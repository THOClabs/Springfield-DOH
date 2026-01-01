/**
 * Type Safety Tests - Batch 56
 * Tests for type safety and runtime type checking
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
// String Type Safety
// ============================================================================

describe('Type Safety - Strings', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-str-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should accept string character', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should reject number as character', () => {
    const result = generateArtifact(123 as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject object as character', () => {
    const result = generateArtifact({name: 'homer'} as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject array as character', () => {
    const result = generateArtifact(['homer'] as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should accept string userInput', () => {
    expect(generateArtifact('homer', 'valid string', testDir)).not.toBeNull();
  });

  it('should accept string path', () => {
    expect(generateArtifact('bart', 'test', testDir)).not.toBeNull();
  });
});

// ============================================================================
// Boolean Type Safety
// ============================================================================

describe('Type Safety - Booleans', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-bool-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return true as boolean', () => {
    generateArtifact('homer', 'test', testDir);
    const result = artifactExists('homer', testDir);
    expect(result === true).toBe(true);
    expect(result).not.toBe(1);
  });

  it('should return false as boolean', () => {
    const result = artifactExists('nonexistent', testDir);
    expect(result === false).toBe(true);
    expect(result).not.toBe(0);
  });

  it('should return boolean from canInvokeRalph', () => {
    const result = canInvokeRalph();
    expect(typeof result).toBe('boolean');
    expect(result === true || result === false).toBe(true);
  });

  it('should return boolean from authorizeRalph', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(typeof result).toBe('boolean');
  });
});

// ============================================================================
// Array Type Safety
// ============================================================================

describe('Type Safety - Arrays', () => {
  it('should have ALL_CHARACTERS as Array', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
    expect(ALL_CHARACTERS instanceof Array).toBe(true);
  });

  it('should have string elements in ALL_CHARACTERS', () => {
    for (const char of ALL_CHARACTERS) {
      expect(typeof char).toBe('string');
    }
  });

  it('should have simpson_family as Array', () => {
    expect(Array.isArray(CHARACTER_TIERS.simpson_family)).toBe(true);
  });

  it('should have string elements in simpson_family', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(typeof char).toBe('string');
    }
  });

  it('should have extended as Array', () => {
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it('should have springfield as Array', () => {
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });
});

// ============================================================================
// Object Type Safety
// ============================================================================

describe('Type Safety - Objects', () => {
  it('should have CHARACTER_TIERS as object', () => {
    expect(typeof CHARACTER_TIERS).toBe('object');
    expect(CHARACTER_TIERS).not.toBeNull();
  });

  it('should have CHARACTER_TIERS properties', () => {
    expect('simpson_family' in CHARACTER_TIERS).toBe(true);
    expect('extended' in CHARACTER_TIERS).toBe(true);
    expect('springfield' in CHARACTER_TIERS).toBe(true);
  });

  it('should access CHARACTER_TIERS.simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should access CHARACTER_TIERS.extended', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should access CHARACTER_TIERS.springfield', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });
});

// ============================================================================
// Null Type Safety
// ============================================================================

describe('Type Safety - Nulls', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-null-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
    expect(result === null).toBe(true);
  });

  it('should return null (not undefined) for invalid', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).not.toBeUndefined();
  });

  it('should return string (not null) for valid', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
    expect(typeof result).toBe('string');
  });
});

// ============================================================================
// Token Type Safety
// ============================================================================

describe('Type Safety - Tokens', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return string token', () => {
    const token = requestRalphAuthorization();
    expect(typeof token).toBe('string');
  });

  it('should accept string in authorizeRalph', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(typeof result).toBe('boolean');
  });

  it('should reject non-string in authorizeRalph', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(123 as any)).toBe(false);
  });

  it('should reject object in authorizeRalph', () => {
    requestRalphAuthorization();
    expect(authorizeRalph({token: 'x'} as any)).toBe(false);
  });
});

// ============================================================================
// Runtime Type Checks
// ============================================================================

describe('Type Safety - Runtime Checks', () => {
  it('should verify ALL_CHARACTERS element types', () => {
    const allStrings = ALL_CHARACTERS.every(c => typeof c === 'string');
    expect(allStrings).toBe(true);
  });

  it('should verify no null elements in ALL_CHARACTERS', () => {
    const noNulls = ALL_CHARACTERS.every(c => c !== null);
    expect(noNulls).toBe(true);
  });

  it('should verify no undefined elements in ALL_CHARACTERS', () => {
    const noUndefined = ALL_CHARACTERS.every(c => c !== undefined);
    expect(noUndefined).toBe(true);
  });

  it('should verify tier arrays have consistent types', () => {
    const allArrays = [
      Array.isArray(CHARACTER_TIERS.simpson_family),
      Array.isArray(CHARACTER_TIERS.extended),
      Array.isArray(CHARACTER_TIERS.springfield),
    ];
    expect(allArrays.every(Boolean)).toBe(true);
  });
});
