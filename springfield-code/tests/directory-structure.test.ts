/**
 * Directory Structure Tests - Batch 23
 * File system layout and agent directory validation
 * 48 tests
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');
const AGENTS_DIR = path.join(SRC_DIR, 'agents');
const COMMANDS_DIR = path.join(SRC_DIR, 'commands');

// ============================================================================
// Core Directory Structure
// ============================================================================

describe('Directory Structure - Core', () => {
  it('should have src directory', () => {
    expect(fs.existsSync(SRC_DIR)).toBe(true);
  });

  it('should have agents directory', () => {
    expect(fs.existsSync(AGENTS_DIR)).toBe(true);
  });

  it('should have commands directory', () => {
    expect(fs.existsSync(COMMANDS_DIR)).toBe(true);
  });

  it('should have artifacts directory', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'artifacts'))).toBe(true);
  });

  it('should have hooks directory', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'hooks'))).toBe(true);
  });

  it('should have skills directory', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'skills'))).toBe(true);
  });
});

// ============================================================================
// Agent Subdirectories
// ============================================================================

describe('Directory Structure - Agent Folders', () => {
  it('should have simpson-family directory', () => {
    expect(fs.existsSync(path.join(AGENTS_DIR, 'simpson-family'))).toBe(true);
  });

  it('should have extended directory', () => {
    expect(fs.existsSync(path.join(AGENTS_DIR, 'extended'))).toBe(true);
  });

  it('should have springfield directory', () => {
    expect(fs.existsSync(path.join(AGENTS_DIR, 'springfield'))).toBe(true);
  });
});

// ============================================================================
// Simpson Family Agent Files
// ============================================================================

describe('Directory Structure - Simpson Family Files', () => {
  const simpsonDir = path.join(AGENTS_DIR, 'simpson-family');

  it('should have homer.md', () => {
    expect(fs.existsSync(path.join(simpsonDir, 'homer.md'))).toBe(true);
  });

  it('should have marge.md', () => {
    expect(fs.existsSync(path.join(simpsonDir, 'marge.md'))).toBe(true);
  });

  it('should have bart.md', () => {
    expect(fs.existsSync(path.join(simpsonDir, 'bart.md'))).toBe(true);
  });

  it('should have lisa.md', () => {
    expect(fs.existsSync(path.join(simpsonDir, 'lisa.md'))).toBe(true);
  });

  it('should have maggie.md', () => {
    expect(fs.existsSync(path.join(simpsonDir, 'maggie.md'))).toBe(true);
  });
});

// ============================================================================
// Extended Family Agent Files
// ============================================================================

describe('Directory Structure - Extended Family Files', () => {
  const extendedDir = path.join(AGENTS_DIR, 'extended');

  it('should have grampa.md', () => {
    expect(fs.existsSync(path.join(extendedDir, 'grampa.md'))).toBe(true);
  });

  it('should have flanders.md', () => {
    expect(fs.existsSync(path.join(extendedDir, 'flanders.md'))).toBe(true);
  });

  it('should have burns.md', () => {
    expect(fs.existsSync(path.join(extendedDir, 'burns.md'))).toBe(true);
  });

  it('should have smithers.md', () => {
    expect(fs.existsSync(path.join(extendedDir, 'smithers.md'))).toBe(true);
  });
});

// ============================================================================
// Springfield Agent Files
// ============================================================================

describe('Directory Structure - Springfield Files', () => {
  const springfieldDir = path.join(AGENTS_DIR, 'springfield');

  it('should have apu.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'apu.md'))).toBe(true);
  });

  it('should have moe.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'moe.md'))).toBe(true);
  });

  it('should have krusty.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'krusty.md'))).toBe(true);
  });

  it('should have wiggum.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'wiggum.md'))).toBe(true);
  });

  it('should have skinner.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'skinner.md'))).toBe(true);
  });

  it('should have willie.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'willie.md'))).toBe(true);
  });

  it('should have nelson.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'nelson.md'))).toBe(true);
  });

  it('should have milhouse.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'milhouse.md'))).toBe(true);
  });

  it('should have ralph.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'ralph.md'))).toBe(true);
  });

  it('should have cbg.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'cbg.md'))).toBe(true);
  });

  it('should have frink.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'frink.md'))).toBe(true);
  });

  it('should have bob.md', () => {
    expect(fs.existsSync(path.join(springfieldDir, 'bob.md'))).toBe(true);
  });
});

// ============================================================================
// Command Files
// ============================================================================

describe('Directory Structure - Command Files', () => {
  it('should have homer.ts command', () => {
    expect(fs.existsSync(path.join(COMMANDS_DIR, 'homer.ts'))).toBe(true);
  });

  it('should have marge.ts command', () => {
    expect(fs.existsSync(path.join(COMMANDS_DIR, 'marge.ts'))).toBe(true);
  });

  it('should have bart.ts command', () => {
    expect(fs.existsSync(path.join(COMMANDS_DIR, 'bart.ts'))).toBe(true);
  });

  it('should have lisa.ts command', () => {
    expect(fs.existsSync(path.join(COMMANDS_DIR, 'lisa.ts'))).toBe(true);
  });

  it('should have summon.ts command', () => {
    expect(fs.existsSync(path.join(COMMANDS_DIR, 'summon.ts'))).toBe(true);
  });

  it('should have springfield.ts command', () => {
    expect(fs.existsSync(path.join(COMMANDS_DIR, 'springfield.ts'))).toBe(true);
  });
});

// ============================================================================
// Core Source Files
// ============================================================================

describe('Directory Structure - Source Files', () => {
  it('should have constants.ts', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'constants.ts'))).toBe(true);
  });

  it('should have index.ts', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'index.ts'))).toBe(true);
  });

  it('should have ralph-gate.ts in hooks', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'hooks', 'ralph-gate.ts'))).toBe(true);
  });

  it('should have generator.ts in artifacts', () => {
    expect(fs.existsSync(path.join(SRC_DIR, 'artifacts', 'generator.ts'))).toBe(true);
  });
});

// ============================================================================
// File Content Validation
// ============================================================================

describe('Directory Structure - File Content', () => {
  it('should have non-empty constants.ts', () => {
    const content = fs.readFileSync(path.join(SRC_DIR, 'constants.ts'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have non-empty index.ts', () => {
    const content = fs.readFileSync(path.join(SRC_DIR, 'index.ts'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have non-empty homer.md', () => {
    const content = fs.readFileSync(path.join(AGENTS_DIR, 'simpson-family', 'homer.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have springfield.md in skills', () => {
    const skillsPath = path.join(SRC_DIR, 'skills', 'springfield.md');
    expect(fs.existsSync(skillsPath)).toBe(true);
  });
});
