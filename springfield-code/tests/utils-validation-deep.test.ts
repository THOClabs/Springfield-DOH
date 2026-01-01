/**
 * Utils and Validation Deep Tests - Batch 8
 * Deep testing of utility functions and validation logic
 * 50 tests covering prerequisites, validation, and stats
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

import { verifyPrerequisites, PrerequisiteResult } from '../src/utils/prerequisites.js';
import { validateRequiredFiles, REQUIRED_FILES, ALL_CHARACTERS, CHARACTER_TIERS, SPRINGFIELD_DIR } from '../src/constants.js';

describe('Utils Deep - Prerequisites', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `utils-deep-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('non-existent directory should fail prerequisites', () => {
        const result = verifyPrerequisites('/non-existent-path-xyz');
        expect(result.ready).toBe(false);
    });

    it('empty directory should fail prerequisites', () => {
        const result = verifyPrerequisites(testDir);
        expect(result.ready).toBe(false);
    });

    it('result should have errors array', () => {
        const result = verifyPrerequisites('/non-existent-path');
        expect(Array.isArray(result.errors)).toBe(true);
    });

    it('result should have missing array', () => {
        const result = verifyPrerequisites(testDir);
        expect(Array.isArray(result.missing)).toBe(true);
    });

    it('result should have present array', () => {
        const result = verifyPrerequisites(testDir);
        expect(Array.isArray(result.present)).toBe(true);
    });

    it('result should have context array', () => {
        const result = verifyPrerequisites(testDir);
        expect(Array.isArray(result.context)).toBe(true);
    });
});

describe('Utils Deep - Validation Required Files', () => {
    let testDir: string;
    const validContent = 'This is valid content that passes all validation checks and is long enough. '.repeat(4);

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `validation-deep-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('empty directory should have all files missing', () => {
        const result = validateRequiredFiles(testDir);
        expect(result.missing.length).toBe(REQUIRED_FILES.length);
    });

    it('valid directory should pass validation', () => {
        for (const file of REQUIRED_FILES) {
            fs.writeFileSync(path.join(testDir, file), validContent);
        }
        const result = validateRequiredFiles(testDir);
        expect(result.isValid).toBe(true);
    });

    it('files with template placeholders should be incomplete', () => {
        for (const file of REQUIRED_FILES) {
            fs.writeFileSync(path.join(testDir, file), validContent + '[One paragraph description]');
        }
        const result = validateRequiredFiles(testDir);
        expect(result.incomplete.length).toBeGreaterThan(0);
    });

    it('result should categorize files correctly', () => {
        fs.writeFileSync(path.join(testDir, REQUIRED_FILES[0]), validContent);
        fs.writeFileSync(path.join(testDir, REQUIRED_FILES[1]), 'short');
        // Leave rest missing
        const result = validateRequiredFiles(testDir);
        expect(result.present.length).toBe(1);
        expect(result.incomplete.length).toBe(1);
        expect(result.missing.length).toBe(REQUIRED_FILES.length - 2);
    });

    it('custom minContentLength should be respected', () => {
        fs.writeFileSync(path.join(testDir, REQUIRED_FILES[0]), 'short');
        fs.writeFileSync(path.join(testDir, REQUIRED_FILES[1]), 'short');
        fs.writeFileSync(path.join(testDir, REQUIRED_FILES[2]), 'short');
        fs.writeFileSync(path.join(testDir, REQUIRED_FILES[3]), 'short');
        
        const result = validateRequiredFiles(testDir, 1);
        expect(result.isValid).toBe(true);
    });
});

describe('Utils Deep - Character Constants', () => {
    it('ALL_CHARACTERS should have 41 characters', () => {
        expect(ALL_CHARACTERS.length).toBe(41);
    });

    it('all characters should be lowercase', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char).toBe(char.toLowerCase());
        }
    });

    it('all characters should be valid identifiers', () => {
        for (const char of ALL_CHARACTERS) {
            expect(char).toMatch(/^[a-z][a-z0-9-]*$/);
        }
    });

    it('simpson family should have 5 members', () => {
        expect(CHARACTER_TIERS.simpson_family.length).toBe(5);
    });

    it('extended should have 4 members', () => {
        expect(CHARACTER_TIERS.extended.length).toBe(4);
    });

    it('springfield should have 12 members', () => {
        expect(CHARACTER_TIERS.springfield.length).toBe(12);
    });

    it('specialists should have 20 members', () => {
        expect(CHARACTER_TIERS.specialists.length).toBe(20);
    });

    it('tier totals should equal ALL_CHARACTERS', () => {
        const total = 
            CHARACTER_TIERS.simpson_family.length +
            CHARACTER_TIERS.extended.length +
            CHARACTER_TIERS.springfield.length +
            CHARACTER_TIERS.specialists.length;
        expect(total).toBe(ALL_CHARACTERS.length);
    });
});

describe('Utils Deep - Required Files', () => {
    it('REQUIRED_FILES should have 4 files', () => {
        expect(REQUIRED_FILES.length).toBe(4);
    });

    it('all required files should end with .md', () => {
        for (const file of REQUIRED_FILES) {
            expect(file).toMatch(/\.md$/);
        }
    });

    it('project.md should be required', () => {
        expect(REQUIRED_FILES).toContain('project.md');
    });

    it('task.md should be required', () => {
        expect(REQUIRED_FILES).toContain('task.md');
    });

    it('completion.md should be required', () => {
        expect(REQUIRED_FILES).toContain('completion.md');
    });

    it('iterations.md should be required', () => {
        expect(REQUIRED_FILES).toContain('iterations.md');
    });
});

describe('Utils Deep - SPRINGFIELD_DIR', () => {
    it('should be .springfield', () => {
        expect(SPRINGFIELD_DIR).toBe('.springfield');
    });

    it('should start with dot', () => {
        expect(SPRINGFIELD_DIR.startsWith('.')).toBe(true);
    });

    it('should be a hidden directory name', () => {
        expect(SPRINGFIELD_DIR.charAt(0)).toBe('.');
    });

    it('should be lowercase', () => {
        expect(SPRINGFIELD_DIR).toBe(SPRINGFIELD_DIR.toLowerCase());
    });
});

describe('Utils Deep - Validation Edge Cases', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `edge-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('non-existent directory should have error message', () => {
        const result = validateRequiredFiles('/definitely/not/a/real/path');
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validation result should have all required properties', () => {
        fs.mkdirSync(testDir, { recursive: true });
        const result = validateRequiredFiles(testDir);
        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('missing');
        expect(result).toHaveProperty('present');
        expect(result).toHaveProperty('incomplete');
        expect(result).toHaveProperty('errors');
    });

    it('missing array should be readonly REQUIRED_FILES for empty dir', () => {
        fs.mkdirSync(testDir, { recursive: true });
        const result = validateRequiredFiles(testDir);
        for (const file of REQUIRED_FILES) {
            expect(result.missing).toContain(file);
        }
    });
});

describe('Utils Deep - Character Uniqueness', () => {
    it('ALL_CHARACTERS should have no duplicates', () => {
        const unique = new Set(ALL_CHARACTERS);
        expect(unique.size).toBe(ALL_CHARACTERS.length);
    });

    it('simpson_family should have no duplicates', () => {
        const unique = new Set(CHARACTER_TIERS.simpson_family);
        expect(unique.size).toBe(CHARACTER_TIERS.simpson_family.length);
    });

    it('extended should have no duplicates', () => {
        const unique = new Set(CHARACTER_TIERS.extended);
        expect(unique.size).toBe(CHARACTER_TIERS.extended.length);
    });

    it('springfield should have no duplicates', () => {
        const unique = new Set(CHARACTER_TIERS.springfield);
        expect(unique.size).toBe(CHARACTER_TIERS.springfield.length);
    });

    it('specialists should have no duplicates', () => {
        const unique = new Set(CHARACTER_TIERS.specialists);
        expect(unique.size).toBe(CHARACTER_TIERS.specialists.length);
    });

    it('no overlap between simpson_family and extended', () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            expect(CHARACTER_TIERS.extended).not.toContain(char);
        }
    });

    it('no overlap between simpson_family and springfield', () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            expect(CHARACTER_TIERS.springfield).not.toContain(char);
        }
    });

    it('no overlap between simpson_family and specialists', () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            expect(CHARACTER_TIERS.specialists).not.toContain(char);
        }
    });

    it('no overlap between extended and springfield', () => {
        for (const char of CHARACTER_TIERS.extended) {
            expect(CHARACTER_TIERS.springfield).not.toContain(char);
        }
    });

    it('no overlap between extended and specialists', () => {
        for (const char of CHARACTER_TIERS.extended) {
            expect(CHARACTER_TIERS.specialists).not.toContain(char);
        }
    });

    it('no overlap between springfield and specialists', () => {
        for (const char of CHARACTER_TIERS.springfield) {
            expect(CHARACTER_TIERS.specialists).not.toContain(char);
        }
    });
});
