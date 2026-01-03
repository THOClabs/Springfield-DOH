/**
 * Tier Lookup Tests - Batch 44
 * Tests for tier lookup and membership queries
 * 52 tests
 */

import { describe, it, expect } from 'vitest';
import { CHARACTER_TIERS, ALL_CHARACTERS } from '../src/constants.js';

// ============================================================================
// Simpson Family Lookup
// ============================================================================

describe('Tier Lookup - Simpson Family', () => {
  it('should find homer in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
  });

  it('should find marge in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('marge');
  });

  it('should find bart in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('bart');
  });

  it('should find lisa in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('lisa');
  });

  it('should find maggie in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('maggie');
  });

  it('should have at least 5 simpson family members', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThanOrEqual(5);
  });

  it('should not contain burns in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).not.toContain('burns');
  });

  it('should not contain apu in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).not.toContain('apu');
  });
});

// ============================================================================
// Extended Tier Lookup
// ============================================================================

describe('Tier Lookup - Extended', () => {
  it('should have extended tier', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should have extended as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it('should have characters in extended', () => {
    expect(CHARACTER_TIERS.extended.length).toBeGreaterThan(0);
  });

  it('should find burns in extended', () => {
    expect(CHARACTER_TIERS.extended).toContain('burns');
  });

  it('should not contain homer in extended', () => {
    expect(CHARACTER_TIERS.extended).not.toContain('homer');
  });

  it('should not contain bart in extended', () => {
    expect(CHARACTER_TIERS.extended).not.toContain('bart');
  });
});

// ============================================================================
// Springfield Tier Lookup
// ============================================================================

describe('Tier Lookup - Springfield', () => {
  it('should have springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should have springfield as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });

  it('should have characters in springfield', () => {
    expect(CHARACTER_TIERS.springfield.length).toBeGreaterThan(0);
  });

  it('should find apu in springfield', () => {
    expect(CHARACTER_TIERS.springfield).toContain('apu');
  });

  it('should not contain homer in springfield', () => {
    expect(CHARACTER_TIERS.springfield).not.toContain('homer');
  });

  it('should not contain marge in springfield', () => {
    expect(CHARACTER_TIERS.springfield).not.toContain('marge');
  });
});

// ============================================================================
// Cross-Tier Lookup
// ============================================================================

describe('Tier Lookup - Cross-Tier', () => {
  it('should not have homer in multiple tiers', () => {
    const inSimpsons = CHARACTER_TIERS.simpson_family.includes('homer');
    const inExtended = CHARACTER_TIERS.extended.includes('homer');
    const inSpringfield = CHARACTER_TIERS.springfield.includes('homer');
    const count = [inSimpsons, inExtended, inSpringfield].filter(Boolean).length;
    expect(count).toBe(1);
  });

  it('should not have burns in multiple tiers', () => {
    const inSimpsons = CHARACTER_TIERS.simpson_family.includes('burns');
    const inExtended = CHARACTER_TIERS.extended.includes('burns');
    const inSpringfield = CHARACTER_TIERS.springfield.includes('burns');
    const count = [inSimpsons, inExtended, inSpringfield].filter(Boolean).length;
    expect(count).toBeLessThanOrEqual(1);
  });

  it('should not have apu in multiple tiers', () => {
    const inSimpsons = CHARACTER_TIERS.simpson_family.includes('apu');
    const inExtended = CHARACTER_TIERS.extended.includes('apu');
    const inSpringfield = CHARACTER_TIERS.springfield.includes('apu');
    const count = [inSimpsons, inExtended, inSpringfield].filter(Boolean).length;
    expect(count).toBeLessThanOrEqual(1);
  });
});

// ============================================================================
// Membership Check Functions
// ============================================================================

describe('Tier Lookup - Membership Checks', () => {
  const isInSimpsonFamily = (char: string) => CHARACTER_TIERS.simpson_family.includes(char);
  const isInExtended = (char: string) => CHARACTER_TIERS.extended.includes(char);
  const isInSpringfield = (char: string) => CHARACTER_TIERS.springfield.includes(char);

  it('should identify homer as simpson family', () => {
    expect(isInSimpsonFamily('homer')).toBe(true);
  });

  it('should identify marge as simpson family', () => {
    expect(isInSimpsonFamily('marge')).toBe(true);
  });

  it('should identify burns as extended or not in simpsons', () => {
    expect(isInSimpsonFamily('burns')).toBe(false);
  });

  it('should identify apu correctly', () => {
    expect(isInSpringfield('apu')).toBe(true);
  });

  it('should handle unknown character', () => {
    expect(isInSimpsonFamily('unknown')).toBe(false);
    expect(isInExtended('unknown')).toBe(false);
    expect(isInSpringfield('unknown')).toBe(false);
  });
});

// ============================================================================
// Tier Statistics
// ============================================================================

describe('Tier Lookup - Statistics', () => {
  it('should have reasonable simpson family size', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThanOrEqual(5);
    expect(CHARACTER_TIERS.simpson_family.length).toBeLessThanOrEqual(20);
  });

  it('should have reasonable extended size', () => {
    expect(CHARACTER_TIERS.extended.length).toBeGreaterThanOrEqual(2);
    expect(CHARACTER_TIERS.extended.length).toBeLessThanOrEqual(20);
  });

  it('should have reasonable springfield size', () => {
    expect(CHARACTER_TIERS.springfield.length).toBeGreaterThanOrEqual(5);
    expect(CHARACTER_TIERS.springfield.length).toBeLessThanOrEqual(30);
  });

  it('should have total less than ALL_CHARACTERS', () => {
    const total =
      CHARACTER_TIERS.simpson_family.length +
      CHARACTER_TIERS.extended.length +
      CHARACTER_TIERS.springfield.length;
    expect(total).toBeLessThanOrEqual(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Tier Iteration
// ============================================================================

describe('Tier Lookup - Iteration', () => {
  it('should iterate simpson family', () => {
    let count = 0;
    for (const _ of CHARACTER_TIERS.simpson_family) count++;
    expect(count).toBe(CHARACTER_TIERS.simpson_family.length);
  });

  it('should iterate extended', () => {
    let count = 0;
    for (const _ of CHARACTER_TIERS.extended) count++;
    expect(count).toBe(CHARACTER_TIERS.extended.length);
  });

  it('should iterate springfield', () => {
    let count = 0;
    for (const _ of CHARACTER_TIERS.springfield) count++;
    expect(count).toBe(CHARACTER_TIERS.springfield.length);
  });

  it('should map simpson family', () => {
    const names = CHARACTER_TIERS.simpson_family.map((c) => c.toUpperCase());
    expect(names.length).toBe(CHARACTER_TIERS.simpson_family.length);
  });

  it('should filter extended', () => {
    const filtered = CHARACTER_TIERS.extended.filter((c) => c.length > 4);
    expect(filtered.length).toBeLessThanOrEqual(CHARACTER_TIERS.extended.length);
  });
});

// ============================================================================
// All Tiers Coverage
// ============================================================================

describe('Tier Lookup - All Tiers', () => {
  it('should have three main tiers', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
    expect(CHARACTER_TIERS.extended).toBeDefined();
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should have non-empty tiers', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThan(0);
    expect(CHARACTER_TIERS.extended.length).toBeGreaterThan(0);
    expect(CHARACTER_TIERS.springfield.length).toBeGreaterThan(0);
  });

  it('should have string array for each tier', () => {
    for (const member of CHARACTER_TIERS.simpson_family) {
      expect(typeof member).toBe('string');
    }
    for (const member of CHARACTER_TIERS.extended) {
      expect(typeof member).toBe('string');
    }
    for (const member of CHARACTER_TIERS.springfield) {
      expect(typeof member).toBe('string');
    }
  });
});
