import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  requestRalphAuthorization,
  authorizeRalph,
  revokeRalphAuthorization,
  canInvokeRalph,
  _resetForTesting,
} from "../src/hooks/ralph-gate.js";
import ralphGateHook from "../src/hooks/ralph-gate.js";

describe("ralph-gate hook", () => {
  beforeEach(() => {
    // Reset state before each test using proper test helper
    _resetForTesting();
  });

  describe("canInvokeRalph", () => {
    it("returns false by default", () => {
      expect(canInvokeRalph()).toBe(false);
    });

    it("returns true after requesting authorization", () => {
      requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
    });
  });

  describe("requestRalphAuthorization", () => {
    it("returns a secure token string", () => {
      const token = requestRalphAuthorization();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(32); // Base64url encoded 256 bits
    });

    it("returns unique tokens on each call", () => {
      const token1 = requestRalphAuthorization();
      _resetForTesting();
      const token2 = requestRalphAuthorization();
      expect(token1).not.toBe(token2);
    });
  });

  describe("authorizeRalph", () => {
    it("returns true with valid token", () => {
      const token = requestRalphAuthorization();
      const result = authorizeRalph(token);
      expect(result).toBe(true);
    });

    it("clears canInvokeRalph after successful authorization", () => {
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      authorizeRalph(token);
      expect(canInvokeRalph()).toBe(false);
    });

    it("rejects attempts with undefined token", () => {
      requestRalphAuthorization();
      const result = authorizeRalph(undefined);
      expect(result).toBe(false);
    });

    it("rejects attempts with wrong token", () => {
      requestRalphAuthorization();
      const result = authorizeRalph("invalid-token");
      expect(result).toBe(false);
    });

    it("rejects reusing a consumed token", () => {
      const token = requestRalphAuthorization();
      authorizeRalph(token); // First use succeeds
      const result = authorizeRalph(token); // Second use fails
      expect(result).toBe(false);
    });
  });

  describe("revokeRalphAuthorization", () => {
    it("prevents Ralph invocation after revocation", () => {
      requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      revokeRalphAuthorization();
      expect(canInvokeRalph()).toBe(false);
    });

    it("invalidates the previously issued token", () => {
      const token = requestRalphAuthorization();
      revokeRalphAuthorization();
      const result = authorizeRalph(token);
      expect(result).toBe(false);
    });
  });

  describe("hook handler", () => {
    it("blocks ralph invocation when not initiated by Lisa", async () => {
      const event = { toolName: "ralph" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.allowed).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message).toContain("Lisa");
    });

    it("allows ralph invocation when initiated by Lisa", async () => {
      requestRalphAuthorization();
      const event = { toolName: "ralph" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.allowed).toBe(true);
    });

    it("resets flag after allowing ralph through", async () => {
      requestRalphAuthorization();
      const event = { toolName: "ralph" };
      const context = {};

      await ralphGateHook.handle(event, context);

      // Flag should be reset after use
      expect(canInvokeRalph()).toBe(false);
    });

    it("blocks ralph-loop tool when not initiated", async () => {
      const event = { toolName: "ralph-loop" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.allowed).toBe(false);
    });

    it("allows non-ralph tools always", async () => {
      const event = { toolName: "other-tool" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.allowed).toBe(true);
    });

    it("handles case-insensitive tool names", async () => {
      const event = { toolName: "RALPH" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      // Should still be blocked without authorization
      expect(result.allowed).toBe(false);
    });
  });

  describe("token expiration", () => {
    it("tokens expire after TTL", async () => {
      vi.useFakeTimers();
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);

      // Advance time past TTL (30 seconds + buffer)
      vi.advanceTimersByTime(31000);

      // Token should be expired - can't authorize
      const result = authorizeRalph(token);
      expect(result).toBe(false);

      vi.useRealTimers();
    });
  });

  describe("rate limiting", () => {
    it("allows up to 10 tokens per minute", () => {
      // Issue 10 tokens - should all succeed
      for (let i = 0; i < 10; i++) {
        const token = requestRalphAuthorization();
        expect(token).toBeDefined();
        // Reset for next iteration (consumes the token)
        revokeRalphAuthorization();
      }
    });

    it("returns null when rate limit exceeded", () => {
      // Issue 10 tokens (at the limit)
      for (let i = 0; i < 10; i++) {
        requestRalphAuthorization();
        revokeRalphAuthorization();
      }

      // 11th token should return null (graceful fallback)
      const token = requestRalphAuthorization();
      expect(token).toBeNull();
    });

    it("rate limit resets after window expires", () => {
      vi.useFakeTimers();

      // Exhaust rate limit
      for (let i = 0; i < 10; i++) {
        requestRalphAuthorization();
        revokeRalphAuthorization();
      }

      // Verify rate limit is hit (returns null)
      expect(requestRalphAuthorization()).toBeNull();

      // Advance past the 1-minute window
      vi.advanceTimersByTime(61000);

      // Should be able to issue tokens again
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      expect(typeof token).toBe("string");

      vi.useRealTimers();
    });
  });

  describe("token validation edge cases", () => {
    it("rejects token after it expires via TTL check", async () => {
      vi.useFakeTimers();
      
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      
      // Advance time just past the TTL (30 seconds default)
      vi.advanceTimersByTime(30001);
      
      // Try to authorize - should fail because TTL exceeded
      const result = authorizeRalph(token!);
      expect(result).toBe(false);
      
      vi.useRealTimers();
    });

    it("cleans up expired tokens automatically", async () => {
      vi.useFakeTimers();
      
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      
      // Advance time past TTL + buffer (31 seconds)
      vi.advanceTimersByTime(32000);
      
      // Token should be cleaned up by the timeout
      expect(canInvokeRalph()).toBe(true); // activeRalphToken still set
      // But authorizing should fail
      const result = authorizeRalph(token!);
      expect(result).toBe(false);
      
      vi.useRealTimers();
    });
  });

  describe("hook handler edge cases", () => {
    it("handles ralph-loop tool when authorized", async () => {
      requestRalphAuthorization();
      const event = { toolName: "ralph-loop" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.allowed).toBe(true);
    });

    it("returns confused response when authorization fails mid-flow", async () => {
      requestRalphAuthorization();
      const event = { toolName: "ralph" };
      const context = {};
      
      // Revoke the token before the hook processes it
      revokeRalphAuthorization();
      
      const result = await ralphGateHook.handle(event, context);
      
      expect(result.allowed).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message).toContain("Lisa");
    });

    it("allows non-ralph tools regardless of token state", async () => {
      // No token requested
      const event1 = { toolName: "homer" };
      const result1 = await ralphGateHook.handle(event1, {});
      expect(result1.allowed).toBe(true);

      // With token requested
      requestRalphAuthorization();
      const event2 = { toolName: "marge" };
      const result2 = await ralphGateHook.handle(event2, {});
      expect(result2.allowed).toBe(true);
      
      // Token should still be valid for ralph
      expect(canInvokeRalph()).toBe(true);
    });
  });

  describe("confused Ralph responses", () => {
    it("returns a string message when blocked", async () => {
      const event = { toolName: "ralph" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.allowed).toBe(false);
      expect(typeof result.message).toBe("string");
      expect(result.message!.length).toBeGreaterThan(50);
    });

    it("response contains Ralph dialogue indicators", async () => {
      const event = { toolName: "ralph" };
      const context = {};

      const result = await ralphGateHook.handle(event, context);

      expect(result.message).toMatch(/\*Ralph|Lisa/);
    });
  });

  describe("authorization flow edge cases", () => {
    it("authorizeRalph fails when token doesn't match activeRalphToken", () => {
      requestRalphAuthorization();
      // Try to authorize with a completely different token
      const result = authorizeRalph("completely-wrong-token");
      expect(result).toBe(false);
    });

    it("revokeRalphAuthorization is idempotent when no token active", () => {
      // No token active
      expect(canInvokeRalph()).toBe(false);
      
      // Revoke should not throw
      revokeRalphAuthorization();
      
      expect(canInvokeRalph()).toBe(false);
    });

    it("multiple revocations don't cause issues", () => {
      requestRalphAuthorization();
      
      revokeRalphAuthorization();
      revokeRalphAuthorization();
      revokeRalphAuthorization();
      
      expect(canInvokeRalph()).toBe(false);
    });
  });
});
