/**
 * Workflow Protocol Tests - Batch 20
 * Tests for Lisa-Ralph protocol and workflow patterns
 * 54 tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  revokeRalphAuthorization,
  _resetForTesting,
} from '../src/hooks/ralph-gate.js';
import {
  ALL_CHARACTERS,
  CHARACTER_TIERS,
  CHARACTER_ARTIFACTS,
} from '../src/constants.js';
import {
  generateArtifact,
  artifactExists,
} from '../src/artifacts/generator.js';

let testDir: string;

// ============================================================================
// Protocol - Basic Token Flow
// ============================================================================

describe('Workflow Protocol - Token Flow', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should start with no authorization', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should grant authorization after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should return valid token', () => {
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
    expect(typeof token).toBe('string');
  });

  it('should consume token on authorize', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should reject second use of same token', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(authorizeRalph(token!)).toBe(false);
  });
});

// ============================================================================
// Protocol - Revocation
// ============================================================================

describe('Workflow Protocol - Revocation', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should revoke pending authorization', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should invalidate token after revocation', () => {
    const token = requestRalphAuthorization();
    revokeRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new request after revocation', () => {
    requestRalphAuthorization();
    revokeRalphAuthorization();
    const newToken = requestRalphAuthorization();
    expect(newToken).not.toBeNull();
  });

  it('should handle revocation without active token', () => {
    expect(() => revokeRalphAuthorization()).not.toThrow();
  });
});

// ============================================================================
// Protocol - Reset Behavior
// ============================================================================

describe('Workflow Protocol - Reset', () => {
  it('should clear all state on reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should invalidate old tokens after reset', () => {
    const token = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new requests after reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const newToken = requestRalphAuthorization();
    expect(newToken).not.toBeNull();
  });

  it('should handle multiple resets', () => {
    expect(() => {
      if (_resetForTesting) {
        _resetForTesting();
        _resetForTesting();
        _resetForTesting();
      }
    }).not.toThrow();
  });
});

// ============================================================================
// Workflow - Character Processing
// ============================================================================

describe('Workflow Protocol - Character Processing', () => {
  it('should process simpson family characters', () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should process extended family characters', () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should process springfield characters', () => {
    for (const char of CHARACTER_TIERS.springfield) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it('should process specialists characters', () => {
    for (const char of CHARACTER_TIERS.specialists) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });
});

// ============================================================================
// Workflow - Artifact Pipeline
// ============================================================================

describe('Workflow Protocol - Artifact Pipeline', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-artifact-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should check artifact existence before generation', () => {
    const exists = artifactExists('homer', testDir);
    expect(typeof exists).toBe('boolean');
    expect(exists).toBe(false);
  });

  it('should generate artifact for valid character', () => {
    const artifact = generateArtifact('homer', 'test input', testDir);
    expect(artifact).not.toBeNull();
  });

  it('should confirm artifact exists after generation', () => {
    generateArtifact('homer', 'test input', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should handle full pipeline for homer', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
    const artifact = generateArtifact('homer', 'test input', testDir);
    expect(artifact).not.toBeNull();
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should reject pipeline for invalid character', () => {
    expect(artifactExists('invalid', testDir)).toBe(false);
    expect(generateArtifact('invalid', 'test', testDir)).toBeNull();
  });
});

// ============================================================================
// Workflow - Multi-Step Operations
// ============================================================================

describe('Workflow Protocol - Multi-Step Operations', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should handle request-authorize-revoke cycle', () => {
    const token = requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    authorizeRalph(token!);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should handle multiple cycles', () => {
    for (let i = 0; i < 3; i++) {
      if (_resetForTesting) _resetForTesting();
      const token = requestRalphAuthorization();
      expect(canInvokeRalph()).toBe(true);
      authorizeRalph(token!);
      expect(canInvokeRalph()).toBe(false);
    }
  });

  it('should handle interleaved operations', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
    const newToken = requestRalphAuthorization();
    expect(authorizeRalph(newToken!)).toBe(true);
  });
});

// ============================================================================
// Workflow - Error Recovery
// ============================================================================

describe('Workflow Protocol - Error Recovery', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should recover from failed authorization', () => {
    requestRalphAuthorization();
    authorizeRalph('bad_token');
    // Should still be able to use original token
    expect(canInvokeRalph()).toBe(true);
  });

  it('should handle multiple failures gracefully', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('bad1')).toBe(false);
    expect(authorizeRalph('bad2')).toBe(false);
    expect(authorizeRalph('bad3')).toBe(false);
    // Original token should still exist
    expect(canInvokeRalph()).toBe(true);
  });

  it('should clean up after errors', () => {
    authorizeRalph('bad_token');
    expect(canInvokeRalph()).toBe(false);
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();
  });
});

// ============================================================================
// Workflow - State Consistency
// ============================================================================

describe('Workflow Protocol - State Consistency', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should maintain consistent state after operations', () => {
    expect(canInvokeRalph()).toBe(false);
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
    revokeRalphAuthorization();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should not have orphaned tokens', () => {
    const token = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(authorizeRalph(token!)).toBe(false);
    expect(canInvokeRalph()).toBe(false);
  });

  it('should handle rapid state changes', () => {
    for (let i = 0; i < 5; i++) {
      requestRalphAuthorization();
      revokeRalphAuthorization();
    }
    expect(canInvokeRalph()).toBe(false);
  });

  it('should maintain isolation between cycles', () => {
    const token1 = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const token2 = requestRalphAuthorization();
    expect(token1).not.toBe(token2);
    expect(authorizeRalph(token1!)).toBe(false);
    expect(authorizeRalph(token2!)).toBe(true);
  });
});
