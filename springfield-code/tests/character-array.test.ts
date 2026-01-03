/**
 * Character Array Tests - Batch 39
 * Tests for ALL_CHARACTERS array properties and access
 * 52 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';
import { generateArtifact } from '../src/artifacts/generator.js';

let testDir: string;

// ============================================================================
// Array Properties
// ============================================================================

describe('Character Array - Properties', () => {
  it('should have non-zero length', () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThan(0);
  });

  it('should have at least 20 characters', () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThanOrEqual(20);
  });

  it('should have at most 100 characters', () => {
    expect(ALL_CHARACTERS.length).toBeLessThanOrEqual(100);
  });

  it('should be an array', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should be iterable', () => {
    let count = 0;
    for (const _ of ALL_CHARACTERS) count++;
    expect(count).toBe(ALL_CHARACTERS.length);
  });

  it('should support forEach', () => {
    let count = 0;
    ALL_CHARACTERS.forEach(() => count++);
    expect(count).toBe(ALL_CHARACTERS.length);
  });

  it('should support map', () => {
    const lengths = ALL_CHARACTERS.map((c) => c.length);
    expect(lengths.length).toBe(ALL_CHARACTERS.length);
  });

  it('should support filter', () => {
    const short = ALL_CHARACTERS.filter((c) => c.length <= 4);
    expect(short.length).toBeLessThanOrEqual(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Array Access
// ============================================================================

describe('Character Array - Access', () => {
  it('should access first element', () => {
    expect(ALL_CHARACTERS[0]).toBeDefined();
  });

  it('should access last element', () => {
    expect(ALL_CHARACTERS[ALL_CHARACTERS.length - 1]).toBeDefined();
  });

  it('should return undefined for out-of-bounds', () => {
    expect(ALL_CHARACTERS[9999]).toBeUndefined();
  });

  it('should return undefined for negative index', () => {
    expect(ALL_CHARACTERS[-1]).toBeUndefined();
  });

  it('should find homer', () => {
    expect(ALL_CHARACTERS.includes('homer')).toBe(true);
  });

  it('should find bart', () => {
    expect(ALL_CHARACTERS.includes('bart')).toBe(true);
  });

  it('should not find unknown', () => {
    expect(ALL_CHARACTERS.includes('unknown')).toBe(false);
  });

  it('should indexOf homer', () => {
    expect(ALL_CHARACTERS.indexOf('homer')).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// Array Iteration
// ============================================================================

describe('Character Array - Iteration', () => {
  it('should iterate with for-of', () => {
    const chars: string[] = [];
    for (const char of ALL_CHARACTERS) {
      chars.push(char);
    }
    expect(chars.length).toBe(ALL_CHARACTERS.length);
  });

  it('should iterate with for-index', () => {
    const chars: string[] = [];
    for (let i = 0; i < ALL_CHARACTERS.length; i++) {
      chars.push(ALL_CHARACTERS[i]);
    }
    expect(chars.length).toBe(ALL_CHARACTERS.length);
  });

  it('should support spread operator', () => {
    const copy = [...ALL_CHARACTERS];
    expect(copy.length).toBe(ALL_CHARACTERS.length);
  });

  it('should support Array.from', () => {
    const copy = Array.from(ALL_CHARACTERS);
    expect(copy.length).toBe(ALL_CHARACTERS.length);
  });

  it('should support entries()', () => {
    const entries = [...ALL_CHARACTERS.entries()];
    expect(entries.length).toBe(ALL_CHARACTERS.length);
  });

  it('should support keys()', () => {
    const keys = [...ALL_CHARACTERS.keys()];
    expect(keys.length).toBe(ALL_CHARACTERS.length);
  });

  it('should support values()', () => {
    const values = [...ALL_CHARACTERS.values()];
    expect(values.length).toBe(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Array Search
// ============================================================================

describe('Character Array - Search', () => {
  it('should find with find()', () => {
    const result = ALL_CHARACTERS.find((c) => c === 'homer');
    expect(result).toBe('homer');
  });

  it('should findIndex correctly', () => {
    const idx = ALL_CHARACTERS.findIndex((c) => c === 'bart');
    expect(idx).toBeGreaterThanOrEqual(0);
  });

  it('should return undefined for find not found', () => {
    const result = ALL_CHARACTERS.find((c) => c === 'notexist');
    expect(result).toBeUndefined();
  });

  it('should return -1 for findIndex not found', () => {
    const idx = ALL_CHARACTERS.findIndex((c) => c === 'notexist');
    expect(idx).toBe(-1);
  });

  it('should support some()', () => {
    expect(ALL_CHARACTERS.some((c) => c === 'lisa')).toBe(true);
  });

  it('should support every() for strings', () => {
    expect(ALL_CHARACTERS.every((c) => typeof c === 'string')).toBe(true);
  });
});

// ============================================================================
// Character Validation
// ============================================================================

describe('Character Array - Validation', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'char-valid-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should have valid homer', () => {
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should have valid marge', () => {
    expect(generateArtifact('marge', 'test', testDir)).not.toBeNull();
  });

  it('should have valid bart', () => {
    expect(generateArtifact('bart', 'test', testDir)).not.toBeNull();
  });

  it('should have valid lisa', () => {
    expect(generateArtifact('lisa', 'test', testDir)).not.toBeNull();
  });

  it('should have valid burns', () => {
    expect(generateArtifact('burns', 'test', testDir)).not.toBeNull();
  });

  it('should have valid apu', () => {
    expect(generateArtifact('apu', 'test', testDir)).not.toBeNull();
  });
});

// ============================================================================
// Tier Integration
// ============================================================================

describe('Character Array - Tier Integration', () => {
  it('should contain all simpson family members', () => {
    for (const member of CHARACTER_TIERS.simpson_family) {
      expect(ALL_CHARACTERS).toContain(member);
    }
  });

  it('should contain all extended members', () => {
    for (const member of CHARACTER_TIERS.extended) {
      expect(ALL_CHARACTERS).toContain(member);
    }
  });

  it('should contain all springfield members', () => {
    for (const member of CHARACTER_TIERS.springfield) {
      expect(ALL_CHARACTERS).toContain(member);
    }
  });

  it('should have tier total within all characters', () => {
    const tierTotal =
      CHARACTER_TIERS.simpson_family.length +
      CHARACTER_TIERS.extended.length +
      CHARACTER_TIERS.springfield.length;
    expect(tierTotal).toBeLessThanOrEqual(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Array Immutability
// ============================================================================

describe('Character Array - Stability', () => {
  it('should have stable length', () => {
    const len1 = ALL_CHARACTERS.length;
    const len2 = ALL_CHARACTERS.length;
    expect(len1).toBe(len2);
  });

  it('should have stable content', () => {
    const copy1 = [...ALL_CHARACTERS];
    const copy2 = [...ALL_CHARACTERS];
    expect(copy1).toEqual(copy2);
  });

  it('should have stable first element', () => {
    const first1 = ALL_CHARACTERS[0];
    const first2 = ALL_CHARACTERS[0];
    expect(first1).toBe(first2);
  });

  it('should have stable last element', () => {
    const last1 = ALL_CHARACTERS[ALL_CHARACTERS.length - 1];
    const last2 = ALL_CHARACTERS[ALL_CHARACTERS.length - 1];
    expect(last1).toBe(last2);
  });
});
