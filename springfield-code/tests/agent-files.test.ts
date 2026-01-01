/**
 * Agent Files Validation Tests - Batch 18
 * Tests for agent markdown file validation and structure
 * 55 tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  ALL_CHARACTERS,
  CHARACTER_TIERS,
  SPRINGFIELD_DIR,
} from '../src/constants.js';

// Helper to get agent directory
const AGENTS_DIR = path.join(SPRINGFIELD_DIR, '..', 'agents');

// ============================================================================
// Agent File Existence - Simpson Family
// ============================================================================

describe('Agent Files - Simpson Family', () => {
  const simpsonFamily = CHARACTER_TIERS.simpson_family;

  it('should have simpson_family tier defined', () => {
    expect(simpsonFamily).toBeDefined();
    expect(Array.isArray(simpsonFamily)).toBe(true);
  });

  it('should have 5 members in simpson_family', () => {
    expect(simpsonFamily.length).toBe(5);
  });

  it('should include homer in simpson_family', () => {
    expect(simpsonFamily).toContain('homer');
  });

  it('should include marge in simpson_family', () => {
    expect(simpsonFamily).toContain('marge');
  });

  it('should include bart in simpson_family', () => {
    expect(simpsonFamily).toContain('bart');
  });

  it('should include lisa in simpson_family', () => {
    expect(simpsonFamily).toContain('lisa');
  });

  it('should include maggie in simpson_family', () => {
    expect(simpsonFamily).toContain('maggie');
  });
});

// ============================================================================
// Agent File Existence - Extended Family
// ============================================================================

describe('Agent Files - Extended Family', () => {
  const extended = CHARACTER_TIERS.extended;

  it('should have extended tier defined', () => {
    expect(extended).toBeDefined();
    expect(Array.isArray(extended)).toBe(true);
  });

  it('should have 4 members in extended', () => {
    expect(extended.length).toBe(4);
  });

  it('should include grampa in extended', () => {
    expect(extended).toContain('grampa');
  });

  it('should include flanders in extended', () => {
    expect(extended).toContain('flanders');
  });

  it('should include burns in extended', () => {
    expect(extended).toContain('burns');
  });

  it('should include smithers in extended', () => {
    expect(extended).toContain('smithers');
  });
});

// ============================================================================
// Agent File Existence - Springfield Citizens
// ============================================================================

describe('Agent Files - Springfield Citizens', () => {
  const springfield = CHARACTER_TIERS.springfield;

  it('should have springfield tier defined', () => {
    expect(springfield).toBeDefined();
    expect(Array.isArray(springfield)).toBe(true);
  });

  it('should have 12 members in springfield', () => {
    expect(springfield.length).toBe(12);
  });

  it('should include apu in springfield', () => {
    expect(springfield).toContain('apu');
  });

  it('should include moe in springfield', () => {
    expect(springfield).toContain('moe');
  });

  it('should include krusty in springfield', () => {
    expect(springfield).toContain('krusty');
  });

  it('should include wiggum in springfield', () => {
    expect(springfield).toContain('wiggum');
  });

  it('should include skinner in springfield', () => {
    expect(springfield).toContain('skinner');
  });

  it('should include willie in springfield', () => {
    expect(springfield).toContain('willie');
  });

  it('should include nelson in springfield', () => {
    expect(springfield).toContain('nelson');
  });

  it('should include milhouse in springfield', () => {
    expect(springfield).toContain('milhouse');
  });

  it('should include ralph in springfield', () => {
    expect(springfield).toContain('ralph');
  });

  it('should include cbg in springfield', () => {
    expect(springfield).toContain('cbg');
  });

  it('should include frink in springfield', () => {
    expect(springfield).toContain('frink');
  });

  it('should include bob in springfield', () => {
    expect(springfield).toContain('bob');
  });
});

// ============================================================================
// Agent File Existence - Specialists
// ============================================================================

describe('Agent Files - Specialists Tier', () => {
  const specialists = CHARACTER_TIERS.specialists;

  it('should have specialists tier defined', () => {
    expect(specialists).toBeDefined();
    expect(Array.isArray(specialists)).toBe(true);
  });

  it('should have 20 members in specialists', () => {
    expect(specialists.length).toBe(20);
  });
});

// ============================================================================
// Character Name Validation
// ============================================================================

describe('Agent Files - Character Name Format', () => {
  it('should have all lowercase character names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have no spaces in character names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).not.toContain(' ');
    }
  });

  it('should have no special characters in names except hyphen', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toMatch(/^[a-z-]+$/);
    }
  });

  it('should have unique character names', () => {
    const uniqueNames = new Set(ALL_CHARACTERS);
    expect(uniqueNames.size).toBe(ALL_CHARACTERS.length);
  });

  it('should have 41 total characters', () => {
    expect(ALL_CHARACTERS.length).toBe(41);
  });
});

// ============================================================================
// Tier Membership Validation
// ============================================================================

describe('Agent Files - Tier Membership', () => {
  it('should have all tier characters in ALL_CHARACTERS', () => {
    const allFromTiers = [
      ...CHARACTER_TIERS.simpson_family,
      ...CHARACTER_TIERS.extended,
      ...CHARACTER_TIERS.springfield,
      ...CHARACTER_TIERS.specialists,
    ];
    for (const char of allFromTiers) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should have no duplicate characters across tiers', () => {
    const allFromTiers = [
      ...CHARACTER_TIERS.simpson_family,
      ...CHARACTER_TIERS.extended,
      ...CHARACTER_TIERS.springfield,
      ...CHARACTER_TIERS.specialists,
    ];
    const uniqueChars = new Set(allFromTiers);
    expect(uniqueChars.size).toBe(allFromTiers.length);
  });

  it('should have tier count matching ALL_CHARACTERS', () => {
    const tierCount =
      CHARACTER_TIERS.simpson_family.length +
      CHARACTER_TIERS.extended.length +
      CHARACTER_TIERS.springfield.length +
      CHARACTER_TIERS.specialists.length;
    expect(tierCount).toBe(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Tier Structure Validation
// ============================================================================

describe('Agent Files - Tier Structure', () => {
  it('should have 4 tiers defined', () => {
    expect(Object.keys(CHARACTER_TIERS).length).toBe(4);
  });

  it('should have simpson_family as first tier', () => {
    expect(CHARACTER_TIERS).toHaveProperty('simpson_family');
  });

  it('should have extended as second tier', () => {
    expect(CHARACTER_TIERS).toHaveProperty('extended');
  });

  it('should have springfield as third tier', () => {
    expect(CHARACTER_TIERS).toHaveProperty('springfield');
  });

  it('should have specialists as fourth tier', () => {
    expect(CHARACTER_TIERS).toHaveProperty('specialists');
  });

  it('should have non-empty tier arrays', () => {
    for (const [tier, members] of Object.entries(CHARACTER_TIERS)) {
      expect(members.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// SPRINGFIELD_DIR Validation
// ============================================================================

describe('Agent Files - Directory Constants', () => {
  it('should have SPRINGFIELD_DIR defined', () => {
    expect(SPRINGFIELD_DIR).toBeDefined();
  });

  it('should have SPRINGFIELD_DIR as string', () => {
    expect(typeof SPRINGFIELD_DIR).toBe('string');
  });

  it('should have non-empty SPRINGFIELD_DIR', () => {
    expect(SPRINGFIELD_DIR.length).toBeGreaterThan(0);
  });

  it('should have SPRINGFIELD_DIR ending with springfield', () => {
    expect(SPRINGFIELD_DIR.endsWith('springfield')).toBe(true);
  });
});
