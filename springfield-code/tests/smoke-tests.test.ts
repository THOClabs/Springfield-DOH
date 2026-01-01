/**
 * Smoke Tests - Batch 50
 * Quick sanity tests for core functionality
 * 45 tests
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
// Basic Import Smoke Tests
// ============================================================================

describe('Smoke Tests - Imports', () => {
  it('should import generateArtifact', () => {
    expect(generateArtifact).toBeDefined();
  });

  it('should import artifactExists', () => {
    expect(artifactExists).toBeDefined();
  });

  it('should import ALL_CHARACTERS', () => {
    expect(ALL_CHARACTERS).toBeDefined();
  });

  it('should import CHARACTER_TIERS', () => {
    expect(CHARACTER_TIERS).toBeDefined();
  });

  it('should import requestRalphAuthorization', () => {
    expect(requestRalphAuthorization).toBeDefined();
  });

  it('should import canInvokeRalph', () => {
    expect(canInvokeRalph).toBeDefined();
  });

  it('should import authorizeRalph', () => {
    expect(authorizeRalph).toBeDefined();
  });
});

// ============================================================================
// Type Smoke Tests
// ============================================================================

describe('Smoke Tests - Types', () => {
  it('should have function type generateArtifact', () => {
    expect(typeof generateArtifact).toBe('function');
  });

  it('should have function type artifactExists', () => {
    expect(typeof artifactExists).toBe('function');
  });

  it('should have array type ALL_CHARACTERS', () => {
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should have object type CHARACTER_TIERS', () => {
    expect(typeof CHARACTER_TIERS).toBe('object');
  });

  it('should have function type requestRalphAuthorization', () => {
    expect(typeof requestRalphAuthorization).toBe('function');
  });

  it('should have function type canInvokeRalph', () => {
    expect(typeof canInvokeRalph).toBe('function');
  });

  it('should have function type authorizeRalph', () => {
    expect(typeof authorizeRalph).toBe('function');
  });
});

// ============================================================================
// Basic Functionality Smoke Tests
// ============================================================================

describe('Smoke Tests - Basic Functionality', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smoke-func-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate homer artifact', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should check artifact existence', () => {
    generateArtifact('bart', 'test', testDir);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should have characters in array', () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThan(0);
  });

  it('should have tiers with members', () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThan(0);
  });

  it('should get authorization token', () => {
    const token = requestRalphAuthorization();
    expect(token).toBeDefined();
  });

  it('should check can invoke', () => {
    const result = canInvokeRalph();
    expect(typeof result).toBe('boolean');
  });

  it('should authorize with token', () => {
    const token = requestRalphAuthorization();
    const result = authorizeRalph(token!);
    expect(result).toBe(true);
  });
});

// ============================================================================
// Character Smoke Tests
// ============================================================================

describe('Smoke Tests - Characters', () => {
  it('should contain homer', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should contain marge', () => {
    expect(ALL_CHARACTERS).toContain('marge');
  });

  it('should contain bart', () => {
    expect(ALL_CHARACTERS).toContain('bart');
  });

  it('should contain lisa', () => {
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should contain burns', () => {
    expect(ALL_CHARACTERS).toContain('burns');
  });
});

// ============================================================================
// Tier Smoke Tests
// ============================================================================

describe('Smoke Tests - Tiers', () => {
  it('should have simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should have extended tier', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should have springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should have homer in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
  });
});

// ============================================================================
// Error Handling Smoke Tests
// ============================================================================

describe('Smoke Tests - Error Handling', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smoke-err-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return false for non-existent artifact', () => {
    expect(artifactExists('nonexistent', testDir)).toBe(false);
  });

  it('should return false for invalid token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('invalid')).toBe(false);
  });
});

// ============================================================================
// Integration Smoke Tests
// ============================================================================

describe('Smoke Tests - Integration', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smoke-int-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate and verify artifact', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should generate multiple artifacts', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('bart', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should verify tier membership and generation', () => {
    const char = CHARACTER_TIERS.simpson_family[0];
    generateArtifact(char, 'test', testDir);
    expect(artifactExists(char, testDir)).toBe(true);
  });
});
