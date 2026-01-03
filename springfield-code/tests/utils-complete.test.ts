/**
 * Utils & Validation Complete Coverage - Batch 12
 * Closes remaining branch gaps across utils (90-96%)
 * 50 tests targeting validation, stats, and config
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { validateRequiredFiles, REQUIRED_FILES, CHARACTER_TIERS, ALL_CHARACTERS, CHARACTER_ARTIFACTS } from '../src/constants.js';
import { verifyPrerequisites } from '../src/utils/prerequisites.js';
import { getConfig, getCachedConfig, clearConfigCache, validateConfig, DEFAULT_CONFIG } from '../src/config.js';

describe('Utils Complete - Placeholder Pattern Detection', () => {
  const testDir = path.join(os.tmpdir(), 'utils-placeholder-test-' + Date.now() + Math.random());
  const springfieldDir = path.join(testDir, '.springfield');

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
    clearConfigCache();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    clearConfigCache();
  });

  it('should detect "[One paragraph" placeholder', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[One paragraph description] '.repeat(20));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('should detect "[What" placeholder', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[What to describe here] '.repeat(20));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('should detect "[Describe" placeholder', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[Describe your feature] '.repeat(20));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('should accept content without placeholders', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Complete project description. '.repeat(20));
    fs.writeFileSync(path.join(springfieldDir, 'task.md'), 'Complete task description. '.repeat(20));
    fs.writeFileSync(path.join(springfieldDir, 'completion.md'), 'Complete completion criteria. '.repeat(20));
    fs.writeFileSync(path.join(springfieldDir, 'iterations.md'), 'Complete iteration config. '.repeat(20));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.isValid).toBe(true);
    expect(result.incomplete.length).toBe(0);
  });

  it('generic bracket does not trigger placeholder check for present files', () => {
    // validateRequiredFiles checks for specific placeholders, not generic brackets
    // Test just that file with generic bracket is marked present, not incomplete
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Array notation is item[0] and item[1]. '.repeat(20));
    const result = validateRequiredFiles(springfieldDir);
    // project.md with generic brackets should be present (not incomplete)
    // But overall isValid is false due to missing other files
    expect(result.present).toContain('project.md');
    expect(result.incomplete).not.toContain('project.md');
  });

  it('should detect placeholder at start of file', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[One paragraph] at start plus more content. '.repeat(15));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete.length).toBeGreaterThan(0);
  });

  it('should detect placeholder in middle of file', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Start content. '.repeat(10) + '[Describe this] ' + 'End content. '.repeat(10));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete.length).toBeGreaterThan(0);
  });

  it('should detect placeholder at end of file', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Start content. '.repeat(15) + '[What to add]');
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete.length).toBeGreaterThan(0);
  });

  it('should detect multiple placeholders', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[One paragraph] [What here] [Describe] '.repeat(10));
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('should handle empty directory', () => {
    const result = validateRequiredFiles(springfieldDir);
    expect(result.isValid).toBe(false);
    expect(result.missing.length).toBe(4);
  });
});

describe('Utils Complete - Content Length Boundaries', () => {
  const testDir = path.join(os.tmpdir(), 'utils-length-test-' + Date.now() + Math.random());
  const springfieldDir = path.join(testDir, '.springfield');

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
    clearConfigCache();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    clearConfigCache();
  });

  it('content at exactly minContentLength should pass', () => {
    const exactLength = 'x'.repeat(200);
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), exactLength);
    const result = validateRequiredFiles(springfieldDir, 200);
    expect(result.incomplete.includes('project.md')).toBe(false);
    expect(result.present.includes('project.md')).toBe(true);
  });

  it('content at minContentLength - 1 should fail', () => {
    const shortContent = 'x'.repeat(199);
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), shortContent);
    const result = validateRequiredFiles(springfieldDir, 200);
    expect(result.incomplete).toContain('project.md');
  });

  it('content at minContentLength + 1 should pass', () => {
    const longContent = 'x'.repeat(201);
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), longContent);
    const result = validateRequiredFiles(springfieldDir, 200);
    expect(result.present).toContain('project.md');
  });

  it('zero length content should fail', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '');
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('whitespace-only content should fail', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '   \n\n\t\t   ');
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('content with only newlines should fail', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '\n\n\n\n\n');
    const result = validateRequiredFiles(springfieldDir);
    expect(result.incomplete).toContain('project.md');
  });

  it('custom minContentLength=50 should work', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'x'.repeat(50));
    const result = validateRequiredFiles(springfieldDir, 50);
    expect(result.present).toContain('project.md');
  });

  it('custom minContentLength=10 should accept short content', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'x'.repeat(15));
    const result = validateRequiredFiles(springfieldDir, 10);
    expect(result.present).toContain('project.md');
  });
});

describe('Utils Complete - Character Tier Lookup', () => {
  it('should find character in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
    expect(CHARACTER_TIERS.simpson_family).toContain('marge');
    expect(CHARACTER_TIERS.simpson_family).toContain('bart');
    expect(CHARACTER_TIERS.simpson_family).toContain('lisa');
    expect(CHARACTER_TIERS.simpson_family).toContain('maggie');
  });

  it('should find character in extended tier', () => {
    expect(CHARACTER_TIERS.extended).toContain('grampa');
    expect(CHARACTER_TIERS.extended).toContain('burns');
    expect(CHARACTER_TIERS.extended).toContain('smithers');
    expect(CHARACTER_TIERS.extended).toContain('flanders');
  });

  it('should find character in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('moe');
    expect(CHARACTER_TIERS.springfield).toContain('ralph');
    expect(CHARACTER_TIERS.springfield).toContain('nelson');
    expect(CHARACTER_TIERS.springfield).toContain('milhouse');
  });

  it('should find character in specialists tier', () => {
    expect(CHARACTER_TIERS.specialists).toContain('dr-nick');
    expect(CHARACTER_TIERS.specialists).toContain('patty');
    expect(CHARACTER_TIERS.specialists).toContain('agnes');
    expect(CHARACTER_TIERS.specialists).toContain('fat-tony');
  });

  it('ALL_CHARACTERS should contain all tiers', () => {
    expect(ALL_CHARACTERS).toContain('homer');
    expect(ALL_CHARACTERS).toContain('burns');
    expect(ALL_CHARACTERS).toContain('moe');
    expect(ALL_CHARACTERS).toContain('agnes');
  });

  it('should handle hyphenated character names', () => {
    expect(ALL_CHARACTERS).toContain('dr-nick');
    expect(ALL_CHARACTERS).toContain('fat-tony');
    expect(ALL_CHARACTERS).toContain('sea-captain');
  });

  it('CHARACTER_ARTIFACTS should have artifacts for most characters', () => {
    expect(CHARACTER_ARTIFACTS['homer']).toBe('questions.md');
    expect(CHARACTER_ARTIFACTS['lisa']).toBe('project.md');
    expect(CHARACTER_ARTIFACTS['dr-nick']).toBe('dr-nick-health.md');
  });

  it('ralph should be in tiers but not have artifact', () => {
    expect(CHARACTER_TIERS.springfield).toContain('ralph');
    expect(CHARACTER_ARTIFACTS['ralph']).toBeUndefined();
  });
});

describe('Utils Complete - Config Validation', () => {
  it('should validate tokenTtlMs minimum', () => {
    const errors = validateConfig({ tokenTtlMs: 500 });
    expect(errors).toContain('tokenTtlMs must be at least 1000ms (1 second)');
  });

  it('should accept valid tokenTtlMs', () => {
    const errors = validateConfig({ tokenTtlMs: 30000 });
    expect(errors.length).toBe(0);
  });

  it('should validate tokenMaxUses minimum', () => {
    const errors = validateConfig({ tokenMaxUses: 0 });
    expect(errors).toContain('tokenMaxUses must be at least 1');
  });

  it('should validate maxTokensPerMinute minimum', () => {
    const errors = validateConfig({ maxTokensPerMinute: 0 });
    expect(errors).toContain('maxTokensPerMinute must be at least 1');
  });

  it('should validate rateLimitWindowMs minimum', () => {
    const errors = validateConfig({ rateLimitWindowMs: 500 });
    expect(errors).toContain('rateLimitWindowMs must be at least 1000ms (1 second)');
  });

  it('should validate minContentLength non-negative', () => {
    const errors = validateConfig({ minContentLength: -1 });
    expect(errors).toContain('minContentLength cannot be negative');
  });

  it('should validate defaultMaxIterations minimum', () => {
    const errors = validateConfig({ defaultMaxIterations: 0 });
    expect(errors).toContain('defaultMaxIterations must be at least 1');
  });

  it('should accept valid complete config', () => {
    const errors = validateConfig({
      tokenTtlMs: 30000,
      tokenMaxUses: 1,
      maxTokensPerMinute: 10,
      rateLimitWindowMs: 60000,
      minContentLength: 200,
      defaultMaxIterations: 20,
    });
    expect(errors.length).toBe(0);
  });
});

describe('Utils Complete - Prerequisites Edge Cases', () => {
  const testDir = path.join(os.tmpdir(), 'utils-prereq-test-' + Date.now() + Math.random());
  const springfieldDir = path.join(testDir, '.springfield');

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
    clearConfigCache();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    clearConfigCache();
  });

  it('should detect all 4 required files', () => {
    const result = verifyPrerequisites(springfieldDir);
    expect(result.missing.length).toBe(4);
  });

  it('should report correct missing file list', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Complete. '.repeat(30));
    const result = verifyPrerequisites(springfieldDir);
    expect(result.missing).not.toContain('project.md');
    expect(result.missing.length).toBe(3);
  });

  it('should validate file content length', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Short');
    const result = verifyPrerequisites(springfieldDir);
    expect(result.missing.some(m => m.includes('incomplete'))).toBe(true);
  });

  it('should check for template placeholders', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), '[One paragraph description] '.repeat(20));
    const result = verifyPrerequisites(springfieldDir);
    expect(result.missing.some(m => m.includes('template'))).toBe(true);
  });

  it('should handle non-existent directory', () => {
    const result = verifyPrerequisites('/nonexistent/path/springfield');
    expect(result.ready).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should report context files', () => {
    fs.writeFileSync(path.join(springfieldDir, 'project.md'), 'Complete. '.repeat(30));
    fs.writeFileSync(path.join(springfieldDir, 'task.md'), 'Complete. '.repeat(30));
    fs.writeFileSync(path.join(springfieldDir, 'completion.md'), 'Complete. '.repeat(30));
    fs.writeFileSync(path.join(springfieldDir, 'iterations.md'), 'Complete. '.repeat(30));
    fs.writeFileSync(path.join(springfieldDir, 'extra.md'), 'Extra context');
    const result = verifyPrerequisites(springfieldDir);
    expect(result.context).toContain('extra.md');
  });
});

describe('Utils Complete - Default Config Values', () => {
  beforeEach(() => {
    clearConfigCache();
  });

  afterEach(() => {
    clearConfigCache();
  });

  it('DEFAULT_CONFIG should have correct tokenTtlMs', () => {
    expect(DEFAULT_CONFIG.tokenTtlMs).toBe(30000);
  });

  it('DEFAULT_CONFIG should have correct tokenMaxUses', () => {
    expect(DEFAULT_CONFIG.tokenMaxUses).toBe(1);
  });

  it('DEFAULT_CONFIG should have correct maxTokensPerMinute', () => {
    expect(DEFAULT_CONFIG.maxTokensPerMinute).toBe(10);
  });

  it('DEFAULT_CONFIG should have correct rateLimitWindowMs', () => {
    expect(DEFAULT_CONFIG.rateLimitWindowMs).toBe(60000);
  });

  it('DEFAULT_CONFIG should have correct minContentLength', () => {
    expect(DEFAULT_CONFIG.minContentLength).toBe(200);
  });

  it('DEFAULT_CONFIG should have correct defaultMaxIterations', () => {
    expect(DEFAULT_CONFIG.defaultMaxIterations).toBe(20);
  });

  it('DEFAULT_CONFIG should have correct defaultCompletionPromise', () => {
    expect(DEFAULT_CONFIG.defaultCompletionPromise).toBe('DONE');
  });

  it('DEFAULT_CONFIG should have correct logLevel', () => {
    expect(DEFAULT_CONFIG.logLevel).toBe('warn');
  });
});

describe('Utils Complete - Config Cache', () => {
  beforeEach(() => {
    clearConfigCache();
  });

  afterEach(() => {
    clearConfigCache();
  });

  it('getCachedConfig should return same instance', () => {
    const config1 = getCachedConfig();
    const config2 = getCachedConfig();
    expect(config1).toBe(config2);
  });

  it('clearConfigCache should reset cache', () => {
    const config1 = getCachedConfig();
    clearConfigCache();
    const config2 = getCachedConfig();
    // After clear, new object should be created
    expect(config1).not.toBe(config2);
  });

  it('getConfig should return new instance each time', () => {
    const config1 = getConfig();
    const config2 = getConfig();
    expect(config1).not.toBe(config2);
  });

  it('getConfig should merge defaults', () => {
    const config = getConfig();
    expect(config.tokenTtlMs).toBe(30000);
    expect(config.minContentLength).toBe(200);
  });
});
