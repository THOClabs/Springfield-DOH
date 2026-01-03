/**
 * Error Recovery Tests - Batch 48
 * Tests for error handling and recovery
 * 44 tests
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

let testDir: string;

// ============================================================================
// Invalid Character Recovery
// ============================================================================

describe('Error Recovery - Invalid Characters', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'err-char-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should recover from invalid character', () => {
    const invalid = generateArtifact('invalid', 'test', testDir);
    expect(invalid).toBeNull();
    const valid = generateArtifact('homer', 'test', testDir);
    expect(valid).not.toBeNull();
  });

  it('should recover from empty character', () => {
    const empty = generateArtifact('', 'test', testDir);
    expect(empty).toBeNull();
    const valid = generateArtifact('bart', 'test', testDir);
    expect(valid).not.toBeNull();
  });

  it('should recover from undefined character', () => {
    const undef = generateArtifact(undefined as any, 'test', testDir);
    expect(undef).toBeNull();
    const valid = generateArtifact('lisa', 'test', testDir);
    expect(valid).not.toBeNull();
  });

  it('should recover from null character', () => {
    const nullChar = generateArtifact(null as any, 'test', testDir);
    expect(nullChar).toBeNull();
    const valid = generateArtifact('marge', 'test', testDir);
    expect(valid).not.toBeNull();
  });
});

// ============================================================================
// Directory Error Recovery
// ============================================================================

describe('Error Recovery - Directory Errors', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'err-dir-'));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should recover after creating .springfield', () => {
    const noDir = generateArtifact('homer', 'test', testDir);
    expect(noDir).toBeNull();
    
    fs.mkdirSync(path.join(testDir, '.springfield'));
    const withDir = generateArtifact('homer', 'test', testDir);
    expect(withDir).not.toBeNull();
  });

  it('should handle missing dir gracefully', () => {
    const result = generateArtifact('homer', 'test', '/nonexistent');
    expect(result).toBeNull();
  });

  it('should continue after bad path', () => {
    const bad = generateArtifact('homer', 'test', '/nonexistent');
    expect(bad).toBeNull();
    
    fs.mkdirSync(path.join(testDir, '.springfield'));
    const good = generateArtifact('homer', 'test', testDir);
    expect(good).not.toBeNull();
  });
});

// ============================================================================
// Token Error Recovery
// ============================================================================

describe('Error Recovery - Token Errors', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should recover from invalid token', () => {
    requestRalphAuthorization();
    const invalid = authorizeRalph('wrong');
    expect(invalid).toBe(false);
    
    const newToken = requestRalphAuthorization();
    const valid = authorizeRalph(newToken!);
    expect(valid).toBe(true);
  });

  it('should recover from null token', () => {
    requestRalphAuthorization();
    const nullResult = authorizeRalph(null as any);
    expect(nullResult).toBe(false);
    
    const newToken = requestRalphAuthorization();
    expect(authorizeRalph(newToken!)).toBe(true);
  });

  it('should recover from empty token', () => {
    requestRalphAuthorization();
    const empty = authorizeRalph('');
    expect(empty).toBe(false);
    
    const newToken = requestRalphAuthorization();
    expect(authorizeRalph(newToken!)).toBe(true);
  });
});

// ============================================================================
// Sequential Errors
// ============================================================================

describe('Error Recovery - Sequential Errors', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'err-seq-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle multiple invalid characters', () => {
    expect(generateArtifact('inv1', 'test', testDir)).toBeNull();
    expect(generateArtifact('inv2', 'test', testDir)).toBeNull();
    expect(generateArtifact('inv3', 'test', testDir)).toBeNull();
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should handle alternating valid/invalid', () => {
    expect(generateArtifact('invalid', 'test', testDir)).toBeNull();
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
    expect(generateArtifact('invalid2', 'test', testDir)).toBeNull();
    expect(generateArtifact('bart', 'test', testDir)).not.toBeNull();
  });

  it('should not corrupt state after errors', () => {
    generateArtifact('invalid', 'test', testDir);
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });
});

// ============================================================================
// State Consistency After Errors
// ============================================================================

describe('Error Recovery - State Consistency', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'err-state-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should maintain artifact count after errors', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('invalid', 'test', testDir);
    generateArtifact('bart', 'test', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should maintain auth state after errors', () => {
    requestRalphAuthorization();
    authorizeRalph('wrong');
    expect(canInvokeRalph()).toBe(true);  // Token still pending
  });

  it('should allow reset after errors', () => {
    requestRalphAuthorization();
    authorizeRalph('wrong');
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
  });
});

// ============================================================================
// Edge Case Recovery
// ============================================================================

describe('Error Recovery - Edge Cases', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'err-edge-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle very long invalid names', () => {
    const longName = 'x'.repeat(1000);
    expect(generateArtifact(longName, 'test', testDir)).toBeNull();
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should handle special characters in name', () => {
    expect(generateArtifact('ho/mer', 'test', testDir)).toBeNull();
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should handle unicode invalid names', () => {
    expect(generateArtifact('日本語', 'test', testDir)).toBeNull();
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });
});

// ============================================================================
// Existence Check Recovery
// ============================================================================

describe('Error Recovery - Existence Checks', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'err-exist-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle check for invalid character', () => {
    expect(artifactExists('invalid', testDir)).toBe(false);
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should handle check for empty character', () => {
    expect(artifactExists('', testDir)).toBe(false);
  });

  it('should handle check for bad path', () => {
    expect(artifactExists('homer', '/nonexistent')).toBe(false);
  });
});
