/**
 * Error Handling Comprehensive Tests - Batch 17
 * Tests error scenarios, edge cases, and recovery patterns
 * 55 tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
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
  revokeRalphAuthorization,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';
import {
  ALL_CHARACTERS,
  CHARACTER_ARTIFACTS,
  CHARACTER_TIERS,
  SPRINGFIELD_DIR,
} from '../src/constants.js';

// Test directory setup
let testDir: string;

// ============================================================================
// Error Handling - Artifact Generator Edge Cases
// ============================================================================

describe('Error Handling - Artifact Generator', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'error-test-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle null character input gracefully', () => {
    const result = generateArtifact(null as unknown as string, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle undefined character input gracefully', () => {
    const result = generateArtifact(undefined as unknown as string, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle empty string character input', () => {
    const result = generateArtifact('', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle whitespace-only character input', () => {
    const result = generateArtifact('   ', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle numeric string character input', () => {
    const result = generateArtifact('12345', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle object character input', () => {
    const result = generateArtifact({} as unknown as string, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle array character input', () => {
    const result = generateArtifact([] as unknown as string, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle boolean character input', () => {
    const result = generateArtifact(true as unknown as string, 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle path traversal attempt', () => {
    const result = generateArtifact('../../../etc/passwd', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle URL-like character input', () => {
    const result = generateArtifact('https://evil.com/hack', 'test', testDir);
    expect(result).toBeNull();
  });
});

// ============================================================================
// Error Handling - Token Validation
// ============================================================================

describe('Error Handling - Token System', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should handle authorization with null token', () => {
    expect(authorizeRalph(null as unknown as string)).toBe(false);
  });

  it('should handle authorization with undefined token', () => {
    expect(authorizeRalph(undefined)).toBe(false);
  });

  it('should handle authorization with empty token', () => {
    expect(authorizeRalph('')).toBe(false);
  });

  it('should handle authorization with object token', () => {
    expect(authorizeRalph({} as unknown as string)).toBe(false);
  });

  it('should handle authorization with array token', () => {
    expect(authorizeRalph([] as unknown as string)).toBe(false);
  });

  it('should handle authorization with number token', () => {
    expect(authorizeRalph(123 as unknown as string)).toBe(false);
  });

  it('should handle revocation without active token', () => {
    expect(() => revokeRalphAuthorization()).not.toThrow();
  });

  it('should handle multiple revocations in sequence', () => {
    expect(() => {
      revokeRalphAuthorization();
      revokeRalphAuthorization();
      revokeRalphAuthorization();
    }).not.toThrow();
  });

  it('should handle request after revocation', () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    const newToken = requestRalphAuthorization();
    expect(newToken).not.toBeNull();
  });

  it('should handle canInvokeRalph without any setup', () => {
    expect(canInvokeRalph()).toBe(false);
  });
});

// ============================================================================
// Error Handling - Character Constants Validation
// ============================================================================

describe('Error Handling - Character Constants', () => {
  it('should handle iteration over ALL_CHARACTERS', () => {
    expect(() => {
      for (const char of ALL_CHARACTERS) {
        expect(typeof char).toBe('string');
      }
    }).not.toThrow();
  });

  it('should handle character lookup in CHARACTER_ARTIFACTS', () => {
    expect(() => {
      for (const char of ALL_CHARACTERS) {
        const artifact = CHARACTER_ARTIFACTS[char as keyof typeof CHARACTER_ARTIFACTS];
        // Some characters may not have artifacts
        if (artifact) {
          expect(typeof artifact).toBe('string');
        }
      }
    }).not.toThrow();
  });

  it('should handle non-existent character in CHARACTER_ARTIFACTS', () => {
    const fake = CHARACTER_ARTIFACTS['nonexistent' as keyof typeof CHARACTER_ARTIFACTS];
    expect(fake).toBeUndefined();
  });

  it('should handle tier lookup for valid tiers', () => {
    const tiers = Object.keys(CHARACTER_TIERS);
    expect(tiers.length).toBe(4);
  });

  it('should handle tier iteration', () => {
    expect(() => {
      for (const [tier, characters] of Object.entries(CHARACTER_TIERS)) {
        expect(typeof tier).toBe('string');
        expect(Array.isArray(characters)).toBe(true);
      }
    }).not.toThrow();
  });
});

// ============================================================================
// Error Handling - Template Edge Cases (using generateArtifact)
// ============================================================================

describe('Error Handling - Template System', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-test-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifact for valid character', () => {
    const result = generateArtifact('homer', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid_char', 'test input', testDir);
    expect(result).toBeNull();
  });

  it('should return null for empty character', () => {
    const result = generateArtifact('', 'test input', testDir);
    expect(result).toBeNull();
  });

  it('should return null for null character', () => {
    const result = generateArtifact(null as unknown as string, 'test input', testDir);
    expect(result).toBeNull();
  });

  it('should return null for undefined character', () => {
    const result = generateArtifact(undefined as unknown as string, 'test input', testDir);
    expect(result).toBeNull();
  });
});

// ============================================================================
// Error Handling - artifactExists Edge Cases
// ============================================================================

describe('Error Handling - artifactExists', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exists-test-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return false for null character', () => {
    expect(artifactExists(null as unknown as string, testDir)).toBe(false);
  });

  it('should return false for undefined character', () => {
    expect(artifactExists(undefined as unknown as string, testDir)).toBe(false);
  });

  it('should return false for empty character', () => {
    expect(artifactExists('', testDir)).toBe(false);
  });

  it('should return false for invalid character', () => {
    expect(artifactExists('not_a_character', testDir)).toBe(false);
  });

  it('should return false for path traversal', () => {
    expect(artifactExists('../../etc/passwd', testDir)).toBe(false);
  });

  it('should return false for special characters', () => {
    expect(artifactExists('<script>alert(1)</script>', testDir)).toBe(false);
  });
});

// ============================================================================
// Error Handling - Recovery Patterns
// ============================================================================

describe('Error Handling - Recovery Patterns', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should recover from failed token authorization', () => {
    authorizeRalph('bad_token');
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });

  it('should recover from multiple failed authorizations', () => {
    authorizeRalph('bad1');
    authorizeRalph('bad2');
    authorizeRalph('bad3');
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });

  it('should maintain state after error conditions', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    authorizeRalph('wrong_token');
    // State should still have the original token
    expect(canInvokeRalph()).toBe(true);
  });

  it('should properly clean up after reset', () => {
    const token = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
    expect(authorizeRalph(token!)).toBe(false);
  });
});

// ============================================================================
// Error Handling - Boundary Conditions
// ============================================================================

describe('Error Handling - Boundary Conditions', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'boundary-test-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle very long character name', () => {
    const longName = 'a'.repeat(10000);
    expect(generateArtifact(longName, 'test', testDir)).toBeNull();
  });

  it('should handle character name with newlines', () => {
    expect(generateArtifact('homer\nbart', 'test', testDir)).toBeNull();
  });

  it('should handle character name with tabs', () => {
    expect(generateArtifact('homer\tbart', 'test', testDir)).toBeNull();
  });

  it('should handle character name with carriage returns', () => {
    expect(generateArtifact('homer\rbart', 'test', testDir)).toBeNull();
  });

  it('should handle Unicode character name', () => {
    expect(generateArtifact('ホーマー', 'test', testDir)).toBeNull();
  });

  it('should handle emoji in character name', () => {
    expect(generateArtifact('homer🍩', 'test', testDir)).toBeNull();
  });

  it('should handle null byte in character name', () => {
    expect(generateArtifact('homer\0bart', 'test', testDir)).toBeNull();
  });

  it('should handle backslash in character name', () => {
    expect(generateArtifact('homer\\bart', 'test', testDir)).toBeNull();
  });

  it('should handle forward slash in character name', () => {
    expect(generateArtifact('homer/bart', 'test', testDir)).toBeNull();
  });
});
