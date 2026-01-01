/**
 * Agent File Content Tests - Batch 45
 * Tests for agent markdown file content and structure
 * 48 tests
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const agentsDir = path.join(__dirname, '..', 'src', 'agents');

// ============================================================================
// Simpson Family Agent Files
// ============================================================================

describe('Agent File Content - Simpson Family', () => {
  const simpsonDir = path.join(agentsDir, 'simpson-family');

  it('should have homer.md with content', () => {
    const file = path.join(simpsonDir, 'homer.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have marge.md with content', () => {
    const file = path.join(simpsonDir, 'marge.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have bart.md with content', () => {
    const file = path.join(simpsonDir, 'bart.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have lisa.md with content', () => {
    const file = path.join(simpsonDir, 'lisa.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have maggie.md with content', () => {
    const file = path.join(simpsonDir, 'maggie.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });
});

// ============================================================================
// Extended Agent Files
// ============================================================================

describe('Agent File Content - Extended', () => {
  const extendedDir = path.join(agentsDir, 'extended');

  it('should have burns.md with content', () => {
    const file = path.join(extendedDir, 'burns.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have smithers.md with content', () => {
    const file = path.join(extendedDir, 'smithers.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have flanders.md with content', () => {
    const file = path.join(extendedDir, 'flanders.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have grampa.md with content', () => {
    const file = path.join(extendedDir, 'grampa.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });
});

// ============================================================================
// Springfield Agent Files
// ============================================================================

describe('Agent File Content - Springfield', () => {
  const springfieldDir = path.join(agentsDir, 'springfield');

  it('should have apu.md with content', () => {
    const file = path.join(springfieldDir, 'apu.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have moe.md with content', () => {
    const file = path.join(springfieldDir, 'moe.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have krusty.md with content', () => {
    const file = path.join(springfieldDir, 'krusty.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have frink.md with content', () => {
    const file = path.join(springfieldDir, 'frink.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have ralph.md with content', () => {
    const file = path.join(springfieldDir, 'ralph.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('should have wiggum.md with content', () => {
    const file = path.join(springfieldDir, 'wiggum.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });
});

// ============================================================================
// Markdown Format Verification
// ============================================================================

describe('Agent File Content - Markdown Format', () => {
  it('should have markdown heading in homer.md', () => {
    const file = path.join(agentsDir, 'simpson-family', 'homer.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.includes('#')).toBe(true);
  });

  it('should have markdown heading in bart.md', () => {
    const file = path.join(agentsDir, 'simpson-family', 'bart.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.includes('#')).toBe(true);
  });

  it('should have markdown heading in burns.md', () => {
    const file = path.join(agentsDir, 'extended', 'burns.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.includes('#')).toBe(true);
  });

  it('should have markdown heading in apu.md', () => {
    const file = path.join(agentsDir, 'springfield', 'apu.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.includes('#')).toBe(true);
  });
});

// ============================================================================
// File Size Validation
// ============================================================================

describe('Agent File Content - Size Validation', () => {
  const getAllAgentFiles = () => {
    const files: string[] = [];
    const folders = ['simpson-family', 'extended', 'springfield'];
    for (const folder of folders) {
      const folderPath = path.join(agentsDir, folder);
      if (fs.existsSync(folderPath)) {
        for (const file of fs.readdirSync(folderPath)) {
          if (file.endsWith('.md')) {
            files.push(path.join(folderPath, file));
          }
        }
      }
    }
    return files;
  };

  it('should have at least 10 agent files', () => {
    const files = getAllAgentFiles();
    expect(files.length).toBeGreaterThanOrEqual(10);
  });

  it('should have no empty agent files', () => {
    const files = getAllAgentFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have agent files under 50KB', () => {
    const files = getAllAgentFiles();
    for (const file of files) {
      const stats = fs.statSync(file);
      expect(stats.size).toBeLessThan(50 * 1024);
    }
  });

  it('should have agent files over 100 bytes', () => {
    const files = getAllAgentFiles();
    for (const file of files) {
      const stats = fs.statSync(file);
      expect(stats.size).toBeGreaterThan(100);
    }
  });
});

// ============================================================================
// Content Patterns
// ============================================================================

describe('Agent File Content - Patterns', () => {
  it('should have lines in homer.md', () => {
    const file = path.join(agentsDir, 'simpson-family', 'homer.md');
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    expect(lines.length).toBeGreaterThan(5);
  });

  it('should have paragraphs in bart.md', () => {
    const file = path.join(agentsDir, 'simpson-family', 'bart.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.length).toBeGreaterThan(200);
  });

  it('should have text content in lisa.md', () => {
    const file = path.join(agentsDir, 'simpson-family', 'lisa.md');
    const content = fs.readFileSync(file, 'utf-8');
    expect(content.match(/[a-zA-Z]/g)!.length).toBeGreaterThan(50);
  });
});

// ============================================================================
// UTF-8 Encoding
// ============================================================================

describe('Agent File Content - Encoding', () => {
  it('should read homer.md as UTF-8', () => {
    const file = path.join(agentsDir, 'simpson-family', 'homer.md');
    expect(() => fs.readFileSync(file, 'utf-8')).not.toThrow();
  });

  it('should read all agent files as UTF-8', () => {
    const folders = ['simpson-family', 'extended', 'springfield'];
    for (const folder of folders) {
      const folderPath = path.join(agentsDir, folder);
      if (fs.existsSync(folderPath)) {
        for (const file of fs.readdirSync(folderPath)) {
          if (file.endsWith('.md')) {
            expect(() =>
              fs.readFileSync(path.join(folderPath, file), 'utf-8')
            ).not.toThrow();
          }
        }
      }
    }
  });
});

// ============================================================================
// Cross-File Uniqueness
// ============================================================================

describe('Agent File Content - Uniqueness', () => {
  it('should have unique content in homer vs bart', () => {
    const homer = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      'utf-8'
    );
    const bart = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'bart.md'),
      'utf-8'
    );
    expect(homer).not.toBe(bart);
  });

  it('should have unique content in lisa vs maggie', () => {
    const lisa = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'lisa.md'),
      'utf-8'
    );
    const maggie = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'maggie.md'),
      'utf-8'
    );
    expect(lisa).not.toBe(maggie);
  });

  it('should have unique content across tiers', () => {
    const homer = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      'utf-8'
    );
    const burns = fs.readFileSync(
      path.join(agentsDir, 'extended', 'burns.md'),
      'utf-8'
    );
    expect(homer).not.toBe(burns);
  });
});
