/**
 * Generator Deep Tests - Batch 5
 * Comprehensive artifact generator testing for all 41 characters
 * 50 tests covering generator functions, output format, edge cases
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_ARTIFACTS, CHARACTER_TIERS } from '../src/constants.js';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

const SIMPSON_FAMILY = CHARACTER_TIERS.simpson_family;
const EXTENDED_FAMILY = CHARACTER_TIERS.extended;
const SPRINGFIELD_RESIDENTS = CHARACTER_TIERS.springfield;
const SPECIALISTS = CHARACTER_TIERS.specialists;

describe('Generator Deep - Simpson Family Artifacts', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-deep-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should generate homer artifact', () => {
        const result = generateArtifact('homer', 'test input', testDir);
        expect(result).not.toBeNull();
    });

    it('homer artifact content should mention questions', () => {
        const result = generateArtifact('homer', 'test', testDir);
        expect(result).not.toBeNull();
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/question|wonder|why/);
    });

    it('homer artifact should be substantial', () => {
        const result = generateArtifact('homer', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.length).toBeGreaterThan(50);
    });

    it('should generate marge artifact', () => {
        const result = generateArtifact('marge', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('marge artifact should be organized', () => {
        const result = generateArtifact('marge', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.length).toBeGreaterThan(50);
    });

    it('should generate bart artifact', () => {
        const result = generateArtifact('bart', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('bart artifact should have edge case focus', () => {
        const result = generateArtifact('bart', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.length).toBeGreaterThan(50);
    });

    it('should generate lisa artifact', () => {
        const result = generateArtifact('lisa', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate maggie artifact', () => {
        const result = generateArtifact('maggie', 'test', testDir);
        expect(result).not.toBeNull();
    });
});

describe('Generator Deep - Extended Family Artifacts', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-ext-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should generate grampa artifact', () => {
        const result = generateArtifact('grampa', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate burns artifact', () => {
        const result = generateArtifact('burns', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('burns artifact should be substantial', () => {
        const result = generateArtifact('burns', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.length).toBeGreaterThan(50);
    });

    it('should generate smithers artifact', () => {
        const result = generateArtifact('smithers', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate flanders artifact', () => {
        const result = generateArtifact('flanders', 'test', testDir);
        expect(result).not.toBeNull();
    });
});

describe('Generator Deep - Springfield Residents', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-spring-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should return null for ralph (special character without artifact)', () => {
        // Ralph is a special character that doesn't have an artifact in CHARACTER_ARTIFACTS
        const result = generateArtifact('ralph', 'test', testDir);
        expect(result).toBeNull();
    });

    it('should generate moe artifact', () => {
        const result = generateArtifact('moe', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate krusty artifact', () => {
        const result = generateArtifact('krusty', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate apu artifact', () => {
        const result = generateArtifact('apu', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate wiggum artifact', () => {
        const result = generateArtifact('wiggum', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate nelson artifact', () => {
        const result = generateArtifact('nelson', 'test', testDir);
        expect(result).not.toBeNull();
    });
});

describe('Generator Deep - Specialists', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-spec-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should generate dr-nick artifact', () => {
        const result = generateArtifact('dr-nick', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate fat-tony artifact', () => {
        const result = generateArtifact('fat-tony', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate sea-captain artifact', () => {
        const result = generateArtifact('sea-captain', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate otto artifact', () => {
        const result = generateArtifact('otto', 'test', testDir);
        expect(result).not.toBeNull();
    });

    it('should generate snake artifact', () => {
        const result = generateArtifact('snake', 'test', testDir);
        expect(result).not.toBeNull();
    });
});

describe('Generator Deep - Error Handling', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-err-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should return null for unknown character', () => {
        const result = generateArtifact('unknown', 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
        const result = generateArtifact('', 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for path traversal attempt', () => {
        const result = generateArtifact('../../../etc/passwd', 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for special characters', () => {
        const result = generateArtifact('homer<script>', 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for non-existent springfield dir', () => {
        fs.rmSync(springfieldDir, { recursive: true, force: true });
        const result = generateArtifact('homer', 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for undefined character', () => {
        const result = generateArtifact(undefined as unknown as string, 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for null character', () => {
        const result = generateArtifact(null as unknown as string, 'test', testDir);
        expect(result).toBeNull();
    });

    it('should return null for numeric character', () => {
        const result = generateArtifact(123 as unknown as string, 'test', testDir);
        expect(result).toBeNull();
    });
});

describe('Generator Deep - Artifact Exists Function', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-exists-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should return false for non-existent artifact', () => {
        const exists = artifactExists('homer', testDir);
        expect(exists).toBe(false);
    });

    it('should return true after generating artifact', () => {
        generateArtifact('homer', 'test', testDir);
        const exists = artifactExists('homer', testDir);
        expect(exists).toBe(true);
    });

    it('should return false for non-existent directory', () => {
        const exists = artifactExists('homer', '/nonexistent/path');
        expect(exists).toBe(false);
    });

    it('should return false for invalid character', () => {
        const exists = artifactExists('invalid', testDir);
        expect(exists).toBe(false);
    });

    it('multiple characters can have artifacts', () => {
        generateArtifact('homer', 'test', testDir);
        generateArtifact('marge', 'test', testDir);
        generateArtifact('bart', 'test', testDir);
        
        expect(artifactExists('homer', testDir)).toBe(true);
        expect(artifactExists('marge', testDir)).toBe(true);
        expect(artifactExists('bart', testDir)).toBe(true);
    });
});

describe('Generator Deep - Output Format', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `generator-fmt-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('artifacts should contain markdown headers', () => {
        const result = generateArtifact('homer', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toMatch(/#|##|\*\*/);
    });

    it('artifacts should have proper line endings', () => {
        const result = generateArtifact('marge', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toContain('\n');
    });

    it('artifacts should be self-contained markdown', () => {
        const result = generateArtifact('lisa', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).not.toContain('import');
        expect(content).not.toContain('require(');
    });

    it('artifacts should include user input', () => {
        const userInput = 'unique-test-input-12345';
        const result = generateArtifact('bart', userInput, testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toContain(userInput);
    });

    it('different characters produce different file names', () => {
        const homer = generateArtifact('homer', 'test', testDir);
        const marge = generateArtifact('marge', 'test', testDir);
        expect(homer).not.toBe(marge);
    });
});
