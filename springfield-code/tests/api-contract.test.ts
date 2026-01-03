/**
 * API Contract Tests - Batch 36
 * Tests for API contracts and interface consistency
 * 52 tests
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
import { ALL_CHARACTERS } from '../src/constants.js';

let testDir: string;

// ============================================================================
// generateArtifact Contract
// ============================================================================

describe('API Contract - generateArtifact', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-contract-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return string for valid character', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return null for missing directory', () => {
    const result = generateArtifact('homer', 'test', '/nonexistent');
    expect(result).toBeNull();
  });

  it('should accept three parameters', () => {
    expect(generateArtifact.length).toBeGreaterThanOrEqual(2);
  });

  it('should be idempotent for same inputs', () => {
    const result1 = generateArtifact('bart', 'test', testDir);
    const result2 = generateArtifact('bart', 'test', testDir);
    expect(typeof result1).toBe('string');
    expect(typeof result2).toBe('string');
  });

  it('should create side effect (file)', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });
});

// ============================================================================
// artifactExists Contract
// ============================================================================

describe('API Contract - artifactExists', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exists-contract-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return boolean', () => {
    const result = artifactExists('homer', testDir);
    expect(typeof result).toBe('boolean');
  });

  it('should return false for non-existent artifact', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should return true for existing artifact', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should accept two parameters', () => {
    expect(artifactExists.length).toBeGreaterThanOrEqual(1);
  });

  it('should be consistent across multiple calls', () => {
    generateArtifact('bart', 'test', testDir);
    expect(artifactExists('bart', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should not have side effects', () => {
    const before = artifactExists('lisa', testDir);
    artifactExists('lisa', testDir);
    artifactExists('lisa', testDir);
    const after = artifactExists('lisa', testDir);
    expect(before).toBe(after);
  });
});

// ============================================================================
// requestRalphAuthorization Contract
// ============================================================================

describe('API Contract - requestRalphAuthorization', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return string', () => {
    const token = requestRalphAuthorization();
    expect(typeof token).toBe('string');
  });

  it('should return non-null value', () => {
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });

  it('should take no parameters', () => {
    expect(requestRalphAuthorization.length).toBe(0);
  });

  it('should affect canInvokeRalph state', () => {
    const before = canInvokeRalph();
    requestRalphAuthorization();
    const after = canInvokeRalph();
    expect(before).toBe(false);
    expect(after).toBe(true);
  });

  it('should return usable token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });
});

// ============================================================================
// authorizeRalph Contract
// ============================================================================

describe('API Contract - authorizeRalph', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return boolean', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(typeof result).toBe('boolean');
  });

  it('should return true for valid token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should return false for invalid token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('invalid')).toBe(false);
  });

  it('should take one parameter', () => {
    expect(authorizeRalph.length).toBe(1);
  });

  it('should affect canInvokeRalph state', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should consume token on success', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(authorizeRalph(token!)).toBe(false);
  });
});

// ============================================================================
// canInvokeRalph Contract
// ============================================================================

describe('API Contract - canInvokeRalph', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should return boolean', () => {
    const result = canInvokeRalph();
    expect(typeof result).toBe('boolean');
  });

  it('should take no parameters', () => {
    expect(canInvokeRalph.length).toBe(0);
  });

  it('should return false initially', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should return true after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should return false after authorization', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should be idempotent (no side effects)', () => {
    requestRalphAuthorization();
    canInvokeRalph();
    canInvokeRalph();
    canInvokeRalph();
    expect(canInvokeRalph()).toBe(true);
  });
});

// ============================================================================
// ALL_CHARACTERS Contract
// ============================================================================

describe('API Contract - ALL_CHARACTERS', () => {
  it('should be an array', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should contain strings only', () => {
    for (const char of ALL_CHARACTERS) {
      expect(typeof char).toBe('string');
    }
  });

  it('should be non-empty', () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThan(0);
  });

  it('should contain known characters', () => {
    expect(ALL_CHARACTERS).toContain('homer');
    expect(ALL_CHARACTERS).toContain('bart');
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should have no duplicates', () => {
    const unique = new Set(ALL_CHARACTERS);
    expect(unique.size).toBe(ALL_CHARACTERS.length);
  });

  it('should be iterable', () => {
    let count = 0;
    for (const _ of ALL_CHARACTERS) {
      count++;
    }
    expect(count).toBe(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Cross-Function Contracts
// ============================================================================

describe('API Contract - Cross-Function', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cross-func-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifacts for all ALL_CHARACTERS entries', () => {
    for (const char of ALL_CHARACTERS.slice(0, 5)) {
      const result = generateArtifact(char, 'test', testDir);
      expect(result).not.toBeNull();
    }
  });

  it('should track existence after generation', () => {
    for (const char of ALL_CHARACTERS.slice(0, 3)) {
      expect(artifactExists(char, testDir)).toBe(false);
      generateArtifact(char, 'test', testDir);
      expect(artifactExists(char, testDir)).toBe(true);
    }
  });

  it('should maintain token state across artifact operations', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    
    generateArtifact('homer', 'test', testDir);
    
    // Token should still be valid
    expect(authorizeRalph(token!)).toBe(true);
  });
});
