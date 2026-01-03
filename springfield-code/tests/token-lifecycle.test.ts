/**
 * Token Lifecycle Tests - Batch 22
 * Comprehensive token state machine testing
 * 55 tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  revokeRalphAuthorization,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';

// ============================================================================
// Token Creation
// ============================================================================

describe('Token Lifecycle - Creation', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should create token successfully', () => {
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });

  it('should create non-empty token', () => {
    const token = requestRalphAuthorization();
    expect(token!.length).toBeGreaterThan(0);
  });

  it('should create string token', () => {
    const token = requestRalphAuthorization();
    expect(typeof token).toBe('string');
  });

  it('should enable canInvokeRalph after token creation', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should create unique tokens', () => {
    const token1 = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const token2 = requestRalphAuthorization();
    expect(token1).not.toBe(token2);
  });

  it('should replace previous token on new request', () => {
    const token1 = requestRalphAuthorization();
    const token2 = requestRalphAuthorization();
    expect(token1).not.toBe(token2);
  });
});

// ============================================================================
// Token Validation States
// ============================================================================

describe('Token Lifecycle - Validation', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should validate correct token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should reject incorrect token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('wrong')).toBe(false);
  });

  it('should reject empty token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('')).toBe(false);
  });

  it('should reject undefined token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(undefined)).toBe(false);
  });

  it('should reject null token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(null as unknown as string)).toBe(false);
  });

  it('should reject token without prior request', () => {
    expect(authorizeRalph('any-token')).toBe(false);
  });
});

// ============================================================================
// Token Consumption
// ============================================================================

describe('Token Lifecycle - Consumption', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should consume token on authorization', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should reject second use of same token', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new token after consumption', () => {
    const token1 = requestRalphAuthorization();
    authorizeRalph(token1!);
    const token2 = requestRalphAuthorization();
    expect(token2).not.toBeNull();
  });

  it('should validate new token after consumption', () => {
    const token1 = requestRalphAuthorization();
    authorizeRalph(token1!);
    const token2 = requestRalphAuthorization();
    expect(authorizeRalph(token2!)).toBe(true);
  });
});

// ============================================================================
// Token Revocation
// ============================================================================

describe('Token Lifecycle - Revocation', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should revoke active token', () => {
    const token = requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should reject revoked token', () => {
    const token = requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new token after revocation', () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    const newToken = requestRalphAuthorization();
    expect(newToken).not.toBeNull();
  });

  it('should handle multiple revocations', () => {
    expect(() => {
      revokeRalphAuthorization();
      revokeRalphAuthorization();
    }).not.toThrow();
  });

  it('should handle revocation without active token', () => {
    expect(() => revokeRalphAuthorization()).not.toThrow();
  });
});

// ============================================================================
// Token Reset
// ============================================================================

describe('Token Lifecycle - Reset', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should clear token on reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should reject old token after reset', () => {
    const token = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new token after reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const newToken = requestRalphAuthorization();
    expect(newToken).not.toBeNull();
  });

  it('should handle reset without active token', () => {
    expect(() => {
      if (_resetForTesting) _resetForTesting();
    }).not.toThrow();
  });

  it('should handle multiple resets', () => {
    expect(() => {
      if (_resetForTesting) _resetForTesting();
      if (_resetForTesting) _resetForTesting();
    }).not.toThrow();
  });
});

// ============================================================================
// canInvokeRalph States
// ============================================================================

describe('Token Lifecycle - canInvokeRalph States', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return false initially', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should return true after token request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should return false after successful authorization', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should remain true after failed authorization', () => {
    requestRalphAuthorization();
    authorizeRalph('wrong-token');
    expect(canInvokeRalph()).toBe(true);
  });

  it('should return false after revocation', () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should return false after reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
  });
});

// ============================================================================
// State Transitions
// ============================================================================

describe('Token Lifecycle - State Transitions', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should transition: none -> active', () => {
    expect(canInvokeRalph()).toBe(false);
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should transition: active -> consumed', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should transition: active -> revoked', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should transition: consumed -> active (new token)', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should transition: revoked -> active (new token)', () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should handle rapid state transitions', () => {
    for (let i = 0; i < 5; i++) {
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      authorizeRalph(token!);
      expect(canInvokeRalph()).toBe(false);
    }
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Token Lifecycle - Edge Cases', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should handle token request after failed auth', () => {
    const token1 = requestRalphAuthorization();
    authorizeRalph('wrong');
    const token2 = requestRalphAuthorization();
    expect(token2).not.toBeNull();
  });

  it('should handle authorization immediately after request', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(result).toBe(true);
  });

  it('should handle multiple sequential cycles', () => {
    for (let i = 0; i < 3; i++) {
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      expect(canInvokeRalph()).toBe(true);
      expect(authorizeRalph(token!)).toBe(true);
      expect(canInvokeRalph()).toBe(false);
    }
  });
});
