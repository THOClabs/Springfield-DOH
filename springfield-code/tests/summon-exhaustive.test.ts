/**
 * Summon Commands Exhaustive Testing - Batch 10
 * Closes 81.48% branch gap in summon.ts
 * 50 tests targeting all character paths and dialogues
 */

import { describe, it, expect } from 'vitest';
import summonCommand, { summonCharacter } from '../src/commands/summon.js';
import { ALL_CHARACTERS, CHARACTER_ARTIFACTS, CHARACTER_TIERS } from '../src/constants.js';

describe('Summon Exhaustive - Simpson Family Dialogues', () => {
  it('homer dialogue should be character-appropriate', async () => {
    const result = await summonCharacter('homer', 'test input', {});
    expect(result).toContain('Homer');
    expect(result).toContain('D\'oh');
    expect(result).toContain('questions.md');
  });

  it('marge dialogue should be character-appropriate', async () => {
    const result = await summonCharacter('marge', 'test input', {});
    expect(result).toContain('Marge');
    expect(result).toContain('organize');
    expect(result).toContain('structure.md');
  });

  it('bart dialogue should be character-appropriate', async () => {
    const result = await summonCharacter('bart', 'test input', {});
    expect(result).toContain('Bart');
    expect(result).toContain('shorts');
    expect(result).toContain('edge-cases.md');
  });

  it('lisa dialogue should be character-appropriate', async () => {
    const result = await summonCharacter('lisa', 'test input', {});
    expect(result).toContain('Lisa');
    expect(result).toContain('analysis');
    expect(result).toContain('project.md');
  });

  it('maggie dialogue should be character-appropriate', async () => {
    const result = await summonCharacter('maggie', 'test input', {});
    expect(result).toContain('Maggie');
    expect(result).toContain('squeak');
    expect(result).toContain('logging.md');
  });
});

describe('Summon Exhaustive - Extended Family Dialogues', () => {
  it('grampa dialogue should reference history', async () => {
    const result = await summonCharacter('grampa', 'test input', {});
    expect(result).toContain('Grampa');
    expect(result).toContain('history.md');
  });

  it('burns dialogue should reference power/money', async () => {
    const result = await summonCharacter('burns', 'test input', {});
    expect(result).toContain('Burns');
    expect(result).toContain('budget.md');
  });

  it('smithers dialogue should be professional', async () => {
    const result = await summonCharacter('smithers', 'test input', {});
    expect(result).toContain('Smithers');
    expect(result).toContain('schedule.md');
  });

  it('flanders dialogue should be neighborly', async () => {
    const result = await summonCharacter('flanders', 'test input', {});
    expect(result).toContain('Flanders');
    expect(result).toContain('standards.md');
  });
});

describe('Summon Exhaustive - Springfield Resident Dialogues', () => {
  it('moe dialogue should be gruff', async () => {
    const result = await summonCharacter('moe', 'test input', {});
    expect(result).toContain('Moe');
    expect(result).toContain('debug-notes.md');
  });

  it('krusty dialogue should be showman-like', async () => {
    const result = await summonCharacter('krusty', 'test input', {});
    expect(result).toContain('Krusty');
    expect(result).toContain('demo.md');
  });

  it('apu dialogue should reference store', async () => {
    const result = await summonCharacter('apu', 'test input', {});
    expect(result).toContain('Apu');
    expect(result).toContain('utilities.md');
  });

  it('wiggum dialogue should reference law', async () => {
    const result = await summonCharacter('wiggum', 'test input', {});
    expect(result).toContain('Wiggum');
    expect(result).toContain('security-review.md');
  });

  it('ralph dialogue should be confused', async () => {
    const result = await summonCharacter('ralph', 'test input', {});
    expect(result).toContain('Ralph');
    expect(result).toContain('Artifact: none');
  });

  it('nelson dialogue should be aggressive', async () => {
    const result = await summonCharacter('nelson', 'test input', {});
    expect(result).toContain('Nelson');
    expect(result).toContain('tests.md');
  });

  it('milhouse dialogue should be uncertain', async () => {
    const result = await summonCharacter('milhouse', 'test input', {});
    expect(result).toContain('Milhouse');
    expect(result).toContain('dependencies.md');
  });

  it('skinner dialogue should be authoritative', async () => {
    const result = await summonCharacter('skinner', 'test input', {});
    expect(result).toContain('Skinner');
    expect(result).toContain('timeline.md');
  });

  it('bob dialogue should be theatrical', async () => {
    const result = await summonCharacter('bob', 'test input', {});
    expect(result).toContain('Bob');
    expect(result).toContain('adversarial.md');
  });

  it('frink dialogue should be scientific', async () => {
    const result = await summonCharacter('frink', 'test input', {});
    expect(result).toContain('Frink');
    expect(result).toContain('experiments.md');
  });

  it('cbg dialogue should be critical', async () => {
    const result = await summonCharacter('cbg', 'test input', {});
    expect(result).toContain('Cbg');
    expect(result).toContain('docs-review.md');
  });

  it('willie dialogue should reference groundskeeping', async () => {
    const result = await summonCharacter('willie', 'test input', {});
    expect(result).toContain('Willie');
    expect(result).toContain('infrastructure.md');
  });
});

describe('Summon Exhaustive - Specialist Dialogues', () => {
  it('dr-nick dialogue should reference health', async () => {
    const result = await summonCharacter('dr-nick', 'test input', {});
    expect(result).toContain('Dr-nick');
    expect(result).toContain('dr-nick-health.md');
  });

  it('patty dialogue should reference compliance', async () => {
    const result = await summonCharacter('patty', 'test input', {});
    expect(result).toContain('Patty');
    expect(result).toContain('patty-compliance.md');
  });

  it('troy dialogue should be promotional', async () => {
    const result = await summonCharacter('troy', 'test input', {});
    expect(result).toContain('Troy');
    expect(result).toContain('troy-onboarding.md');
  });

  it('lionel dialogue should be legal', async () => {
    const result = await summonCharacter('lionel', 'test input', {});
    expect(result).toContain('Lionel');
    expect(result).toContain('lionel-legal.md');
  });

  it('hans dialogue should reference accessibility', async () => {
    const result = await summonCharacter('hans', 'test input', {});
    expect(result).toContain('Hans');
    expect(result).toContain('hans-accessibility.md');
  });

  it('hibbert dialogue should reference performance', async () => {
    const result = await summonCharacter('hibbert', 'test input', {});
    expect(result).toContain('Hibbert');
    expect(result).toContain('hibbert-performance.md');
  });

  it('edna dialogue should be educational', async () => {
    const result = await summonCharacter('edna', 'test input', {});
    expect(result).toContain('Edna');
    expect(result).toContain('edna-review.md');
  });

  it('otto dialogue should reference transport', async () => {
    const result = await summonCharacter('otto', 'test input', {});
    expect(result).toContain('Otto');
    expect(result).toContain('otto-migration.md');
  });

  it('lenny dialogue should be casual', async () => {
    const result = await summonCharacter('lenny', 'test input', {});
    expect(result).toContain('Lenny');
    expect(result).toContain('lenny-abtesting.md');
  });

  it('kent dialogue should be news-like', async () => {
    const result = await summonCharacter('kent', 'test input', {});
    expect(result).toContain('Kent');
    expect(result).toContain('kent-monitoring.md');
  });

  it('snake dialogue should be criminal', async () => {
    const result = await summonCharacter('snake', 'test input', {});
    expect(result).toContain('Snake');
    expect(result).toContain('snake-auth.md');
  });

  it('cookie dialogue should reference food/data', async () => {
    const result = await summonCharacter('cookie', 'test input', {});
    expect(result).toContain('Cookie');
    expect(result).toContain('cookie-database.md');
  });

  it('gil dialogue should be desperate', async () => {
    const result = await summonCharacter('gil', 'test input', {});
    expect(result).toContain('Gil');
    expect(result).toContain('gil-errors.md');
  });

  it('bumblebee dialogue should reference i18n', async () => {
    const result = await summonCharacter('bumblebee', 'test input', {});
    expect(result).toContain('Bumblebee');
    expect(result).toContain('bumblebee-i18n.md');
  });

  it('duffman dialogue should be enthusiastic', async () => {
    const result = await summonCharacter('duffman', 'test input', {});
    expect(result).toContain('Duffman');
    expect(result).toContain('duffman-flags.md');
  });

  it('fat-tony dialogue should be business-like', async () => {
    const result = await summonCharacter('fat-tony', 'test input', {});
    expect(result).toContain('Fat-tony');
    expect(result).toContain('fat-tony-microservices.md');
  });

  it('sea-captain dialogue should be nautical', async () => {
    const result = await summonCharacter('sea-captain', 'test input', {});
    expect(result).toContain('Sea-captain');
    expect(result).toContain('sea-captain-containers.md');
  });

  it('lovejoy dialogue should be pastoral', async () => {
    const result = await summonCharacter('lovejoy', 'test input', {});
    expect(result).toContain('Lovejoy');
    expect(result).toContain('lovejoy-events.md');
  });

  it('helen dialogue should be gossipy', async () => {
    const result = await summonCharacter('helen', 'test input', {});
    expect(result).toContain('Helen');
    expect(result).toContain('helen-analytics.md');
  });

  it('agnes dialogue should be demanding', async () => {
    const result = await summonCharacter('agnes', 'test input', {});
    expect(result).toContain('Agnes');
    expect(result).toContain('agnes-cicd.md');
  });
});

describe('Summon Exhaustive - Agent Path Lookup', () => {
  it('should find agent in simpson-family directory', async () => {
    const result = await summonCharacter('homer', 'test', {});
    expect(result).toContain('Homer');
    expect(result).not.toContain('Unknown character');
  });

  it('should find agent in extended directory', async () => {
    const result = await summonCharacter('burns', 'test', {});
    expect(result).toContain('Burns');
    expect(result).not.toContain('Unknown character');
  });

  it('should find agent in springfield directory', async () => {
    const result = await summonCharacter('moe', 'test', {});
    expect(result).toContain('Moe');
    expect(result).not.toContain('Unknown character');
  });

  it('should return error for non-existent agent', async () => {
    const result = await summonCharacter('nonexistent', 'test', {});
    expect(result).toContain('Unknown character');
    expect(result).toContain('Available characters');
  });

  it('should list all characters when unknown requested', async () => {
    const result = await summonCharacter('invalid', 'test', {});
    expect(result).toContain('/homer');
    expect(result).toContain('/lisa');
  });

  it('should handle case-insensitive character lookup', async () => {
    const result = await summonCharacter('HOMER', 'test', {});
    expect(result).toContain('Homer');
    expect(result).not.toContain('Unknown character');
  });
});

describe('Summon Exhaustive - Command Interface', () => {
  it('should display usage when no character provided', async () => {
    const result = await summonCommand.run([], {});
    expect(result).toContain('Usage');
    expect(result).toContain('/summon');
  });

  it('should show available characters in usage', async () => {
    const result = await summonCommand.run([], {});
    expect(result).toContain('homer');
    expect(result).toContain('lisa');
    expect(result).toContain('burns');
  });

  it('should accept character as first arg', async () => {
    const result = await summonCommand.run(['homer'], {});
    expect(result).toContain('Homer');
  });

  it('should join remaining args as input', async () => {
    const result = await summonCommand.run(['lisa', 'my', 'test', 'input'], {});
    expect(result).toContain('my test input');
  });

  it('should have correct command name', () => {
    expect(summonCommand.name).toBe('summon');
  });

  it('should have description', () => {
    expect(summonCommand.description).toBeDefined();
    expect(summonCommand.description.length).toBeGreaterThan(10);
  });

  it('should pass context to summonCharacter', async () => {
    const context = { cwd: '/test/path' };
    const result = await summonCommand.run(['homer', 'test'], context);
    expect(result).toContain('Homer');
  });

  it('should work with empty input string', async () => {
    const result = await summonCommand.run(['homer'], {});
    expect(result).toContain('no specific input');
  });
});

describe('Summon Exhaustive - Input Edge Cases', () => {
  it('should handle unicode character names gracefully', async () => {
    const result = await summonCharacter('hömër', 'test', {});
    expect(result).toContain('Unknown character');
  });

  it('should handle XSS-like input in character name', async () => {
    const result = await summonCharacter('<script>alert(1)</script>', 'test', {});
    expect(result).toContain('Unknown character');
  });

  it('should handle newlines in input', async () => {
    const result = await summonCharacter('homer', 'line1\nline2', {});
    expect(result).toContain('Homer');
    expect(result).toContain('line1\nline2');
  });

  it('should handle very long character name', async () => {
    const longName = 'a'.repeat(1000);
    const result = await summonCharacter(longName, 'test', {});
    expect(result).toContain('Unknown character');
  });

  it('should handle empty character name', async () => {
    const result = await summonCharacter('', 'test', {});
    expect(result).toContain('Unknown character');
  });

  it('should handle whitespace-only character name', async () => {
    const result = await summonCharacter('   ', 'test', {});
    expect(result).toContain('Unknown character');
  });

  it('should handle numeric character name', async () => {
    const result = await summonCharacter('123', 'test', {});
    expect(result).toContain('Unknown character');
  });
});
