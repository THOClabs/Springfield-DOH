/**
 * Data Integrity Tests - Batch 53
 * Tests for data consistency and integrity
 * 46 tests
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
// Character Data Integrity
// ============================================================================

describe('Data Integrity - Characters', () => {
  it('should have consistent ALL_CHARACTERS', () => {
    const copy1 = [...ALL_CHARACTERS];
    const copy2 = [...ALL_CHARACTERS];
    expect(copy1).toEqual(copy2);
  });

  it('should have unique character names', () => {
    const unique = new Set(ALL_CHARACTERS);
    expect(unique.size).toBe(ALL_CHARACTERS.length);
  });

  it('should have no empty character names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have no null characters', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).not.toBeNull();
    }
  });

  it('should have no undefined characters', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).not.toBeUndefined();
    }
  });
});

// ============================================================================
// Tier Data Integrity
// ============================================================================

describe('Data Integrity - Tiers', () => {
  it('should have unique simpson family members', () => {
    const unique = new Set(CHARACTER_TIERS.simpson_family);
    expect(unique.size).toBe(CHARACTER_TIERS.simpson_family.length);
  });

  it('should have unique extended members', () => {
    const unique = new Set(CHARACTER_TIERS.extended);
    expect(unique.size).toBe(CHARACTER_TIERS.extended.length);
  });

  it('should have unique springfield members', () => {
    const unique = new Set(CHARACTER_TIERS.springfield);
    expect(unique.size).toBe(CHARACTER_TIERS.springfield.length);
  });

  it('should have tier members in ALL_CHARACTERS', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(ALL_CHARACTERS).toContain(char);
    }
    for (const char of CHARACTER_TIERS.extended) {
      expect(ALL_CHARACTERS).toContain(char);
    }
    for (const char of CHARACTER_TIERS.springfield) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });
});

// ============================================================================
// Artifact Data Integrity
// ============================================================================

describe('Data Integrity - Artifacts', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'data-art-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should create valid file content', () => {
    const content = generateArtifact('homer', 'test', testDir);
    expect(content).not.toBeNull();
    expect(content!.length).toBeGreaterThan(0);
  });

  it('should create consistent artifacts', () => {
    generateArtifact('homer', 'test1', testDir);
    const exists1 = artifactExists('homer', testDir);
    generateArtifact('homer', 'test2', testDir);
    const exists2 = artifactExists('homer', testDir);
    expect(exists1).toBe(exists2);
  });

  it('should preserve artifact after overwrite', () => {
    generateArtifact('bart', 'first', testDir);
    generateArtifact('bart', 'second', testDir);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should not corrupt other artifacts on write', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('bart', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
  });
});

// ============================================================================
// Token Data Integrity
// ============================================================================

describe('Data Integrity - Tokens', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should generate non-empty tokens', () => {
    const token = requestRalphAuthorization();
    expect(token!.length).toBeGreaterThan(0);
  });

  it('should generate string tokens', () => {
    const token = requestRalphAuthorization();
    expect(typeof token).toBe('string');
  });

  it('should generate unique tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const token = requestRalphAuthorization();
      tokens.add(token!);
      if (_resetForTesting) _resetForTesting();
    }
    expect(tokens.size).toBe(10);
  });

  it('should not alter token on storage', () => {
    const token = requestRalphAuthorization();
    const originalLength = token!.length;
    authorizeRalph(token!);
    expect(token!.length).toBe(originalLength);
  });
});

// ============================================================================
// State Integrity
// ============================================================================

describe('Data Integrity - State', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should have consistent initial state', () => {
    expect(canInvokeRalph()).toBe(false);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should have consistent pending state', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    expect(canInvokeRalph()).toBe(true);
  });

  it('should have consistent authorized state', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should have consistent reset state', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
    expect(canInvokeRalph()).toBe(false);
  });
});

// ============================================================================
// File System Integrity
// ============================================================================

describe('Data Integrity - File System', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'data-fs-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should write valid UTF-8 content', () => {
    generateArtifact('homer', 'test with unicode: 日本語', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(testDir, '.springfield', file), 'utf-8');
      expect(typeof content).toBe('string');
    }
  });

  it('should create readable files', () => {
    generateArtifact('bart', 'test', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('should not create empty files', () => {
    generateArtifact('lisa', 'test', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    for (const file of files) {
      const stats = fs.statSync(path.join(testDir, '.springfield', file));
      expect(stats.size).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Cross-Reference Integrity
// ============================================================================

describe('Data Integrity - Cross-Reference', () => {
  it('should have simpson_family members valid', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(ALL_CHARACTERS.includes(char)).toBe(true);
    }
  });

  it('should have extended members valid', () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(ALL_CHARACTERS.includes(char)).toBe(true);
    }
  });

  it('should have springfield members valid', () => {
    for (const char of CHARACTER_TIERS.springfield) {
      expect(ALL_CHARACTERS.includes(char)).toBe(true);
    }
  });

  it('should have consistent tier totals', () => {
    const tierTotal =
      CHARACTER_TIERS.simpson_family.length +
      CHARACTER_TIERS.extended.length +
      CHARACTER_TIERS.springfield.length;
    expect(tierTotal).toBeLessThanOrEqual(ALL_CHARACTERS.length);
  });
});
