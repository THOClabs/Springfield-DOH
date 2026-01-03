/**
 * Artifacts Extended Tests - Batch 64
 * Extended testing of artifact generation for all character types
 * 50 tests for artifact content, structure, and special cases
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_ARTIFACTS, CHARACTER_TIERS } from '../src/constants.js';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

describe('Artifacts Extended - Specialist Characters', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-ext-spec-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('generates dr-nick health artifact', () => {
        const result = generateArtifact('dr-nick', 'health check', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('dr-nick-health.md');
    });

    it('generates patty compliance artifact', () => {
        const result = generateArtifact('patty', 'check compliance', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('patty-compliance.md');
    });

    it('generates troy onboarding artifact', () => {
        const result = generateArtifact('troy', 'new feature', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('troy-onboarding.md');
    });

    it('generates lionel legal artifact', () => {
        const result = generateArtifact('lionel', 'license check', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('lionel-legal.md');
    });

    it('generates hans accessibility artifact', () => {
        const result = generateArtifact('hans', 'a11y review', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('hans-accessibility.md');
    });

    it('generates hibbert performance artifact', () => {
        const result = generateArtifact('hibbert', 'optimize', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('hibbert-performance.md');
    });

    it('generates edna review artifact', () => {
        const result = generateArtifact('edna', 'code review', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('edna-review.md');
    });

    it('generates otto migration artifact', () => {
        const result = generateArtifact('otto', 'migrate db', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('otto-migration.md');
    });

    it('generates lenny abtesting artifact', () => {
        const result = generateArtifact('lenny', 'test feature', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('lenny-abtesting.md');
    });

    it('generates kent monitoring artifact', () => {
        const result = generateArtifact('kent', 'add alerts', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('kent-monitoring.md');
    });
});

describe('Artifacts Extended - More Specialists', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-ext-spec2-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('generates snake auth artifact', () => {
        const result = generateArtifact('snake', 'security', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('snake-auth.md');
    });

    it('generates cookie database artifact', () => {
        const result = generateArtifact('cookie', 'db schema', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('cookie-database.md');
    });

    it('generates gil errors artifact', () => {
        const result = generateArtifact('gil', 'error handling', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('gil-errors.md');
    });

    it('generates bumblebee i18n artifact', () => {
        const result = generateArtifact('bumblebee', 'localization', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('bumblebee-i18n.md');
    });

    it('generates duffman flags artifact', () => {
        const result = generateArtifact('duffman', 'feature flags', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('duffman-flags.md');
    });

    it('generates fat-tony microservices artifact', () => {
        const result = generateArtifact('fat-tony', 'architecture', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('fat-tony-microservices.md');
    });

    it('generates sea-captain containers artifact', () => {
        const result = generateArtifact('sea-captain', 'docker', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('sea-captain-containers.md');
    });

    it('generates lovejoy events artifact', () => {
        const result = generateArtifact('lovejoy', 'event system', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('lovejoy-events.md');
    });

    it('generates helen analytics artifact', () => {
        const result = generateArtifact('helen', 'tracking', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('helen-analytics.md');
    });

    it('generates agnes cicd artifact', () => {
        const result = generateArtifact('agnes', 'pipeline', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe('agnes-cicd.md');
    });
});

describe('Artifacts Extended - Content Quality', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-ext-qual-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('artifact content is substantial', () => {
        const result = generateArtifact('homer', 'big project', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.length).toBeGreaterThan(100);
    });

    it('artifact has markdown headers', () => {
        const result = generateArtifact('marge', 'organize', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toMatch(/^#/m);
    });

    it('artifact includes user input context', () => {
        const userInput = 'very-unique-test-context-xyz';
        const result = generateArtifact('bart', userInput, testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toContain(userInput);
    });

    it('artifact is valid UTF-8', () => {
        const result = generateArtifact('lisa', 'analyze', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(() => Buffer.from(content, 'utf-8')).not.toThrow();
    });

    it('artifact has no binary content', () => {
        const result = generateArtifact('maggie', 'observe', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).not.toContain('\0');
    });
});

describe('Artifacts Extended - File System Behavior', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-ext-fs-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('artifact path is absolute', () => {
        const result = generateArtifact('homer', 'test', testDir);
        expect(path.isAbsolute(result!)).toBe(true);
    });

    it('artifact is in springfield directory', () => {
        const result = generateArtifact('marge', 'test', testDir);
        expect(result!.includes('.springfield')).toBe(true);
    });

    it('multiple artifacts coexist', () => {
        generateArtifact('homer', 'test', testDir);
        generateArtifact('marge', 'test', testDir);
        generateArtifact('bart', 'test', testDir);
        expect(artifactExists('homer', testDir)).toBe(true);
        expect(artifactExists('marge', testDir)).toBe(true);
        expect(artifactExists('bart', testDir)).toBe(true);
    });

    it('artifactExists is false before generation', () => {
        expect(artifactExists('lisa', testDir)).toBe(false);
    });

    it('artifactExists is true after generation', () => {
        generateArtifact('lisa', 'test', testDir);
        expect(artifactExists('lisa', testDir)).toBe(true);
    });

    it('regeneration overwrites existing artifact', () => {
        const result1 = generateArtifact('homer', 'first input', testDir);
        const content1 = fs.readFileSync(result1!, 'utf-8');
        
        const result2 = generateArtifact('homer', 'second input', testDir);
        const content2 = fs.readFileSync(result2!, 'utf-8');
        
        expect(content1).not.toBe(content2);
        expect(result1).toBe(result2); // Same file path
    });
});

describe('Artifacts Extended - Invalid Characters', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-ext-inv-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('returns null for unknown character', () => {
        const result = generateArtifact('unknown-char', 'test', testDir);
        expect(result).toBeNull();
    });

    it('returns null for empty character', () => {
        const result = generateArtifact('', 'test', testDir);
        expect(result).toBeNull();
    });

    it('ralph returns null (special character)', () => {
        const result = generateArtifact('ralph', 'test', testDir);
        expect(result).toBeNull();
    });

    it('throws for null projectDir', () => {
        expect(() => generateArtifact('homer', 'test', null as any)).toThrow();
    });

    it('throws for undefined projectDir', () => {
        expect(() => generateArtifact('homer', 'test', undefined as any)).toThrow();
    });
});

describe('Artifacts Extended - Character Tier Coverage', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `art-ext-tier-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('all simpson family can generate artifacts', () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all extended family can generate artifacts', () => {
        for (const char of CHARACTER_TIERS.extended) {
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all springfield (except ralph) can generate artifacts', () => {
        for (const char of CHARACTER_TIERS.springfield) {
            if (char === 'ralph') continue;
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all specialists can generate artifacts', () => {
        for (const char of CHARACTER_TIERS.specialists) {
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('artifact count matches characters minus ralph', () => {
        const artifactCount = Object.keys(CHARACTER_ARTIFACTS).length;
        const expectedCount = ALL_CHARACTERS.length - 1; // minus ralph
        expect(artifactCount).toBe(expectedCount);
    });
});
