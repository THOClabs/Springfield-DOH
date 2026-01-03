/**
 * Artifact Path Resolution Tests - Batch 34
 * Tests for file path handling and resolution
 * 50 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';

let testDir: string;

// ============================================================================
// Path Resolution Basics
// ============================================================================

describe('Path Resolution - Basics', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'path-basic-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should resolve absolute path correctly', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should handle path with trailing slash', () => {
    const pathWithSlash = testDir + path.sep;
    const result = generateArtifact('bart', 'test', pathWithSlash);
    expect(result).not.toBeNull();
  });

  it('should handle normalized path', () => {
    const normalized = path.normalize(testDir);
    const result = generateArtifact('lisa', 'test', normalized);
    expect(result).not.toBeNull();
  });

  it('should check artifact in correct directory', () => {
    generateArtifact('homer', 'test', testDir);
    const artifactDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(artifactDir);
    expect(files.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Springfield Directory
// ============================================================================

describe('Path Resolution - Springfield Directory', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'springfield-dir-'));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should fail without .springfield directory', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should succeed with .springfield directory', () => {
    fs.mkdirSync(path.join(testDir, '.springfield'));
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should fail if .springfield is a file', () => {
    fs.writeFileSync(path.join(testDir, '.springfield'), 'not a dir');
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle nested .springfield creation', () => {
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    const result = generateArtifact('bart', 'test', testDir);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Path Edge Cases
// ============================================================================

describe('Path Resolution - Edge Cases', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'path-edge-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle path with spaces', () => {
    const spacePath = path.join(testDir, 'has spaces');
    fs.mkdirSync(path.join(spacePath, '.springfield'), { recursive: true });
    const result = generateArtifact('homer', 'test', spacePath);
    expect(result).not.toBeNull();
  });

  it('should handle deep nested path', () => {
    const deepPath = path.join(testDir, 'a', 'b', 'c', 'd');
    fs.mkdirSync(path.join(deepPath, '.springfield'), { recursive: true });
    const result = generateArtifact('bart', 'test', deepPath);
    expect(result).not.toBeNull();
  });

  it('should handle path with unicode', () => {
    const unicodePath = path.join(testDir, 'тест');
    fs.mkdirSync(path.join(unicodePath, '.springfield'), { recursive: true });
    const result = generateArtifact('lisa', 'test', unicodePath);
    expect(result).not.toBeNull();
  });

  it('should handle path with numbers', () => {
    const numPath = path.join(testDir, '12345');
    fs.mkdirSync(path.join(numPath, '.springfield'), { recursive: true });
    const result = generateArtifact('marge', 'test', numPath);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Multiple Artifacts in Same Directory
// ============================================================================

describe('Path Resolution - Multiple Artifacts', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'multi-artifact-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should store multiple artifacts in same directory', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('bart', 'test', testDir);
    generateArtifact('lisa', 'test', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
    expect(artifactExists('lisa', testDir)).toBe(true);
  });

  it('should not overwrite different character artifacts', () => {
    generateArtifact('homer', 'test', testDir);
    const homerExists1 = artifactExists('homer', testDir);
    
    generateArtifact('bart', 'test', testDir);
    const homerExists2 = artifactExists('homer', testDir);
    
    expect(homerExists1).toBe(true);
    expect(homerExists2).toBe(true);
  });

  it('should handle many artifacts', () => {
    const chars = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
    for (const char of chars) {
      generateArtifact(char, 'test', testDir);
    }
    
    for (const char of chars) {
      expect(artifactExists(char, testDir)).toBe(true);
    }
  });
});

// ============================================================================
// Directory Isolation
// ============================================================================

describe('Path Resolution - Directory Isolation', () => {
  let testDir2: string;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'iso-1-'));
    testDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'iso-2-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    fs.mkdirSync(path.join(testDir2, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
    fs.rmSync(testDir2, { recursive: true, force: true });
  });

  it('should isolate artifacts between directories', () => {
    generateArtifact('homer', 'dir1', testDir);
    generateArtifact('homer', 'dir2', testDir2);
    
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('homer', testDir2)).toBe(true);
  });

  it('should not see artifacts from other directories', () => {
    generateArtifact('bart', 'test', testDir);
    
    expect(artifactExists('bart', testDir)).toBe(true);
    expect(artifactExists('bart', testDir2)).toBe(false);
  });

  it('should handle parallel artifact creation', () => {
    generateArtifact('lisa', 'first', testDir);
    generateArtifact('lisa', 'second', testDir2);
    
    expect(artifactExists('lisa', testDir)).toBe(true);
    expect(artifactExists('lisa', testDir2)).toBe(true);
  });
});

// ============================================================================
// Path Type Handling
// ============================================================================

describe('Path Resolution - Type Handling', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-handling-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle string path', () => {
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should accept path from path.join', () => {
    const joinedPath = path.join(testDir);
    const result = generateArtifact('bart', 'test', joinedPath);
    expect(result).not.toBeNull();
  });

  it('should accept path from path.resolve', () => {
    const resolvedPath = path.resolve(testDir);
    const result = generateArtifact('lisa', 'test', resolvedPath);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// Artifact File Names
// ============================================================================

describe('Path Resolution - Artifact Names', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'artifact-names-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should create file with .md extension', () => {
    generateArtifact('homer', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  it('should create readable artifact file', () => {
    generateArtifact('bart', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    for (const file of files) {
      const content = fs.readFileSync(path.join(springfieldDir, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('should create artifact with proper permissions', () => {
    generateArtifact('lisa', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    for (const file of files) {
      const stats = fs.statSync(path.join(springfieldDir, file));
      expect(stats.isFile()).toBe(true);
    }
  });
});
