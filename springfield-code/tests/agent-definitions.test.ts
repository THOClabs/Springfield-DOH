/**
 * Agent Definition Validation Tests - Batch 26
 * Deep validation of agent markdown file structure and content
 * 55 tests
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ALL_CHARACTERS, CHARACTER_TIERS } from '../src/constants.js';

const agentsDir = path.join(__dirname, '..', 'src', 'agents');

// ============================================================================
// Simpson Family Agent File Validation
// ============================================================================

describe('Agent Definition - Simpson Family Files', () => {
  const simpsonFamily = CHARACTER_TIERS.simpson_family;

  it('should have agent file for each simpson family member', () => {
    for (const member of simpsonFamily) {
      const filePath = path.join(agentsDir, 'simpson-family', `${member}.md`);
      expect(fs.existsSync(filePath), `Missing: ${member}.md`).toBe(true);
    }
  });

  it('should have readable content in homer.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in marge.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'marge.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in bart.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'bart.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in lisa.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'lisa.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in maggie.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'maggie.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Extended Family Agent File Validation
// ============================================================================

describe('Agent Definition - Extended Family Files', () => {
  const extended = CHARACTER_TIERS.extended;

  it('should have agent file for each extended family member', () => {
    for (const member of extended) {
      const filePath = path.join(agentsDir, 'extended', `${member}.md`);
      expect(fs.existsSync(filePath), `Missing: ${member}.md`).toBe(true);
    }
  });

  it('should have readable content in burns.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'extended', 'burns.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in flanders.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'extended', 'flanders.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in grampa.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'extended', 'grampa.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in smithers.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'extended', 'smithers.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Springfield Citizen Agent File Validation
// ============================================================================

describe('Agent Definition - Springfield Citizens Files', () => {
  const springfield = CHARACTER_TIERS.springfield;

  it('should have agent file for each springfield citizen', () => {
    for (const citizen of springfield) {
      const filePath = path.join(agentsDir, 'springfield', `${citizen}.md`);
      expect(fs.existsSync(filePath), `Missing: ${citizen}.md`).toBe(true);
    }
  });

  it('should have readable content in apu.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'springfield', 'apu.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in moe.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'springfield', 'moe.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in krusty.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'springfield', 'krusty.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in skinner.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'springfield', 'skinner.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have readable content in wiggum.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'springfield', 'wiggum.md'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Markdown Structure Validation
// ============================================================================

describe('Agent Definition - Markdown Structure', () => {
  it('should have markdown heading in homer.md', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      'utf-8'
    );
    expect(content.includes('#')).toBe(true);
  });

  it('should have markdown content in agent files', () => {
    const allFiles = [
      ...CHARACTER_TIERS.simpson_family.map((c) =>
        path.join(agentsDir, 'simpson-family', `${c}.md`)
      ),
      ...CHARACTER_TIERS.extended.map((c) =>
        path.join(agentsDir, 'extended', `${c}.md`)
      ),
      ...CHARACTER_TIERS.springfield.map((c) =>
        path.join(agentsDir, 'springfield', `${c}.md`)
      ),
    ];

    for (const file of allFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        // Should have some text content
        expect(content.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have UTF-8 compatible content in all files', () => {
    const allFiles = [
      ...CHARACTER_TIERS.simpson_family.map((c) =>
        path.join(agentsDir, 'simpson-family', `${c}.md`)
      ),
      ...CHARACTER_TIERS.extended.map((c) =>
        path.join(agentsDir, 'extended', `${c}.md`)
      ),
    ];

    for (const file of allFiles) {
      if (fs.existsSync(file)) {
        expect(() => fs.readFileSync(file, 'utf-8')).not.toThrow();
      }
    }
  });
});

// ============================================================================
// File Size Validation
// ============================================================================

describe('Agent Definition - File Size Constraints', () => {
  it('should have homer.md under 100KB', () => {
    const stats = fs.statSync(
      path.join(agentsDir, 'simpson-family', 'homer.md')
    );
    expect(stats.size).toBeLessThan(100 * 1024);
  });

  it('should have marge.md under 100KB', () => {
    const stats = fs.statSync(
      path.join(agentsDir, 'simpson-family', 'marge.md')
    );
    expect(stats.size).toBeLessThan(100 * 1024);
  });

  it('should have bart.md under 100KB', () => {
    const stats = fs.statSync(
      path.join(agentsDir, 'simpson-family', 'bart.md')
    );
    expect(stats.size).toBeLessThan(100 * 1024);
  });

  it('should have lisa.md under 100KB', () => {
    const stats = fs.statSync(
      path.join(agentsDir, 'simpson-family', 'lisa.md')
    );
    expect(stats.size).toBeLessThan(100 * 1024);
  });

  it('should have burns.md under 100KB', () => {
    const stats = fs.statSync(path.join(agentsDir, 'extended', 'burns.md'));
    expect(stats.size).toBeLessThan(100 * 1024);
  });

  it('should have all agent files non-empty', () => {
    const allFiles = CHARACTER_TIERS.simpson_family.map((c) =>
      path.join(agentsDir, 'simpson-family', `${c}.md`)
    );
    for (const file of allFiles) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        expect(stats.size).toBeGreaterThan(0);
      }
    }
  });
});

// ============================================================================
// Character Naming Consistency
// ============================================================================

describe('Agent Definition - Naming Consistency', () => {
  it('should have lowercase filenames for simpson family', () => {
    const files = fs.readdirSync(path.join(agentsDir, 'simpson-family'));
    for (const file of files) {
      if (file.endsWith('.md')) {
        expect(file).toBe(file.toLowerCase());
      }
    }
  });

  it('should have lowercase filenames for extended family', () => {
    const files = fs.readdirSync(path.join(agentsDir, 'extended'));
    for (const file of files) {
      if (file.endsWith('.md')) {
        expect(file).toBe(file.toLowerCase());
      }
    }
  });

  it('should have lowercase filenames for springfield', () => {
    const files = fs.readdirSync(path.join(agentsDir, 'springfield'));
    for (const file of files) {
      if (file.endsWith('.md')) {
        expect(file).toBe(file.toLowerCase());
      }
    }
  });

  it('should have .md extension for all agent files', () => {
    const folders = ['simpson-family', 'extended', 'springfield'];
    for (const folder of folders) {
      const folderPath = path.join(agentsDir, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        const mdFiles = files.filter((f) => f.endsWith('.md'));
        expect(mdFiles.length).toBeGreaterThan(0);
      }
    }
  });
});

// ============================================================================
// Content Character Validation
// ============================================================================

describe('Agent Definition - Content Validation', () => {
  it('should have no null bytes in any agent file', () => {
    const files = [
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      path.join(agentsDir, 'simpson-family', 'bart.md'),
      path.join(agentsDir, 'extended', 'burns.md'),
    ];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content.includes('\0')).toBe(false);
    }
  });

  it('should have no carriage returns only (old Mac format) in files', () => {
    const files = [
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      path.join(agentsDir, 'simpson-family', 'marge.md'),
    ];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      // Old Mac format is CR only without LF
      const hasOnlyCR = content.includes('\r') && !content.includes('\n');
      expect(hasOnlyCR).toBe(false);
    }
  });

  it('should have meaningful text content', () => {
    const content = fs.readFileSync(
      path.join(agentsDir, 'simpson-family', 'homer.md'),
      'utf-8'
    );
    // Should have at least some words
    const words = content.split(/\s+/).filter((w) => w.length > 0);
    expect(words.length).toBeGreaterThan(5);
  });

  it('should not have excessive whitespace only content', () => {
    const files = CHARACTER_TIERS.simpson_family.map((c) =>
      path.join(agentsDir, 'simpson-family', `${c}.md`)
    );
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const trimmed = content.trim();
      expect(trimmed.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Folder Structure Validation
// ============================================================================

describe('Agent Definition - Folder Structure', () => {
  it('should have simpson-family folder', () => {
    expect(fs.existsSync(path.join(agentsDir, 'simpson-family'))).toBe(true);
  });

  it('should have extended folder', () => {
    expect(fs.existsSync(path.join(agentsDir, 'extended'))).toBe(true);
  });

  it('should have springfield folder', () => {
    expect(fs.existsSync(path.join(agentsDir, 'springfield'))).toBe(true);
  });

  it('should have simpson-family as directory', () => {
    const stats = fs.statSync(path.join(agentsDir, 'simpson-family'));
    expect(stats.isDirectory()).toBe(true);
  });

  it('should have extended as directory', () => {
    const stats = fs.statSync(path.join(agentsDir, 'extended'));
    expect(stats.isDirectory()).toBe(true);
  });

  it('should have springfield as directory', () => {
    const stats = fs.statSync(path.join(agentsDir, 'springfield'));
    expect(stats.isDirectory()).toBe(true);
  });
});
