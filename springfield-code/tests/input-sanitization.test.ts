/**
 * Input Sanitization Tests - Batch 25
 * Tests for input validation and sanitization across the codebase
 * 52 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
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
import { ALL_CHARACTERS } from '../src/constants.js';

let testDir: string;

// ============================================================================
// Character Name Sanitization
// ============================================================================

describe('Input Sanitization - Character Names', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sanitize-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject character with leading space', () => {
    expect(generateArtifact(' homer', 'test', testDir)).toBeNull();
  });

  it('should reject character with trailing space', () => {
    expect(generateArtifact('homer ', 'test', testDir)).toBeNull();
  });

  it('should reject character with double spaces', () => {
    expect(generateArtifact('ho  mer', 'test', testDir)).toBeNull();
  });

  it('should reject character with tab character', () => {
    expect(generateArtifact('ho\tmer', 'test', testDir)).toBeNull();
  });

  it('should reject character with newline', () => {
    expect(generateArtifact('ho\nmer', 'test', testDir)).toBeNull();
  });

  it('should reject character with carriage return', () => {
    expect(generateArtifact('ho\rmer', 'test', testDir)).toBeNull();
  });

  it('should reject character with form feed', () => {
    expect(generateArtifact('ho\fmer', 'test', testDir)).toBeNull();
  });

  it('should reject character with vertical tab', () => {
    expect(generateArtifact('ho\vmer', 'test', testDir)).toBeNull();
  });

  it('should reject character with null byte', () => {
    expect(generateArtifact('ho\0mer', 'test', testDir)).toBeNull();
  });

  it('should reject character with backspace', () => {
    expect(generateArtifact('ho\bmer', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// Path Injection Prevention
// ============================================================================

describe('Input Sanitization - Path Injection', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'path-inject-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject path with ../', () => {
    expect(generateArtifact('../homer', 'test', testDir)).toBeNull();
  });

  it('should reject path with /..', () => {
    expect(generateArtifact('homer/..', 'test', testDir)).toBeNull();
  });

  it('should reject path with /../', () => {
    expect(generateArtifact('foo/../bar', 'test', testDir)).toBeNull();
  });

  it('should reject absolute unix path', () => {
    expect(generateArtifact('/etc/passwd', 'test', testDir)).toBeNull();
  });

  it('should reject absolute windows path', () => {
    expect(generateArtifact('C:\\Windows', 'test', testDir)).toBeNull();
  });

  it('should reject UNC path', () => {
    expect(generateArtifact('\\\\server\\share', 'test', testDir)).toBeNull();
  });

  it('should reject file:// protocol', () => {
    expect(generateArtifact('file:///etc/passwd', 'test', testDir)).toBeNull();
  });

  it('should reject http:// protocol', () => {
    expect(generateArtifact('http://evil.com', 'test', testDir)).toBeNull();
  });

  it('should reject https:// protocol', () => {
    expect(generateArtifact('https://evil.com', 'test', testDir)).toBeNull();
  });

  it('should reject javascript: protocol', () => {
    expect(generateArtifact('javascript:alert(1)', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// Token Input Validation
// ============================================================================

describe('Input Sanitization - Token Validation', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should reject token with leading whitespace', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(' ' + token)).toBe(false);
  });

  it('should reject token with trailing whitespace', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token + ' ')).toBe(false);
  });

  it('should reject token with newline appended', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token + '\n')).toBe(false);
  });

  it('should reject token with null byte', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token + '\0')).toBe(false);
  });

  it('should reject partially matching token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!.substring(0, 5))).toBe(false);
  });

  it('should reject extended token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token + 'extra')).toBe(false);
  });

  it('should reject case-modified token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!.toUpperCase())).toBe(false);
  });

  it('should reject reversed token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!.split('').reverse().join(''))).toBe(false);
  });
});

// ============================================================================
// Special Character Handling
// ============================================================================

describe('Input Sanitization - Special Characters', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'special-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject character with angle brackets', () => {
    expect(generateArtifact('<homer>', 'test', testDir)).toBeNull();
  });

  it('should reject character with quotes', () => {
    expect(generateArtifact('"homer"', 'test', testDir)).toBeNull();
  });

  it('should reject character with single quotes', () => {
    expect(generateArtifact("'homer'", 'test', testDir)).toBeNull();
  });

  it('should reject character with backticks', () => {
    expect(generateArtifact('`homer`', 'test', testDir)).toBeNull();
  });

  it('should reject character with dollar sign', () => {
    expect(generateArtifact('$homer', 'test', testDir)).toBeNull();
  });

  it('should reject character with ampersand', () => {
    expect(generateArtifact('homer&bart', 'test', testDir)).toBeNull();
  });

  it('should reject character with pipe', () => {
    expect(generateArtifact('homer|bart', 'test', testDir)).toBeNull();
  });

  it('should reject character with semicolon', () => {
    expect(generateArtifact('homer;bart', 'test', testDir)).toBeNull();
  });

  it('should reject character with parentheses', () => {
    expect(generateArtifact('homer()', 'test', testDir)).toBeNull();
  });

  it('should reject character with curly braces', () => {
    expect(generateArtifact('homer{}', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// ALL_CHARACTERS Validation
// ============================================================================

describe('Input Sanitization - ALL_CHARACTERS', () => {
  it('should have no characters with special chars', () => {
    const specialChars = /[<>"'`$&|;(){}[\]\\]/;
    for (const char of ALL_CHARACTERS) {
      expect(specialChars.test(char)).toBe(false);
    }
  });

  it('should have no characters with whitespace', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.trim()).toBe(char);
    }
  });

  it('should have no characters with path separators except hyphen', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.includes('/')).toBe(false);
      expect(char.includes('\\')).toBe(false);
    }
  });

  it('should have no characters starting with dot', () => {
    for (const char of ALL_CHARACTERS) {
      expect(char.startsWith('.')).toBe(false);
    }
  });
});
