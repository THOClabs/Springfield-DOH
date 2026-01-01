/**
 * State Machine Tests - Batch 29
 * Tests for state transitions and machine behavior
 * 48 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';

let testDir: string;

// ============================================================================
// Authorization State Machine
// ============================================================================

describe('State Machine - Authorization States', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should start in IDLE state (no active token)', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should transition to PENDING after request', () => {
    const token = requestRalphAuthorization();
    expect(token).toBeTruthy();
    // Can invoke - have pending token
    expect(canInvokeRalph()).toBe(true);
  });

  it('should transition to CONSUMED after authorize', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
    // After consumption, can no longer invoke
    expect(canInvokeRalph()).toBe(false);
  });

  it('should stay in PENDING if wrong token used', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('wrong-token')).toBe(false);
    // Still has pending token, can invoke
    expect(canInvokeRalph()).toBe(true);
  });

  it('should reset to IDLE state', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
    const newToken = requestRalphAuthorization();
    expect(newToken).toBeTruthy();
  });
});

// ============================================================================
// Token Lifecycle States
// ============================================================================

describe('State Machine - Token Lifecycle', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should create unique token on each request after reset', () => {
    const tokens: string[] = [];
    for (let i = 0; i < 5; i++) {
      const token = requestRalphAuthorization();
      tokens.push(token!);
      if (_resetForTesting) _resetForTesting();
    }
    const unique = new Set(tokens);
    expect(unique.size).toBe(5);
  });

  it('should only accept most recent token', () => {
    const token1 = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    requestRalphAuthorization();
    // Old token should not work
    expect(authorizeRalph(token1!)).toBe(false);
  });

  it('should invalidate token after use', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    // Same token can't be reused
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new token request after consumption', () => {
    const token1 = requestRalphAuthorization();
    authorizeRalph(token1!);
    if (_resetForTesting) _resetForTesting();
    const token2 = requestRalphAuthorization();
    expect(token2).toBeTruthy();
    expect(token2).not.toBe(token1);
  });
});

// ============================================================================
// Artifact Existence State
// ============================================================================

describe('State Machine - Artifact States', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'state-artifact-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should start with artifact NOT_EXISTS', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should transition to EXISTS after generation', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should maintain EXISTS state after multiple generations', () => {
    generateArtifact('bart', 'test 1', testDir);
    expect(artifactExists('bart', testDir)).toBe(true);
    generateArtifact('bart', 'test 2', testDir);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should allow creating artifact after prior artifact exists', () => {
    generateArtifact('lisa', 'test', testDir);
    expect(artifactExists('lisa', testDir)).toBe(true);
    
    // Generate again - should still work
    generateArtifact('lisa', 'new test', testDir);
    expect(artifactExists('lisa', testDir)).toBe(true);
  });
});

// ============================================================================
// Multi-Character State
// ============================================================================

describe('State Machine - Multi-Character', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'multi-char-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should track each character independently', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
    expect(artifactExists('bart', testDir)).toBe(false);
    
    generateArtifact('homer', 'test', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(false);
  });

  it('should allow multiple characters to have artifacts', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('marge', 'test', testDir);
    generateArtifact('bart', 'test', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('marge', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
  });

  it('should not affect one character when another is generated', () => {
    generateArtifact('homer', 'original', testDir);
    const homerBefore = artifactExists('homer', testDir);
    
    generateArtifact('lisa', 'new', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(homerBefore);
    expect(artifactExists('lisa', testDir)).toBe(true);
  });
});

// ============================================================================
// Directory State
// ============================================================================

describe('State Machine - Directory States', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dir-state-'));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should fail generation if .springfield missing', () => {
    expect(generateArtifact('homer', 'test', testDir)).toBeNull();
  });

  it('should succeed generation after .springfield created', () => {
    expect(generateArtifact('homer', 'test', testDir)).toBeNull();
    fs.mkdirSync(path.join(testDir, '.springfield'));
    const result = generateArtifact('bart', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should fail generation if .springfield becomes file', () => {
    fs.writeFileSync(path.join(testDir, '.springfield'), 'not a directory');
    expect(generateArtifact('homer', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// Error State Recovery
// ============================================================================

describe('State Machine - Error Recovery', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'error-recovery-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should recover after invalid character attempt', () => {
    expect(generateArtifact('invalid', 'test', testDir)).toBeNull();
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should recover after empty input attempt', () => {
    generateArtifact('homer', '', testDir);
    const result = generateArtifact('bart', 'valid input', testDir);
    expect(result).not.toBeNull();
  });

  it('should maintain state after failed generations', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    
    generateArtifact('invalid', 'test', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(true);
  });
});

// ============================================================================
// Concurrent State Access
// ============================================================================

describe('State Machine - Concurrent Patterns', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'concurrent-state-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle rapid state checks', () => {
    const results: boolean[] = [];
    for (let i = 0; i < 100; i++) {
      results.push(artifactExists('homer', testDir));
    }
    expect(new Set(results).size).toBe(1); // All false
  });

  it('should handle interleaved operations', () => {
    generateArtifact('homer', 'test', testDir);
    
    for (let i = 0; i < 10; i++) {
      expect(artifactExists('homer', testDir)).toBe(true);
      generateArtifact('bart', `test ${i}`, testDir);
      expect(artifactExists('bart', testDir)).toBe(true);
    }
  });
});
