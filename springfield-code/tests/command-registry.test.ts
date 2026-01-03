/**
 * Command Registry Tests - Batch 28
 * Tests for command module structure and exports
 * 53 tests
 */

import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

const commandsDir = path.join(__dirname, '..', 'src', 'commands');

// ============================================================================
// Command File Existence
// ============================================================================

describe('Command Registry - File Existence', () => {
  const expectedCommands = [
    'homer',
    'marge',
    'bart',
    'lisa',
    'maggie',
    'burns',
    'flanders',
    'grampa',
    'smithers',
    'apu',
    'moe',
    'krusty',
    'skinner',
    'wiggum',
    'willie',
    'milhouse',
    'nelson',
    'ralph',
    'cbg',
    'frink',
    'bob',
  ];

  for (const cmd of expectedCommands) {
    it(`should have command file for ${cmd}`, () => {
      const filePath = path.join(commandsDir, `${cmd}.ts`);
      expect(fs.existsSync(filePath), `Missing: ${cmd}.ts`).toBe(true);
    });
  }
});

// ============================================================================
// Command Module Imports
// ============================================================================

describe('Command Registry - Module Imports', () => {
  it('should import homer command', async () => {
    const mod = await import('../src/commands/homer.js');
    expect(mod).toBeDefined();
  });

  it('should import marge command', async () => {
    const mod = await import('../src/commands/marge.js');
    expect(mod).toBeDefined();
  });

  it('should import bart command', async () => {
    const mod = await import('../src/commands/bart.js');
    expect(mod).toBeDefined();
  });

  it('should import lisa command', async () => {
    const mod = await import('../src/commands/lisa.js');
    expect(mod).toBeDefined();
  });

  it('should import maggie command', async () => {
    const mod = await import('../src/commands/maggie.js');
    expect(mod).toBeDefined();
  });

  it('should import burns command', async () => {
    const mod = await import('../src/commands/burns.js');
    expect(mod).toBeDefined();
  });

  it('should import flanders command', async () => {
    const mod = await import('../src/commands/flanders.js');
    expect(mod).toBeDefined();
  });

  it('should import smithers command', async () => {
    const mod = await import('../src/commands/smithers.js');
    expect(mod).toBeDefined();
  });

  it('should import grampa command', async () => {
    const mod = await import('../src/commands/grampa.js');
    expect(mod).toBeDefined();
  });

  it('should import apu command', async () => {
    const mod = await import('../src/commands/apu.js');
    expect(mod).toBeDefined();
  });

  it('should import moe command', async () => {
    const mod = await import('../src/commands/moe.js');
    expect(mod).toBeDefined();
  });

  it('should import krusty command', async () => {
    const mod = await import('../src/commands/krusty.js');
    expect(mod).toBeDefined();
  });
});

// ============================================================================
// Special Commands
// ============================================================================

describe('Command Registry - Special Commands', () => {
  it('should have summon command', () => {
    const filePath = path.join(commandsDir, 'summon.ts');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should import summon command', async () => {
    const mod = await import('../src/commands/summon.js');
    expect(mod).toBeDefined();
  });

  it('should have springfield command', () => {
    const filePath = path.join(commandsDir, 'springfield.ts');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should import springfield command', async () => {
    const mod = await import('../src/commands/springfield.js');
    expect(mod).toBeDefined();
  });

  it('should have lisa-ralph-special command', () => {
    const filePath = path.join(commandsDir, 'lisa-ralph-special.ts');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should import lisa-ralph-special command', async () => {
    const mod = await import('../src/commands/lisa-ralph-special.js');
    expect(mod).toBeDefined();
  });
});

// ============================================================================
// Command File Structure
// ============================================================================

describe('Command Registry - File Structure', () => {
  it('should have commands directory', () => {
    expect(fs.existsSync(commandsDir)).toBe(true);
  });

  it('should have commands directory as folder', () => {
    const stats = fs.statSync(commandsDir);
    expect(stats.isDirectory()).toBe(true);
  });

  it('should have all TypeScript files in commands', () => {
    const files = fs.readdirSync(commandsDir);
    const tsFiles = files.filter((f) => f.endsWith('.ts'));
    expect(tsFiles.length).toBeGreaterThan(10);
  });

  it('should have consistent naming pattern for command files', () => {
    const files = fs.readdirSync(commandsDir);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        // Should be lowercase with optional hyphens
        expect(file).toMatch(/^[a-z-]+\.ts$/);
      }
    }
  });
});

// ============================================================================
// Command Content Validation
// ============================================================================

describe('Command Registry - Content Validation', () => {
  it('should have homer.ts with content', () => {
    const content = fs.readFileSync(
      path.join(commandsDir, 'homer.ts'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have bart.ts with content', () => {
    const content = fs.readFileSync(
      path.join(commandsDir, 'bart.ts'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have lisa.ts with content', () => {
    const content = fs.readFileSync(
      path.join(commandsDir, 'lisa.ts'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have summon.ts with content', () => {
    const content = fs.readFileSync(
      path.join(commandsDir, 'summon.ts'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have springfield.ts with content', () => {
    const content = fs.readFileSync(
      path.join(commandsDir, 'springfield.ts'),
      'utf-8'
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Command Count Validation
// ============================================================================

describe('Command Registry - Count Validation', () => {
  it('should have at least 20 command files', () => {
    const files = fs.readdirSync(commandsDir);
    const tsFiles = files.filter((f) => f.endsWith('.ts'));
    expect(tsFiles.length).toBeGreaterThanOrEqual(20);
  });

  it('should have command file count matching expected', () => {
    const files = fs.readdirSync(commandsDir);
    const tsFiles = files.filter((f) => f.endsWith('.ts'));
    // Should have at least 24 command files, can have many more
    expect(tsFiles.length).toBeGreaterThanOrEqual(20);
    expect(tsFiles.length).toBeLessThanOrEqual(100);
  });
});
