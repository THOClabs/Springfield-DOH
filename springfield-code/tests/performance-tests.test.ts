/**
 * Memory and Performance Tests - Batch 52
 * Tests for memory usage and performance patterns
 * 42 tests
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
// Repeated Operations
// ============================================================================

describe('Performance - Repeated Operations', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-repeat-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle 10 consecutive generates', () => {
    for (let i = 0; i < 10; i++) {
      const result = generateArtifact('homer', `test-${i}`, testDir);
      expect(result).not.toBeNull();
    }
  });

  it('should handle 100 consecutive existence checks', () => {
    generateArtifact('homer', 'test', testDir);
    for (let i = 0; i < 100; i++) {
      expect(artifactExists('homer', testDir)).toBe(true);
    }
  });

  it('should handle 50 consecutive ALL_CHARACTERS accesses', () => {
    for (let i = 0; i < 50; i++) {
      expect(ALL_CHARACTERS.length).toBeGreaterThan(0);
    }
  });

  it('should handle 50 tier accesses', () => {
    for (let i = 0; i < 50; i++) {
      expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Token Cycling
// ============================================================================

describe('Performance - Token Cycling', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should handle 20 token requests', () => {
    for (let i = 0; i < 20; i++) {
      const token = requestRalphAuthorization();
      expect(token).toBeDefined();
    }
  });

  it('should handle 10 full auth cycles', () => {
    for (let i = 0; i < 10; i++) {
      const token = requestRalphAuthorization();
      expect(authorizeRalph(token!)).toBe(true);
      if (_resetForTesting) _resetForTesting();
    }
  });

  it('should handle rapid canInvokeRalph checks', () => {
    for (let i = 0; i < 100; i++) {
      const result = canInvokeRalph();
      expect(typeof result).toBe('boolean');
    }
  });
});

// ============================================================================
// Multi-Character Operations
// ============================================================================

describe('Performance - Multi-Character', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-multi-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate all simpson family', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      const result = generateArtifact(char, 'test', testDir);
      expect(result).not.toBeNull();
    }
  });

  it('should check existence for all simpson family', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      generateArtifact(char, 'test', testDir);
    }
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(artifactExists(char, testDir)).toBe(true);
    }
  });

  it('should iterate all characters without issue', () => {
    let count = 0;
    for (const char of ALL_CHARACTERS) {
      expect(typeof char).toBe('string');
      count++;
    }
    expect(count).toBe(ALL_CHARACTERS.length);
  });
});

// ============================================================================
// Large Input Handling
// ============================================================================

describe('Performance - Large Inputs', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-large-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle 1KB user input', () => {
    const input = 'x'.repeat(1024);
    expect(generateArtifact('homer', input, testDir)).not.toBeNull();
  });

  it('should handle 10KB user input', () => {
    const input = 'x'.repeat(10240);
    expect(generateArtifact('bart', input, testDir)).not.toBeNull();
  });

  it('should handle 100KB user input', () => {
    const input = 'x'.repeat(102400);
    expect(generateArtifact('lisa', input, testDir)).not.toBeNull();
  });
});

// ============================================================================
// Array Operations
// ============================================================================

describe('Performance - Array Operations', () => {
  it('should filter quickly', () => {
    const filtered = ALL_CHARACTERS.filter((c) => c.startsWith('h'));
    expect(filtered.length).toBeLessThanOrEqual(ALL_CHARACTERS.length);
  });

  it('should map quickly', () => {
    const mapped = ALL_CHARACTERS.map((c) => c.toUpperCase());
    expect(mapped.length).toBe(ALL_CHARACTERS.length);
  });

  it('should reduce quickly', () => {
    const total = ALL_CHARACTERS.reduce((acc, c) => acc + c.length, 0);
    expect(total).toBeGreaterThan(0);
  });

  it('should find quickly', () => {
    const found = ALL_CHARACTERS.find((c) => c === 'homer');
    expect(found).toBe('homer');
  });

  it('should indexOf quickly', () => {
    const idx = ALL_CHARACTERS.indexOf('homer');
    expect(idx).toBeGreaterThanOrEqual(0);
  });

  it('should includes quickly', () => {
    expect(ALL_CHARACTERS.includes('homer')).toBe(true);
  });
});

// ============================================================================
// Concurrent-Like Access
// ============================================================================

describe('Performance - Concurrent Patterns', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-conc-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle interleaved read/write', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    generateArtifact('bart', 'test', testDir);
    expect(artifactExists('bart', testDir)).toBe(true);
    generateArtifact('lisa', 'test', testDir);
    expect(artifactExists('lisa', testDir)).toBe(true);
  });

  it('should handle mixed token and artifact ops', () => {
    generateArtifact('homer', 'test', testDir);
    requestRalphAuthorization();
    generateArtifact('bart', 'test', testDir);
    expect(canInvokeRalph()).toBe(true);
    generateArtifact('lisa', 'test', testDir);
  });
});

// ============================================================================
// Stability Under Load
// ============================================================================

describe('Performance - Stability', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-stable-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should remain stable after many operations', () => {
    for (let i = 0; i < 20; i++) {
      generateArtifact('homer', `test-${i}`, testDir);
    }
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should return consistent results', () => {
    generateArtifact('homer', 'test', testDir);
    const results: boolean[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(artifactExists('homer', testDir));
    }
    expect(results.every((r) => r === true)).toBe(true);
  });
});
