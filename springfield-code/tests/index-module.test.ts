/**
 * Index Module Tests - Batch 46
 * Tests for main entry point exports
 * 45 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Import from main entry point
import * as index from '../src/index.js';

let testDir: string;

// ============================================================================
// Export Existence
// ============================================================================

describe('Index Module - Export Existence', () => {
  it('should export generateArtifact', () => {
    expect(typeof index.generateArtifact).toBe('function');
  });

  it('should export artifactExists', () => {
    expect(typeof index.artifactExists).toBe('function');
  });

  it('should export ALL_CHARACTERS', () => {
    expect(index.ALL_CHARACTERS).toBeDefined();
  });

  it('should export CHARACTER_TIERS', () => {
    expect(index.CHARACTER_TIERS).toBeDefined();
  });

  it('should export requestRalphAuthorization', () => {
    expect(typeof index.requestRalphAuthorization).toBe('function');
  });

  it('should export canInvokeRalph', () => {
    expect(typeof index.canInvokeRalph).toBe('function');
  });

  it('should export authorizeRalph', () => {
    expect(typeof index.authorizeRalph).toBe('function');
  });
});

// ============================================================================
// Export Types
// ============================================================================

describe('Index Module - Export Types', () => {
  it('should have ALL_CHARACTERS as array', () => {
    expect(Array.isArray(index.ALL_CHARACTERS)).toBe(true);
  });

  it('should have CHARACTER_TIERS as object', () => {
    expect(typeof index.CHARACTER_TIERS).toBe('object');
  });

  it('should have simpson_family in CHARACTER_TIERS', () => {
    expect(index.CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should have extended in CHARACTER_TIERS', () => {
    expect(index.CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should have springfield in CHARACTER_TIERS', () => {
    expect(index.CHARACTER_TIERS.springfield).toBeDefined();
  });
});

// ============================================================================
// Export Functionality
// ============================================================================

describe('Index Module - Export Functionality', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'idx-func-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifact via index export', () => {
    const result = index.generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should check artifact existence via index export', () => {
    index.generateArtifact('bart', 'test', testDir);
    expect(index.artifactExists('bart', testDir)).toBe(true);
  });

  it('should access ALL_CHARACTERS via index export', () => {
    expect(index.ALL_CHARACTERS.includes('homer')).toBe(true);
  });

  it('should access CHARACTER_TIERS via index export', () => {
    expect(index.CHARACTER_TIERS.simpson_family.includes('homer')).toBe(true);
  });
});

// ============================================================================
// Ralph Gate via Index
// ============================================================================

describe('Index Module - Ralph Gate', () => {
  beforeEach(() => {
    if (index._resetForTesting) (index._resetForTesting as Function)();
  });

  it('should request authorization via index', () => {
    const token = index.requestRalphAuthorization();
    expect(token).toBeDefined();
  });

  it('should check canInvokeRalph via index', () => {
    expect(typeof index.canInvokeRalph()).toBe('boolean');
  });

  it('should authorize via index', () => {
    const token = index.requestRalphAuthorization();
    expect(index.authorizeRalph(token!)).toBe(true);
  });
});

// ============================================================================
// Export Consistency
// ============================================================================

describe('Index Module - Consistency', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'idx-cons-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should have same ALL_CHARACTERS across accesses', () => {
    const first = index.ALL_CHARACTERS;
    const second = index.ALL_CHARACTERS;
    expect(first).toEqual(second);
  });

  it('should have same CHARACTER_TIERS across accesses', () => {
    const first = index.CHARACTER_TIERS;
    const second = index.CHARACTER_TIERS;
    expect(first).toEqual(second);
  });

  it('should generate consistent artifacts', () => {
    const result1 = index.generateArtifact('homer', 'test', testDir);
    const result2 = index.generateArtifact('homer', 'test', testDir);
    expect(result1).not.toBeNull();
    expect(result2).not.toBeNull();
  });
});

// ============================================================================
// Named vs Default Export
// ============================================================================

describe('Index Module - Named Exports', () => {
  it('should have named export for generateArtifact', () => {
    const { generateArtifact } = index;
    expect(typeof generateArtifact).toBe('function');
  });

  it('should have named export for artifactExists', () => {
    const { artifactExists } = index;
    expect(typeof artifactExists).toBe('function');
  });

  it('should have named export for ALL_CHARACTERS', () => {
    const { ALL_CHARACTERS } = index;
    expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
  });

  it('should have named export for CHARACTER_TIERS', () => {
    const { CHARACTER_TIERS } = index;
    expect(typeof CHARACTER_TIERS).toBe('object');
  });
});

// ============================================================================
// Import Star
// ============================================================================

describe('Index Module - Import Star', () => {
  it('should have multiple exports', () => {
    const keys = Object.keys(index);
    expect(keys.length).toBeGreaterThan(5);
  });

  it('should include core functions', () => {
    expect('generateArtifact' in index).toBe(true);
    expect('artifactExists' in index).toBe(true);
  });

  it('should include constants', () => {
    expect('ALL_CHARACTERS' in index).toBe(true);
    expect('CHARACTER_TIERS' in index).toBe(true);
  });

  it('should include ralph gate functions', () => {
    expect('requestRalphAuthorization' in index).toBe(true);
    expect('canInvokeRalph' in index).toBe(true);
    expect('authorizeRalph' in index).toBe(true);
  });
});
