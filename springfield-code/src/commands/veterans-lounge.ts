/**
 * Veterans Lounge Command
 * Power user features unlocked at 100 command invocations
 *
 * Source: .springfield/delight-moments.md (line 103)
 * "You've earned access to the Veteran's Lounge -
 *  a collection of power user features."
 *
 * @module commands/veterans-lounge
 */

import * as fs from "fs";
import * as path from "path";
import { loadStats, getTopCharacters, type UsageStats } from "../utils/stats.js";
import { SPRINGFIELD_DIR, ALL_CHARACTERS, CHARACTER_TIERS } from "../constants.js";

interface CommandContext {
  cwd?: string;
}

/**
 * Threshold for veteran status
 */
export const VETERAN_THRESHOLD = 100;

/**
 * Check if user has unlocked veteran status
 *
 * @param projectDir - Project directory path
 * @returns true if user has 100+ invocations
 */
export function isVeteran(projectDir: string): boolean {
  const stats = loadStats(projectDir);
  if (!stats) return false;
  return stats.totalInvocations >= VETERAN_THRESHOLD;
}

/**
 * Get progress towards veteran status
 *
 * @param projectDir - Project directory path
 * @returns Progress object with current, required, and percentage
 */
export function getVeteranProgress(projectDir: string): {
  current: number;
  required: number;
  percentage: number;
  isUnlocked: boolean;
} {
  const stats = loadStats(projectDir);
  const current = stats?.totalInvocations ?? 0;
  return {
    current,
    required: VETERAN_THRESHOLD,
    percentage: Math.min(100, Math.floor((current / VETERAN_THRESHOLD) * 100)),
    isUnlocked: current >= VETERAN_THRESHOLD,
  };
}

/**
 * Format a progress bar
 */
function formatProgressBar(current: number, total: number, width = 20): string {
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  return "[" + "=".repeat(filled) + "-".repeat(empty) + "]";
}

/**
 * Generate locked message showing progress
 */
function getLockedMessage(projectDir: string): string {
  const progress = getVeteranProgress(projectDir);
  const remaining = progress.required - progress.current;
  const bar = formatProgressBar(progress.current, progress.required);

  return `# Veterans Lounge

*Burns peers through the door*

"Hmm... not quite yet."

---

**Status:** LOCKED

${bar} ${progress.current}/${progress.required} commands (${progress.percentage}%)

You need **${remaining} more command${remaining === 1 ? "" : "s"}** to unlock the Veterans Lounge.

---

*Keep summoning characters to unlock power user features!*

**What awaits:**
- Advanced statistics dashboard
- Character usage heatmap
- Export capabilities
- Achievement tracking
- Veteran-only insights

*Burns adjusts monocle*

"Come back when you've proven your dedication."`;
}

/**
 * Generate character usage heatmap
 */
function generateHeatmap(stats: UsageStats): string {
  const lines: string[] = ["## Character Usage Heatmap", ""];

  // Group by tier
  const tiers = [
    { name: "Simpson Family", chars: CHARACTER_TIERS.simpson_family },
    { name: "Extended", chars: CHARACTER_TIERS.extended },
    { name: "Springfield", chars: CHARACTER_TIERS.springfield },
    { name: "Specialists", chars: CHARACTER_TIERS.specialists },
  ];

  for (const tier of tiers) {
    lines.push(`### ${tier.name}`);
    lines.push("");

    const charStats = tier.chars
      .map((char) => ({
        name: char,
        count: stats.characters[char] || 0,
      }))
      .sort((a, b) => b.count - a.count);

    const maxCount = Math.max(...charStats.map((c) => c.count), 1);

    for (const char of charStats) {
      const barWidth = Math.max(1, Math.round((char.count / maxCount) * 15));
      const bar = char.count > 0 ? "=".repeat(barWidth) : "-";
      const countStr = char.count.toString().padStart(4);
      lines.push(`  ${char.name.padEnd(12)} ${bar} ${countStr}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate advanced dashboard
 */
async function handleDashboard(projectDir: string): Promise<string> {
  const stats = loadStats(projectDir);
  if (!stats) {
    return "Error: Could not load stats.";
  }

  const topChars = getTopCharacters(projectDir, 5);
  const topCharsList = topChars
    .map((tc, i) => `${i + 1}. **${tc.character}** - ${tc.count} invocations`)
    .join("\n");

  // Calculate tier distribution
  const tierTotal =
    stats.tiers.simpson_family +
    stats.tiers.extended +
    stats.tiers.springfield +
    stats.tiers.specialists;

  const tierDist = tierTotal > 0
    ? {
        simpson_family: Math.round((stats.tiers.simpson_family / tierTotal) * 100),
        extended: Math.round((stats.tiers.extended / tierTotal) * 100),
        springfield: Math.round((stats.tiers.springfield / tierTotal) * 100),
        specialists: Math.round((stats.tiers.specialists / tierTotal) * 100),
      }
    : { simpson_family: 0, extended: 0, springfield: 0, specialists: 0 };

  // Count unique characters used
  const uniqueChars = Object.entries(stats.characters).filter(
    ([, count]) => count > 0
  ).length;
  const totalChars = ALL_CHARACTERS.length;

  const heatmap = generateHeatmap(stats);

  return `# Veterans Lounge Dashboard

*Burns welcomes you*

"Ah, a fellow power user. Excellent."

---

## Overview

| Metric | Value |
|--------|-------|
| Total Invocations | ${stats.totalInvocations} |
| Unique Characters | ${uniqueChars}/${totalChars} |
| Tracking Since | ${new Date(stats.createdAt).toLocaleDateString()} |
| Last Activity | ${new Date(stats.updatedAt).toLocaleDateString()} |

## Tier Distribution

| Tier | Usage | % |
|------|-------|---|
| Simpson Family | ${stats.tiers.simpson_family} | ${tierDist.simpson_family}% |
| Extended | ${stats.tiers.extended} | ${tierDist.extended}% |
| Springfield | ${stats.tiers.springfield} | ${tierDist.springfield}% |
| Specialists | ${stats.tiers.specialists} | ${tierDist.specialists}% |

## Top 5 Characters

${topCharsList || "*No characters invoked yet*"}

${heatmap}

---

*"Knowledge is power. And power is... excellent."*`;
}

/**
 * Export stats to JSON
 */
async function handleExport(
  projectDir: string,
  format: string
): Promise<string> {
  const stats = loadStats(projectDir);
  if (!stats) {
    return "Error: Could not load stats.";
  }

  const exportDir = path.join(projectDir, SPRINGFIELD_DIR, "exports");

  // Ensure exports directory exists
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (format === "json") {
    const filename = `stats-${timestamp}.json`;
    const filepath = path.join(exportDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(stats, null, 2), "utf-8");

    return `# Export Complete

*Smithers files the paperwork*

Exported stats to:
\`${path.relative(projectDir, filepath)}\`

Format: JSON
Records: ${stats.totalInvocations} invocations`;
  }

  if (format === "markdown" || format === "md") {
    const filename = `stats-${timestamp}.md`;
    const filepath = path.join(exportDir, filename);

    const topChars = getTopCharacters(projectDir, 10);
    const content = `# Springfield Code Statistics Export

Generated: ${new Date().toLocaleString()}

## Summary

- **Total Invocations:** ${stats.totalInvocations}
- **Tracking Since:** ${new Date(stats.createdAt).toLocaleDateString()}

## By Tier

| Tier | Count |
|------|-------|
| Simpson Family | ${stats.tiers.simpson_family} |
| Extended | ${stats.tiers.extended} |
| Springfield | ${stats.tiers.springfield} |
| Specialists | ${stats.tiers.specialists} |

## Top Characters

${topChars.map((tc, i) => `${i + 1}. ${tc.character}: ${tc.count}`).join("\n")}

## All Character Counts

${Object.entries(stats.characters)
  .filter(([, count]) => count > 0)
  .sort(([, a], [, b]) => b - a)
  .map(([char, count]) => `- ${char}: ${count}`)
  .join("\n")}
`;

    fs.writeFileSync(filepath, content, "utf-8");

    return `# Export Complete

*Smithers organizes the files*

Exported stats to:
\`${path.relative(projectDir, filepath)}\`

Format: Markdown`;
  }

  return `Unknown export format: ${format}

Supported formats:
- \`json\` - Machine-readable JSON
- \`markdown\` or \`md\` - Human-readable Markdown`;
}

/**
 * Show available subcommands
 */
function getHelpText(): string {
  return `# Veterans Lounge

*Burns gestures expansively*

"Welcome to the inner circle. Here's what's available."

---

## Available Commands

| Command | Description |
|---------|-------------|
| \`/springfield veterans-lounge\` | Show this help |
| \`/springfield veterans-lounge dashboard\` | Advanced statistics |
| \`/springfield veterans-lounge export json\` | Export to JSON |
| \`/springfield veterans-lounge export md\` | Export to Markdown |

---

*"Use these powers wisely. Or don't. I'm not your mother."*`;
}

/**
 * Main command handler
 */
export async function run(
  args: string[],
  context: CommandContext
): Promise<string> {
  const projectDir = context.cwd || process.cwd();

  // Check if veteran status is unlocked
  if (!isVeteran(projectDir)) {
    return getLockedMessage(projectDir);
  }

  const [subcommand, ...rest] = args;

  switch (subcommand?.toLowerCase()) {
    case "dashboard":
    case "dash":
      return handleDashboard(projectDir);

    case "export":
      return handleExport(projectDir, rest[0] || "json");

    case "help":
    default:
      return getHelpText();
  }
}

export default {
  name: "veterans-lounge",
  description:
    "Power user features for Springfield veterans (unlocked at 100 commands)",
  run,
};
