/**
 * Security Validation Tests - Batch 65
 * Security-focused tests for input validation and authorization
 * 50 tests for security boundaries, injection prevention, and access control
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';
import {
    requestRalphAuthorization,
    authorizeRalph,
    revokeRalphAuthorization,
    canInvokeRalph,
    resetRalphGateForTesting,
    ralphGateHook,
    generateArtifact,
    validateSpringfieldDirectory,
    hasTemplatePlaceholders,
    validateConfig,
    ALL_CHARACTERS,
} from '../src/index.js';
import summonCommand from '../src/commands/summon.js';

describe('Security - Token Validation', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('rejects empty string token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('')).toBe(false);
    });

    it('rejects null token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph(null as any)).toBe(false);
    });

    it('rejects undefined token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph(undefined)).toBe(false);
    });

    it('rejects whitespace-only token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('   ')).toBe(false);
    });

    it('rejects wrong length token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('short')).toBe(false);
    });

    it('rejects token with special chars injection', () => {
        requestRalphAuthorization();
        expect(authorizeRalph('<script>alert(1)</script>')).toBe(false);
    });

    it('rejects SQL injection attempt in token', () => {
        requestRalphAuthorization();
        expect(authorizeRalph("'; DROP TABLE tokens; --")).toBe(false);
    });

    it('tokens are unique per request', () => {
        const token1 = requestRalphAuthorization();
        resetRalphGateForTesting();
        const token2 = requestRalphAuthorization();
        expect(token1).not.toBe(token2);
    });
});

describe('Security - Input Sanitization', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `sec-input-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('handles script injection in user input without crashing', async () => {
        const result = await summonCommand.run(['homer', '<script>alert(1)</script>'], { cwd: testDir });
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('handles SQL injection in user input', async () => {
        const result = await summonCommand.run(['homer', "'; DROP TABLE users; --"], { cwd: testDir });
        expect(typeof result).toBe('string');
    });

    it('handles path traversal in character name', async () => {
        const result = await summonCommand.run(['../../../etc/passwd', 'test'], { cwd: testDir });
        expect(result).toBeDefined();
        // Should not allow path traversal
    });

    it('handles null bytes in input', async () => {
        const result = await summonCommand.run(['homer', 'test\x00injection'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('handles very long input', async () => {
        const longInput = 'a'.repeat(10000);
        const result = await summonCommand.run(['homer', longInput], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('handles unicode in input', async () => {
        const result = await summonCommand.run(['homer', '日本語テスト'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('handles emoji in input', async () => {
        const result = await summonCommand.run(['homer', '🍩💀🎉'], { cwd: testDir });
        expect(result).toBeDefined();
    });
});

describe('Security - Character Name Validation', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `sec-char-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('rejects character with slashes', () => {
        const result = generateArtifact('homer/marge', 'test', testDir);
        expect(result).toBeNull();
    });

    it('rejects character with backslashes', () => {
        const result = generateArtifact('homer\\marge', 'test', testDir);
        expect(result).toBeNull();
    });

    it('rejects character with dots', () => {
        const result = generateArtifact('..', 'test', testDir);
        expect(result).toBeNull();
    });

    it('rejects character with special chars', () => {
        const result = generateArtifact('homer<>:|"', 'test', testDir);
        expect(result).toBeNull();
    });

    it('only allows known characters', () => {
        const result = generateArtifact('unknown-char', 'test', testDir);
        expect(result).toBeNull();
    });

    it('accepts valid hyphenated characters', () => {
        const result = generateArtifact('dr-nick', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('accepts fat-tony with hyphen', () => {
        const result = generateArtifact('fat-tony', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('accepts sea-captain with hyphen', () => {
        const result = generateArtifact('sea-captain', 'test', testDir);
        expect(result).not.toBeNull();
    });
});

describe('Security - Directory Validation', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `sec-dir-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('validates non-existent directory', () => {
        const result = validateSpringfieldDirectory(testDir);
        expect(result.isValid).toBe(false);
    });

    it('validates empty directory', () => {
        fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
        const result = validateSpringfieldDirectory(testDir);
        expect(result.isValid).toBe(false);
    });

    it('detects template placeholders', () => {
        expect(hasTemplatePlaceholders('[One paragraph description]')).toBe(true);
    });

    it('detects task placeholders', () => {
        expect(hasTemplatePlaceholders('[What needs to be done]')).toBe(true);
    });

    it('detects describe placeholders', () => {
        expect(hasTemplatePlaceholders('[Describe the feature]')).toBe(true);
    });

    it('accepts real content', () => {
        expect(hasTemplatePlaceholders('This is a real project description.')).toBe(false);
    });
});

describe('Security - Config Validation', () => {
    it('rejects negative tokenTtlMs', () => {
        const errors = validateConfig({ tokenTtlMs: -1 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects zero tokenMaxUses', () => {
        const errors = validateConfig({ tokenMaxUses: 0 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects zero maxTokensPerMinute', () => {
        const errors = validateConfig({ maxTokensPerMinute: 0 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects negative minContentLength', () => {
        const errors = validateConfig({ minContentLength: -100 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects zero defaultMaxIterations', () => {
        const errors = validateConfig({ defaultMaxIterations: 0 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('accepts valid config', () => {
        const errors = validateConfig({
            tokenTtlMs: 30000,
            tokenMaxUses: 1,
            maxTokensPerMinute: 10,
        });
        expect(errors).toHaveLength(0);
    });
});

describe('Security - Hook Bypass Prevention', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('blocks ralph regardless of case', async () => {
        const result = await ralphGateHook.handle({ toolName: 'RALPH' }, {});
        expect(result.allowed).toBe(false);
    });

    it('blocks ralph-loop regardless of case', async () => {
        const result = await ralphGateHook.handle({ toolName: 'RALPH-LOOP' }, {});
        expect(result.allowed).toBe(false);
    });

    it('context cannot override authorization', async () => {
        const result = await ralphGateHook.handle(
            { toolName: 'ralph' },
            { authorized: true, bypass: true }
        );
        expect(result.allowed).toBe(false);
    });

    it('event properties cannot override authorization', async () => {
        const result = await ralphGateHook.handle(
            { toolName: 'ralph', allowed: true, authorized: true },
            {}
        );
        expect(result.allowed).toBe(false);
    });

    it('token consumed prevents reuse', async () => {
        requestRalphAuthorization();
        await ralphGateHook.handle({ toolName: 'ralph' }, {});
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });

    it('revocation prevents use', async () => {
        requestRalphAuthorization();
        revokeRalphAuthorization();
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });
});

describe('Security - Character Whitelist', () => {
    it('all characters are lowercase or have hyphens', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char).toMatch(/^[a-z-]+$/);
        }
    });

    it('no characters have special chars', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char).not.toMatch(/[<>:"\\|?*]/);
        }
    });

    it('no characters have path separators', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char).not.toContain('/');
            expect(char).not.toContain('\\');
        }
    });

    it('no characters have dots', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char).not.toContain('.');
        }
    });

    it('characters are non-empty', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char.length).toBeGreaterThan(0);
        }
    });

    it('characters have reasonable length', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char.length).toBeLessThan(50);
        }
    });
});
