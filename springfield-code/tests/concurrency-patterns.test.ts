/**
 * Concurrency Patterns Tests - Batch 37
 * Tests for concurrent-like access patterns
 * 48 tests
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
// Rapid Operations
// ============================================================================

describe('Concurrency - Rapid Operations', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapid-ops-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle rapid artifact generation', () => {
    for (let i = 0; i < 20; i++) {
      const result = generateArtifact('homer', `test ${i}`, testDir);
      expect(result).not.toBeNull();
    }
  });

  it('should handle rapid existence checks', () => {
    generateArtifact('bart', 'test', testDir);
    for (let i = 0; i < 100; i++) {
      expect(artifactExists('bart', testDir)).toBe(true);
    }
  });

  it('should handle interleaved generate and check', () => {
    for (let i = 0; i < 10; i++) {
      generateArtifact('lisa', `test ${i}`, testDir);
      expect(artifactExists('lisa', testDir)).toBe(true);
    }
  });

  it('should handle multiple characters in sequence', () => {
    const chars = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
    for (let round = 0; round < 3; round++) {
      for (const char of chars) {
        generateArtifact(char, `round ${round}`, testDir);
      }
    }
    for (const char of chars) {
      expect(artifactExists(char, testDir)).toBe(true);
    }
  });
});

// ============================================================================
// Token Rapid Operations
// ============================================================================

describe('Concurrency - Token Operations', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should handle rapid request-authorize cycles', () => {
    for (let i = 0; i < 20; i++) {
      const token = requestRalphAuthorization();
      expect(authorizeRalph(token!)).toBe(true);
      if (_resetForTesting) _resetForTesting();
    }
  });

  it('should handle rapid canInvokeRalph checks', () => {
    requestRalphAuthorization();
    for (let i = 0; i < 100; i++) {
      expect(canInvokeRalph()).toBe(true);
    }
  });

  it('should handle failed authorization attempts rapidly', () => {
    requestRalphAuthorization();
    for (let i = 0; i < 50; i++) {
      expect(authorizeRalph(`wrong-token-${i}`)).toBe(false);
    }
    // Token should still be pending
    expect(canInvokeRalph()).toBe(true);
  });

  it('should handle interleaved request and check', () => {
    for (let i = 0; i < 10; i++) {
      if (_resetForTesting) _resetForTesting();
      expect(canInvokeRalph()).toBe(false);
      requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
    }
  });
});

// ============================================================================
// Multi-Directory Operations
// ============================================================================

describe('Concurrency - Multi-Directory', () => {
  const dirs: string[] = [];

  beforeEach(() => {
    for (let i = 0; i < 5; i++) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), `multi-dir-${i}-`));
      fs.mkdirSync(path.join(dir, '.springfield'), { recursive: true });
      dirs.push(dir);
    }
  });

  afterEach(() => {
    for (const dir of dirs) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    dirs.length = 0;
  });

  it('should handle operations across multiple directories', () => {
    for (const dir of dirs) {
      generateArtifact('homer', 'test', dir);
    }
    for (const dir of dirs) {
      expect(artifactExists('homer', dir)).toBe(true);
    }
  });

  it('should isolate artifacts between directories', () => {
    generateArtifact('bart', 'test', dirs[0]);
    for (let i = 1; i < dirs.length; i++) {
      expect(artifactExists('bart', dirs[i])).toBe(false);
    }
  });

  it('should handle alternating directory operations', () => {
    for (let round = 0; round < 5; round++) {
      const dir = dirs[round % dirs.length];
      generateArtifact('lisa', `round ${round}`, dir);
    }
    for (const dir of dirs) {
      expect(artifactExists('lisa', dir)).toBe(true);
    }
  });
});

// ============================================================================
// Stress Patterns
// ============================================================================

describe('Concurrency - Stress Patterns', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stress-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle all characters in sequence', () => {
    for (const char of ALL_CHARACTERS) {
      const result = generateArtifact(char, 'test', testDir);
      // Ralph requires authorization, others should work
      if (char !== 'ralph') {
        expect(result).not.toBeNull();
      }
    }
  });

  it('should handle mixed valid and invalid characters', () => {
    const mixed = ['homer', 'invalid', 'bart', 'unknown', 'lisa'];
    for (const char of mixed) {
      generateArtifact(char, 'test', testDir);
    }
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
    expect(artifactExists('lisa', testDir)).toBe(true);
  });

  it('should handle many existence checks for non-existent', () => {
    for (let i = 0; i < 100; i++) {
      expect(artifactExists('nonexistent', testDir)).toBe(false);
    }
  });
});

// ============================================================================
// Recovery Patterns
// ============================================================================

describe('Concurrency - Recovery', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'recovery-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should recover from invalid character in sequence', () => {
    generateArtifact('invalid', 'test', testDir);
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should maintain state after failed operations', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    
    // Attempt invalid operations
    generateArtifact('invalid', 'test', testDir);
    generateArtifact('', 'test', testDir);
    
    // Homer should still exist
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should recover token state after failed auth', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    
    // Failed authorizations
    authorizeRalph('wrong1');
    authorizeRalph('wrong2');
    
    // Should still be able to authorize with correct token
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should handle reset during operations', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    
    if (_resetForTesting) _resetForTesting();
    
    expect(canInvokeRalph()).toBe(false);
    const newToken = requestRalphAuthorization();
    expect(authorizeRalph(newToken!)).toBe(true);
  });
});

// ============================================================================
// Ordering Guarantees
// ============================================================================

describe('Concurrency - Ordering', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ordering-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should maintain operation order for artifacts', () => {
    const operations: string[] = [];
    
    operations.push(`before:${artifactExists('homer', testDir)}`);
    generateArtifact('homer', 'test', testDir);
    operations.push(`after:${artifactExists('homer', testDir)}`);
    
    expect(operations[0]).toBe('before:false');
    expect(operations[1]).toBe('after:true');
  });

  it('should maintain operation order for tokens', () => {
    if (_resetForTesting) _resetForTesting();
    
    const states: boolean[] = [];
    states.push(canInvokeRalph());
    requestRalphAuthorization();
    states.push(canInvokeRalph());
    
    expect(states[0]).toBe(false);
    expect(states[1]).toBe(true);
  });

  it('should handle sequential overwrites', () => {
    for (let i = 0; i < 5; i++) {
      generateArtifact('bart', `version ${i}`, testDir);
      expect(artifactExists('bart', testDir)).toBe(true);
    }
  });

  it('should track each artifact independently', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(false);
    
    generateArtifact('bart', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
  });
});
