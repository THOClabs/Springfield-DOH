/**
 * Achievement Definitions
 * Complete registry of Springfield Code achievements
 *
 * Source: .springfield/delight-moments.md
 *
 * @module achievements/definitions
 */

import type { Achievement } from "./types.js";

/**
 * All available achievements
 */
export const ACHIEVEMENTS: Achievement[] = [
  // === MILESTONE ACHIEVEMENTS ===
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first character invocation",
    character: "troy-mcclure",
    category: "milestone",
    icon: "🎬",
    target: 1,
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Reach 10 total invocations",
    character: "homer",
    category: "milestone",
    icon: "🍩",
    target: 10,
  },
  {
    id: "regular",
    name: "Regular",
    description: "Reach 50 total invocations",
    character: "moe",
    category: "milestone",
    icon: "🍺",
    target: 50,
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Reach 100 total invocations and unlock Veterans Lounge",
    character: "grampa",
    category: "milestone",
    icon: "🎖️",
    target: 100,
  },
  {
    id: "power-user",
    name: "Power User",
    description: "Reach 500 total invocations",
    character: "burns",
    category: "milestone",
    icon: "⚡",
    target: 500,
  },

  // === MASTERY ACHIEVEMENTS ===
  {
    id: "the-chaos-monkey",
    name: "The Chaos Monkey",
    description: "Invoke Bart 50 times (embrace the chaos)",
    character: "bart",
    category: "mastery",
    icon: "🐒",
    target: 50,
  },
  {
    id: "the-perfectionist",
    name: "The Perfectionist",
    description: "Complete all sections in project.md",
    character: "lisa",
    category: "mastery",
    icon: "📚",
    target: 1, // Binary: complete or not
  },
  {
    id: "the-budget-master",
    name: "The Budget Master",
    description: "Complete an ROI calculation with Burns",
    character: "burns",
    category: "mastery",
    icon: "💰",
    target: 1,
  },
  {
    id: "security-conscious",
    name: "Security Conscious",
    description: "Complete a security review with Chief Wiggum",
    character: "wiggum",
    category: "mastery",
    icon: "🔒",
    target: 1,
  },
  {
    id: "the-methodologist",
    name: "The Methodologist",
    description: "Create all planning artifacts (project, task, completion, iterations)",
    character: "marge",
    category: "mastery",
    icon: "📋",
    target: 4, // 4 core planning artifacts
  },

  // === COMPLETION ACHIEVEMENTS ===
  {
    id: "simpson-family",
    name: "Simpson Family",
    description: "Invoke all Simpson family members (Homer, Marge, Bart, Lisa, Maggie)",
    character: "marge",
    category: "completion",
    icon: "👨‍👩‍👧‍👦",
    target: 5,
  },
  {
    id: "extended-family",
    name: "Extended Family",
    description: "Invoke 10 different characters",
    character: "grampa",
    category: "completion",
    icon: "👴",
    target: 10,
  },
  {
    id: "the-full-springfield",
    name: "The Full Springfield",
    description: "Invoke all 47 characters at least once",
    character: "ensemble",
    category: "completion",
    icon: "🏘️",
    target: 47,
  },
  {
    id: "artifact-collector",
    name: "Artifact Collector",
    description: "Create 10 different artifact files",
    character: "apu",
    category: "completion",
    icon: "📦",
    target: 10,
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    id: "steamed-hams",
    name: "Steamed Hams",
    description: "Trigger the Steamed Hams rare event",
    character: "skinner",
    category: "special",
    icon: "🍔",
    hidden: true,
    target: 1,
  },
  {
    id: "monorail-moment",
    name: "Monorail Moment",
    description: "Trigger the Monorail rare event",
    character: "lyle-lanley",
    category: "special",
    icon: "🚝",
    hidden: true,
    target: 1,
  },
  {
    id: "spider-pig-sighting",
    name: "Spider-Pig Sighting",
    description: "Witness the rare Spider-Pig event (0.1% chance)",
    character: "homer",
    category: "special",
    icon: "🐷",
    hidden: true,
    target: 1,
  },
  {
    id: "night-shift",
    name: "Night Shift",
    description: "Use Springfield Code after midnight",
    character: "moe",
    category: "special",
    icon: "🌙",
    hidden: true,
    target: 1,
  },
  {
    id: "stonecutter",
    name: "Stonecutter",
    description: "Experience the Stonecutters greeting (Tuesday 3:15 PM)",
    character: "homer",
    category: "special",
    icon: "🔨",
    hidden: true,
    target: 1,
  },
];

/**
 * Get all achievements
 * @returns Copy of achievements array
 */
export function getAllAchievements(): Achievement[] {
  return [...ACHIEVEMENTS];
}

/**
 * Get achievement by ID
 * @param id - Achievement ID
 * @returns Achievement or undefined
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Get achievements by category
 * @param category - Achievement category
 * @returns Achievements in that category
 */
export function getAchievementsByCategory(
  category: Achievement["category"]
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * Get visible achievements (non-hidden or unlocked)
 * @param unlockedIds - Set of unlocked achievement IDs
 * @returns Visible achievements
 */
export function getVisibleAchievements(
  unlockedIds: Set<string>
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.hidden || unlockedIds.has(a.id));
}

/**
 * Total number of achievements
 */
export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;

/**
 * Character invocation counts needed for chaos-monkey
 */
export const CHAOS_MONKEY_TARGET = 50;

/**
 * Simpson family member IDs
 */
export const SIMPSON_FAMILY = ["homer", "marge", "bart", "lisa", "maggie"];

/**
 * Core planning artifacts for methodologist
 */
export const PLANNING_ARTIFACTS = [
  "project.md",
  "task.md",
  "completion.md",
  "iterations.md",
];
