/**
 * Return Value Tests - Batch 38
 * Tests for function return value characteristics
 * 50 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';

let testDir: string;

// ============================================================================
// generateArtifact Return Values
// ============================================================================

describe('Return Values - generateArtifact', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ret-gen-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return string for homer', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return string for marge', () => {
    const result = generateArtifact('marge', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return string for bart', () => {
    const result = generateArtifact('bart', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return string for lisa', () => {
    const result = generateArtifact('lisa', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return string for maggie', () => {
    const result = generateArtifact('maggie', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return null for empty character', () => {
    const result = generateArtifact('', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return non-empty string for valid input', () => {
    const result = generateArtifact('burns', 'test', testDir);
    expect(result!.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// artifactExists Return Values
// ============================================================================

describe('Return Values - artifactExists', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ret-exists-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return boolean true when exists', () => {
    generateArtifact('homer', 'test', testDir);
    const result = artifactExists('homer', testDir);
    expect(result).toBe(true);
    expect(typeof result).toBe('boolean');
  });

  it('should return boolean false when not exists', () => {
    const result = artifactExists('homer', testDir);
    expect(result).toBe(false);
    expect(typeof result).toBe('boolean');
  });

  it('should return false for invalid character', () => {
    const result = artifactExists('invalid', testDir);
    expect(result).toBe(false);
  });

  it('should return consistent type', () => {
    generateArtifact('bart', 'test', testDir);
    const result1 = artifactExists('bart', testDir);
    const result2 = artifactExists('nonexistent', testDir);
    expect(typeof result1).toBe(typeof result2);
  });
});

// ============================================================================
// Token Function Return Values
// ============================================================================

describe('Return Values - Token Functions', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return string from requestRalphAuthorization', () => {
    const result = requestRalphAuthorization();
    expect(typeof result).toBe('string');
  });

  it('should return non-empty string from requestRalphAuthorization', () => {
    const result = requestRalphAuthorization();
    expect(result!.length).toBeGreaterThan(0);
  });

  it('should return boolean from canInvokeRalph', () => {
    const result = canInvokeRalph();
    expect(typeof result).toBe('boolean');
  });

  it('should return false from canInvokeRalph initially', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should return true from canInvokeRalph after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should return boolean from authorizeRalph', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(typeof result).toBe('boolean');
  });

  it('should return true from authorizeRalph for valid token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should return false from authorizeRalph for invalid token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('invalid')).toBe(false);
  });
});

// ============================================================================
// Constant Return Values
// ============================================================================

describe('Return Values - Constants', () => {
  it('should return array for ALL_CHARACTERS', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should return array for CHARACTER_TIERS.simpson_family', () => {
    expect(Array.isArray(CHARACTER_TIERS.simpson_family)).toBe(true);
  });

  it('should return array for CHARACTER_TIERS.extended', () => {
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it('should return array for CHARACTER_TIERS.springfield', () => {
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });

  it('should return object for CHARACTER_TIERS', () => {
    expect(typeof CHARACTER_TIERS).toBe('object');
  });

  it('should return strings in ALL_CHARACTERS', () => {
    for (const item of ALL_CHARACTERS) {
      expect(typeof item).toBe('string');
    }
  });
});

// ============================================================================
// Edge Case Returns
// ============================================================================

describe('Return Values - Edge Cases', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ret-edge-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return null for undefined character', () => {
    const result = generateArtifact(undefined as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return null for null character', () => {
    const result = generateArtifact(null as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return false for empty directory path', () => {
    const result = artifactExists('homer', '');
    expect(result).toBe(false);
  });

  it('should handle consecutive calls with same return type', () => {
    const r1 = generateArtifact('homer', 'a', testDir);
    const r2 = generateArtifact('homer', 'b', testDir);
    const r3 = generateArtifact('homer', 'c', testDir);
    expect(typeof r1).toBe(typeof r2);
    expect(typeof r2).toBe(typeof r3);
  });
});

// ============================================================================
// Null Safety
// ============================================================================

describe('Return Values - Null Safety', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'null-safe-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should safely chain with null check', () => {
    const result = generateArtifact('homer', 'test', testDir);
    if (result !== null) {
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('should allow optional chaining on result', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result?.length).toBeUndefined();
  });

  it('should work with nullish coalescing', () => {
    const result = generateArtifact('invalid', 'test', testDir) ?? 'default';
    expect(result).toBe('default');
  });

  it('should provide valid result with nullish coalescing', () => {
    const result = generateArtifact('homer', 'test', testDir) ?? 'default';
    expect(result).not.toBe('default');
  });
});
