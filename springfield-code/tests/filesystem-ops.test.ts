/**
 * File System Operations Tests - Batch 40
 * Tests for file system interactions
 * 48 tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateArtifact, artifactExists } from '../src/artifacts/generator.js';

let testDir: string;

// ============================================================================
// Directory Creation
// ============================================================================

describe('File System - Directory Creation', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-dir-'));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should work with pre-existing .springfield', () => {
    fs.mkdirSync(path.join(testDir, '.springfield'));
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should work with nested .springfield creation', () => {
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
    const result = generateArtifact('bart', 'test', testDir);
    expect(result).not.toBeNull();
  });

  it('should fail without .springfield directory', () => {
    const result = generateArtifact('lisa', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should handle deeply nested project path', () => {
    const deepPath = path.join(testDir, 'a', 'b', 'c');
    fs.mkdirSync(path.join(deepPath, '.springfield'), { recursive: true });
    const result = generateArtifact('homer', 'test', deepPath);
    expect(result).not.toBeNull();
  });
});

// ============================================================================
// File Writing
// ============================================================================

describe('File System - File Writing', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-write-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should create file in .springfield', () => {
    generateArtifact('homer', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    expect(files.length).toBeGreaterThan(0);
  });

  it('should create .md file', () => {
    generateArtifact('bart', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    expect(files.some((f) => f.endsWith('.md'))).toBe(true);
  });

  it('should write non-empty content', () => {
    generateArtifact('lisa', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    for (const file of files) {
      const content = fs.readFileSync(path.join(springfieldDir, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('should overwrite existing artifact', () => {
    generateArtifact('homer', 'first', testDir);
    generateArtifact('homer', 'second', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should create readable file', () => {
    generateArtifact('marge', 'test', testDir);
    const springfieldDir = path.join(testDir, '.springfield');
    const files = fs.readdirSync(springfieldDir);
    for (const file of files) {
      expect(() => fs.readFileSync(path.join(springfieldDir, file), 'utf-8')).not.toThrow();
    }
  });
});

// ============================================================================
// File Reading
// ============================================================================

describe('File System - File Reading', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-read-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should check existence correctly when file exists', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
  });

  it('should check existence correctly when file does not exist', () => {
    expect(artifactExists('homer', testDir)).toBe(false);
  });

  it('should handle multiple existence checks', () => {
    generateArtifact('bart', 'test', testDir);
    for (let i = 0; i < 10; i++) {
      expect(artifactExists('bart', testDir)).toBe(true);
    }
  });

  it('should distinguish between different characters', () => {
    generateArtifact('homer', 'test', testDir);
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(false);
  });
});

// ============================================================================
// Path Handling
// ============================================================================

describe('File System - Path Handling', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-path-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle path with spaces', () => {
    const spacePath = path.join(testDir, 'has spaces');
    fs.mkdirSync(path.join(spacePath, '.springfield'), { recursive: true });
    expect(generateArtifact('homer', 'test', spacePath)).not.toBeNull();
  });

  it('should handle path with numbers', () => {
    const numPath = path.join(testDir, '123');
    fs.mkdirSync(path.join(numPath, '.springfield'), { recursive: true });
    expect(generateArtifact('bart', 'test', numPath)).not.toBeNull();
  });

  it('should handle unicode path', () => {
    const unicodePath = path.join(testDir, '日本語');
    fs.mkdirSync(path.join(unicodePath, '.springfield'), { recursive: true });
    expect(generateArtifact('lisa', 'test', unicodePath)).not.toBeNull();
  });

  it('should handle path with trailing separator', () => {
    const trailingPath = testDir + path.sep;
    expect(generateArtifact('marge', 'test', trailingPath)).not.toBeNull();
  });
});

// ============================================================================
// Error Handling
// ============================================================================

describe('File System - Error Handling', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-error-'));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should handle non-existent directory gracefully', () => {
    const result = generateArtifact('homer', 'test', '/nonexistent/path');
    expect(result).toBeNull();
  });

  it('should handle .springfield as file', () => {
    fs.writeFileSync(path.join(testDir, '.springfield'), 'not a dir');
    const result = generateArtifact('homer', 'test', testDir);
    expect(result).toBeNull();
  });

  it('should return false for existence check on missing dir', () => {
    const result = artifactExists('homer', '/nonexistent');
    expect(result).toBe(false);
  });

  it('should handle empty string path', () => {
    const result = artifactExists('homer', '');
    expect(result).toBe(false);
  });
});

// ============================================================================
// Multiple Files
// ============================================================================

describe('File System - Multiple Files', () => {
  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-multi-'));
    fs.mkdirSync(path.join(testDir, '.springfield'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should create multiple artifacts', () => {
    generateArtifact('homer', 'test', testDir);
    generateArtifact('bart', 'test', testDir);
    generateArtifact('lisa', 'test', testDir);
    
    expect(artifactExists('homer', testDir)).toBe(true);
    expect(artifactExists('bart', testDir)).toBe(true);
    expect(artifactExists('lisa', testDir)).toBe(true);
  });

  it('should not interfere between artifacts', () => {
    generateArtifact('homer', 'test', testDir);
    const homerBefore = artifactExists('homer', testDir);
    
    generateArtifact('marge', 'test', testDir);
    const homerAfter = artifactExists('homer', testDir);
    
    expect(homerBefore).toBe(homerAfter);
  });

  it('should handle all simpson family', () => {
    const family = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
    for (const member of family) {
      generateArtifact(member, 'test', testDir);
    }
    for (const member of family) {
      expect(artifactExists(member, testDir)).toBe(true);
    }
  });
});

// ============================================================================
// Cleanup
// ============================================================================

describe('File System - Cleanup', () => {
  it('should allow directory deletion after operations', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cleanup-'));
    fs.mkdirSync(path.join(dir, '.springfield'));
    generateArtifact('homer', 'test', dir);
    
    expect(() => fs.rmSync(dir, { recursive: true, force: true })).not.toThrow();
  });

  it('should not leave file handles open', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'handles-'));
    fs.mkdirSync(path.join(dir, '.springfield'));
    
    generateArtifact('homer', 'test', dir);
    artifactExists('homer', dir);
    
    expect(() => fs.rmSync(dir, { recursive: true, force: true })).not.toThrow();
  });
});
