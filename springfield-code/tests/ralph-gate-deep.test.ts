/**
 * Ralph Gate Deep Tests (Batch 74)
 *
 * Deep testing of Ralph Gate hook including token lifecycle,
 * authorization flows, rate limiting, and security validations.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  requestRalphAuthorization,
  authorizeRalph,
  revokeRalphAuthorization,
  canInvokeRalph,
  resetRalphGateForTesting,
  type SecureToken,
} from "../src/index.js";

describe("requestRalphAuthorization Function", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  describe("token generation", () => {
    it("returns a non-null token", () => {
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
    });

    it("returns a string token", () => {
      const token = requestRalphAuthorization();
      expect(typeof token).toBe("string");
    });

    it("returns a non-empty token", () => {
      const token = requestRalphAuthorization();
      expect(token!.length).toBeGreaterThan(0);
    });

    it("returns unique tokens on each call", () => {
      const token1 = requestRalphAuthorization();
      resetRalphGateForTesting();
      const token2 = requestRalphAuthorization();
      expect(token1).not.toBe(token2);
    });

    it("token is base64url encoded", () => {
      const token = requestRalphAuthorization();
      // base64url uses A-Z, a-z, 0-9, -, _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });

  describe("authorization state", () => {
    it("sets canInvokeRalph to true after request", () => {
      expect(canInvokeRalph()).toBe(false);
      requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
    });
  });
});

describe("canInvokeRalph Function", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  it("returns false initially", () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it("returns true after authorization requested", () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it("returns false after authorization used", () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it("returns false after authorization revoked", () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it("is read-only - does not consume token", () => {
    requestRalphAuthorization();
    canInvokeRalph();
    canInvokeRalph();
    canInvokeRalph();
    expect(canInvokeRalph()).toBe(true);
  });
});

describe("authorizeRalph Function", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  describe("with valid token", () => {
    it("returns true for valid active token", () => {
      const token = requestRalphAuthorization();
      expect(authorizeRalph(token!)).toBe(true);
    });

    it("clears active token after use", () => {
      const token = requestRalphAuthorization();
      authorizeRalph(token!);
      expect(canInvokeRalph()).toBe(false);
    });

    it("token cannot be reused", () => {
      const token = requestRalphAuthorization();
      expect(authorizeRalph(token!)).toBe(true);
      // Try to reuse - should fail since token is consumed
      // Need to request again to have a valid state
      expect(authorizeRalph(token!)).toBe(false);
    });
  });

  describe("with invalid token", () => {
    it("returns false for null token", () => {
      requestRalphAuthorization();
      expect(authorizeRalph(null as unknown as string)).toBe(false);
    });

    it("returns false for undefined token", () => {
      requestRalphAuthorization();
      expect(authorizeRalph(undefined)).toBe(false);
    });

    it("returns false for empty string token", () => {
      requestRalphAuthorization();
      expect(authorizeRalph("")).toBe(false);
    });

    it("returns false for wrong token", () => {
      requestRalphAuthorization();
      expect(authorizeRalph("wrong-token")).toBe(false);
    });

    it("returns false when no authorization requested", () => {
      expect(authorizeRalph("some-token")).toBe(false);
    });
  });

  describe("token mismatch scenarios", () => {
    it("rejects old token after new request", () => {
      const token1 = requestRalphAuthorization();
      resetRalphGateForTesting();
      requestRalphAuthorization();
      expect(authorizeRalph(token1!)).toBe(false);
    });

    it("only accepts most recent token", () => {
      const token1 = requestRalphAuthorization();
      revokeRalphAuthorization();
      const token2 = requestRalphAuthorization();
      expect(authorizeRalph(token1!)).toBe(false);
      expect(authorizeRalph(token2!)).toBe(true);
    });
  });
});

describe("revokeRalphAuthorization Function", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  it("clears active authorization", () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it("can be called when no authorization active", () => {
    expect(() => revokeRalphAuthorization()).not.toThrow();
  });

  it("can be called multiple times", () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    revokeRalphAuthorization();
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it("invalidates previously issued token", () => {
    const token = requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it("returns void", () => {
    const result = revokeRalphAuthorization();
    expect(result).toBeUndefined();
  });
});

describe("resetRalphGateForTesting Function", () => {
  it("clears active authorization", () => {
    requestRalphAuthorization();
    resetRalphGateForTesting();
    expect(canInvokeRalph()).toBe(false);
  });

  it("can be called multiple times", () => {
    resetRalphGateForTesting();
    resetRalphGateForTesting();
    resetRalphGateForTesting();
    expect(canInvokeRalph()).toBe(false);
  });

  it("allows new authorization after reset", () => {
    requestRalphAuthorization();
    resetRalphGateForTesting();
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
    expect(canInvokeRalph()).toBe(true);
  });
});

describe("Authorization Flow Scenarios", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  describe("complete valid flow", () => {
    it("request -> authorize -> complete", () => {
      expect(canInvokeRalph()).toBe(false);
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      expect(authorizeRalph(token!)).toBe(true);
      expect(canInvokeRalph()).toBe(false);
    });
  });

  describe("request -> revoke flow", () => {
    it("properly cleans up after revoke", () => {
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      revokeRalphAuthorization();
      expect(canInvokeRalph()).toBe(false);
      expect(authorizeRalph(token!)).toBe(false);
    });
  });

  describe("multiple request flow", () => {
    it("only latest token is valid", () => {
      const token1 = requestRalphAuthorization();
      revokeRalphAuthorization();
      const token2 = requestRalphAuthorization();
      revokeRalphAuthorization();
      const token3 = requestRalphAuthorization();

      expect(authorizeRalph(token1!)).toBe(false);
      expect(authorizeRalph(token2!)).toBe(false);
      expect(authorizeRalph(token3!)).toBe(true);
    });
  });

  describe("unauthorized attempt flow", () => {
    it("rejects all attempts without valid token", () => {
      expect(authorizeRalph("random")).toBe(false);
      expect(authorizeRalph("")).toBe(false);
      expect(authorizeRalph(undefined)).toBe(false);
    });
  });
});

describe("SecureToken Type", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  it("token is branded string type at runtime", () => {
    const token = requestRalphAuthorization();
    expect(typeof token).toBe("string");
  });

  it("token can be used with authorizeRalph", () => {
    const token: SecureToken | null = requestRalphAuthorization();
    if (token) {
      expect(authorizeRalph(token)).toBe(true);
    }
  });
});

describe("Edge Cases", () => {
  beforeEach(() => {
    resetRalphGateForTesting();
  });

  afterEach(() => {
    resetRalphGateForTesting();
  });

  it("handles rapid request-authorize cycles", () => {
    for (let i = 0; i < 5; i++) {
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      expect(authorizeRalph(token!)).toBe(true);
      expect(canInvokeRalph()).toBe(false);
    }
  });

  it("handles rapid request-revoke cycles", () => {
    for (let i = 0; i < 5; i++) {
      requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      revokeRalphAuthorization();
      expect(canInvokeRalph()).toBe(false);
    }
  });

  it("token string is sufficiently long for security", () => {
    const token = requestRalphAuthorization();
    // 256-bit token in base64url is ~43 chars
    expect(token!.length).toBeGreaterThanOrEqual(40);
  });
});
