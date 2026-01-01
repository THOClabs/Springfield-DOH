/**
 * Local Usage Statistics
 * Tracks character invocation counts in .springfield/stats.json
 * No network calls - file-based only for privacy
 * 
 * @module utils/stats
 */

import * as fs from "fs";
import * as path from "path";
import { SPRINGFIELD_DIR, ALL_CHARACTERS, CHARACTER_TIERS } from "../constants.js";

/**
 * Statistics data structure
 */
export interface UsageStats {
  /** Version of the stats format */
  version: string;
  /** When stats tracking started */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Total invocations across all characters */
  totalInvocations: number;
  /** Per-character invocation counts */
  characters: Record<string, number>;
  /** Per-tier invocation counts */
  tiers: {
    simpson_family: number;
    extended: number;
    springfield: number;
    specialists: number;
  };
}

const STATS_FILE = "stats.json";
const STATS_VERSION = "1.0.0";

/**
 * Get the path to the stats file
 */
function getStatsPath(projectDir: string): string {
  return path.join(projectDir, SPRINGFIELD_DIR, STATS_FILE);
}

/**
 * Create empty stats object
 */
function createEmptyStats(): UsageStats {
  const now = new Date().toISOString();
  const characters: Record<string, number> = {};
  
  for (const char of ALL_CHARACTERS) {
    characters[char] = 0;
  }

  return {
    version: STATS_VERSION,
    createdAt: now,
    updatedAt: now,
    totalInvocations: 0,
    characters,
    tiers: {
      simpson_family: 0,
      extended: 0,
      springfield: 0,
      specialists: 0,
    },
  };
}

/**
 * Load stats from file, creating if doesn't exist
 */
export function loadStats(projectDir: string): UsageStats | null {
  const statsPath = getStatsPath(projectDir);
  
  // Check if .springfield directory exists
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);
  if (!fs.existsSync(springfieldDir)) {
    return null;
  }

  if (!fs.existsSync(statsPath)) {
    return createEmptyStats();
  }

  try {
    const content = fs.readFileSync(statsPath, "utf-8");
    const stats = JSON.parse(content) as UsageStats;
    
    // Ensure all characters have entries (for new characters added in updates)
    for (const char of ALL_CHARACTERS) {
      if (!(char in stats.characters)) {
        stats.characters[char] = 0;
      }
    }
    
    // Ensure specialists tier exists (for v2.0.0 → v2.1.0 migration)
    if (!stats.tiers.specialists) {
      stats.tiers.specialists = 0;
    }
    
    return stats;
  } catch {
    return createEmptyStats();
  }
}

/**
 * Save stats to file
 */
export function saveStats(projectDir: string, stats: UsageStats): boolean {
  const statsPath = getStatsPath(projectDir);
  
  // Check if .springfield directory exists
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);
  if (!fs.existsSync(springfieldDir)) {
    return false;
  }

  try {
    stats.updatedAt = new Date().toISOString();
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");
    return true;
    /* istanbul ignore next -- @preserve Cannot mock fs.writeFileSync in ESM */
  } catch {
    return false;
  }
}

/**
 * Get the tier for a character
 */
function getCharacterTier(character: string): keyof UsageStats["tiers"] | null {
  // Cast to readonly string arrays for includes() comparison
  if ((CHARACTER_TIERS.simpson_family as readonly string[]).includes(character)) return "simpson_family";
  if ((CHARACTER_TIERS.extended as readonly string[]).includes(character)) return "extended";
  if ((CHARACTER_TIERS.springfield as readonly string[]).includes(character)) return "springfield";
  if ((CHARACTER_TIERS.specialists as readonly string[]).includes(character)) return "specialists";
  
  return null;
}

/**
 * Record a character invocation
 */
export function recordInvocation(projectDir: string, character: string): boolean {
  const stats = loadStats(projectDir);
  if (!stats) return false;

  // Increment character count
  if (character in stats.characters) {
    stats.characters[character]++;
  } else {
    stats.characters[character] = 1;
  }

  // Increment tier count
  const tier = getCharacterTier(character);
  if (tier) {
    stats.tiers[tier]++;
  }

  // Increment total
  stats.totalInvocations++;

  return saveStats(projectDir, stats);
}

/**
 * Get top N most used characters
 */
export function getTopCharacters(projectDir: string, n = 10): Array<{ character: string; count: number }> {
  const stats = loadStats(projectDir);
  if (!stats) return [];

  return Object.entries(stats.characters)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([character, count]) => ({ character, count }));
}

/**
 * Format stats as a readable report
 */
export function formatStatsReport(projectDir: string): string {
  const stats = loadStats(projectDir);
  
  if (!stats) {
    return `# Usage Statistics

*No stats available. Initialize Springfield first with \`/springfield init\`*
`;
  }

  if (stats.totalInvocations === 0) {
    return `# Usage Statistics

*No character invocations recorded yet.*

Start summoning characters to build your stats!
`;
  }

  const topChars = getTopCharacters(projectDir, 10);
  const topCharsList = topChars
    .map((tc, i) => `${i + 1}. \`${tc.character}\` - ${tc.count} invocations`)
    .join("\n");

  return `# Usage Statistics

**Total Invocations:** ${stats.totalInvocations}
**Tracking Since:** ${new Date(stats.createdAt).toLocaleDateString()}
**Last Updated:** ${new Date(stats.updatedAt).toLocaleDateString()}

## By Tier

| Tier | Invocations |
|------|-------------|
| Simpson Family | ${stats.tiers.simpson_family} |
| Extended | ${stats.tiers.extended} |
| Springfield | ${stats.tiers.springfield} |
| Specialists | ${stats.tiers.specialists} |

## Top Characters

${topCharsList || "*No characters invoked yet*"}
`;
}

/**
 * Reset all stats
 */
export function resetStats(projectDir: string): boolean {
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);
  if (!fs.existsSync(springfieldDir)) {
    return false;
  }

  const emptyStats = createEmptyStats();
  return saveStats(projectDir, emptyStats);
}
