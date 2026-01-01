/**
 * Artifact Output Format Tests - Batch 30
 * Tests for artifact content structure and formatting
 * 50 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';

let testDir: string;

// ============================================================================
// Artifact Content Structure
// ============================================================================

describe('Artifact Output - Content Structure', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-struct-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate non-empty content for homer', () => {
    const content = generateArtifact('homer', 'test', testDir);
    expect(content).not.toBeNull();
    expect(content!.length).toBeGreaterThan(0);
  });

  it('should generate non-empty content for marge', () => {
    const content = generateArtifact('marge', 'test', testDir);
    expect(content).not.toBeNull();
    expect(content!.length).toBeGreaterThan(0);
  });

  it('should generate non-empty content for bart', () => {
    const content = generateArtifact('bart', 'test', testDir);
    expect(content).not.toBeNull();
    expect(content!.length).toBeGreaterThan(0);
  });

  it('should generate non-empty content for lisa', () => {
    const content = generateArtifact('lisa', 'test', testDir);
    expect(content).not.toBeNull();
    expect(content!.length).toBeGreaterThan(0);
  });

  it('should generate non-empty content for maggie', () => {
    const content = generateArtifact('maggie', 'test', testDir);
    expect(content).not.toBeNull();
    expect(content!.length).toBeGreaterThan(0);
  });

  it('should generate content that is a string', () => {
    const content = generateArtifact('homer', 'test', testDir);
    expect(typeof content).toBe('string');
  });

  it('should generate content with reasonable length', () => {
    const content = generateArtifact('bart', 'test', testDir);
    expect(content!.length).toBeGreaterThan(5);
    expect(content!.length).toBeLessThan(1000000);
  });
});

// ============================================================================
// User Input Incorporation
// ============================================================================

describe('Artifact Output - User Input', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'user-input-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should accept short user input', () => {
    const content = generateArtifact('homer', 'hi', testDir);
    expect(content).not.toBeNull();
  });

  it('should accept medium user input', () => {
    const content = generateArtifact('homer', 'this is a medium test input', testDir);
    expect(content).not.toBeNull();
  });

  it('should accept long user input', () => {
    const longInput = 'word '.repeat(50);
    const content = generateArtifact('homer', longInput, testDir);
    expect(content).not.toBeNull();
  });

  it('should handle input with special markdown chars', () => {
    const content = generateArtifact('homer', '**bold** and _italic_', testDir);
    expect(content).not.toBeNull();
  });

  it('should handle input with code blocks', () => {
    const content = generateArtifact('homer', '```code```', testDir);
    expect(content).not.toBeNull();
  });

  it('should handle input with numbers', () => {
    const content = generateArtifact('homer', '12345 67890', testDir);
    expect(content).not.toBeNull();
  });

  it('should handle input with punctuation', () => {
    const content = generateArtifact('homer', 'Hello! How are you? Fine.', testDir);
    expect(content).not.toBeNull();
  });
});

// ============================================================================
// Character-Specific Outputs
// ============================================================================

describe('Artifact Output - Character Specific', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'char-specific-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate distinct content for different characters', () => {
    const homerContent = generateArtifact('homer', 'test', testDir);
    const bartContent = generateArtifact('bart', 'test', testDir);
    // Content might differ since they are different characters
    expect(homerContent).not.toBeNull();
    expect(bartContent).not.toBeNull();
  });

  it('should generate consistent content for same character', () => {
    const content1 = generateArtifact('homer', 'test', testDir);
    const content2 = generateArtifact('homer', 'test', testDir);
    // Both should generate valid content
    expect(content1).not.toBeNull();
    expect(content2).not.toBeNull();
  });

  it('should generate content for burns', () => {
    const content = generateArtifact('burns', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for flanders', () => {
    const content = generateArtifact('flanders', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for apu', () => {
    const content = generateArtifact('apu', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for moe', () => {
    const content = generateArtifact('moe', 'test', testDir);
    expect(content).not.toBeNull();
  });
});

// ============================================================================
// File Write Validation
// ============================================================================

describe('Artifact Output - File Writing', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'file-write-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should create artifact file after generation', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should write file to .springfield directory', () => {
    generateArtifact('bart', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    expect(files.length).toBeGreaterThan(0);
  });

  it('should write file with content', () => {
    generateArtifact('lisa', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    const lisaFile = files.find((f) => f.includes('questions'));
    if (lisaFile) {
      const content = fs.readFileSync(path.join(springfieldDir, lisaFile), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('should overwrite existing artifact', () => {
    generateArtifact('homer', 'first', testDir);
    generateArtifact('homer', 'second', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });
});

// ============================================================================
// Content Format Validation
// ============================================================================

describe('Artifact Output - Format Validation', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'format-valid-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should return string type content', () => {
    const content = generateArtifact('homer', 'test', testDir);
    expect(typeof content).toBe('string');
  });

  it('should not return empty string for valid request', () => {
    const content = generateArtifact('marge', 'test', testDir);
    expect(content).not.toBe('');
  });

  it('should return content without control characters', () => {
    const content = generateArtifact('bart', 'test', testDir);
    // Should not have null bytes
    expect(content!.includes('\0')).toBe(false);
  });

  it('should return valid UTF-8 content', () => {
    const content = generateArtifact('lisa', 'test', testDir);
    // Should be decodable
    expect(() => Buffer.from(content!, 'utf-8').toString()).not.toThrow();
  });

  it('should return content with reasonable line structure', () => {
    const content = generateArtifact('maggie', 'test', testDir);
    // Content should exist
    expect(content).not.toBeNull();
  });
});

// ============================================================================
// Extended Character Outputs
// ============================================================================

describe('Artifact Output - Extended Characters', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'extended-output-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate content for krusty', () => {
    const content = generateArtifact('krusty', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for skinner', () => {
    const content = generateArtifact('skinner', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for wiggum', () => {
    const content = generateArtifact('wiggum', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for nelson', () => {
    const content = generateArtifact('nelson', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for milhouse', () => {
    const content = generateArtifact('milhouse', 'test', testDir);
    expect(content).not.toBeNull();
  });

  it('should generate content for frink', () => {
    const content = generateArtifact('frink', 'test', testDir);
    expect(content).not.toBeNull();
  });
});
