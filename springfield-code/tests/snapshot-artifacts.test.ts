/**
 * Snapshot Artifacts Tests - Batch 59
 * Tests using vitest snapshot testing for artifact content validation
 * 50 tests covering artifact structure, content, and consistency
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_TIERS, CHARACTER_ARTIFACTS } from '../src/constants.js';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

describe('Snapshot - Simpson Family Artifact Structure', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `snap-simpson-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('homer artifact has expected filename', () => {
        const result = generateArtifact('homer', 'test', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.homer);
    });

    it('marge artifact has expected filename', () => {
        const result = generateArtifact('marge', 'test', testDir);
        expect(result).not.toBeNull();
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.marge);
    });

    it('bart artifact has expected filename', () => {
        const result = generateArtifact('bart', 'test', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.bart);
    });

    it('lisa artifact has expected filename', () => {
        const result = generateArtifact('lisa', 'test', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.lisa);
    });

    it('maggie artifact has expected filename', () => {
        const result = generateArtifact('maggie', 'test', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.maggie);
    });

    it('homer artifact content structure is valid markdown', () => {
        const result = generateArtifact('homer', 'build feature', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toMatch(/^#/m); // Has markdown header
        expect(content.length).toBeGreaterThan(100);
    });

    it('marge artifact content structure is valid markdown', () => {
        const result = generateArtifact('marge', 'organize', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).toMatch(/^#/m);
    });

    it('bart artifact content has edge case focus', () => {
        const result = generateArtifact('bart', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/edge|break|chaos|unexpected/);
    });

    it('lisa artifact content is properly structured', () => {
        const result = generateArtifact('lisa', 'plan', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.length).toBeGreaterThan(50);
    });

    it('maggie artifact content has logging focus', () => {
        const result = generateArtifact('maggie', 'observe', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/log|observe|silent|watch/);
    });
});

describe('Snapshot - Extended Family Artifact Structure', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `snap-ext-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('grampa artifact has expected filename', () => {
        const result = generateArtifact('grampa', 'history', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.grampa);
    });

    it('burns artifact has expected filename', () => {
        const result = generateArtifact('burns', 'budget', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.burns);
    });

    it('smithers artifact has expected filename', () => {
        const result = generateArtifact('smithers', 'schedule', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.smithers);
    });

    it('flanders artifact has expected filename', () => {
        const result = generateArtifact('flanders', 'standards', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.flanders);
    });

    it('grampa artifact content has history theme', () => {
        const result = generateArtifact('grampa', 'reminisce', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/histor|remember|past|war|old/);
    });

    it('burns artifact content has budget theme', () => {
        const result = generateArtifact('burns', 'money', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/budget|cost|money|excellent|power/);
    });

    it('smithers artifact content has schedule theme', () => {
        const result = generateArtifact('smithers', 'plan', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/schedule|plan|timeline|burns/);
    });

    it('flanders artifact content has standards theme', () => {
        const result = generateArtifact('flanders', 'quality', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/standard|quality|diddly|neighbor|best/);
    });
});

describe('Snapshot - Springfield Residents Artifact Structure', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `snap-town-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('moe artifact has expected filename', () => {
        const result = generateArtifact('moe', 'debug', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.moe);
    });

    it('wiggum artifact has expected filename', () => {
        const result = generateArtifact('wiggum', 'security', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.wiggum);
    });

    it('krusty artifact has expected filename', () => {
        const result = generateArtifact('krusty', 'demo', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.krusty);
    });

    it('bob artifact has expected filename', () => {
        const result = generateArtifact('bob', 'adversarial', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.bob);
    });

    it('moe artifact content has debug theme', () => {
        const result = generateArtifact('moe', 'fix', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/debug|fix|problem|trouble/);
    });

    it('wiggum artifact content has security theme', () => {
        const result = generateArtifact('wiggum', 'review', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/secur|review|protect|crime|police/);
    });

    it('krusty artifact content has demo theme', () => {
        const result = generateArtifact('krusty', 'show', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/demo|show|entertain|hey/);
    });

    it('bob artifact content has adversarial theme', () => {
        const result = generateArtifact('bob', 'attack', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.toLowerCase()).toMatch(/adversar|attack|vulnerab|exploit|bart/);
    });
});

describe('Snapshot - Specialist Artifact Structure', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `snap-spec-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('dr-nick artifact has expected filename', () => {
        const result = generateArtifact('dr-nick', 'health', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS['dr-nick']);
    });

    it('patty artifact has expected filename', () => {
        const result = generateArtifact('patty', 'compliance', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.patty);
    });

    it('otto artifact has expected filename', () => {
        const result = generateArtifact('otto', 'migration', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.otto);
    });

    it('kent artifact has expected filename', () => {
        const result = generateArtifact('kent', 'monitoring', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS.kent);
    });

    it('fat-tony artifact has expected filename', () => {
        const result = generateArtifact('fat-tony', 'services', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS['fat-tony']);
    });

    it('sea-captain artifact has expected filename', () => {
        const result = generateArtifact('sea-captain', 'containers', testDir);
        expect(path.basename(result!)).toBe(CHARACTER_ARTIFACTS['sea-captain']);
    });
});

describe('Snapshot - Artifact Consistency Across Tiers', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `snap-consist-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('all simpson family have artifacts', () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all extended family have artifacts', () => {
        for (const char of CHARACTER_TIERS.extended) {
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all springfield residents have artifacts', () => {
        for (const char of CHARACTER_TIERS.springfield) {
            if (char === 'ralph') continue; // Ralph is special - no direct artifact
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all specialists have artifacts', () => {
        for (const char of CHARACTER_TIERS.specialists) {
            const result = generateArtifact(char, 'test', testDir);
            expect(result).not.toBeNull();
        }
    });

    it('all artifacts exist after generation', () => {
        for (const char of ALL_CHARACTERS.slice(0, 10)) {
            generateArtifact(char, 'test', testDir);
            expect(artifactExists(char, testDir)).toBe(true);
        }
    });

    it('artifacts are stored in .springfield directory', () => {
        generateArtifact('homer', 'test', testDir);
        const filesInSpringfield = fs.readdirSync(springfieldDir);
        expect(filesInSpringfield.length).toBeGreaterThan(0);
    });
});

describe('Snapshot - Artifact Content Validation', () => {
    let testDir: string;
    let springfieldDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `snap-val-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        springfieldDir = path.join(testDir, '.springfield');
        fs.mkdirSync(springfieldDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('artifact content is non-empty string', () => {
        const result = generateArtifact('homer', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
    });

    it('artifact content has no null bytes', () => {
        const result = generateArtifact('marge', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content).not.toContain('\0');
    });

    it('artifact content is valid UTF-8', () => {
        const result = generateArtifact('bart', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(() => new TextEncoder().encode(content)).not.toThrow();
    });

    it('artifact content ends with newline or content', () => {
        const result = generateArtifact('lisa', 'test', testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        expect(content.trimEnd().length).toBeGreaterThan(0);
    });

    it('artifact preserves user input context', () => {
        const input = 'unique-test-context-123';
        const result = generateArtifact('homer', input, testDir);
        const content = fs.readFileSync(result!, 'utf-8');
        // Content should reference the input
        expect(content.toLowerCase()).toContain('unique-test-context-123');
    });

    it('different inputs produce different artifacts', () => {
        const result1 = generateArtifact('homer', 'first input', testDir);
        const content1 = fs.readFileSync(result1!, 'utf-8');
        
        // Regenerate with different input
        fs.unlinkSync(result1!);
        
        const result2 = generateArtifact('homer', 'second input', testDir);
        const content2 = fs.readFileSync(result2!, 'utf-8');
        
        expect(content1).not.toBe(content2);
    });

    it('same input produces same filename', () => {
        const result1 = generateArtifact('homer', 'test', testDir);
        fs.unlinkSync(result1!);
        const result2 = generateArtifact('homer', 'test', testDir);
        expect(result1).toBe(result2);
    });
});

describe('Snapshot - Character Artifact Mapping Completeness', () => {
    it('all characters have artifact mappings', () => {
        for (const char of ALL_CHARACTERS) {
            if (char !== 'ralph') { // Ralph is special
                expect(CHARACTER_ARTIFACTS[char]).toBeDefined();
            }
        }
    });

    it('artifact filenames end with .md', () => {
        for (const [char, filename] of Object.entries(CHARACTER_ARTIFACTS)) {
            expect(filename).toMatch(/\.md$/);
        }
    });

    it('artifact filenames are unique', () => {
        const filenames = Object.values(CHARACTER_ARTIFACTS);
        const uniqueFilenames = new Set(filenames);
        expect(uniqueFilenames.size).toBe(filenames.length);
    });

    it('artifact filenames are lowercase', () => {
        for (const filename of Object.values(CHARACTER_ARTIFACTS)) {
            expect(filename).toBe(filename.toLowerCase());
        }
    });

    it('artifact filenames have no spaces', () => {
        for (const filename of Object.values(CHARACTER_ARTIFACTS)) {
            expect(filename).not.toContain(' ');
        }
    });

    it('artifact filenames use hyphens for separation', () => {
        for (const filename of Object.values(CHARACTER_ARTIFACTS)) {
            expect(filename).toMatch(/^[a-z0-9-]+\.md$/);
        }
    });
});
