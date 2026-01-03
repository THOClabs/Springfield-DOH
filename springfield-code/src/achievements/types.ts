/**
 * Achievement System Types
 * Type definitions for Springfield Code achievements
 *
 * @module achievements/types
 */

/**
 * Achievement definition
 */
export interface Achievement {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of how to unlock */
  description: string;
  /** Character who announces/celebrates this achievement */
  character: string;
  /** Category for grouping */
  category: AchievementCategory;
  /** Icon/emoji for display */
  icon: string;
  /** Whether this is a hidden achievement (revealed on unlock) */
  hidden?: boolean;
  /** Target value for progress-based achievements */
  target?: number;
}

/**
 * Achievement categories
 */
export type AchievementCategory =
  | "milestone" // Usage milestones (first steps, veteran)
  | "mastery" // Character/feature mastery
  | "completion" // Completing artifact sets
  | "special"; // Special/easter egg achievements

/**
 * Progress tracking for a single achievement
 */
export interface AchievementProgress {
  /** Current progress value (for progress-based achievements) */
  current: number;
  /** Target value (copied from Achievement for convenience) */
  target: number;
  /** When the achievement was unlocked (null if not yet) */
  unlockedAt: string | null;
  /** Whether currently unlocked */
  unlocked: boolean;
}

/**
 * Complete achievement state for storage
 */
export interface AchievementState {
  /** Schema version for future migrations */
  version: string;
  /** Total achievements unlocked */
  totalUnlocked: number;
  /** Total possible achievements */
  totalPossible: number;
  /** Progress map keyed by achievement ID */
  progress: Record<string, AchievementProgress>;
  /** When the state was last updated */
  lastUpdated: string;
}

/**
 * Result from checking achievement progress
 */
export interface AchievementCheckResult {
  /** Achievement ID */
  achievementId: string;
  /** Whether newly unlocked this check */
  newlyUnlocked: boolean;
  /** Current progress */
  current: number;
  /** Target to unlock */
  target: number;
  /** Percentage complete */
  percentage: number;
}

/**
 * Event that can trigger achievement progress
 */
export interface AchievementEvent {
  /** Type of event */
  type: AchievementEventType;
  /** Character involved (if any) */
  character?: string;
  /** Artifact created (if any) */
  artifact?: string;
  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Types of events that can trigger achievements
 */
export type AchievementEventType =
  | "invocation" // Character was invoked
  | "artifact_created" // Artifact file was created
  | "milestone_reached" // Stats milestone reached
  | "feature_used"; // Feature was used (demo, export, etc.)

/**
 * Default empty achievement state
 */
export const EMPTY_ACHIEVEMENT_STATE: AchievementState = {
  version: "1.0.0",
  totalUnlocked: 0,
  totalPossible: 0,
  progress: {},
  lastUpdated: new Date().toISOString(),
};
