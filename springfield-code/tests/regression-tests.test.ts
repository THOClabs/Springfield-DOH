/**
 * Regression Tests - Batch 51
 * Tests to prevent regression of known behaviors
 * 48 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';

let testDir: string;

// ============================================================================
// Character List Regression
// ============================================================================

describe('Regression - Character List', () => {
  it('should always include homer', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should always include marge', () => {
    expect(ALL_CHARACTERS).toContain('marge');
  });

  it('should always include bart', () => {
    expect(ALL_CHARACTERS).toContain('bart');
  });

  it('should always include lisa', () => {
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should always include maggie', () => {
    expect(ALL_CHARACTERS).toContain('maggie');
  });

  it('should always have lowercase names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should always have string names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(typeof char).toBe('string');
    }
  });
});

// ============================================================================
// Tier Structure Regression
// ============================================================================

describe('Regression - Tier Structure', () => {
  it('should always have simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should always have extended tier', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should always have springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should always have homer in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
  });

  it('should always have marge in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('marge');
  });

  it('should always have 5 core simpsons', () => {
    const core = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
    for (const member of core) {
      expect(CHARACTER_TIERS.simpson_family).toContain(member);
    }
  });
});

// ============================================================================
// Generate Artifact Regression
// ============================================================================

describe('Regression - Generate Artifact', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-gen-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should always return string for valid character', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should always return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should always create file in .springfield', () => {
    generateArtifact('homer', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    expect(files.length).toBeGreaterThan(0);
  });

  it('should always require .springfield directory', () => {
    const noDir = fs.mkdtempSync(path.join(os.tmpdir(), 'no-spring-'));
    const result = generateArtifact('homer', 'test', noDir);
    expect(result).toBeNull();
    fs.rmSync(noDir, { recursive: true, force: true });
  });
});

// ============================================================================
// Artifact Exists Regression
// ============================================================================

describe('Regression - Artifact Exists', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-exists-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should always return true after generate', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should always return false before generate', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should always return boolean', () => {
    const result = artifactExists('homer', testDir);
    expect(typeof result).toBe('boolean');
  });
});

// ============================================================================
// Ralph Gate Regression
// ============================================================================

describe('Regression - Ralph Gate', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should always start with canInvokeRalph false', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should always return token from requestRalphAuthorization', () => {
    const token = requestRalphAuthorization();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should always set canInvokeRalph true after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should always return true for valid authorize', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should always return false for invalid authorize', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('invalid')).toBe(false);
  });

  it('should always consume token on authorize', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });
});

// ============================================================================
// File System Regression
// ============================================================================

describe('Regression - File System', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-fs-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should always create markdown files', () => {
    generateArtifact('homer', 'test', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    expect(files.some((f) => f.endsWith('.md'))).toBe(true);
  });

  it('should always write non-empty content', () => {
    generateArtifact('bart', 'test', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(testDir, '.springfield', file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Error Handling Regression
// ============================================================================

describe('Regression - Error Handling', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-err-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should always handle empty character gracefully', () => {
    const result = generateArtifact('', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should always handle undefined character gracefully', () => {
    const result = generateArtifact(undefined as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should always handle null character gracefully', () => {
    const result = generateArtifact(null as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should always handle empty token gracefully', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('')).toBe(false);
  });
});
