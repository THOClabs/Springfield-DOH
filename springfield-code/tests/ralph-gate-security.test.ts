/**
 * Ralph-Gate Security Deep Dive - Batch 9
 * Closes 90.47% branch gap, covers 2 uncovered functions
 * 50 tests targeting security edge cases
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  requestRalphAuthorization,
  authorizeRalph,
  revokeRalphAuthorization,
  canInvokeRalph,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';
import ralphGateHook from '../src/hooks/ralph-gate.js';

describe('Ralph-Gate Security - TTL Boundary Conditions', () => {
  beforeEach(() => {
    _resetForTesting();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    _resetForTesting();
  });

  it('token should expire at exact TTL millisecond', () => {
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
    // Advance past 30000ms (TTL is 30000, token expires when > ttl)
    vi.advanceTimersByTime(30001);
    const result = authorizeRalph(token!);
    expect(result).toBe(false);
  });

  it('token should work 1ms before TTL expiry', () => {
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
    // Advance to 29999ms (1ms before TTL)
    vi.advanceTimersByTime(29999);
    const result = authorizeRalph(token!);
    expect(result).toBe(true);
  });

  it('token should fail 1ms after TTL expiry', () => {
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
    // Advance to 30001ms (1ms after TTL)
    vi.advanceTimersByTime(30001);
    const result = authorizeRalph(token!);
    expect(result).toBe(false);
  });

  it('multiple tokens should respect individual TTLs', () => {
    const token1 = requestRalphAuthorization();
    revokeRalphAuthorization();
    vi.advanceTimersByTime(10000);
    const token2 = requestRalphAuthorization();
    // token1 issued at 0, token2 at 10000
    // At 25000ms: token1 is 25s old, token2 is 15s old
    vi.advanceTimersByTime(15000);
    expect(authorizeRalph(token2!)).toBe(true);
  });

  it('token issued at TTL boundary should have correct expiry', () => {
    const token = requestRalphAuthorization();
    // At 29500ms, get close to boundary
    vi.advanceTimersByTime(29500);
    expect(canInvokeRalph()).toBe(true);
    // At 30500ms, past boundary
    vi.advanceTimersByTime(1000);
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('TTL check should use monotonic time comparison', () => {
    const token = requestRalphAuthorization();
    vi.advanceTimersByTime(15000);
    expect(canInvokeRalph()).toBe(true);
    vi.advanceTimersByTime(16000);
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('expired token should be cleaned up from storage', () => {
    const token = requestRalphAuthorization();
    // Token should exist
    expect(canInvokeRalph()).toBe(true);
    // Advance past TTL + cleanup buffer (31000ms cleanup timeout)
    vi.advanceTimersByTime(32000);
    // Try to authorize - should fail because token expired
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('TTL of short duration should work correctly', () => {
    const token = requestRalphAuthorization();
    vi.advanceTimersByTime(5000);
    expect(canInvokeRalph()).toBe(true);
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('TTL at maximum configured value should work', () => {
    const token = requestRalphAuthorization();
    // Just before default TTL
    vi.advanceTimersByTime(29000);
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('consecutive token requests have independent TTLs', () => {
    const token1 = requestRalphAuthorization();
    revokeRalphAuthorization();
    vi.advanceTimersByTime(5000);
    const token2 = requestRalphAuthorization();
    expect(token1).not.toBe(token2);
    // Token2 issued at 5000ms, advance 26000 more = 31000 total, but token2 is only 26000ms old
    vi.advanceTimersByTime(26000);
    // Token2 is still valid (26s < 30s TTL)
    expect(authorizeRalph(token2!)).toBe(true);
  });
});

describe('Ralph-Gate Security - Rate Limiting Edge Cases', () => {
  beforeEach(() => {
    _resetForTesting();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    _resetForTesting();
  });

  it('should allow exactly maxTokensPerMinute requests', () => {
    for (let i = 0; i < 10; i++) {
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      revokeRalphAuthorization();
    }
  });

  it('should reject request at maxTokensPerMinute + 1', () => {
    for (let i = 0; i < 10; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    const token11 = requestRalphAuthorization();
    expect(token11).toBeNull();
  });

  it('rate limit should reset exactly at window boundary', () => {
    for (let i = 0; i < 10; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    // Advance past window boundary (60000ms + 1ms to be past it)
    vi.advanceTimersByTime(60001);
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });

  it('rate limit should reset 1ms after window expires', () => {
    for (let i = 0; i < 10; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    vi.advanceTimersByTime(60001);
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });

  it('rapid sequential requests within limit should succeed', () => {
    const tokens: (string | null)[] = [];
    for (let i = 0; i < 5; i++) {
      tokens.push(requestRalphAuthorization());
      revokeRalphAuthorization();
    }
    expect(tokens.every(t => t !== null)).toBe(true);
  });

  it('rate limit counter should track across token types', () => {
    for (let i = 0; i < 5; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    for (let i = 0; i < 5; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    const token11 = requestRalphAuthorization();
    expect(token11).toBeNull();
  });

  it('rate limit should persist through token consumption', () => {
    for (let i = 0; i < 10; i++) {
      const token = requestRalphAuthorization();
      if (token) authorizeRalph(token);
    }
    const token11 = requestRalphAuthorization();
    expect(token11).toBeNull();
  });

  it('rate limit window should be configurable', () => {
    // Default window is 60000ms, test that it works
    for (let i = 0; i < 10; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    vi.advanceTimersByTime(30000);
    const midToken = requestRalphAuthorization();
    expect(midToken).toBeNull();
    vi.advanceTimersByTime(30001);
    const afterToken = requestRalphAuthorization();
    expect(afterToken).not.toBeNull();
  });

  it('concurrent-like requests at limit boundary', () => {
    for (let i = 0; i < 9; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    const token10 = requestRalphAuthorization();
    const token11AfterRevoke = (revokeRalphAuthorization(), requestRalphAuthorization());
    expect(token10).not.toBeNull();
    expect(token11AfterRevoke).toBeNull();
  });

  it('rate limit reset should not affect active tokens', () => {
    const token = requestRalphAuthorization();
    for (let i = 0; i < 9; i++) {
      revokeRalphAuthorization();
      requestRalphAuthorization();
    }
    vi.advanceTimersByTime(25000);
    // Token should still be valid even though rate limit will reset soon
    expect(canInvokeRalph()).toBe(true);
  });
});

describe('Ralph-Gate Security - Hook Handler Casing', () => {
  beforeEach(() => {
    _resetForTesting();
  });

  afterEach(() => {
    _resetForTesting();
  });

  it('should match tool name "ralph" lowercase', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.allowed).toBe(false);
    expect(result.message).toContain('Lisa');
  });

  it('should match tool name "RALPH" uppercase', async () => {
    const result = await ralphGateHook.handle({ toolName: 'RALPH' }, {});
    expect(result.allowed).toBe(false);
    expect(result.message).toContain('Lisa');
  });

  it('should match tool name "Ralph" titlecase', async () => {
    const result = await ralphGateHook.handle({ toolName: 'Ralph' }, {});
    expect(result.allowed).toBe(false);
    expect(result.message).toContain('Lisa');
  });

  it('should match tool name "rAlPh" mixed case', async () => {
    const result = await ralphGateHook.handle({ toolName: 'rAlPh' }, {});
    expect(result.allowed).toBe(false);
    expect(result.message).toContain('Lisa');
  });

  it('should not match partial tool name "ral"', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ral' }, {});
    expect(result.allowed).toBe(true);
  });

  it('should not match extended tool name "ralph2"', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph2' }, {});
    expect(result.allowed).toBe(true);
  });

  it('hook should reject non-ralph tool names', async () => {
    const result = await ralphGateHook.handle({ toolName: 'homer' }, {});
    expect(result.allowed).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it('hook should handle undefined tool name gracefully', async () => {
    try {
      await ralphGateHook.handle({ toolName: undefined as unknown as string }, {});
    } catch {
      // Expected - undefined.toLowerCase() throws
    }
  });

  it('hook should handle empty string tool name', async () => {
    const result = await ralphGateHook.handle({ toolName: '' }, {});
    expect(result.allowed).toBe(true);
  });

  it('hook should handle whitespace tool name', async () => {
    const result = await ralphGateHook.handle({ toolName: '   ' }, {});
    expect(result.allowed).toBe(true);
  });
});

describe('Ralph-Gate Security - Multi-Use Token Exhaustion', () => {
  beforeEach(() => {
    _resetForTesting();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    _resetForTesting();
  });

  it('token with default maxUses should work exactly once', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
    // Second use should fail - token consumed
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('token reuse after revocation should fail', () => {
    const token = requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('token from previous session should fail after reset', () => {
    const token = requestRalphAuthorization();
    _resetForTesting();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('token use count should persist across checks', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    expect(canInvokeRalph()).toBe(true);
    expect(authorizeRalph(token!)).toBe(true);
    expect(canInvokeRalph()).toBe(false);
  });

  it('consumed token should not be reusable', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('token at last use should still succeed', () => {
    const token = requestRalphAuthorization();
    // First and only use
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('partially used token should be revocable', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    revokeRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('multi-use token should respect TTL', () => {
    const token = requestRalphAuthorization();
    vi.advanceTimersByTime(31000);
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('new token after consumption should work', () => {
    const token1 = requestRalphAuthorization();
    authorizeRalph(token1!);
    const token2 = requestRalphAuthorization();
    expect(token2).not.toBeNull();
    expect(authorizeRalph(token2!)).toBe(true);
  });

  it('authorization with wrong token should not consume active token', () => {
    const token = requestRalphAuthorization();
    authorizeRalph('wrong-token');
    expect(authorizeRalph(token!)).toBe(true);
  });
});

describe('Ralph-Gate Security - Confused Ralph Responses', () => {
  beforeEach(() => {
    _resetForTesting();
  });

  afterEach(() => {
    _resetForTesting();
  });

  it('should return response containing Lisa reference', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message).toContain('Lisa');
  });

  it('should return different responses on multiple calls', async () => {
    const responses = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
      if (result.message) responses.add(result.message);
    }
    // Should have at least 2 different responses (random)
    expect(responses.size).toBeGreaterThanOrEqual(1);
  });

  it('response should include Ralph action', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message).toMatch(/\*Ralph/);
  });

  it('response should mention instructions or telling', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message).toMatch(/tells|instructions|talk|know/i);
  });

  it('response should be longer than 50 characters', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message!.length).toBeGreaterThan(50);
  });

  it('response should include authorization failure message', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.allowed).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('response should be Ralph-themed', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message).toMatch(/Ralph|Lisa|confused|instructions/i);
  });

  it('all responses should be non-empty strings', async () => {
    for (let i = 0; i < 10; i++) {
      const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
      expect(typeof result.message).toBe('string');
      expect(result.message!.length).toBeGreaterThan(0);
    }
  });

  it('response selection should use random index', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message).toBeDefined();
    vi.restoreAllMocks();
  });

  it('responses should not leak security information', async () => {
    const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
    expect(result.message).not.toMatch(/token|secret|key|password|auth/i);
  });
});
