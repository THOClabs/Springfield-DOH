/**
 * Character Tier Behavior Tests - Batch 31
 * Tests for tier-specific behaviors and properties
 * 52 tests
 */

import { describe, it, expect } from 'vitest';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';

// ============================================================================
// Tier Membership Validation
// ============================================================================

describe('Character Tiers - Membership', () => {
  it('should have homer in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
  });

  it('should have marge in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('marge');
  });

  it('should have bart in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('bart');
  });

  it('should have lisa in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('lisa');
  });

  it('should have maggie in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('maggie');
  });

  it('should have burns in extended tier', () => {
    expect(CHARACTER_TIERS.extended).toContain('burns');
  });

  it('should have flanders in extended tier', () => {
    expect(CHARACTER_TIERS.extended).toContain('flanders');
  });

  it('should have grampa in extended tier', () => {
    expect(CHARACTER_TIERS.extended).toContain('grampa');
  });

  it('should have smithers in extended tier', () => {
    expect(CHARACTER_TIERS.extended).toContain('smithers');
  });
});

// ============================================================================
// Springfield Citizens Membership
// ============================================================================

describe('Character Tiers - Springfield Citizens', () => {
  it('should have apu in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('apu');
  });

  it('should have moe in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('moe');
  });

  it('should have krusty in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('krusty');
  });

  it('should have skinner in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('skinner');
  });

  it('should have wiggum in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('wiggum');
  });

  it('should have nelson in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('nelson');
  });

  it('should have milhouse in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('milhouse');
  });

  it('should have ralph in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('ralph');
  });

  it('should have willie in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toContain('willie');
  });
});

// ============================================================================
// Tier Exclusivity
// ============================================================================

describe('Character Tiers - Exclusivity', () => {
  it('should not have homer in extended tier', () => {
    expect(CHARACTER_TIERS.extended).not.toContain('homer');
  });

  it('should not have homer in springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).not.toContain('homer');
  });

  it('should not have burns in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).not.toContain('burns');
  });

  it('should not have apu in simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).not.toContain('apu');
  });

  it('should not have apu in extended tier', () => {
    expect(CHARACTER_TIERS.extended).not.toContain('apu');
  });
});

// ============================================================================
// Tier Size Constraints
// ============================================================================

describe('Character Tiers - Size Constraints', () => {
  it('should have simpson_family with at least 5 members', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThanOrEqual(5);
  });

  it('should have simpson_family with no more than 10 members', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeLessThanOrEqual(10);
  });

  it('should have extended with at least 3 members', () => {
    expect(CHARACTER_TIERS.extended.length).toBeGreaterThanOrEqual(3);
  });

  it('should have extended with no more than 10 members', () => {
    expect(CHARACTER_TIERS.extended.length).toBeLessThanOrEqual(10);
  });

  it('should have springfield with at least 5 members', () => {
    expect(CHARACTER_TIERS.springfield.length).toBeGreaterThanOrEqual(5);
  });

  it('should have springfield with no more than 20 members', () => {
    expect(CHARACTER_TIERS.springfield.length).toBeLessThanOrEqual(20);
  });
});

// ============================================================================
// ALL_CHARACTERS Consistency
// ============================================================================

describe('Character Tiers - ALL_CHARACTERS Consistency', () => {
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

  it('should have combined tier count less than or equal to ALL_CHARACTERS', () => {
    const tierTotal =
      CHARACTER_TIERS.simpson_family.length +
      CHARACTER_TIERS.extended.length +
      CHARACTER_TIERS.springfield.length +
      (CHARACTER_TIERS.specialists?.length || 0);
    expect(tierTotal).toBeLessThanOrEqual(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Tier Name Validation
// ============================================================================

describe('Character Tiers - Name Validation', () => {
  it('should have simpson_family as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.simpson_family)).toBe(true);
  });

  it('should have extended as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it('should have springfield as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });

  it('should have lowercase names in simpson_family', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have lowercase names in extended', () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have lowercase names in springfield', () => {
    for (const char of CHARACTER_TIERS.springfield) {
      expect(char).toBe(char.toLowerCase());
    }
  });
});

// ============================================================================
// Tier Lookup Functions
// ============================================================================

describe('Character Tiers - Lookup', () => {
  function findTierForCharacter(char: string): string | null {
    for (const [tierName, members] of Object.entries(CHARACTER_TIERS)) {
      if ((members as string[]).includes(char)) {
        return tierName;
      }
    }
    return null;
  }

  it('should find tier for homer', () => {
    expect(findTierForCharacter('homer')).toBe('simpson_family');
  });

  it('should find tier for burns', () => {
    expect(findTierForCharacter('burns')).toBe('extended');
  });

  it('should find tier for apu', () => {
    expect(findTierForCharacter('apu')).toBe('springfield');
  });

  it('should return null for unknown character', () => {
    expect(findTierForCharacter('unknown')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(findTierForCharacter('')).toBeNull();
  });
});

// ============================================================================
// Tier Iteration
// ============================================================================

describe('Character Tiers - Iteration', () => {
  it('should iterate over all tiers', () => {
    const tierNames = Object.keys(CHARACTER_TIERS);
    expect(tierNames.length).toBeGreaterThan(0);
  });

  it('should iterate over all characters in simpson_family', () => {
    let count = 0;
    for (const _ of CHARACTER_TIERS.simpson_family) {
      count++;
    }
    expect(count).toBe(CHARACTER_TIERS.simpson_family.length);
  });

  it('should iterate over all characters in extended', () => {
    let count = 0;
    for (const _ of CHARACTER_TIERS.extended) {
      count++;
    }
    expect(count).toBe(CHARACTER_TIERS.extended.length);
  });

  it('should iterate over all characters in springfield', () => {
    let count = 0;
    for (const _ of CHARACTER_TIERS.springfield) {
      count++;
    }
    expect(count).toBe(CHARACTER_TIERS.springfield.length);
  });
});
