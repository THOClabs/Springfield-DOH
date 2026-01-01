/**
 * User Guide Examples Tests - Batch 62
 * Tests verifying code examples from documentation work correctly
 * 50 tests covering API usage patterns from README and USERGUIDE
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

// Import all public exports as they would be used in docs
import {
    // Commands
    springfieldCommand,
    summonCommand,
    lisaRalphCommand,
    homerCommand,
    margeCommand,
    bartCommand,
    lisaCommand,
    maggieCommand,
    summonBatchCommand,
    statsCommand,
    
    // Ralph Gate API
    requestRalphAuthorization,
    authorizeRalph,
    revokeRalphAuthorization,
    canInvokeRalph,
    resetRalphGateForTesting,
    ralphGateHook,
    
    // Constants
    ALL_CHARACTERS,
    CHARACTER_TIERS,
    CHARACTER_ARTIFACTS,
    REQUIRED_FILES,
    SPRINGFIELD_DIR,
    
    // Artifacts
    generateArtifact,
    artifactExists,
    
    // Stats
    loadStats,
    recordInvocation,
    getTopCharacters,
    formatStatsReport,
    resetStats,
    
    // Validation
    isSpringfieldInitialized,
    isSpringfieldReady,
    validateSpringfieldDirectory,
    hasTemplatePlaceholders,
    isFileComplete,
    
    // Config
    getConfig,
    getCachedConfig,
    clearConfigCache,
    validateConfig,
    DEFAULT_CONFIG,
    
    // Skills
    registerSkill,
    getSkill,
    listSkills,
    clearSkillRegistry,
    
    // Plugin info
    PLUGIN_INFO,
} from '../src/index.js';

describe('User Guide - Basic Usage Examples', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `ug-basic-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
        resetRalphGateForTesting();
        clearConfigCache();
        clearSkillRegistry();
    });

    afterEach(() => {
        resetRalphGateForTesting();
        clearConfigCache();
        clearSkillRegistry();
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('plugin info is accessible', () => {
        expect(PLUGIN_INFO.name).toBe('springfield-code');
        expect(PLUGIN_INFO.version).toBeDefined();
    });

    it('can summon a character', async () => {
        const response = await summonCommand.run(['homer', 'help with testing'], { cwd: testDir });
        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
    });

    it('can generate an artifact', () => {
        const artifactPath = generateArtifact('homer', 'my project question', testDir);
        expect(artifactPath).not.toBeNull();
        expect(fs.existsSync(artifactPath!)).toBe(true);
    });

    it('can check if artifact exists', () => {
        generateArtifact('marge', 'organize', testDir);
        expect(artifactExists('marge', testDir)).toBe(true);
    });

    it('can list all characters', () => {
        expect(ALL_CHARACTERS.length).toBe(41);
    });

    it('can access character tiers', () => {
        expect(CHARACTER_TIERS.simpson_family).toContain('homer');
        expect(CHARACTER_TIERS.specialists).toContain('dr-nick');
    });
});

describe('User Guide - Ralph Authorization Flow', () => {
    beforeEach(() => {
        resetRalphGateForTesting();
    });

    afterEach(() => {
        resetRalphGateForTesting();
    });

    it('request authorization returns token', () => {
        const token = requestRalphAuthorization();
        expect(token).toBeDefined();
        expect(token).not.toBeNull();
        expect(typeof token).toBe('string');
    });

    it('can check if ralph is invokable', () => {
        expect(canInvokeRalph()).toBe(false);
        requestRalphAuthorization();
        expect(canInvokeRalph()).toBe(true);
    });

    it('can authorize with token', () => {
        const token = requestRalphAuthorization();
        const result = authorizeRalph(token);
        expect(result).toBe(true);
    });

    it('can revoke authorization', () => {
        requestRalphAuthorization();
        revokeRalphAuthorization();
        expect(canInvokeRalph()).toBe(false);
    });

    it('hook allows non-ralph tools', async () => {
        const result = await ralphGateHook.handle({ toolName: 'any-tool' }, {});
        expect(result.allowed).toBe(true);
    });

    it('hook blocks ralph without auth', async () => {
        const result = await ralphGateHook.handle({ toolName: 'ralph' }, {});
        expect(result.allowed).toBe(false);
    });
});

describe('User Guide - Configuration Examples', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `ug-cfg-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        fs.mkdirSync(testDir, { recursive: true });
        clearConfigCache();
    });

    afterEach(() => {
        clearConfigCache();
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('can get default config', () => {
        const config = getConfig(testDir);
        expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
    });

    it('can use cached config', () => {
        const config1 = getCachedConfig(testDir);
        const config2 = getCachedConfig(testDir);
        expect(config1).toBe(config2);
    });

    it('can validate custom config', () => {
        const errors = validateConfig({
            tokenTtlMs: 60000,
            tokenMaxUses: 3,
        });
        expect(errors).toHaveLength(0);
    });

    it('DEFAULT_CONFIG has all expected fields', () => {
        expect(DEFAULT_CONFIG.tokenTtlMs).toBeDefined();
        expect(DEFAULT_CONFIG.logLevel).toBeDefined();
        expect(DEFAULT_CONFIG.defaultMaxIterations).toBeDefined();
    });
});

describe('User Guide - Stats Examples', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `ug-stats-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('can load stats', () => {
        const stats = loadStats(testDir);
        expect(stats).toBeDefined();
        expect(stats.totalInvocations).toBe(0);
    });

    it('can record invocation', () => {
        recordInvocation(testDir, 'homer');
        const stats = loadStats(testDir);
        expect(stats.totalInvocations).toBe(1);
    });

    it('can get top characters', () => {
        recordInvocation(testDir, 'homer');
        recordInvocation(testDir, 'homer');
        recordInvocation(testDir, 'marge');
        const top = getTopCharacters(testDir, 5);
        expect(top).toBeDefined();
    });

    it('can format stats report', () => {
        recordInvocation(testDir, 'bart');
        const report = formatStatsReport(testDir);
        expect(typeof report).toBe('string');
    });

    it('can reset stats', () => {
        recordInvocation(testDir, 'lisa');
        resetStats(testDir);
        const stats = loadStats(testDir);
        expect(stats.totalInvocations).toBe(0);
    });
});

describe('User Guide - Validation Examples', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `ug-val-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('can check if initialized', () => {
        expect(isSpringfieldInitialized(testDir)).toBe(false);
        fs.mkdirSync(springfieldDir, { recursive: true });
        expect(isSpringfieldInitialized(testDir)).toBe(true);
    });

    it('can check if ready', () => {
        expect(isSpringfieldReady(testDir)).toBe(false);
    });

    it('can validate directory', () => {
        const result = validateSpringfieldDirectory(testDir);
        expect(result.isValid).toBe(false);
    });

    it('can detect template placeholders', () => {
        expect(hasTemplatePlaceholders('[One paragraph description]')).toBe(true);
        expect(hasTemplatePlaceholders('Real content here')).toBe(false);
    });

    it('can check file completeness', () => {
        // isFileComplete takes content string, not file path
        expect(isFileComplete('short', 10)).toBe(false);
        expect(isFileComplete('This is longer content', 10)).toBe(true);
    });

    it('REQUIRED_FILES is defined', () => {
        expect(REQUIRED_FILES).toContain('project.md');
        expect(REQUIRED_FILES).toContain('task.md');
    });

    it('SPRINGFIELD_DIR constant is .springfield', () => {
        expect(SPRINGFIELD_DIR).toBe('.springfield');
    });
});

describe('User Guide - Skills Examples', () => {
    beforeEach(() => {
        clearSkillRegistry();
    });

    afterEach(() => {
        clearSkillRegistry();
    });

    it('can register a skill', () => {
        // registerSkill takes content with frontmatter
        const content = `---
name: test-skill
description: A test skill
---
# Test Skill Content`;
        registerSkill(content);
        const result = getSkill('test-skill');
        expect(result.found).toBe(true);
    });

    it('can list skills', () => {
        const content1 = `---
name: skill1
---
# Skill 1`;
        const content2 = `---
name: skill2
---
# Skill 2`;
        registerSkill(content1);
        registerSkill(content2);
        const skills = listSkills();
        expect(skills.length).toBe(2);
    });

    it('getSkill returns found false for unknown', () => {
        const result = getSkill('unknown-skill');
        expect(result.found).toBe(false);
    });
});

describe('User Guide - Command Examples', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `ug-cmd-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('springfield command has run method', () => {
        expect(typeof springfieldCommand.run).toBe('function');
    });

    it('summon batch command works', async () => {
        const result = await summonBatchCommand.run(['family', 'test'], { cwd: testDir });
        expect(result).toContain('Homer');
    });

    it('stats command works', async () => {
        const result = await statsCommand.run([], { cwd: testDir });
        expect(result).toBeDefined();
    });

    it('lisa-ralph command exists', () => {
        expect(lisaRalphCommand).toBeDefined();
        expect(lisaRalphCommand.name).toBeDefined();
    });
});
