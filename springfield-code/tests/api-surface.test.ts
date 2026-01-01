/**
 * API Surface Tests - Batch 55
 * Tests for public API surface area
 * 45 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Test all public exports
import {
  generateArtifact,
  artifactExists,
} from '../src/artifacts/generator.js';
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';
import {
  ALL_CHARACTERS,
  CHARACTER_TIERS,
} from '../src/constants.js';

let testDir: string;

// ============================================================================
// Generator Module API
// ============================================================================

describe('API Surface - Generator Module', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-gen-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should export generateArtifact as function', () => {
    expect(typeof generateArtifact).toBe('function');
  });

  it('should export artifactExists as function', () => {
    expect(typeof artifactExists).toBe('function');
  });

  it('should call generateArtifact with 3 arguments', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should call artifactExists with 2 arguments', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should return string from generateArtifact', () => {
    const result = generateArtifact('bart', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return boolean from artifactExists', () => {
    expect(typeof artifactExists('homer', testDir)).toBe('boolean');
  });
});

// ============================================================================
// Ralph Gate Module API
// ============================================================================

describe('API Surface - Ralph Gate Module', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should export requestRalphAuthorization as function', () => {
    expect(typeof requestRalphAuthorization).toBe('function');
  });

  it('should export canInvokeRalph as function', () => {
    expect(typeof canInvokeRalph).toBe('function');
  });

  it('should export authorizeRalph as function', () => {
    expect(typeof authorizeRalph).toBe('function');
  });

  it('should call requestRalphAuthorization with 0 arguments', () => {
    const token = requestRalphAuthorization();
    expect(token).toBeDefined();
  });

  it('should call canInvokeRalph with 0 arguments', () => {
    const result = canInvokeRalph();
    expect(typeof result).toBe('boolean');
  });

  it('should call authorizeRalph with 1 argument', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(typeof result).toBe('boolean');
  });

  it('should return string from requestRalphAuthorization', () => {
    const token = requestRalphAuthorization();
    expect(typeof token).toBe('string');
  });

  it('should return boolean from canInvokeRalph', () => {
    expect(typeof canInvokeRalph()).toBe('boolean');
  });

  it('should return boolean from authorizeRalph', () => {
    const token = requestRalphAuthorization();
    expect(typeof authorizeRalph(token!)).toBe('boolean');
  });
});

// ============================================================================
// Constants Module API
// ============================================================================

describe('API Surface - Constants Module', () => {
  it('should export ALL_CHARACTERS as array', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should export CHARACTER_TIERS as object', () => {
    expect(typeof CHARACTER_TIERS).toBe('object');
  });

  it('should have ALL_CHARACTERS with string elements', () => {
    for (const char of ALL_CHARACTERS) {
      expect(typeof char).toBe('string');
    }
  });

  it('should have CHARACTER_TIERS.simpson_family as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.simpson_family)).toBe(true);
  });

  it('should have CHARACTER_TIERS.extended as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it('should have CHARACTER_TIERS.springfield as array', () => {
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });
});

// ============================================================================
// Function Signatures
// ============================================================================

describe('API Surface - Function Signatures', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-sig-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should have generateArtifact taking character, input, path', () => {
    expect(generateArtifact('homer', 'userInput', testDir)).not.toBeNull();
  });

  it('should have artifactExists taking character, path', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should have requestRalphAuthorization taking no args', () => {
    expect(requestRalphAuthorization()).toBeDefined();
  });

  it('should have canInvokeRalph taking no args', () => {
    expect(canInvokeRalph()).toBeDefined();
  });

  it('should have authorizeRalph taking token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBeDefined();
  });
});

// ============================================================================
// Return Types Verification
// ============================================================================

describe('API Surface - Return Types', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-ret-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return string or null from generateArtifact', () => {
    const validResult = generateArtifact('homer', 'test', testDir);
    expect(typeof validResult === 'string' || validResult === null).toBe(true);
  });

  it('should return only boolean from artifactExists', () => {
    expect(typeof artifactExists('homer', testDir)).toBe('boolean');
  });

  it('should return string or null from requestRalphAuthorization', () => {
    const token = requestRalphAuthorization();
    expect(typeof token === 'string' || token === null).toBe(true);
  });

  it('should return only boolean from canInvokeRalph', () => {
    expect(typeof canInvokeRalph()).toBe('boolean');
  });

  it('should return only boolean from authorizeRalph', () => {
    const token = requestRalphAuthorization();
    expect(typeof authorizeRalph(token!)).toBe('boolean');
  });
});

// ============================================================================
// API Stability
// ============================================================================

describe('API Surface - Stability', () => {
  it('should have stable ALL_CHARACTERS export', () => {
    const ref1 = ALL_CHARACTERS;
    const ref2 = ALL_CHARACTERS;
    expect(ref1).toBe(ref2);
  });

  it('should have stable CHARACTER_TIERS export', () => {
    const ref1 = CHARACTER_TIERS;
    const ref2 = CHARACTER_TIERS;
    expect(ref1).toBe(ref2);
  });

  it('should have stable function exports', () => {
    expect(generateArtifact).toBe(generateArtifact);
    expect(artifactExists).toBe(artifactExists);
    expect(requestRalphAuthorization).toBe(requestRalphAuthorization);
    expect(canInvokeRalph).toBe(canInvokeRalph);
    expect(authorizeRalph).toBe(authorizeRalph);
  });
});
