/**
 * Authorization Flow Tests - Batch 43
 * Tests for complete authorization workflows
 * 45 tests
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
// Basic Authorization Flow
// ============================================================================

describe('Authorization Flow - Basic', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should start unauthorized', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should get token from request', () => {
    const token = requestRalphAuthorization();
    expect(token).toBeDefined();
    expect(token!.length).toBeGreaterThan(0);
  });

  it('should be pending after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should authorize with correct token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should not allow reuse of token', () => {
    const token = requestRalphAuthorization();
    authorizeRalph(token!);
    expect(authorizeRalph(token!)).toBe(false);
  });
});

// ============================================================================
// Token Lifecycle
// ============================================================================

describe('Authorization Flow - Token Lifecycle', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should generate unique tokens', () => {
    const token1 = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const token2 = requestRalphAuthorization();
    expect(token1).not.toBe(token2);
  });

  it('should invalidate old token on new request', () => {
    const token1 = requestRalphAuthorization();
    const token2 = requestRalphAuthorization();
    expect(authorizeRalph(token1!)).toBe(false);
    expect(authorizeRalph(token2!)).toBe(true);
  });

  it('should return false for empty token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('')).toBe(false);
  });

  it('should return false for wrong token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('wrong-token-12345')).toBe(false);
  });

  it('should return false without request', () => {
    expect(authorizeRalph('any-token')).toBe(false);
  });
});

// ============================================================================
// Ralph Artifact Authorization
// ============================================================================

describe('Authorization Flow - Ralph Artifact', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-ralph-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should fail ralph artifact without authorization', () => {
    const result = generateArtifact('ralph', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should have canInvokeRalph true after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should allow authorization with valid token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should require fresh authorization for each ralph call', () => {
    const token1 = requestRalphAuthorization();
    authorizeRalph(token1!);
    
    // After authorization is consumed, canInvokeRalph should be false
    expect(canInvokeRalph()).toBe(false);
  });
});

// ============================================================================
// Non-Ralph Characters
// ============================================================================

describe('Authorization Flow - Non-Ralph Characters', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-nonralph-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should not require authorization for homer', () => {
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should not require authorization for marge', () => {
    expect(generateArtifact('marge', 'test', testDir)).not.toBeNull();
  });

  it('should not require authorization for bart', () => {
    expect(generateArtifact('bart', 'test', testDir)).not.toBeNull();
  });

  it('should not require authorization for lisa', () => {
    expect(generateArtifact('lisa', 'test', testDir)).not.toBeNull();
  });

  it('should not require authorization for burns', () => {
    expect(generateArtifact('burns', 'test', testDir)).not.toBeNull();
  });

  it('should not require authorization for apu', () => {
    expect(generateArtifact('apu', 'test', testDir)).not.toBeNull();
  });
});

// ============================================================================
// State Reset
// ============================================================================

describe('Authorization Flow - State Reset', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should reset to unauthorized state', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
  });

  it('should invalidate token after reset', () => {
    const token = requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    expect(authorizeRalph(token!)).toBe(false);
  });

  it('should allow new request after reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const newToken = requestRalphAuthorization();
    expect(newToken).toBeDefined();
  });

  it('should authorize new token after reset', () => {
    requestRalphAuthorization();
    if (_resetForTesting) _resetForTesting();
    const newToken = requestRalphAuthorization();
    expect(authorizeRalph(newToken!)).toBe(true);
  });
});

// ============================================================================
// Error Scenarios
// ============================================================================

describe('Authorization Flow - Errors', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-error-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle null token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(null as any)).toBe(false);
  });

  it('should handle undefined token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(undefined as any)).toBe(false);
  });

  it('should handle numeric token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph(12345 as any)).toBe(false);
  });

  it('should handle object token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph({} as any)).toBe(false);
  });
});

// ============================================================================
// Concurrent Authorization
// ============================================================================

describe('Authorization Flow - Concurrency', () => {
  beforeEach(() => {
    if (_resetForTesting) _resetForTesting();
  });

  it('should handle rapid requests', () => {
    const tokens: string[] = [];
    for (let i = 0; i < 5; i++) {
      const token = requestRalphAuthorization();
      if (token) tokens.push(token);
    }
    expect(tokens.length).toBe(5);
  });

  it('should only allow last token', () => {
    const token1 = requestRalphAuthorization();
    const token2 = requestRalphAuthorization();
    const token3 = requestRalphAuthorization();
    
    expect(authorizeRalph(token1!)).toBe(false);
    expect(authorizeRalph(token2!)).toBe(false);
    expect(authorizeRalph(token3!)).toBe(true);
  });

  it('should handle request-authorize cycle', () => {
    for (let i = 0; i < 3; i++) {
      const token = requestRalphAuthorization();
      expect(authorizeRalph(token!)).toBe(true);
      if (_resetForTesting) _resetForTesting();
    }
  });
});
