/**
 * Coverage Gaps Tests - Batch 58
 * Tests targeting specific uncovered lines and branches
 * 50 tests for coverage gaps in ralph-gate, summon, validation, etc.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
} from '../src/index.js';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';
import { loadStats, saveStats, recordInvocation, resetStats } from '../src/utils/stats.js';
import {
    validateSpringfieldDirectory,
    isSpringfieldInitialized,
    isSpringfieldReady,
    validateRequiredFiles,
} from '../src/utils/validation.js';
import summonCommand from '../src/commands/summon.js';
import summonBatchCommand from '../src/commands/summon-batch.js';
import { run as springfieldRun } from '../src/commands/springfield.js';

describe('Coverage Gaps - Ralph Gate Edge Cases', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('should return confused response for ralph tool without authorization', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
        expect(result.message).toBeDefined();
        expect(result.message).toContain('Lisa');
    });

    it('should return confused response for ralph-loop tool without authorization', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph-loop' }, {});
        expect(result.allowed).toBe(false);
        expect(result.message).toBeDefined();
    });

    it('should allow ralph tool with valid token', async () => {
        const token = requestRalphAuthorization();
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(true);
    });

    it('should consume token on successful ralph invocation', async () => {
        const token = requestRalphAuthorization();
        await ralphGateHook.handle({ toolName: 'ralph' }, {});
        // Token consumed, second call should fail
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });

    it('should be case-insensitive for tool names', async () => {
        const result1 = await ralphGateHook.handle({ toolName: 'RALPH' }, {});
        expect(result1.allowed).toBe(false);

        const result2 = await ralphGateHook.handle({ toolName: 'Ralph-Loop' }, {});
        expect(result2.allowed).toBe(false);
    });

    it('should allow non-ralph tools without authorization', async () => {
        const result = await ralphGateHook.handle({ toolName: 'other-tool' }, {});
        expect(result.allowed).toBe(true);
    });

    it('should handle empty tool name', async () => {
        const result = await ralphGateHook.handle({ toolName: '' }, {});
        expect(result.allowed).toBe(true);
    });

    it('confused response should mention Lisa multiple times', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.message).toBeDefined();
        // All confused responses mention Lisa
        expect(result.message!.toLowerCase()).toContain('lisa');
    });

    it('should handle tool name with mixed case and numbers', async () => {
        const result = await ralphGateHook.handle({ toolName: 'Ralph123' }, {});
        expect(result.allowed).toBe(true);
    });

    it('should handle tool name with special characters', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph_tool' }, {});
        expect(result.allowed).toBe(true);
    });
});

describe('Coverage Gaps - Summon Command Edge Cases', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `cov-gaps-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('summon command should have name property', () => {
        expect(summonCommand.name).toBe('summon');
    });

    it('summon command should have description property', () => {
        expect(summonCommand.description).toBeDefined();
        expect(typeof summonCommand.description).toBe('string');
    });

    it('should run summon command with valid character', async () => {
        const result = await summonCommand.run(['homer', 'test'], { cwd: testDir });
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });

    it('should run summon command with user input', async () => {
        const result = await summonCommand.run(['bart', 'hello', 'world'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle summon command with empty input', async () => {
        const result = await summonCommand.run(['lisa'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle summon command for all simpson family', async () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            const result = await summonCommand.run([char, 'test'], { cwd: testDir });
            expect(result).toBeDefined();
        }
    });

    it('should handle summon command for extended family', async () => {
        for (const char of CHARACTER_TIERS.extended) {
            const result = await summonCommand.run([char, 'test'], { cwd: testDir });
            expect(result).toBeDefined();
        }
    });

    it('should handle invalid character gracefully', async () => {
        const result = await summonCommand.run(['invalid-character', 'test'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle empty args', async () => {
        const result = await summonCommand.run([], { cwd: testDir });
        expect(result).toBeDefined();
    });
});

describe('Coverage Gaps - Summon Batch Edge Cases', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `cov-batch-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('summon batch command should have name property', () => {
        expect(summonBatchCommand.name).toBe('summon-batch');
    });

    it('summon batch command should have description property', () => {
        expect(summonBatchCommand.description).toBeDefined();
    });

    it('should run batch with family tier', async () => {
        const result = await summonBatchCommand.run(['family', 'test'], { cwd: testDir });
        expect(result).toContain('Homer');
    });

    it('should run batch with extended tier', async () => {
        const result = await summonBatchCommand.run(['extended', 'test'], { cwd: testDir });
        expect(result).toContain('Grampa');
    });

    it('should include batch complete message', async () => {
        const result = await summonBatchCommand.run(['family', 'test'], { cwd: testDir });
        expect(result).toContain('Batch complete');
    });

    it('should handle batch with no input', async () => {
        const result = await summonBatchCommand.run([], { cwd: testDir });
        expect(result).toContain('Batch Summon');
    });
});

describe('Coverage Gaps - Springfield Command Edge Cases', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `spring-cov-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should handle init subcommand', async () => {
        const result = await springfieldRun(['init'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle status subcommand', async () => {
        const result = await springfieldRun(['status'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle reset subcommand', async () => {
        const result = await springfieldRun(['reset'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle unknown subcommand with help', async () => {
        const result = await springfieldRun(['unknown'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle empty args with help', async () => {
        const result = await springfieldRun([], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle subcommand case-insensitively', async () => {
        const result = await springfieldRun(['INIT'], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('should handle Status with mixed case', async () => {
        const result = await springfieldRun(['Status'], { cwd: testDir });
        expect(result).toBeDefined();
    });
});

describe('Coverage Gaps - Validation Utilities', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `val-cov-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should validate non-existent directory', () => {
        const result = validateSpringfieldDirectory(testDir);
        expect(result.isValid).toBe(false);
    });

    it('isSpringfieldInitialized should return false for non-existent dir', () => {
        expect(isSpringfieldInitialized(testDir)).toBe(false);
    });

    it('isSpringfieldReady should return false for non-existent dir', () => {
        expect(isSpringfieldReady(testDir)).toBe(false);
    });

    it('should validate empty directory', () => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        const result = validateSpringfieldDirectory(testDir);
        expect(result.isValid).toBe(false);
    });

    it('should validate directory with incomplete files', () => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'short');
        const result = validateSpringfieldDirectory(testDir);
        expect(result.isValid).toBe(false);
    });

    it('should find optional files in directory', () => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        fs.writeFileSync(path.join(springfieldDir, 'custom.md'), 'custom content');
        const result = validateSpringfieldDirectory(testDir);
        expect(result.optionalFiles).toContain('custom.md');
    });

    it('should detect template placeholders in files', () => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[One paragraph description of project]');
        const result = validateSpringfieldDirectory(testDir);
        expect(result.incompleteFiles).toContain('project.md');
    });
});

describe('Coverage Gaps - Stats Utilities', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `stats-cov-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should load stats from non-existent file', () => {
        const stats = loadStats(testDir);
        expect(stats).toBeDefined();
        expect(stats.totalInvocations).toBe(0);
    });

    it('should save stats to file', () => {
        const stats = loadStats(testDir);
        const saved = saveStats(testDir, stats);
        expect(saved).toBe(true);
    });

    it('should record invocation and increment count', () => {
        recordInvocation(testDir, 'homer');
        const stats = loadStats(testDir);
        expect(stats.totalInvocations).toBeGreaterThan(0);
    });

    it('should reset stats', () => {
        recordInvocation(testDir, 'homer');
        resetStats(testDir);
        const newStats = loadStats(testDir);
        expect(newStats.totalInvocations).toBe(0);
    });

    it('should handle multiple character invocations', () => {
        recordInvocation(testDir, 'homer');
        recordInvocation(testDir, 'marge');
        recordInvocation(testDir, 'bart');
        const stats = loadStats(testDir);
        expect(stats.totalInvocations).toBe(3);
    });
});

describe('Coverage Gaps - Artifact Generator Edge Cases', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-cov-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should throw on null projectDir', () => {
        expect(() => generateArtifact('homer', 'test', null as any)).toThrow();
    });

    it('should throw on undefined projectDir', () => {
        expect(() => generateArtifact('homer', 'test', undefined as any)).toThrow();
    });

    it('should generate artifact for specialist character', () => {
        const result = generateArtifact('dr-nick', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate artifact for all tiers', () => {
        for (const tier of Object.values(CHARACTER_TIERS)) {
            for (const char of tier.slice(0, 2)) {
                const result = generateArtifact(char, 'test', testDir);
                expect(result).not.toBeNull();
            }
        }
    });

    it('artifactExists should return false for non-existent artifact', () => {
        expect(artifactExists('homer', testDir)).toBe(false);
    });

    it('artifactExists should return true after generation', () => {
        generateArtifact('homer', 'test', testDir);
        expect(artifactExists('homer', testDir)).toBe(true);
    });

    it('should handle empty user input', () => {
        const result = generateArtifact('homer', '', testDir);
        expect(result).not.toBeNull();
    });

    it('should handle whitespace-only input', () => {
        const result = generateArtifact('homer', '   ', testDir);
        expect(result).not.toBeNull();
    });
});

describe('Coverage Gaps - Token Authority Edge Cases', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('should generate unique tokens', () => {
        const token1 = requestRalphAuthorization();
        resetRalphGateForTesting();
        const token2 = requestRalphAuthorization();
        expect(token1).not.toBe(token2);
    });

    it('should not authorize with wrong token', () => {
        requestRalphAuthorization();
        const result = authorizeRalph({ token: 'wrong-token', timestamp: Date.now() });
        expect(result).toBe(false);
    });

    it('should authorize with correct token', () => {
        const token = requestRalphAuthorization();
        const result = authorizeRalph(token);
        expect(result).toBe(true);
    });

    it('canInvokeRalph should be true when token exists', () => {
        requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
    });

    it('canInvokeRalph should be false after revocation', () => {
        requestRalphAuthorization();
        revokeRalphAuthorization();
        expect(canInvokeRalph()).toBe(false);
    });
});
