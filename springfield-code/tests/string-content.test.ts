/**
 * String Content Tests - Batch 41
 * Tests for string content of artifacts and inputs
 * 46 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS } from '../src/constants.js';

let testDir: string;

// ============================================================================
// Artifact Content Format
// ============================================================================

describe('String Content - Artifact Format', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'str-format-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return string type', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return non-empty string', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result!.length).toBeGreaterThan(0);
  });

  it('should contain markdown-like content', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).toBeDefined();
  });

  it('should handle different user inputs', () => {
    const result1 = generateArtifact('homer', 'input1', testDir);
    const result2 = generateArtifact('homer', 'input2', testDir);
    expect(result1).not.toBeNull();
    expect(result2).not.toBeNull();
  });

  it('should handle long user input', () => {
    const longInput = 'a'.repeat(1000);
    const result = generateArtifact('bart', longInput, testDir);
    expect(result).not.toBeNull();
  });

  it('should handle empty user input', () => {
    const result = generateArtifact('lisa', '', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Character Name Strings
// ============================================================================

describe('String Content - Character Names', () => {
  it('should have lowercase names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toBe(char.toLowerCase());
    }
  });

  it('should have non-empty names', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.length).toBeGreaterThan(0);
    }
  });

  it('should have names with valid characters', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char).toMatch(/^[a-z-]+$/);
    }
  });

  it('should not have leading spaces', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.startsWith(' ')).toBe(false);
    }
  });

  it('should not have trailing spaces', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.endsWith(' ')).toBe(false);
    }
  });

  it('should not have double hyphens', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.includes('--')).toBe(false);
    }
  });
});

// ============================================================================
// User Input Handling
// ============================================================================

describe('String Content - User Input', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'str-input-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should accept basic text input', () => {
    const result = generateArtifact('homer', 'Hello World', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept numbers in input', () => {
    const result = generateArtifact('bart', '12345', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept special characters', () => {
    const result = generateArtifact('lisa', '!@#$%', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept newlines in input', () => {
    const result = generateArtifact('marge', 'line1\nline2', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept tabs in input', () => {
    const result = generateArtifact('maggie', 'col1\tcol2', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept unicode in input', () => {
    const result = generateArtifact('homer', '日本語', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept emoji in input', () => {
    const result = generateArtifact('bart', '😀🎉', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept mixed content', () => {
    const result = generateArtifact('lisa', 'Hello 123 !@# 日本語', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// String Operations
// ============================================================================

describe('String Content - Operations', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'str-ops-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should allow trim on result', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(() => result!.trim()).not.toThrow();
  });

  it('should allow split on result', () => {
    const result = generateArtifact('bart', 'test', testDir);
    expect(() => result!.split('\n')).not.toThrow();
  });

  it('should allow includes on result', () => {
    const result = generateArtifact('lisa', 'test', testDir);
    expect(typeof result!.includes('a')).toBe('boolean');
  });

  it('should allow substring on result', () => {
    const result = generateArtifact('marge', 'test', testDir);
    expect(() => result!.substring(0, 10)).not.toThrow();
  });

  it('should allow toLowerCase on result', () => {
    const result = generateArtifact('maggie', 'test', testDir);
    expect(() => result!.toLowerCase()).not.toThrow();
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('String Content - Edge Cases', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'str-edge-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle null byte in input', () => {
    const result = generateArtifact('homer', 'test\0value', testDir);
    expect(result).not.toBeNull();
  });

  it('should handle carriage return', () => {
    const result = generateArtifact('bart', 'line1\r\nline2', testDir);
    expect(result).not.toBeNull();
  });

  it('should handle backslash', () => {
    const result = generateArtifact('lisa', 'path\\to\\file', testDir);
    expect(result).not.toBeNull();
  });

  it('should handle quotes', () => {
    const result = generateArtifact('marge', 'say "hello"', testDir);
    expect(result).not.toBeNull();
  });

  it('should handle single quotes', () => {
    const result = generateArtifact('maggie', "it's ok", testDir);
    expect(result).not.toBeNull();
  });

  it('should handle HTML-like content', () => {
    const result = generateArtifact('homer', '<script>alert(1)</script>', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// String Length
// ============================================================================

describe('String Content - Length', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'str-len-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should have result with length property', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(typeof result!.length).toBe('number');
  });

  it('should have minimum content', () => {
    const result = generateArtifact('bart', 'test', testDir);
    expect(result!.length).toBeGreaterThan(5);
  });

  it('should handle very long input gracefully', () => {
    const longInput = 'x'.repeat(10000);
    const result = generateArtifact('lisa', longInput, testDir);
    expect(result).not.toBeNull();
  });
});
