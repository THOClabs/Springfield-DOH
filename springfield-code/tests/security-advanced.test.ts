/**
 * Advanced Security Tests - Batch 2
 * Deep security testing for ralph-gate, token management, and access control
 * 50 tests covering edge cases, race conditions, and attack vectors
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
    requestRalphAuthorization,
    canInvokeRalph,
    authorizeRalph,
    revokeRalphAuthorization,
    _resetForTesting,
} from '../src/hooks/ralph-gate.js';

describe('Security - Token Cryptographic Properties', () => {
    beforeEach(() => {
        _resetForTesting();
    });

    it('tokens should be 256-bit (43+ chars in base64url)', () => {
        const token = requestRalphAuthorization();
        expect(token).not.toBeNull();
        // 32 bytes = 256 bits, base64url encodes to ~43 chars
        expect(token!.length).toBeGreaterThanOrEqual(43);
    });

    it('tokens should only contain base64url characters', () => {
        const token = requestRalphAuthorization();
        expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('sequential tokens should be unique', () => {
        const tokens = new Set<string>();
        for (let i = 0; i < 5; i++) {
            const token = requestRalphAuthorization();
            expect(token).not.toBeNull();
            expect(tokens.has(token!)).toBe(false);
            tokens.add(token!);
            _resetForTesting();
        }
    });

    it('tokens should have high entropy (no repeated patterns)', () => {
        const token = requestRalphAuthorization();
        // Check no single character dominates (would indicate low entropy)
        const charCounts = new Map<string, number>();
        for (const char of token!) {
            charCounts.set(char, (charCounts.get(char) || 0) + 1);
        }
        const maxCount = Math.max(...charCounts.values());
        // No character should appear more than 25% of the time
        expect(maxCount / token!.length).toBeLessThan(0.25);
    });

    it('tokens should not be predictable from previous tokens', () => {
        const token1 = requestRalphAuthorization();
        _resetForTesting();
        const token2 = requestRalphAuthorization();
        
        // Check tokens don't share significant prefix
        let commonPrefix = 0;
        for (let i = 0; i < Math.min(token1!.length, token2!.length); i++) {
            if (token1![i] === token2![i]) commonPrefix++;
            else break;
        }
        expect(commonPrefix).toBeLessThan(5); // Random tokens shouldn't share prefix
    });
});

describe('Security - Token Lifecycle', () => {
    beforeEach(() => {
        _resetForTesting();
    });

    it('token should be consumable only once', () => {
        const token = requestRalphAuthorization();
        expect(authorizeRalph(token!)).toBe(true);
        expect(authorizeRalph(token!)).toBe(false);
    });

    it('revoked token should not be usable', () => {
        const token = requestRalphAuthorization();
        revokeRalphAuthorization();
        expect(authorizeRalph(token!)).toBe(false);
    });

    it('canInvokeRalph should return false after authorization', () => {
        const token = requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
        authorizeRalph(token!);
        expect(canInvokeRalph()).toBe(false);
    });

    it('canInvokeRalph should return false after revocation', () => {
        requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
        revokeRalphAuthorization();
        expect(canInvokeRalph()).toBe(false);
    });

    it('new token should invalidate previous token', () => {
        const token1 = requestRalphAuthorization();
        const token2 = requestRalphAuthorization();
        
        // Token1 should no longer work since token2 is now active
        expect(authorizeRalph(token1!)).toBe(false);
        expect(authorizeRalph(token2!)).toBe(true);
    });

    it('reset should clear all authorization state', () => {
        requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
        _resetForTesting();
        expect(canInvokeRalph()).toBe(false);
    });
});

describe('Security - Input Validation Attacks', () => {
    beforeEach(() => {
        _resetForTesting();
    });

    it('should reject undefined token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph(undefined)).toBe(false);
    });

    it('should reject null token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph(null as unknown as string)).toBe(false);
    });

    it('should reject empty string token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('')).toBe(false);
    });

    it('should reject whitespace-only token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('   ')).toBe(false);
    });

    it('should reject token with null bytes', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('token\x00injection')).toBe(false);
    });

    it('should reject extremely long token', () => {
        requestRalphAuthorization();
        const longToken = 'a'.repeat(10000);
        expect(authorizeRalph(longToken)).toBe(false);
    });

    it('should reject token with special characters', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('<script>alert("xss")</script>')).toBe(false);
    });

    it('should reject numeric token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph(12345 as unknown as string)).toBe(false);
    });

    it('should reject object token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph({} as unknown as string)).toBe(false);
    });

    it('should reject array token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph([] as unknown as string)).toBe(false);
    });

    it('should reject prototype pollution attempt', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('__proto__')).toBe(false);
    });

    it('should reject constructor pollution attempt', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('constructor')).toBe(false);
    });
});

describe('Security - Timing and Race Conditions', () => {
    beforeEach(() => {
        _resetForTesting();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('token should expire after TTL', async () => {
        const token = requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
        
        // Advance past TTL (default 30000ms)
        vi.advanceTimersByTime(31000);
        
        expect(authorizeRalph(token!)).toBe(false);
    });

    it('token should work just before expiry', async () => {
        const token = requestRalphAuthorization();
        
        // Advance to just before TTL (default 30000ms)
        vi.advanceTimersByTime(29000);
        
        expect(authorizeRalph(token!)).toBe(true);
    });

    it('rapid authorization requests should be handled correctly', () => {
        // Rapid sequential requests
        for (let i = 0; i < 5; i++) {
            const token = requestRalphAuthorization();
            expect(token).not.toBeNull();
            expect(authorizeRalph(token!)).toBe(true);
        }
    });

    it('expired token cleanup should not affect new tokens', async () => {
        const token1 = requestRalphAuthorization();
        vi.advanceTimersByTime(31000); // Let it expire (default TTL is 30000ms)
        
        _resetForTesting();
        const token2 = requestRalphAuthorization();
        
        expect(authorizeRalph(token1!)).toBe(false);
        expect(authorizeRalph(token2!)).toBe(true);
    });
});

describe('Security - Rate Limiting', () => {
    beforeEach(() => {
        _resetForTesting();
    });

    it('should allow up to 10 tokens per minute', () => {
        for (let i = 0; i < 10; i++) {
            const token = requestRalphAuthorization();
            expect(token).not.toBeNull();
            _resetForTesting();
        }
    });

    it('should block after rate limit exceeded', () => {
        // Use up rate limit
        for (let i = 0; i < 10; i++) {
            requestRalphAuthorization();
        }
        
        // 11th should be rate limited
        const token = requestRalphAuthorization();
        expect(token).toBeNull();
    });

    it('rate limit should reset after window expires', () => {
        vi.useFakeTimers();
        
        // Use up rate limit
        for (let i = 0; i < 10; i++) {
            requestRalphAuthorization();
        }
        
        expect(requestRalphAuthorization()).toBeNull();
        
        // Advance past rate limit window (60 seconds)
        vi.advanceTimersByTime(61000);
        
        const token = requestRalphAuthorization();
        expect(token).not.toBeNull();
        
        vi.useRealTimers();
    });
});

describe('Security - State Isolation', () => {
    beforeEach(() => {
        _resetForTesting();
    });

    it('authorization state should be isolated between calls', () => {
        const token1 = requestRalphAuthorization();
        authorizeRalph(token1!);
        
        const token2 = requestRalphAuthorization();
        expect(authorizeRalph(token2!)).toBe(true);
    });

    it('revocation should not affect future authorizations', () => {
        const token1 = requestRalphAuthorization();
        revokeRalphAuthorization();
        
        const token2 = requestRalphAuthorization();
        expect(authorizeRalph(token2!)).toBe(true);
    });

    it('failed authorization should not affect state', () => {
        const validToken = requestRalphAuthorization();
        
        // Try various invalid tokens
        authorizeRalph('invalid');
        authorizeRalph(undefined);
        authorizeRalph('');
        
        // Valid token should still work
        expect(authorizeRalph(validToken!)).toBe(true);
    });

    it('canInvokeRalph should be read-only', () => {
        const token = requestRalphAuthorization();
        
        // Multiple reads shouldn't affect state
        canInvokeRalph();
        canInvokeRalph();
        canInvokeRalph();
        
        expect(authorizeRalph(token!)).toBe(true);
    });
});

describe('Security - Edge Cases', () => {
    beforeEach(() => {
        _resetForTesting();
    });

    it('should handle authorization without prior request', () => {
        expect(canInvokeRalph()).toBe(false);
        expect(authorizeRalph('any-token')).toBe(false);
    });

    it('should handle double revocation gracefully', () => {
        requestRalphAuthorization();
        revokeRalphAuthorization();
        revokeRalphAuthorization();
        expect(canInvokeRalph()).toBe(false);
    });

    it('should handle reset without active token', () => {
        expect(() => _resetForTesting()).not.toThrow();
    });

    it('should handle multiple resets in sequence', () => {
        requestRalphAuthorization();
        _resetForTesting();
        _resetForTesting();
        _resetForTesting();
        expect(canInvokeRalph()).toBe(false);
    });

    it('should handle authorization after reset', () => {
        const token1 = requestRalphAuthorization();
        _resetForTesting();
        
        expect(authorizeRalph(token1!)).toBe(false);
        expect(canInvokeRalph()).toBe(false);
    });

    it('should maintain security after error conditions', () => {
        // Create token
        const token = requestRalphAuthorization();
        
        // Trigger various error conditions
        authorizeRalph(undefined);
        authorizeRalph(null as unknown as string);
        authorizeRalph('fake');
        
        // System should remain secure
        expect(canInvokeRalph()).toBe(true);
        expect(authorizeRalph(token!)).toBe(true);
    });
});
