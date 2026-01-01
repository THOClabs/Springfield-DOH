/**
 * Defensive Programming Tests - Batch 54
 * Tests for defensive coding patterns and validation
 * 44 tests
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
// Null/Undefined Input Defense
// ============================================================================

describe('Defensive - Null/Undefined Inputs', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'def-null-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle null character', () => {
    const result = generateArtifact(null as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle undefined character', () => {
    const result = generateArtifact(undefined as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle null userInput', () => {
    const result = generateArtifact('homer', null as any, testDir);
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('should handle undefined userInput', () => {
    const result = generateArtifact('homer', undefined as any, testDir);
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('should handle null token in authorize', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(null as any)).toBe(false);
  });

  it('should handle undefined token in authorize', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(undefined as any)).toBe(false);
  });
});

// ============================================================================
// Type Coercion Defense
// ============================================================================

describe('Defensive - Type Coercion', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'def-type-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle number as character', () => {
    const result = generateArtifact(123 as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle object as character', () => {
    const result = generateArtifact({} as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle array as character', () => {
    const result = generateArtifact(['homer'] as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle boolean as character', () => {
    const result = generateArtifact(true as any, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle number as token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(123 as any)).toBe(false);
  });

  it('should handle object as token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph({} as any)).toBe(false);
  });
});

// ============================================================================
// Empty/Blank Defense
// ============================================================================

describe('Defensive - Empty/Blank Inputs', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'def-empty-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle empty string character', () => {
    const result = generateArtifact('', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle whitespace character', () => {
    const result = generateArtifact('   ', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle empty string token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('')).toBe(false);
  });

  it('should handle whitespace token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('   ')).toBe(false);
  });
});

// ============================================================================
// Boundary Defense
// ============================================================================

describe('Defensive - Boundary Values', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'def-bound-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle very long character name', () => {
    const result = generateArtifact('x'.repeat(10000), 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle single char name', () => {
    const result = generateArtifact('h', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle special characters in name', () => {
    const result = generateArtifact('homer!', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle path separators in name', () => {
    const result = generateArtifact('ho/mer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle dots in name', () => {
    const result = generateArtifact('homer.test', 'test', testDir);
    expect(result).toBeNull();
  });
});

// ============================================================================
// State Defense
// ============================================================================

describe('Defensive - State Protection', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should not break on repeated requests', () => {
    for (let i = 0; i < 10; i++) {
      const token = requestRalphAuthorization();
      expect(token).toBeDefined();
    }
  });

  it('should not break on repeated authorizations', () => {
    const token = requestRalphAuthorization();
    for (let i = 0; i < 10; i++) {
      const result = authorizeRalph(token!);
      expect(typeof result).toBe('boolean');
    }
  });

  it('should not break on repeated canInvokeRalph', () => {
    for (let i = 0; i < 100; i++) {
      const result = canInvokeRalph();
      expect(typeof result).toBe('boolean');
    }
  });

  it('should not break on repeated resets', () => {
    for (let i = 0; i < 10; i++) {
      requestRalphAuthorization();
      if (_resetForTesting) _resetForTesting();
      expect(canInvokeRalph()).toBe(false);
    }
  });
});

// ============================================================================
// Injection Defense
// ============================================================================

describe('Defensive - Injection Prevention', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'def-inject-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject path traversal in character', () => {
    const result = generateArtifact('../../../etc/passwd', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject backslash path in character', () => {
    const result = generateArtifact('..\\..\\windows', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should reject null bytes in character', () => {
    const result = generateArtifact('homer\0bad', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle HTML in user input', () => {
    const result = generateArtifact('homer', '<script>alert(1)</script>', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Recovery Defense
// ============================================================================

describe('Defensive - Error Recovery', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'def-rec-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should recover from bad input', () => {
    generateArtifact(null as any, 'test', testDir);
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should recover from bad token', () => {
    requestRalphAuthorization();
    authorizeRalph(null as any);
    const newToken = requestRalphAuthorization();
    expect(authorizeRalph(newToken!)).toBe(true);
  });

  it('should recover from bad path', () => {
    generateArtifact('homer', 'test', '/nonexistent');
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });
});
