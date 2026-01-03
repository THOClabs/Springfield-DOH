/**
 * Hook Edge Cases Tests - Batch 63
 * Deep testing of ralph-gate hook behavior and edge cases
 * 50 tests for hook mechanics, timing, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    requestRalphAuthorization,
    authorizeRalph,
    revokeRalphAuthorization,
    canInvokeRalph,
    resetRalphGateForTesting,
    ralphGateHook,
} from '../src/index.js';

describe('Hook Edge Cases - Basic Hook Behavior', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('hook is an object with handle method', () => {
        expect(typeof ralphGateHook).toBe('object');
        expect(typeof ralphGateHook.handle).toBe('function');
    });

    it('handle returns a promise', () => {
        const result = ralphGateHook.handle({ toolName: 'test' }, {});
        expect(result).toBeInstanceOf(Promise);
    });

    it('handle returns allowed and optional message', async () => {
        const result = await ralphGateHook.handle({ toolName: 'test' }, {});
        expect(typeof result.allowed).toBe('boolean');
    });

    it('allowed is true for non-ralph tools', async () => {
        const result = await ralphGateHook.handle({ toolName: 'grep' }, {});
        expect(result.allowed).toBe(true);
        expect(result.message).toBeUndefined();
    });

    it('allowed is false for ralph without token', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
        expect(result.message).toBeDefined();
    });
});

describe('Hook Edge Cases - Tool Name Variations', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('blocks ralph (lowercase)', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });

    it('blocks RALPH (uppercase)', async () => {
        const result = await ralphGateHook.handle({ toolName: 'RALPH' }, {});
        expect(result.allowed).toBe(false);
    });

    it('blocks Ralph (mixed case)', async () => {
        const result = await ralphGateHook.handle({ toolName: 'Ralph' }, {});
        expect(result.allowed).toBe(false);
    });

    it('blocks ralph-loop', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph-loop' }, {});
        expect(result.allowed).toBe(false);
    });

    it('blocks RALPH-LOOP (uppercase)', async () => {
        const result = await ralphGateHook.handle({ toolName: 'RALPH-LOOP' }, {});
        expect(result.allowed).toBe(false);
    });

    it('allows ralph-like but not exact', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph-helper' }, {});
        expect(result.allowed).toBe(true);
    });

    it('allows ralphie (not exact match)', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralphie' }, {});
        expect(result.allowed).toBe(true);
    });

    it('allows empty tool name', async () => {
        const result = await ralphGateHook.handle({ toolName: '' }, {});
        expect(result.allowed).toBe(true);
    });
});

describe('Hook Edge Cases - Authorization Flow', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('token request before hook allows ralph', async () => {
        requestRalphAuthorization();
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(true);
    });

    it('token is consumed after successful hook', async () => {
        requestRalphAuthorization();
        await ralphGateHook.handle({ toolName: 'ralph' }, {});
        // Second call should fail
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });

    it('revoked token blocks ralph', async () => {
        requestRalphAuthorization();
        revokeRalphAuthorization();
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });

    it('new token after revocation allows ralph', async () => {
        requestRalphAuthorization();
        revokeRalphAuthorization();
        requestRalphAuthorization();
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(true);
    });

    it('canInvokeRalph returns false initially', () => {
        expect(canInvokeRalph()).toBe(false);
    });

    it('canInvokeRalph returns true after request', () => {
        requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
    });

    it('canInvokeRalph returns false after consumption', async () => {
        requestRalphAuthorization();
        await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(canInvokeRalph()).toBe(false);
    });
});

describe('Hook Edge Cases - Token Properties', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('token is a string', () => {
        const token = requestRalphAuthorization();
        expect(typeof token).toBe('string');
    });

    it('token is non-empty', () => {
        const token = requestRalphAuthorization();
        expect(token!.length).toBeGreaterThan(0);
    });

    it('consecutive tokens are different', () => {
        const token1 = requestRalphAuthorization();
        resetRalphGateForTesting();
        const token2 = requestRalphAuthorization();
        expect(token1).not.toBe(token2);
    });

    it('authorizeRalph returns true for valid token', () => {
        const token = requestRalphAuthorization();
        expect(authorizeRalph(token)).toBe(true);
    });

    it('authorizeRalph returns false for invalid token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('invalid-token')).toBe(false);
    });

    it('authorizeRalph returns false for undefined', () => {
        requestRalphAuthorization();
        expect(authorizeRalph(undefined)).toBe(false);
    });

    it('authorizeRalph returns false with no pending token', () => {
        expect(authorizeRalph('any-token')).toBe(false);
    });
});

describe('Hook Edge Cases - Confused Ralph Messages', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('blocked ralph returns message', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.message).toBeDefined();
        expect(typeof result.message).toBe('string');
    });

    it('message mentions Lisa', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.message!.toLowerCase()).toContain('lisa');
    });

    it('message has ralph personality', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.message!.length).toBeGreaterThan(50);
    });

    it('allowed ralph has no message', async () => {
        requestRalphAuthorization();
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.message).toBeUndefined();
    });
});

describe('Hook Edge Cases - Context Handling', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('handles empty context', async () => {
        const result = await ralphGateHook.handle({ toolName: 'test' }, {});
        expect(result.allowed).toBe(true);
    });

    it('handles context with arbitrary properties', async () => {
        const result = await ralphGateHook.handle(
            { toolName: 'test' },
            { custom: 'value', nested: { prop: 123 } }
        );
        expect(result.allowed).toBe(true);
    });

    it('handles event with extra properties', async () => {
        const result = await ralphGateHook.handle(
            { toolName: 'test', extra: 'data', count: 42 },
            {}
        );
        expect(result.allowed).toBe(true);
    });

    it('ignores context for authorization decision', async () => {
        requestRalphAuthorization();
        const result = await ralphGateHook.handle(
            { toolName: 'ralph' },
            { authorized: false } // This should be ignored
        );
        expect(result.allowed).toBe(true);
    });
});

describe('Hook Edge Cases - Reset Behavior', () => {
    it('reset clears pending token', () => {
        requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
        resetRalphGateForTesting();
        expect(canInvokeRalph()).toBe(false);
    });

    it('reset allows new token request', () => {
        requestRalphAuthorization();
        resetRalphGateForTesting();
        const token = requestRalphAuthorization();
        expect(token).not.toBeNull();
    });

    it('multiple resets are safe', () => {
        resetRalphGateForTesting();
        resetRalphGateForTesting();
        resetRalphGateForTesting();
        expect(canInvokeRalph()).toBe(false);
    });

    it('reset before any tokens is safe', () => {
        resetRalphGateForTesting();
        expect(canInvokeRalph()).toBe(false);
    });
});
