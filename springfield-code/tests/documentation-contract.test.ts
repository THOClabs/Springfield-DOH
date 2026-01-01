/**
 * Documentation Contract Tests - Batch 57
 * Tests verifying documented behavior
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
// Character List Contracts
// ============================================================================

describe('Documentation Contract - Characters', () => {
  it('should have homer available', () => {
    expect(ALL_CHARACTERS).toContain('homer');
  });

  it('should have marge available', () => {
    expect(ALL_CHARACTERS).toContain('marge');
  });

  it('should have bart available', () => {
    expect(ALL_CHARACTERS).toContain('bart');
  });

  it('should have lisa available', () => {
    expect(ALL_CHARACTERS).toContain('lisa');
  });

  it('should have maggie available', () => {
    expect(ALL_CHARACTERS).toContain('maggie');
  });

  it('should have burns available', () => {
    expect(ALL_CHARACTERS).toContain('burns');
  });

  it('should have apu available', () => {
    expect(ALL_CHARACTERS).toContain('apu');
  });
});

// ============================================================================
// Tier Contracts
// ============================================================================

describe('Documentation Contract - Tiers', () => {
  it('should have simpson_family tier', () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
  });

  it('should have extended tier', () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
  });

  it('should have springfield tier', () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
  });

  it('should place homer in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('homer');
  });

  it('should place marge in simpson_family', () => {
    expect(CHARACTER_TIERS.simpson_family).toContain('marge');
  });

  it('should have core family in simpson_family', () => {
    const core = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
    for (const member of core) {
      expect(CHARACTER_TIERS.simpson_family).toContain(member);
    }
  });
});

// ============================================================================
// Artifact Generation Contracts
// ============================================================================

describe('Documentation Contract - Artifact Generation', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-gen-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should create artifact for valid character', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should store artifact in .springfield', () => {
    generateArtifact('homer', 'test', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('should create .md file', () => {
    generateArtifact('bart', 'test', testDir);
    const files = fs.readdirSync(path.join(testDir, '.springfield'));
    expect(files.some(f => f.endsWith('.md'))).toBe(true);
  });
});

// ============================================================================
// Ralph Authorization Contracts
// ============================================================================

describe('Documentation Contract - Ralph Authorization', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-ralph-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should require authorization for ralph', () => {
    const result = generateArtifact('ralph', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should start with canInvokeRalph false', () => {
    expect(canInvokeRalph()).toBe(false);
  });

  it('should return token from request', () => {
    const token = requestRalphAuthorization();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should set canInvokeRalph true after request', () => {
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);
  });

  it('should authorize with correct token', () => {
    const token = requestRalphAuthorization();
    expect(authorizeRalph(token!)).toBe(true);
  });

  it('should reject incorrect token', () => {
    requestRalphAuthorization();
    expect(authorizeRalph('wrong')).toBe(false);
  });
});

// ============================================================================
// Existence Check Contracts
// ============================================================================

describe('Documentation Contract - Existence Check', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-exists-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return true after generation', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should return false before generation', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should return boolean type', () => {
    expect(typeof artifactExists('homer', testDir)).toBe('boolean');
  });
});

// ============================================================================
// Error Handling Contracts
// ============================================================================

describe('Documentation Contract - Error Handling', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-err-'));
    if (_resetForTesting) _resetForTesting();
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return null without .springfield dir', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return false for existence in missing dir', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should return false for empty character', () => {
    fs.mkdirSync(path.join(testDir, '.springfield'));
    expect(artifactExists('', testDir)).toBe(false);
  });
});
