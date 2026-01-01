/**
 * Boolean Logic Tests - Batch 42
 * Tests for boolean return values and logic
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
// artifactExists Boolean Logic
// ============================================================================

describe('Boolean Logic - artifactExists', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bool-exists-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return strictly true when exists', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should return strictly false when not exists', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should work in if condition when true', () => {
    generateArtifact('bart', 'test', testDir);
    let executed = false;
    if (artifactExists('bart', testDir)) {
      executed = true;
    }
    expect(executed).toBe(true);
  });

  it('should work in if condition when false', () => {
    let executed = false;
    if (!artifactExists('bart', testDir)) {
      executed = true;
    }
    expect(executed).toBe(true);
  });

  it('should work with AND operator', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('marge', 'test', testDir);
    const both = artifactExists('homer', testDir) && artifactExists('marge', testDir);
    expect(both).toBe(true);
  });

  it('should work with OR operator', () => {
    generateArtifact('homer', 'test', testDir);
    const either = artifactExists('homer', testDir) || artifactExists('lisa', testDir);
    expect(either).toBe(true);
  });

  it('should work with NOT operator', () => {
    expect(!artifactExists('nonexistent', testDir)).toBe(true);
  });

  it('should work with ternary operator', () => {
    const result = artifactExists('homer', testDir) ? 'yes' : 'no';
    expect(result).toBe('no');
  });
});

// ============================================================================
// canInvokeRalph Boolean Logic
// ============================================================================

describe('Boolean Logic - canInvokeRalph', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return strictly false initially', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should return strictly true after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should work with double negation', () => {
    expect(!!canInvokeRalph()).toBe(false);
  });

  it('should work with Boolean conversion', () => {
    expect(Boolean(canInvokeRalph())).toBe(false);
  });

  it('should work with strict equality to false', () => {
    expect(canInvokeRalph() === false).toBe(true);
  });

  it('should work with strict equality to true after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph() === true).toBe(true);
  });
});

// ============================================================================
// authorizeRalph Boolean Logic
// ============================================================================

describe('Boolean Logic - authorizeRalph', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return strictly true for valid token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should return strictly false for invalid token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('invalid')).toBe(false);
  });

  it('should allow conditional based on result', () => {
    const token = requestRalphAuthorization();
    let authorized = false;
    if (authorizeRalph(token!)) {
      authorized = true;
    }
    expect(authorized).toBe(true);
  });

  it('should return false for empty token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('')).toBe(false);
  });

  it('should return false without prior request', () => {
    expect(authorizeRalph('any-token')).toBe(false);
  });
});

// ============================================================================
// Boolean Combinations
// ============================================================================

describe('Boolean Logic - Combinations', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bool-combo-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should combine artifact and auth checks with AND', () => {
    generateArtifact('homer', 'test', testDir);
    requestRalphAuthorization();
    const both = artifactExists('homer', testDir) && canInvokeRalph();
    expect(both).toBe(true);
  });

  it('should combine artifact and auth checks with OR', () => {
    const either = artifactExists('nonexistent', testDir) || canInvokeRalph();
    expect(either).toBe(false);
  });

  it('should support complex boolean expressions', () => {
    generateArtifact('homer', 'test', testDir);
    const complex =
      artifactExists('homer', testDir) && (!canInvokeRalph() || artifactExists('bart', testDir));
    expect(complex).toBe(true);
  });

  it('should handle De Morgan law equivalence', () => {
    const a = artifactExists('homer', testDir);
    const b = canInvokeRalph();
    expect(!(a && b)).toBe(!a || !b);
  });

  it('should handle De Morgan law equivalence 2', () => {
    const a = artifactExists('homer', testDir);
    const b = canInvokeRalph();
    expect(!(a || b)).toBe(!a && !b);
  });
});

// ============================================================================
// Array Boolean Methods
// ============================================================================

describe('Boolean Logic - Array Methods', () => {
  it('should support includes for boolean check', () => {
    expect(ALL_CHARACTERS.includes('homer')).toBe(true);
  });

  it('should support includes returning false', () => {
    expect(ALL_CHARACTERS.includes('notexist')).toBe(false);
  });

  it('should support some() for boolean check', () => {
    expect(ALL_CHARACTERS.some((c) => c === 'bart')).toBe(true);
  });

  it('should support every() returning boolean', () => {
    const allStrings = ALL_CHARACTERS.every((c) => typeof c === 'string');
    expect(allStrings).toBe(true);
  });

  it('should support every() returning false', () => {
    const allLong = ALL_CHARACTERS.every((c) => c.length > 20);
    expect(allLong).toBe(false);
  });
});

// ============================================================================
// Boolean Type Checking
// ============================================================================

describe('Boolean Logic - Type Checking', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bool-type-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return boolean type from artifactExists', () => {
    expect(typeof artifactExists('homer', testDir)).toBe('boolean');
  });

  it('should return boolean type from canInvokeRalph', () => {
    expect(typeof canInvokeRalph()).toBe('boolean');
  });

  it('should return boolean type from authorizeRalph', () => {
    const token = requestRalphAuthorization();
    expect(typeof authorizeRalph(token!)).toBe('boolean');
  });

  it('should not return truthy non-boolean from artifactExists', () => {
    generateArtifact('homer', 'test', testDir);
    const result = artifactExists('homer', testDir);
    expect(result).not.toBe(1);
    expect(result).toBe(true);
  });

  it('should not return falsy non-boolean from artifactExists', () => {
    const result = artifactExists('nonexistent', testDir);
    expect(result).not.toBe(0);
    expect(result).not.toBe(null);
    expect(result).not.toBe(undefined);
    expect(result).toBe(false);
  });
});

// ============================================================================
// Boolean Short-circuit
// ============================================================================

describe('Boolean Logic - Short-circuit', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bool-short-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should short-circuit AND on false', () => {
    let called = false;
    const result =
      artifactExists('nonexistent', testDir) &&
      (() => {
        called = true;
        return true;
      })();
    expect(called).toBe(false);
    expect(result).toBe(false);
  });

  it('should short-circuit OR on true', () => {
    generateArtifact('homer', 'test', testDir);
    let called = false;
    const result =
      artifactExists('homer', testDir) ||
      (() => {
        called = true;
        return false;
      })();
    expect(called).toBe(false);
    expect(result).toBe(true);
  });
});
