/**
 * Stats & Metrics Deep Dive - Batch 14
 * Uses actual exports from the codebase
 * 55 tests targeting character tier lookup and constants validation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  CHARACTER_TIERS,
  ALL_CHARACTERS,
  CHARACTER_ARTIFACTS,
  SPRINGFIELD_DIR,
} from '../src/constants.js';

// Helper to get tier for a character from CHARACTER_TIERS
function getCharacterTier(character: string): string {
  for (const [tier, chars] of Object.entries(CHARACTER_TIERS)) {
    if ((chars as string[]).includes(character)) {
      return tier;
    }
  }
  return 'unknown';
}

describe('Character Tier Lookup - Simpson Family', () => {
  it('should return simpson_family tier for homer', () => {
    expect(getCharacterTier('homer')).toBe('simpson_family');
  });

  it('should return simpson_family tier for lisa', () => {
    expect(getCharacterTier('lisa')).toBe('simpson_family');
  });

  it('should return simpson_family tier for bart', () => {
    expect(getCharacterTier('bart')).toBe('simpson_family');
  });

  it('should return simpson_family tier for marge', () => {
    expect(getCharacterTier('marge')).toBe('simpson_family');
  });

  it('should return simpson_family tier for maggie', () => {
    expect(getCharacterTier('maggie')).toBe('simpson_family');
  });

  it('should include all 5 simpson family members', () => {
    expect(CHARACTER_TIERS.simpson_family).toHaveLength(5);
  });

  it('should have homer in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
  });
});

describe('Character Tier Lookup - Extended', () => {
  it('should return extended tier for burns', () => {
    expect(getCharacterTier('burns')).toBe('extended');
  });

  it('should return extended tier for smithers', () => {
    expect(getCharacterTier('smithers')).toBe('extended');
  });

  it('should return extended tier for flanders', () => {
    expect(getCharacterTier('flanders')).toBe('extended');
  });

  it('should return extended tier for grampa', () => {
    expect(getCharacterTier('grampa')).toBe('extended');
  });

  it('should include all 4 extended members', () => {
    expect(CHARACTER_TIERS.extended).toHaveLength(4);
  });

  it('should have burns in extended', () => {
    expect(CHARACTER_TIERS.extended).toContain('burns');
  });
});

describe('Character Tier Lookup - Springfield', () => {
  it('should return springfield tier for moe', () => {
    expect(getCharacterTier('moe')).toBe('springfield');
  });

  it('should return springfield tier for apu', () => {
    expect(getCharacterTier('apu')).toBe('springfield');
  });

  it('should return springfield tier for krusty', () => {
    expect(getCharacterTier('krusty')).toBe('springfield');
  });

  it('should return springfield tier for ralph', () => {
    expect(getCharacterTier('ralph')).toBe('springfield');
  });

  it('should return springfield tier for wiggum', () => {
    expect(getCharacterTier('wiggum')).toBe('springfield');
  });

  it('should return springfield tier for milhouse', () => {
    expect(getCharacterTier('milhouse')).toBe('springfield');
  });

  it('should return springfield tier for nelson', () => {
    expect(getCharacterTier('nelson')).toBe('springfield');
  });

  it('should return springfield tier for bob', () => {
    expect(getCharacterTier('bob')).toBe('springfield');
  });

  it('should return springfield tier for skinner', () => {
    expect(getCharacterTier('skinner')).toBe('springfield');
  });

  it('should return springfield tier for willie', () => {
    expect(getCharacterTier('willie')).toBe('springfield');
  });

  it('should return springfield tier for cbg', () => {
    expect(getCharacterTier('cbg')).toBe('springfield');
  });

  it('should return springfield tier for frink', () => {
    expect(getCharacterTier('frink')).toBe('springfield');
  });

  it('should include 12 springfield members', () => {
    expect(CHARACTER_TIERS.springfield).toHaveLength(12);
  });
});

describe('Character Tier Lookup - Specialists', () => {
  it('should return specialists tier for dr-nick', () => {
    expect(getCharacterTier('dr-nick')).toBe('specialists');
  });

  it('should return specialists tier for fat-tony', () => {
    expect(getCharacterTier('fat-tony')).toBe('specialists');
  });

  it('should return specialists tier for agnes', () => {
    expect(getCharacterTier('agnes')).toBe('specialists');
  });

  it('should return specialists tier for sea-captain', () => {
    expect(getCharacterTier('sea-captain')).toBe('specialists');
  });

  it('should return specialists tier for patty', () => {
    expect(getCharacterTier('patty')).toBe('specialists');
  });

  it('should return specialists tier for troy', () => {
    expect(getCharacterTier('troy')).toBe('specialists');
  });

  it('should return specialists tier for lionel', () => {
    expect(getCharacterTier('lionel')).toBe('specialists');
  });

  it('should return specialists tier for hans', () => {
    expect(getCharacterTier('hans')).toBe('specialists');
  });

  it('should return specialists tier for hibbert', () => {
    expect(getCharacterTier('hibbert')).toBe('specialists');
  });

  it('should return specialists tier for edna', () => {
    expect(getCharacterTier('edna')).toBe('specialists');
  });

  it('should return specialists tier for otto', () => {
    expect(getCharacterTier('otto')).toBe('specialists');
  });

  it('should return specialists tier for lenny', () => {
    expect(getCharacterTier('lenny')).toBe('specialists');
  });

  it('should return specialists tier for kent', () => {
    expect(getCharacterTier('kent')).toBe('specialists');
  });

  it('should return specialists tier for snake', () => {
    expect(getCharacterTier('snake')).toBe('specialists');
  });

  it('should return specialists tier for cookie', () => {
    expect(getCharacterTier('cookie')).toBe('specialists');
  });

  it('should return specialists tier for gil', () => {
    expect(getCharacterTier('gil')).toBe('specialists');
  });

  it('should return specialists tier for bumblebee', () => {
    expect(getCharacterTier('bumblebee')).toBe('specialists');
  });

  it('should return specialists tier for lovejoy', () => {
    expect(getCharacterTier('lovejoy')).toBe('specialists');
  });

  it('should have 20 specialists', () => {
    expect(CHARACTER_TIERS.specialists).toHaveLength(20);
  });
});

describe('Character Tier Lookup - Unknown', () => {
  it('should return unknown for invalid character', () => {
    expect(getCharacterTier('not-a-character')).toBe('unknown');
  });

  it('should return unknown for empty string', () => {
    expect(getCharacterTier('')).toBe('unknown');
  });

  it('should return unknown for numeric string', () => {
    expect(getCharacterTier('123')).toBe('unknown');
  });

  it('should return unknown for special characters', () => {
    expect(getCharacterTier('!@#$%')).toBe('unknown');
  });
});

describe('ALL_CHARACTERS Validation', () => {
  it('should include all 41 characters', () => {
    expect(ALL_CHARACTERS.length).toBe(41);
  });

  it('should include homer', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should include lisa', () => {
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should include ralph', () => {
    expect(ALL_CHARACTERS).toContain('ralph');
  });

  it('should include dr-nick', () => {
    expect(ALL_CHARACTERS).toContain('dr-nick');
  });

  it('should have unique entries', () => {
    const unique = new Set(ALL_CHARACTERS);
    expect(unique.size).toBe(ALL_CHARACTERS.length);
  });
});

describe('CHARACTER_ARTIFACTS Validation', () => {
  it('should have homer artifact as questions.md', () => {
    expect(CHARACTER_ARTIFACTS['homer']).toBe('questions.md');
  });

  it('should have lisa artifact as project.md', () => {
    expect(CHARACTER_ARTIFACTS['lisa']).toBe('project.md');
  });

  it('should have bart artifact as edge-cases.md', () => {
    expect(CHARACTER_ARTIFACTS['bart']).toBe('edge-cases.md');
  });

  it('should have marge artifact as structure.md', () => {
    expect(CHARACTER_ARTIFACTS['marge']).toBe('structure.md');
  });

  it('should have maggie artifact as logging.md', () => {
    expect(CHARACTER_ARTIFACTS['maggie']).toBe('logging.md');
  });

  it('should not have ralph artifact', () => {
    expect(CHARACTER_ARTIFACTS['ralph']).toBeUndefined();
  });

  it('should have burns artifact as budget.md', () => {
    expect(CHARACTER_ARTIFACTS['burns']).toBe('budget.md');
  });

  it('should have moe artifact as debug-notes.md', () => {
    expect(CHARACTER_ARTIFACTS['moe']).toBe('debug-notes.md');
  });
});

describe('SPRINGFIELD_DIR Constant', () => {
  it('should be .springfield', () => {
    expect(SPRINGFIELD_DIR).toBe('.springfield');
  });

  it('should be a string', () => {
    expect(typeof SPRINGFIELD_DIR).toBe('string');
  });
});

describe('Character Tier Key Validation', () => {
  it('should have 4 tier keys', () => {
    expect(Object.keys(CHARACTER_TIERS)).toHaveLength(4);
  });

  it('should have simpson_family key', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should have extended key', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should have springfield key', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should have specialists key', () => {
    expect(CHARACTER_TIERS.specialists).toBeDefined();
  });
});
