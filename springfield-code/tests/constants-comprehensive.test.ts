/**
 * Constants Comprehensive Tests - Batch 24
 * Deep validation of all exported constants and their relationships
 * 45 tests
 */

import { describe, it, expect } from 'vitest';
import {
  ALL_CHARACTERS,
  CHARACTER_ARTIFACTS,
  CHARACTER_TIERS,
  SPRINGFIELD_DIR,
  DEFAULT_MAX_ITERATIONS,
} from '../src/constants.js';

// ============================================================================
// ALL_CHARACTERS Comprehensive
// ============================================================================

describe('Constants - ALL_CHARACTERS', () => {
  it('should be an array', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should have length > 0', () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThan(0);
  });

  it('should have at least 20 characters', () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThanOrEqual(20);
  });

  it('should have unique values', () => {
    const unique = new Set(ALL_CHARACTERS);
    expect(unique.size).toBe(ALL_CHARACTERS.length);
  });

  it('should have all lowercase values', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have all string values', () => {
    for (const char of ALL_CHARACTERS) {
      expect(typeof char).toBe('string');
    }
  });

  it('should have all non-empty values', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.length).toBeGreaterThan(0);
    }
  });

  it('should contain homer', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should contain lisa', () => {
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should contain ralph', () => {
    expect(ALL_CHARACTERS).toContain('ralph');
  });
});

// ============================================================================
// CHARACTER_ARTIFACTS Comprehensive
// ============================================================================

describe('Constants - CHARACTER_ARTIFACTS', () => {
  it('should be an object', () => {
    expect(typeof CHARACTER_ARTIFACTS).toBe('object');
  });

  it('should have homer artifact', () => {
    expect(CHARACTER_ARTIFACTS.homer).toBeDefined();
  });

  it('should have marge artifact', () => {
    expect(CHARACTER_ARTIFACTS.marge).toBeDefined();
  });

  it('should have bart artifact', () => {
    expect(CHARACTER_ARTIFACTS.bart).toBeDefined();
  });

  it('should have lisa artifact', () => {
    expect(CHARACTER_ARTIFACTS.lisa).toBeDefined();
  });

  it('should have all artifacts as strings', () => {
    for (const [key, value] of Object.entries(CHARACTER_ARTIFACTS)) {
      expect(typeof value).toBe('string');
    }
  });

  it('should have all artifacts ending with .md', () => {
    for (const [key, value] of Object.entries(CHARACTER_ARTIFACTS)) {
      expect(value.endsWith('.md')).toBe(true);
    }
  });

  it('should have at least 10 artifacts', () => {
    expect(Object.keys(CHARACTER_ARTIFACTS).length).toBeGreaterThanOrEqual(10);
  });
});

// ============================================================================
// CHARACTER_TIERS Comprehensive
// ============================================================================

describe('Constants - CHARACTER_TIERS', () => {
  it('should be an object', () => {
    expect(typeof CHARACTER_TIERS).toBe('object');
  });

  it('should have exactly 4 tiers', () => {
    expect(Object.keys(CHARACTER_TIERS).length).toBe(4);
  });

  it('should have simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should have extended tier', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should have springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should have specialists tier', () => {
    expect(CHARACTER_TIERS.specialists).toBeDefined();
  });

  it('should have arrays for all tier values', () => {
    for (const [tier, chars] of Object.entries(CHARACTER_TIERS)) {
      expect(Array.isArray(chars)).toBe(true);
    }
  });

  it('should have non-empty arrays for all tiers', () => {
    for (const [tier, chars] of Object.entries(CHARACTER_TIERS)) {
      expect((chars as string[]).length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Tier Arrays
// ============================================================================

describe('Constants - Tier Arrays', () => {
  it('should have simpson_family as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.simpson_family)).toBe(true);
  });

  it('should have extended as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it('should have springfield as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });

  it('should have specialists as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.specialists)).toBe(true);
  });

  it('should have 5 simpson_family members', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBe(5);
  });

  it('should have 4 extended members', () => {
    expect(CHARACTER_TIERS.extended.length).toBe(4);
  });

  it('should have springfield members > 0', () => {
    expect(CHARACTER_TIERS.springfield.length).toBeGreaterThan(0);
  });

  it('should have specialists members > 0', () => {
    expect(CHARACTER_TIERS.specialists.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// String Constants
// ============================================================================

describe('Constants - String Values', () => {
  it('should have SPRINGFIELD_DIR as string', () => {
    expect(typeof SPRINGFIELD_DIR).toBe('string');
  });

  it('should have SPRINGFIELD_DIR equal to .springfield', () => {
    expect(SPRINGFIELD_DIR).toBe('.springfield');
  });

  it('should have DEFAULT_MAX_ITERATIONS as number', () => {
    expect(typeof DEFAULT_MAX_ITERATIONS).toBe('number');
  });

  it('should have DEFAULT_MAX_ITERATIONS > 0', () => {
    expect(DEFAULT_MAX_ITERATIONS).toBeGreaterThan(0);
  });
});

// ============================================================================
// Consistency Checks
// ============================================================================

describe('Constants - Consistency', () => {
  it('should have all tier characters in ALL_CHARACTERS', () => {
    for (const [tier, chars] of Object.entries(CHARACTER_TIERS)) {
      for (const char of chars as string[]) {
        expect(ALL_CHARACTERS).toContain(char);
      }
    }
  });

  it('should have all simpson_family in ALL_CHARACTERS', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should have all extended in ALL_CHARACTERS', () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should have all springfield in ALL_CHARACTERS', () => {
    for (const char of CHARACTER_TIERS.springfield) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should have all specialists in ALL_CHARACTERS', () => {
    for (const char of CHARACTER_TIERS.specialists) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });
});
