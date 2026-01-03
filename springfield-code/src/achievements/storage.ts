/**
 * Achievement Storage
 * Persistence layer for achievement state
 *
 * @module achievements/storage
 */

import * as fs from "fs";
import * as path from "path";
import type { AchievementState, AchievementProgress } from "./types.js";
import { EMPTY_ACHIEVEMENT_STATE } from "./types.js";
import { TOTAL_ACHIEVEMENTS, getAllAchievements } from "./definitions.js";

/**
 * Achievement storage filename
 */
export const ACHIEVEMENTS_FILE = "achievements.json";

/**
 * Get path to achievements file
 * @param projectDir - Project directory
 * @returns Path to achievements.json
 */
export function getAchievementsPath(projectDir: string): string {
  return path.join(projectDir, ".springfield", ACHIEVEMENTS_FILE);
}

/**
 * Load achievement state from disk
 * @param projectDir - Project directory
 * @returns Achievement state (empty state if not found)
 */
export function loadAchievements(projectDir: string): AchievementState {
  const filePath = getAchievementsPath(projectDir);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const state = JSON.parse(content) as AchievementState;

      // Ensure totalPossible is current
      state.totalPossible = TOTAL_ACHIEVEMENTS;

      // Initialize missing achievements
      const allAchievements = getAllAchievements();
      for (const achievement of allAchievements) {
        if (!state.progress[achievement.id]) {
          state.progress[achievement.id] = {
            current: 0,
            target: achievement.target || 1,
            unlockedAt: null,
            unlocked: false,
          };
        }
      }

      return state;
    }
  } catch {
    // Return empty state on error
  }

  return initializeState();
}

/**
 * Save achievement state to disk
 * @param projectDir - Project directory
 * @param state - Achievement state to save
 */
export function saveAchievements(
  projectDir: string,
  state: AchievementState
): void {
  const filePath = getAchievementsPath(projectDir);
  const springfieldDir = path.dirname(filePath);

  // Ensure directory exists
  if (!fs.existsSync(springfieldDir)) {
    fs.mkdirSync(springfieldDir, { recursive: true });
  }

  // Update timestamp
  state.lastUpdated = new Date().toISOString();

  // Count unlocked
  state.totalUnlocked = Object.values(state.progress).filter(
    (p) => p.unlocked
  ).length;
  state.totalPossible = TOTAL_ACHIEVEMENTS;

  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Initialize a fresh achievement state
 * @returns New achievement state with all achievements at 0 progress
 */
export function initializeState(): AchievementState {
  const state: AchievementState = {
    ...EMPTY_ACHIEVEMENT_STATE,
    totalPossible: TOTAL_ACHIEVEMENTS,
    progress: {},
    lastUpdated: new Date().toISOString(),
  };

  // Initialize all achievements
  const allAchievements = getAllAchievements();
  for (const achievement of allAchievements) {
    state.progress[achievement.id] = {
      current: 0,
      target: achievement.target || 1,
      unlockedAt: null,
      unlocked: false,
    };
  }

  return state;
}

/**
 * Update progress for a specific achievement
 * @param state - Current state
 * @param achievementId - Achievement to update
 * @param progress - New progress value or increment
 * @param increment - If true, add to current; if false, set absolute
 * @returns Whether the achievement was newly unlocked
 */
export function updateProgress(
  state: AchievementState,
  achievementId: string,
  progress: number,
  increment: boolean = false
): boolean {
  const achievementProgress = state.progress[achievementId];
  if (!achievementProgress) {
    return false;
  }

  // Already unlocked - no change
  if (achievementProgress.unlocked) {
    return false;
  }

  // Update progress
  if (increment) {
    achievementProgress.current += progress;
  } else {
    achievementProgress.current = progress;
  }

  // Check for unlock
  if (achievementProgress.current >= achievementProgress.target) {
    achievementProgress.current = achievementProgress.target; // Cap at target
    achievementProgress.unlocked = true;
    achievementProgress.unlockedAt = new Date().toISOString();
    state.totalUnlocked++;
    return true;
  }

  return false;
}

/**
 * Get progress for a specific achievement
 * @param state - Achievement state
 * @param achievementId - Achievement ID
 * @returns Progress or undefined
 */
export function getProgress(
  state: AchievementState,
  achievementId: string
): AchievementProgress | undefined {
  return state.progress[achievementId];
}

/**
 * Check if an achievement is unlocked
 * @param state - Achievement state
 * @param achievementId - Achievement ID
 * @returns Whether unlocked
 */
export function isUnlocked(
  state: AchievementState,
  achievementId: string
): boolean {
  return state.progress[achievementId]?.unlocked ?? false;
}

/**
 * Get all unlocked achievement IDs
 * @param state - Achievement state
 * @returns Set of unlocked achievement IDs
 */
export function getUnlockedIds(state: AchievementState): Set<string> {
  const unlocked = new Set<string>();
  for (const [id, progress] of Object.entries(state.progress)) {
    if (progress.unlocked) {
      unlocked.add(id);
    }
  }
  return unlocked;
}

/**
 * Get achievements close to completion (>50% progress)
 * @param state - Achievement state
 * @returns Array of [achievementId, percentage] pairs
 */
export function getCloseToCompletion(
  state: AchievementState
): Array<[string, number]> {
  const close: Array<[string, number]> = [];

  for (const [id, progress] of Object.entries(state.progress)) {
    if (!progress.unlocked && progress.target > 0) {
      const percentage = (progress.current / progress.target) * 100;
      if (percentage >= 50) {
        close.push([id, percentage]);
      }
    }
  }

  // Sort by percentage descending
  close.sort((a, b) => b[1] - a[1]);
  return close;
}

/**
 * Check if achievements file exists
 * @param projectDir - Project directory
 * @returns Whether achievements.json exists
 */
export function achievementsExist(projectDir: string): boolean {
  return fs.existsSync(getAchievementsPath(projectDir));
}
