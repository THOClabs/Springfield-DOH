/**
 * Template Engine Tests - Batch 19
 * Tests for artifact template generation and validation
 * 52 tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  generateArtifact,
  artifactExists,
} from '../src/artifacts/generator.js';
import {
  ALL_CHARACTERS,
  CHARACTER_ARTIFACTS,
  CHARACTER_TIERS,
} from '../src/constants.js';

let testDir: string;
let springfieldDir: string;

// ============================================================================
// Template Generation - Simpson Family
// ============================================================================

describe('Template Engine - Simpson Family', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-simpson-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifact for homer', () => {
    const result = generateArtifact('homer', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for marge', () => {
    const result = generateArtifact('marge', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for bart', () => {
    const result = generateArtifact('bart', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for lisa', () => {
    const result = generateArtifact('lisa', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for maggie', () => {
    const result = generateArtifact('maggie', 'test input', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Template Generation - Extended Family
// ============================================================================

describe('Template Engine - Extended Family', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-extended-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifact for grampa', () => {
    const result = generateArtifact('grampa', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for flanders', () => {
    const result = generateArtifact('flanders', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for burns', () => {
    const result = generateArtifact('burns', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for smithers', () => {
    const result = generateArtifact('smithers', 'test input', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Template Generation - Springfield Citizens
// ============================================================================

describe('Template Engine - Springfield Citizens', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-springfield-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifact for apu', () => {
    const result = generateArtifact('apu', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for moe', () => {
    const result = generateArtifact('moe', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for krusty', () => {
    const result = generateArtifact('krusty', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for wiggum', () => {
    const result = generateArtifact('wiggum', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for skinner', () => {
    const result = generateArtifact('skinner', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for willie', () => {
    const result = generateArtifact('willie', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for nelson', () => {
    const result = generateArtifact('nelson', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for milhouse', () => {
    const result = generateArtifact('milhouse', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  // ralph requires special authorization - tested separately in lisa-ralph.test.ts
  it('should return null for ralph without authorization', () => {
    const result = generateArtifact('ralph', 'test input', testDir);
    expect(result).toBeNull();
  });

  it('should generate artifact for cbg', () => {
    const result = generateArtifact('cbg', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for frink', () => {
    const result = generateArtifact('frink', 'test input', testDir);
    expect(result).not.toBeNull();
  });

  it('should generate artifact for bob', () => {
    const result = generateArtifact('bob', 'test input', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Template Content Validation
// ============================================================================

describe('Template Engine - Content Format', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-content-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return string content for valid character', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(typeof result).toBe('string');
  });

  it('should return non-empty content for valid character', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result!.length).toBeGreaterThan(0);
  });

  it('should return null for invalid character', () => {
    const result = generateArtifact('invalid', 'test', testDir);
    expect(result).toBeNull();
  });
});

// ============================================================================
// Artifact Existence Checks
// ============================================================================

describe('Template Engine - Artifact Existence', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-exists-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return false before artifact created', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should return true after artifact created', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should return false for nonexistent character', () => {
    expect(artifactExists('nonexistent', testDir)).toBe(false);
  });

  it('should return false for empty character', () => {
    expect(artifactExists('', testDir)).toBe(false);
  });

  it('should return false for null character', () => {
    expect(artifactExists(null as unknown as string, testDir)).toBe(false);
  });
});

// ============================================================================
// Generate Artifact Results
// ============================================================================

describe('Template Engine - Generate Artifact', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-gen-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate artifact for homer', () => {
    const artifact = generateArtifact('homer', 'test', testDir);
    expect(artifact).not.toBeNull();
  });

  it('should generate artifact for marge', () => {
    const artifact = generateArtifact('marge', 'test', testDir);
    expect(artifact).not.toBeNull();
  });

  it('should generate artifact for bart', () => {
    const artifact = generateArtifact('bart', 'test', testDir);
    expect(artifact).not.toBeNull();
  });

  it('should generate artifact for lisa', () => {
    const artifact = generateArtifact('lisa', 'test', testDir);
    expect(artifact).not.toBeNull();
  });

  it('should return null for invalid character', () => {
    const artifact = generateArtifact('invalid', 'test', testDir);
    expect(artifact).toBeNull();
  });
});

// ============================================================================
// CHARACTER_ARTIFACTS Mapping
// ============================================================================

describe('Template Engine - CHARACTER_ARTIFACTS', () => {
  it('should have homer artifact defined', () => {
    expect(CHARACTER_ARTIFACTS.homer).toBeDefined();
  });

  it('should have marge artifact defined', () => {
    expect(CHARACTER_ARTIFACTS.marge).toBeDefined();
  });

  it('should have bart artifact defined', () => {
    expect(CHARACTER_ARTIFACTS.bart).toBeDefined();
  });

  it('should have lisa artifact defined', () => {
    expect(CHARACTER_ARTIFACTS.lisa).toBeDefined();
  });

  it('should have all artifacts as strings', () => {
    for (const [char, artifact] of Object.entries(CHARACTER_ARTIFACTS)) {
      expect(typeof artifact).toBe('string');
    }
  });

  it('should have all artifacts ending with .md', () => {
    for (const [char, artifact] of Object.entries(CHARACTER_ARTIFACTS)) {
      expect(artifact.endsWith('.md')).toBe(true);
    }
  });
});

// ============================================================================
// Case Sensitivity
// ============================================================================

describe('Template Engine - Case Sensitivity', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-case-'));
    springfieldDir = path.join(testDir, '.springfield');
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should reject uppercase character name', () => {
    expect(generateArtifact('HOMER', 'test', testDir)).toBeNull();
  });

  it('should reject mixed case character name', () => {
    expect(generateArtifact('Homer', 'test', testDir)).toBeNull();
  });

  it('should accept lowercase character name', () => {
    expect(generateArtifact('homer', 'test', testDir)).not.toBeNull();
  });

  it('should reject uppercase in unknown character', () => {
    expect(generateArtifact('INVALID', 'test', testDir)).toBeNull();
  });

  it('should reject mixed case in unknown character', () => {
    expect(generateArtifact('Invalid', 'test', testDir)).toBeNull();
  });
});
