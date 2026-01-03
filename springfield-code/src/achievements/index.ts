/**
 * Achievement System
 * Main entry point for Springfield Code achievements
 *
 * @module achievements
 */

// Types
export type {
  Achievement,
  AchievementCategory,
  AchievementProgress,
  AchievementState,
  AchievementCheckResult,
  AchievementEvent,
  AchievementEventType,
} from "./types.js";

export { EMPTY_ACHIEVEMENT_STATE } from "./types.js";

// Definitions
export {
  ACHIEVEMENTS,
  getAllAchievements,
  getAchievementById,
  getAchievementsByCategory,
  getVisibleAchievements,
  TOTAL_ACHIEVEMENTS,
  CHAOS_MONKEY_TARGET,
  SIMPSON_FAMILY,
  PLANNING_ARTIFACTS,
} from "./definitions.js";

// Storage
export {
  ACHIEVEMENTS_FILE,
  getAchievementsPath,
  loadAchievements,
  saveAchievements,
  initializeState,
  updateProgress,
  getProgress,
  isUnlocked,
  getUnlockedIds,
  getCloseToCompletion,
  achievementsExist,
} from "./storage.js";

// Detector
export {
  processEvent,
  checkNightShift,
  checkProjectCompleteness,
  syncWithStats,
} from "./detector.js";

// Formatter
export {
  getCelebrationMessage,
  formatAchievement,
  formatProgressBar,
  formatAchievementSummary,
  formatCompactAchievements,
  formatNewUnlocks,
} from "./formatter.js";
