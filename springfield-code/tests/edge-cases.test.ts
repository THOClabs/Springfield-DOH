/**
 * Edge Cases and Error Handling Tests - Batch 3
 * Deep testing of error paths, boundary conditions, and defensive code
 * 50 tests covering constants, tiers, validation, and logger
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import actual exports from modules
import { 
    ALL_CHARACTERS, 
    CHARACTER_ARTIFACTS, 
    CHARACTER_TIERS, 
    REQUIRED_FILES,
    SPRINGFIELD_DIR,
    DEFAULT_COMPLETION_PROMISE,
    DEFAULT_MAX_ITERATIONS,
    validateRequiredFiles 
} from '../src/constants.js';
import { createLogger, configureLogLevel } from '../src/utils/logger.js';

// Derive family/resident lists from CHARACTER_TIERS
const SIMPSON_FAMILY = CHARACTER_TIERS.simpson_family;
const SPRINGFIELD_RESIDENTS = CHARACTER_TIERS.springfield;
const EXTENDED_FAMILY = CHARACTER_TIERS.extended;
const SPECIALISTS = CHARACTER_TIERS.specialists;

describe('Edge Cases - Character Constants', () => {
    it('ALL_CHARACTERS should include all Simpson family members', () => {
        for (const member of SIMPSON_FAMILY) {
            expect(ALL_CHARACTERS).toContain(member);
        }
    });

    it('ALL_CHARACTERS should include all Springfield residents', () => {
        for (const resident of SPRINGFIELD_RESIDENTS) {
            expect(ALL_CHARACTERS).toContain(resident);
        }
    });

    it('CHARACTER_ARTIFACTS should have entry for each main character', () => {
        const mainCharacters = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
        for (const char of mainCharacters) {
            expect(CHARACTER_ARTIFACTS[char]).toBeDefined();
        }
    });

    it('CHARACTER_ARTIFACTS values should be non-empty strings', () => {
        for (const [char, artifact] of Object.entries(CHARACTER_ARTIFACTS)) {
            expect(typeof artifact).toBe('string');
            expect(artifact.length).toBeGreaterThan(0);
        }
    });

    it('no duplicate characters in ALL_CHARACTERS', () => {
        const unique = new Set(ALL_CHARACTERS);
        expect(unique.size).toBe(ALL_CHARACTERS.length);
    });
});

describe('Edge Cases - Character Tiers', () => {
    it('simpson_family should have exactly 5 members', () => {
        expect(SIMPSON_FAMILY).toHaveLength(5);
    });

    it('extended family should have 4 members', () => {
        expect(EXTENDED_FAMILY).toHaveLength(4);
    });

    it('springfield residents should have 12 members', () => {
        expect(SPRINGFIELD_RESIDENTS).toHaveLength(12);
    });

    it('specialists should have 20 members', () => {
        expect(SPECIALISTS).toHaveLength(20);
    });

    it('all tiers combined should equal ALL_CHARACTERS', () => {
        const combined = [
            ...SIMPSON_FAMILY,
            ...EXTENDED_FAMILY,
            ...SPRINGFIELD_RESIDENTS,
            ...SPECIALISTS
        ];
        expect(combined).toHaveLength(ALL_CHARACTERS.length);
    });

    it('homer should be in simpson_family tier', () => {
        expect(SIMPSON_FAMILY).toContain('homer');
    });

    it('burns should be in extended tier', () => {
        expect(EXTENDED_FAMILY).toContain('burns');
    });

    it('ralph should be in springfield tier', () => {
        expect(SPRINGFIELD_RESIDENTS).toContain('ralph');
    });

    it('dr-nick should be in specialists tier', () => {
        expect(SPECIALISTS).toContain('dr-nick');
    });
});

describe('Edge Cases - Required Files', () => {
    it('REQUIRED_FILES should have 4 entries', () => {
        expect(REQUIRED_FILES).toHaveLength(4);
    });

    it('should include project.md', () => {
        expect(REQUIRED_FILES).toContain('project.md');
    });

    it('should include task.md', () => {
        expect(REQUIRED_FILES).toContain('task.md');
    });

    it('should include completion.md', () => {
        expect(REQUIRED_FILES).toContain('completion.md');
    });

    it('should include iterations.md', () => {
        expect(REQUIRED_FILES).toContain('iterations.md');
    });

    it('all required files should end with .md', () => {
        for (const file of REQUIRED_FILES) {
            expect(file).toMatch(/\.md$/);
        }
    });
});

describe('Edge Cases - Constants Values', () => {
    it('SPRINGFIELD_DIR should be .springfield', () => {
        expect(SPRINGFIELD_DIR).toBe('.springfield');
    });

    it('DEFAULT_COMPLETION_PROMISE should be DONE', () => {
        expect(DEFAULT_COMPLETION_PROMISE).toBe('DONE');
    });

    it('DEFAULT_MAX_ITERATIONS should be 20', () => {
        expect(DEFAULT_MAX_ITERATIONS).toBe(20);
    });

    it('SPRINGFIELD_DIR should start with dot', () => {
        expect(SPRINGFIELD_DIR.startsWith('.')).toBe(true);
    });
});

describe('Edge Cases - Logger', () => {
    it('should create logger with namespace', () => {
        const logger = createLogger('test-namespace');
        expect(logger).toBeDefined();
    });

    it('logger should have info method', () => {
        const logger = createLogger('test');
        expect(typeof logger.info).toBe('function');
    });

    it('logger should have warn method', () => {
        const logger = createLogger('test');
        expect(typeof logger.warn).toBe('function');
    });

    it('logger should have error method', () => {
        const logger = createLogger('test');
        expect(typeof logger.error).toBe('function');
    });

    it('logger should have debug method', () => {
        const logger = createLogger('test');
        expect(typeof logger.debug).toBe('function');
    });

    it('multiple loggers should be independent', () => {
        const logger1 = createLogger('test1');
        const logger2 = createLogger('test2');
        expect(logger1).not.toBe(logger2);
    });

    it('logger methods should not throw', () => {
        const logger = createLogger('test');
        expect(() => logger.info('test message')).not.toThrow();
        expect(() => logger.warn('test warning')).not.toThrow();
        expect(() => logger.error('test error')).not.toThrow();
    });
});

describe('Edge Cases - validateRequiredFiles', () => {
    let testDir: string;

    beforeEach(() => {
        testDir = path.join(os.tmpdir(), `springfield-test-${Date.now()}`);
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should return invalid for non-existent directory', () => {
        const result = validateRequiredFiles('/non/existent/path');
        expect(result.isValid).toBe(false);
    });

    it('should report all files missing for non-existent directory', () => {
        const result = validateRequiredFiles('/non/existent/path');
        expect(result.missing).toHaveLength(REQUIRED_FILES.length);
    });

    it('should have error message for non-existent directory', () => {
        const result = validateRequiredFiles('/non/existent/path');
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid for empty directory', () => {
        fs.mkdirSync(testDir, { recursive: true });
        const result = validateRequiredFiles(testDir);
        expect(result.isValid).toBe(false);
    });

    it('should report all missing files for empty directory', () => {
        fs.mkdirSync(testDir, { recursive: true });
        const result = validateRequiredFiles(testDir);
        expect(result.missing).toHaveLength(REQUIRED_FILES.length);
    });

    it('should detect incomplete files with template placeholders', () => {
        fs.mkdirSync(testDir, { recursive: true });
        for (const file of REQUIRED_FILES) {
            fs.writeFileSync(
                path.join(testDir, file),
                '[One paragraph describing the project]'
            );
        }
        const result = validateRequiredFiles(testDir);
        expect(result.incomplete.length).toBeGreaterThan(0);
    });

    it('should detect files that are too short', () => {
        fs.mkdirSync(testDir, { recursive: true });
        for (const file of REQUIRED_FILES) {
            fs.writeFileSync(path.join(testDir, file), 'x');
        }
        const result = validateRequiredFiles(testDir);
        expect(result.incomplete.length).toBeGreaterThan(0);
    });

    it('should accept valid complete files', () => {
        fs.mkdirSync(testDir, { recursive: true });
        // Content must be >= 200 chars (config.minContentLength default)
        const validContent = 'This is a valid project description that is long enough to pass validation checks and contains no template placeholders. '.repeat(3);
        for (const file of REQUIRED_FILES) {
            fs.writeFileSync(path.join(testDir, file), validContent);
        }
        const result = validateRequiredFiles(testDir);
        expect(result.present.length).toBe(REQUIRED_FILES.length);
        expect(result.isValid).toBe(true);
    });

    it('should handle partial files (some missing)', () => {
        fs.mkdirSync(testDir, { recursive: true });
        // Content must be >= 200 chars (config.minContentLength default)
        const validContent = 'This is valid content that passes all validation checks easily and provides sufficient information for the project. '.repeat(3);
        fs.writeFileSync(path.join(testDir, 'project.md'), validContent);
        fs.writeFileSync(path.join(testDir, 'task.md'), validContent);
        // Missing: completion.md, iterations.md
        const result = validateRequiredFiles(testDir);
        expect(result.present.length).toBe(2);
        expect(result.missing.length).toBe(2);
        expect(result.isValid).toBe(false);
    });
});

describe('Edge Cases - Character Artifact Mapping', () => {
    it('homer artifact should be questions.md', () => {
        expect(CHARACTER_ARTIFACTS.homer).toBe('questions.md');
    });

    it('marge artifact should be structure.md', () => {
        expect(CHARACTER_ARTIFACTS.marge).toBe('structure.md');
    });

    it('bart artifact should be edge-cases.md', () => {
        expect(CHARACTER_ARTIFACTS.bart).toBe('edge-cases.md');
    });

    it('lisa artifact should be project.md', () => {
        expect(CHARACTER_ARTIFACTS.lisa).toBe('project.md');
    });

    it('all artifacts should end with .md', () => {
        for (const artifact of Object.values(CHARACTER_ARTIFACTS)) {
            expect(artifact).toMatch(/\.md$/);
        }
    });

    it('all artifacts should contain character name or be descriptive', () => {
        for (const [char, artifact] of Object.entries(CHARACTER_ARTIFACTS)) {
            // Artifact should contain character name OR be a descriptive name
            expect(artifact.length).toBeGreaterThan(5);
        }
    });

    it('no duplicate artifact names', () => {
        const artifacts = Object.values(CHARACTER_ARTIFACTS);
        const unique = new Set(artifacts);
        expect(unique.size).toBe(artifacts.length);
    });
});

describe('Edge Cases - Tier Consistency', () => {
    it('all tier members should be in ALL_CHARACTERS', () => {
        for (const tier of Object.values(CHARACTER_TIERS)) {
            for (const member of tier) {
                expect(ALL_CHARACTERS).toContain(member);
            }
        }
    });

    it('all ALL_CHARACTERS should be in exactly one tier', () => {
        for (const char of ALL_CHARACTERS) {
            let foundInTiers = 0;
            for (const tier of Object.values(CHARACTER_TIERS)) {
                if (tier.includes(char as typeof tier[number])) {
                    foundInTiers++;
                }
            }
            expect(foundInTiers).toBe(1);
        }
    });

    it('tier names should match expected structure', () => {
        expect(CHARACTER_TIERS).toHaveProperty('simpson_family');
        expect(CHARACTER_TIERS).toHaveProperty('extended');
        expect(CHARACTER_TIERS).toHaveProperty('springfield');
        expect(CHARACTER_TIERS).toHaveProperty('specialists');
    });
});
