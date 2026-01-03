/**
 * Achievement Detector
 * Logic for detecting when achievements should be unlocked
 *
 * @module achievements/detector
 */

import * as fs from "fs";
import * as path from "path";
import type {
  AchievementState,
  AchievementEvent,
  AchievementCheckResult,
} from "./types.js";
import {
  SIMPSON_FAMILY,
  PLANNING_ARTIFACTS,
  getAchievementById,
} from "./definitions.js";
import { updateProgress, getProgress } from "./storage.js";

/**
 * Process an achievement event and update state
 * @param state - Current achievement state
 * @param event - Event to process
 * @returns Array of newly unlocked achievements
 */
export function processEvent(
  state: AchievementState,
  event: AchievementEvent
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  switch (event.type) {
    case "invocation":
      results.push(...processInvocation(state, event.character));
      break;
    case "artifact_created":
      results.push(...processArtifact(state, event.artifact));
      break;
    case "milestone_reached":
      results.push(...processMilestone(state, event.context));
      break;
    case "feature_used":
      results.push(...processFeature(state, event.context));
      break;
  }

  return results;
}

/**
 * Process a character invocation event
 */
function processInvocation(
  state: AchievementState,
  character?: string
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  // Track total invocations for milestone achievements
  // (This would need to be called with total count from stats)

  if (character) {
    // Track unique characters used
    const uniqueKey = `_unique_${character}`;
    if (!state.progress[uniqueKey]) {
      // First time using this character
      state.progress[uniqueKey] = {
        current: 1,
        target: 1,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };

      // Update completion achievements
      results.push(...checkUniqueCharacters(state));
    }

    // Track character-specific counts
    if (character === "bart") {
      const result = checkProgress(state, "the-chaos-monkey", 1, true);
      if (result) results.push(result);
    }

    if (character === "wiggum") {
      // Check for security review artifact
      // (This would be checked in artifact_created event instead)
    }

    if (character === "burns") {
      // Budget master checked via artifact
    }
  }

  return results;
}

/**
 * Check unique character achievements
 */
function checkUniqueCharacters(
  state: AchievementState
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  // Count unique characters
  const uniqueCharacters = new Set<string>();
  for (const key of Object.keys(state.progress)) {
    if (key.startsWith("_unique_")) {
      uniqueCharacters.add(key.replace("_unique_", ""));
    }
  }

  // Simpson Family (5 members)
  const simpsonCount = SIMPSON_FAMILY.filter((c) =>
    uniqueCharacters.has(c)
  ).length;
  const simpsonResult = checkProgress(state, "simpson-family", simpsonCount);
  if (simpsonResult) results.push(simpsonResult);

  // Extended Family (10 unique)
  const extendedResult = checkProgress(
    state,
    "extended-family",
    uniqueCharacters.size
  );
  if (extendedResult) results.push(extendedResult);

  // Full Springfield (47 characters)
  const fullResult = checkProgress(
    state,
    "the-full-springfield",
    uniqueCharacters.size
  );
  if (fullResult) results.push(fullResult);

  return results;
}

/**
 * Process an artifact creation event
 */
function processArtifact(
  state: AchievementState,
  artifact?: string
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  if (!artifact) return results;

  // Track unique artifacts
  const artifactKey = `_artifact_${artifact}`;
  if (!state.progress[artifactKey]) {
    state.progress[artifactKey] = {
      current: 1,
      target: 1,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    };

    // Count total artifacts
    let artifactCount = 0;
    for (const key of Object.keys(state.progress)) {
      if (key.startsWith("_artifact_")) {
        artifactCount++;
      }
    }

    const collectorResult = checkProgress(
      state,
      "artifact-collector",
      artifactCount
    );
    if (collectorResult) results.push(collectorResult);
  }

  // Check planning artifacts for methodologist
  if (PLANNING_ARTIFACTS.includes(artifact)) {
    let planningCount = 0;
    for (const planArtifact of PLANNING_ARTIFACTS) {
      if (state.progress[`_artifact_${planArtifact}`]) {
        planningCount++;
      }
    }
    const methodResult = checkProgress(
      state,
      "the-methodologist",
      planningCount
    );
    if (methodResult) results.push(methodResult);
  }

  // Check for perfectionist (project.md complete)
  if (artifact === "project.md") {
    // Would need to check content completeness
    // For now, creating project.md counts
    const perfResult = checkProgress(state, "the-perfectionist", 1);
    if (perfResult) results.push(perfResult);
  }

  // Check for security-conscious (security-review.md)
  if (artifact === "security-review.md") {
    const secResult = checkProgress(state, "security-conscious", 1);
    if (secResult) results.push(secResult);
  }

  // Check for budget-master (budget.md or roi calculation)
  if (artifact === "budget.md" || artifact === "roi.md") {
    const budgetResult = checkProgress(state, "the-budget-master", 1);
    if (budgetResult) results.push(budgetResult);
  }

  return results;
}

/**
 * Process a milestone event (from stats)
 */
function processMilestone(
  state: AchievementState,
  context?: Record<string, unknown>
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  if (!context) return results;

  const totalInvocations = context.totalInvocations as number | undefined;
  if (typeof totalInvocations === "number") {
    // Check milestone achievements
    const milestones = [
      { id: "first-steps", target: 1 },
      { id: "getting-started", target: 10 },
      { id: "regular", target: 50 },
      { id: "veteran", target: 100 },
      { id: "power-user", target: 500 },
    ];

    for (const milestone of milestones) {
      const result = checkProgress(state, milestone.id, totalInvocations);
      if (result) results.push(result);
    }
  }

  return results;
}

/**
 * Process a feature usage event
 */
function processFeature(
  state: AchievementState,
  context?: Record<string, unknown>
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  if (!context) return results;

  const feature = context.feature as string | undefined;
  const rareEventId = context.rareEventId as string | undefined;
  const easterEggId = context.easterEggId as string | undefined;

  // Check for rare event achievements
  if (rareEventId === "steamed-hams") {
    const result = checkProgress(state, "steamed-hams", 1);
    if (result) results.push(result);
  }

  if (rareEventId === "monorail") {
    const result = checkProgress(state, "monorail-moment", 1);
    if (result) results.push(result);
  }

  if (rareEventId === "spider-pig") {
    const result = checkProgress(state, "spider-pig-sighting", 1);
    if (result) results.push(result);
  }

  // Check for easter egg achievements
  if (easterEggId === "stonecutters") {
    const result = checkProgress(state, "stonecutter", 1);
    if (result) results.push(result);
  }

  // Night shift (after midnight)
  if (feature === "night-shift") {
    const result = checkProgress(state, "night-shift", 1);
    if (result) results.push(result);
  }

  return results;
}

/**
 * Helper to check and update progress for an achievement
 */
function checkProgress(
  state: AchievementState,
  achievementId: string,
  currentValue: number,
  increment: boolean = false
): AchievementCheckResult | null {
  const achievement = getAchievementById(achievementId);
  if (!achievement) return null;

  const progress = getProgress(state, achievementId);
  if (!progress) return null;

  // Already unlocked
  if (progress.unlocked) {
    return {
      achievementId,
      newlyUnlocked: false,
      current: progress.current,
      target: progress.target,
      percentage: 100,
    };
  }

  const wasUnlocked = updateProgress(state, achievementId, currentValue, increment);

  const updatedProgress = getProgress(state, achievementId)!;
  const percentage = Math.min(
    100,
    Math.round((updatedProgress.current / updatedProgress.target) * 100)
  );

  return {
    achievementId,
    newlyUnlocked: wasUnlocked,
    current: updatedProgress.current,
    target: updatedProgress.target,
    percentage,
  };
}

/**
 * Check for night shift achievement based on current time
 * @param state - Achievement state
 * @param date - Current date (optional, for testing)
 * @returns Result if newly unlocked
 */
export function checkNightShift(
  state: AchievementState,
  date: Date = new Date()
): AchievementCheckResult | null {
  const hour = date.getHours();

  // After midnight but before 5am
  if (hour >= 0 && hour < 5) {
    return checkProgress(state, "night-shift", 1);
  }

  return null;
}

/**
 * Check project.md completeness for perfectionist achievement
 * @param projectDir - Project directory
 * @returns Whether project.md is complete
 */
export function checkProjectCompleteness(projectDir: string): boolean {
  const projectPath = path.join(projectDir, ".springfield", "project.md");

  try {
    if (!fs.existsSync(projectPath)) {
      return false;
    }

    const content = fs.readFileSync(projectPath, "utf-8");

    // Check for required sections
    const requiredSections = [
      "## Project Overview",
      "## Goals",
      "## Context",
      "## Technical Scope",
    ];

    for (const section of requiredSections) {
      if (!content.includes(section)) {
        return false;
      }
    }

    // Check minimum content length (not just template)
    if (content.length < 500) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sync achievement state with stats data
 * @param state - Achievement state
 * @param stats - Stats data from stats.json
 */
export function syncWithStats(
  state: AchievementState,
  stats: {
    totalInvocations?: number;
    characterCounts?: Record<string, number>;
    artifacts?: string[];
  }
): AchievementCheckResult[] {
  const results: AchievementCheckResult[] = [];

  // Process total invocations
  if (typeof stats.totalInvocations === "number") {
    results.push(
      ...processMilestone(state, { totalInvocations: stats.totalInvocations })
    );
  }

  // Process character counts
  if (stats.characterCounts) {
    for (const [character, count] of Object.entries(stats.characterCounts)) {
      // Mark character as used
      const uniqueKey = `_unique_${character}`;
      if (!state.progress[uniqueKey] && count > 0) {
        state.progress[uniqueKey] = {
          current: 1,
          target: 1,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      // Check chaos monkey for Bart
      if (character === "bart" && count >= 50) {
        const result = checkProgress(state, "the-chaos-monkey", count);
        if (result) results.push(result);
      }
    }

    // Check unique character achievements
    results.push(...checkUniqueCharacters(state));
  }

  // Process artifacts
  if (stats.artifacts) {
    for (const artifact of stats.artifacts) {
      results.push(...processArtifact(state, artifact));
    }
  }

  return results;
}
