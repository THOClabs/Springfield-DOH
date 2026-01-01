/**
 * Character Name Validation Tests - Batch 33
 * Tests for character name format and constraints
 * 50 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';
import { generateArtifact } from '../src/artifacts/generator.js';

let testDir: string;

// ============================================================================
// Name Format Validation
// ============================================================================

describe('Character Names - Format', () => {
  it('should have all lowercase names in ALL_CHARACTERS', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have names without leading whitespace', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.trimStart());
    }
  });

  it('should have names without trailing whitespace', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.trimEnd());
    }
  });

  it('should have names with valid characters only', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toMatch(/^[a-z-]+$/);
    }
  });

  it('should have non-empty names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.length).toBeGreaterThan(0);
    }
  });

  it('should have names with reasonable length', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.length).toBeLessThan(50);
    }
  });
});

// ============================================================================
// Name Uniqueness
// ============================================================================

describe('Character Names - Uniqueness', () => {
  it('should have no duplicate names in ALL_CHARACTERS', () => {
    const unique = new Set(ALL_CHARACTERS);
    expect(unique.size).toBe(ALL_CHARACTERS.length);
  });

  it('should have no duplicate names in simpson_family', () => {
    const unique = new Set(CHARACTER_TIERS.simpson_family);
    expect(unique.size).toBe(CHARACTER_TIERS.simpson_family.length);
  });

  it('should have no duplicate names in extended', () => {
    const unique = new Set(CHARACTER_TIERS.extended);
    expect(unique.size).toBe(CHARACTER_TIERS.extended.length);
  });

  it('should have no duplicate names in springfield', () => {
    const unique = new Set(CHARACTER_TIERS.springfield);
    expect(unique.size).toBe(CHARACTER_TIERS.springfield.length);
  });

  it('should have no overlap between simpson_family and extended', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(CHARACTER_TIERS.extended).not.toContain(char);
    }
  });

  it('should have no overlap between simpson_family and springfield', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(CHARACTER_TIERS.springfield).not.toContain(char);
    }
  });

  it('should have no overlap between extended and springfield', () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(CHARACTER_TIERS.springfield).not.toContain(char);
    }
  });
});

// ============================================================================
// Specific Name Validation
// ============================================================================

describe('Character Names - Specific Names', () => {
  it('should include homer', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should include marge', () => {
    expect(ALL_CHARACTERS).toContain('marge');
  });

  it('should include bart', () => {
    expect(ALL_CHARACTERS).toContain('bart');
  });

  it('should include lisa', () => {
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should include maggie', () => {
    expect(ALL_CHARACTERS).toContain('maggie');
  });

  it('should include burns', () => {
    expect(ALL_CHARACTERS).toContain('burns');
  });

  it('should include flanders', () => {
    expect(ALL_CHARACTERS).toContain('flanders');
  });

  it('should include apu', () => {
    expect(ALL_CHARACTERS).toContain('apu');
  });

  it('should include moe', () => {
    expect(ALL_CHARACTERS).toContain('moe');
  });

  it('should include krusty', () => {
    expect(ALL_CHARACTERS).toContain('krusty');
  });
});

// ============================================================================
// Name Case Sensitivity
// ============================================================================

describe('Character Names - Case Sensitivity', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'case-test-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should accept lowercase homer', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should reject uppercase HOMER', () => {
    const result = generateArtifact('HOMER', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject mixed case Homer', () => {
    const result = generateArtifact('Homer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject mixed case hOmEr', () => {
    const result = generateArtifact('hOmEr', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should accept lowercase bart', () => {
    const result = generateArtifact('bart', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should reject uppercase BART', () => {
    const result = generateArtifact('BART', 'test', testDir);
    expect(result).toBeNull();
  });
});

// ============================================================================
// Name Edge Cases
// ============================================================================

describe('Character Names - Edge Cases', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-case-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject name with leading underscore', () => {
    const result = generateArtifact('_homer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with trailing underscore', () => {
    const result = generateArtifact('homer_', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with digits', () => {
    const result = generateArtifact('homer1', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with periods', () => {
    const result = generateArtifact('homer.simpson', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with at symbol', () => {
    const result = generateArtifact('homer@home', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with hash symbol', () => {
    const result = generateArtifact('homer#1', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with percent symbol', () => {
    const result = generateArtifact('homer%20', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with asterisk', () => {
    const result = generateArtifact('homer*', 'test', testDir);
    expect(result).toBeNull();
  });
});

// ============================================================================
// Name Substring Tests
// ============================================================================

describe('Character Names - Substrings', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'substring-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject partial name hom', () => {
    const result = generateArtifact('hom', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject partial name omer', () => {
    const result = generateArtifact('omer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject extended name homersimpson', () => {
    const result = generateArtifact('homersimpson', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject name with suffix', () => {
    const result = generateArtifact('homer2', 'test', testDir);
    expect(result).toBeNull();
  });
});
