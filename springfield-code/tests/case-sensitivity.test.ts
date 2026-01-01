/**
 * Character Case Sensitivity Tests - Batch 47
 * Tests for character name case handling
 * 48 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';

let testDir: string;

// ============================================================================
// Lowercase Names
// ============================================================================

describe('Case Sensitivity - Lowercase Names', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'case-low-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should work with lowercase homer', () => {
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should work with lowercase bart', () => {
    expect(generateArtifact('bart', 'test', testDir)).not.toBeNull();
  });

  it('should work with lowercase lisa', () => {
    expect(generateArtifact('lisa', 'test', testDir)).not.toBeNull();
  });

  it('should work with lowercase marge', () => {
    expect(generateArtifact('marge', 'test', testDir)).not.toBeNull();
  });

  it('should work with lowercase burns', () => {
    expect(generateArtifact('burns', 'test', testDir)).not.toBeNull();
  });

  it('should work with lowercase apu', () => {
    expect(generateArtifact('apu', 'test', testDir)).not.toBeNull();
  });
});

// ============================================================================
// Uppercase Names
// ============================================================================

describe('Case Sensitivity - Uppercase Names', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'case-up-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject uppercase HOMER', () => {
    expect(generateArtifact('HOMER', 'test', testDir)).toBeNull();
  });

  it('should reject uppercase BART', () => {
    expect(generateArtifact('BART', 'test', testDir)).toBeNull();
  });

  it('should reject uppercase LISA', () => {
    expect(generateArtifact('LISA', 'test', testDir)).toBeNull();
  });

  it('should reject uppercase MARGE', () => {
    expect(generateArtifact('MARGE', 'test', testDir)).toBeNull();
  });

  it('should reject uppercase BURNS', () => {
    expect(generateArtifact('BURNS', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// Mixed Case Names
// ============================================================================

describe('Case Sensitivity - Mixed Case', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'case-mix-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject Homer (title case)', () => {
    expect(generateArtifact('Homer', 'test', testDir)).toBeNull();
  });

  it('should reject HoMeR (alternating)', () => {
    expect(generateArtifact('HoMeR', 'test', testDir)).toBeNull();
  });

  it('should reject homeR (trailing upper)', () => {
    expect(generateArtifact('homeR', 'test', testDir)).toBeNull();
  });

  it('should reject HOMER (all upper)', () => {
    expect(generateArtifact('HOMER', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// ALL_CHARACTERS Case
// ============================================================================

describe('Case Sensitivity - ALL_CHARACTERS', () => {
  it('should have all lowercase names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should not have uppercase letters', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).not.toMatch(/[A-Z]/);
    }
  });

  it('should contain homer in lowercase', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should not contain Homer in title case', () => {
    expect(ALL_CHARACTERS).not.toContain('Homer');
  });

  it('should not contain HOMER in uppercase', () => {
    expect(ALL_CHARACTERS).not.toContain('HOMER');
  });
});

// ============================================================================
// CHARACTER_TIERS Case
// ============================================================================

describe('Case Sensitivity - CHARACTER_TIERS', () => {
  it('should have lowercase simpson family names', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have lowercase extended names', () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have lowercase springfield names', () => {
    for (const char of CHARACTER_TIERS.springfield) {
      expect(char).toBe(char.toLowerCase());
    }
  });
});

// ============================================================================
// Artifact Existence Case
// ============================================================================

describe('Case Sensitivity - Artifact Existence', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'case-exists-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should find homer with lowercase', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should not find Homer with title case', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('Homer', testDir)).toBe(false);
  });

  it('should not find HOMER with uppercase', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('HOMER', testDir)).toBe(false);
  });
});

// ============================================================================
// String Normalization
// ============================================================================

describe('Case Sensitivity - Normalization', () => {
  it('should treat homer as is (no normalization)', () => {
    expect(ALL_CHARACTERS.find((c) => c === 'homer')).toBe('homer');
  });

  it('should not find with different case', () => {
    expect(ALL_CHARACTERS.find((c) => c === 'Homer')).toBeUndefined();
  });

  it('should not find with upper case', () => {
    expect(ALL_CHARACTERS.find((c) => c === 'HOMER')).toBeUndefined();
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Case Sensitivity - Edge Cases', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'case-edge-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle single letter case difference', () => {
    expect(generateArtifact('Homer', 'test', testDir)).toBeNull();
  });

  it('should handle last letter case difference', () => {
    expect(generateArtifact('homeR', 'test', testDir)).toBeNull();
  });

  it('should handle middle letter case difference', () => {
    expect(generateArtifact('hoMer', 'test', testDir)).toBeNull();
  });
});
