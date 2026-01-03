/**
 * Tests for src/achievements/* - Achievement System
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Types
import type {
  Achievement,
  AchievementState,
  AchievementProgress,
  AchievementEvent,
} from "../src/achievements/types.js";

// Definitions
import {
  ACHIEVEMENTS,
  getAllAchievements,
  getAchievementById,
  getAchievementsByCategory,
  getVisibleAchievements,
  TOTAL_ACHIEVEMENTS,
  SIMPSON_FAMILY,
  PLANNING_ARTIFACTS,
} from "../src/achievements/definitions.js";

// Storage
import {
  loadAchievements,
  saveAchievements,
  initializeState,
  updateProgress,
  getProgress,
  isUnlocked,
  getUnlockedIds,
  getCloseToCompletion,
  achievementsExist,
  getAchievementsPath,
} from "../src/achievements/storage.js";

// Detector
import {
  processEvent,
  checkNightShift,
  checkProjectCompleteness,
  syncWithStats,
} from "../src/achievements/detector.js";

// Formatter
import {
  getCelebrationMessage,
  formatAchievement,
  formatProgressBar,
  formatAchievementSummary,
  formatCompactAchievements,
  formatNewUnlocks,
} from "../src/achievements/formatter.js";

describe("Achievement System", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "springfield-achievements-"));
    fs.mkdirSync(path.join(testDir, ".springfield"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe("definitions", () => {
    describe("ACHIEVEMENTS array", () => {
      it("has expected total achievements", () => {
        expect(ACHIEVEMENTS.length).toBeGreaterThan(15);
        expect(ACHIEVEMENTS.length).toBe(TOTAL_ACHIEVEMENTS);
      });

      it("all achievements have required properties", () => {
        for (const achievement of ACHIEVEMENTS) {
          expect(achievement.id).toBeTruthy();
          expect(achievement.name).toBeTruthy();
          expect(achievement.description).toBeTruthy();
          expect(achievement.character).toBeTruthy();
          expect(achievement.category).toBeTruthy();
          expect(achievement.icon).toBeTruthy();
          expect(typeof achievement.target).toBe("number");
        }
      });

      it("has unique IDs", () => {
        const ids = ACHIEVEMENTS.map((a) => a.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });

      it("has milestone achievements", () => {
        const milestones = getAchievementsByCategory("milestone");
        expect(milestones.length).toBeGreaterThan(0);

        const ids = milestones.map((m) => m.id);
        expect(ids).toContain("first-steps");
        expect(ids).toContain("veteran");
      });

      it("has special hidden achievements", () => {
        const special = getAchievementsByCategory("special");
        expect(special.length).toBeGreaterThan(0);

        const hidden = special.filter((s) => s.hidden);
        expect(hidden.length).toBeGreaterThan(0);
      });
    });

    describe("getAllAchievements", () => {
      it("returns copy of achievements", () => {
        const a1 = getAllAchievements();
        const a2 = getAllAchievements();
        expect(a1).not.toBe(a2);
        expect(a1).toEqual(a2);
      });
    });

    describe("getAchievementById", () => {
      it("returns achievement by ID", () => {
        const achievement = getAchievementById("first-steps");
        expect(achievement).toBeDefined();
        expect(achievement?.name).toBe("First Steps");
      });

      it("returns undefined for unknown ID", () => {
        const achievement = getAchievementById("nonexistent");
        expect(achievement).toBeUndefined();
      });
    });

    describe("getAchievementsByCategory", () => {
      it("filters by category", () => {
        const milestones = getAchievementsByCategory("milestone");
        expect(milestones.every((a) => a.category === "milestone")).toBe(true);
      });
    });

    describe("getVisibleAchievements", () => {
      it("shows non-hidden achievements", () => {
        const visible = getVisibleAchievements(new Set());
        const hiddenInVisible = visible.filter((a) => a.hidden);
        expect(hiddenInVisible.length).toBe(0);
      });

      it("shows hidden achievements if unlocked", () => {
        const hiddenId = ACHIEVEMENTS.find((a) => a.hidden)?.id;
        expect(hiddenId).toBeDefined();

        const visible = getVisibleAchievements(new Set([hiddenId!]));
        const hasHidden = visible.some((a) => a.id === hiddenId);
        expect(hasHidden).toBe(true);
      });
    });
  });

  describe("storage", () => {
    describe("initializeState", () => {
      it("creates state with all achievements at 0", () => {
        const state = initializeState();

        expect(state.version).toBe("1.0.0");
        expect(state.totalUnlocked).toBe(0);
        expect(state.totalPossible).toBe(TOTAL_ACHIEVEMENTS);

        // All achievements should have initial progress
        for (const achievement of ACHIEVEMENTS) {
          const progress = state.progress[achievement.id];
          expect(progress).toBeDefined();
          expect(progress.current).toBe(0);
          expect(progress.unlocked).toBe(false);
        }
      });
    });

    describe("loadAchievements", () => {
      it("returns empty state when file does not exist", () => {
        const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "empty-"));
        fs.mkdirSync(path.join(emptyDir, ".springfield"), { recursive: true });

        const state = loadAchievements(emptyDir);
        expect(state.totalUnlocked).toBe(0);

        fs.rmSync(emptyDir, { recursive: true, force: true });
      });

      it("loads existing state", () => {
        const state = initializeState();
        state.progress["first-steps"].current = 1;
        state.progress["first-steps"].unlocked = true;
        state.totalUnlocked = 1;

        saveAchievements(testDir, state);

        const loaded = loadAchievements(testDir);
        expect(loaded.progress["first-steps"].unlocked).toBe(true);
        expect(loaded.totalUnlocked).toBe(1);
      });
    });

    describe("saveAchievements", () => {
      it("creates file in .springfield directory", () => {
        const state = initializeState();
        saveAchievements(testDir, state);

        expect(achievementsExist(testDir)).toBe(true);
      });

      it("updates lastUpdated timestamp", () => {
        const state = initializeState();

        saveAchievements(testDir, state);

        const loaded = loadAchievements(testDir);
        // Just verify it has a valid timestamp
        expect(loaded.lastUpdated).toBeTruthy();
        expect(new Date(loaded.lastUpdated).getTime()).not.toBeNaN();
      });
    });

    describe("updateProgress", () => {
      it("updates progress value", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);

        expect(state.progress["first-steps"].current).toBe(1);
      });

      it("increments when increment=true", () => {
        const state = initializeState();
        updateProgress(state, "the-chaos-monkey", 10, true);
        updateProgress(state, "the-chaos-monkey", 15, true);

        expect(state.progress["the-chaos-monkey"].current).toBe(25);
      });

      it("returns true when newly unlocked", () => {
        const state = initializeState();
        const result = updateProgress(state, "first-steps", 1);

        expect(result).toBe(true);
        expect(state.progress["first-steps"].unlocked).toBe(true);
      });

      it("returns false when already unlocked", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);
        const result = updateProgress(state, "first-steps", 1);

        expect(result).toBe(false);
      });

      it("caps progress at target", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 100);

        expect(state.progress["first-steps"].current).toBe(1);
      });
    });

    describe("getProgress", () => {
      it("returns progress for achievement", () => {
        const state = initializeState();
        const progress = getProgress(state, "first-steps");

        expect(progress).toBeDefined();
        expect(progress?.target).toBe(1);
      });

      it("returns undefined for unknown achievement", () => {
        const state = initializeState();
        const progress = getProgress(state, "nonexistent");

        expect(progress).toBeUndefined();
      });
    });

    describe("isUnlocked", () => {
      it("returns false for locked achievement", () => {
        const state = initializeState();
        expect(isUnlocked(state, "first-steps")).toBe(false);
      });

      it("returns true for unlocked achievement", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);
        expect(isUnlocked(state, "first-steps")).toBe(true);
      });
    });

    describe("getUnlockedIds", () => {
      it("returns empty set when none unlocked", () => {
        const state = initializeState();
        const unlocked = getUnlockedIds(state);
        expect(unlocked.size).toBe(0);
      });

      it("returns set of unlocked IDs", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);
        updateProgress(state, "getting-started", 10);

        const unlocked = getUnlockedIds(state);
        expect(unlocked.has("first-steps")).toBe(true);
        expect(unlocked.has("getting-started")).toBe(true);
      });
    });

    describe("getCloseToCompletion", () => {
      it("returns achievements over 50%", () => {
        const state = initializeState();
        // Chaos monkey is 50 target
        updateProgress(state, "the-chaos-monkey", 30);

        const close = getCloseToCompletion(state);
        expect(close.some(([id]) => id === "the-chaos-monkey")).toBe(true);
      });

      it("excludes unlocked achievements", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);

        const close = getCloseToCompletion(state);
        expect(close.some(([id]) => id === "first-steps")).toBe(false);
      });
    });
  });

  describe("detector", () => {
    describe("processEvent", () => {
      it("processes invocation event", () => {
        const state = initializeState();
        const event: AchievementEvent = {
          type: "invocation",
          character: "bart",
        };

        processEvent(state, event);

        // Should track unique character
        expect(state.progress["_unique_bart"]).toBeDefined();
      });

      it("tracks Bart for chaos-monkey", () => {
        const state = initializeState();

        // Simulate 50 Bart invocations
        for (let i = 0; i < 50; i++) {
          processEvent(state, { type: "invocation", character: "bart" });
        }

        expect(state.progress["the-chaos-monkey"].current).toBe(50);
        expect(state.progress["the-chaos-monkey"].unlocked).toBe(true);
      });

      it("processes artifact_created event", () => {
        const state = initializeState();

        processEvent(state, {
          type: "artifact_created",
          artifact: "project.md",
        });

        expect(state.progress["_artifact_project.md"]).toBeDefined();
      });

      it("tracks planning artifacts for methodologist", () => {
        const state = initializeState();

        for (const artifact of PLANNING_ARTIFACTS) {
          processEvent(state, { type: "artifact_created", artifact });
        }

        expect(state.progress["the-methodologist"].current).toBe(4);
      });
    });

    describe("checkNightShift", () => {
      it("triggers during night hours (0-5)", () => {
        const state = initializeState();
        const nightDate = new Date("2025-01-01T02:30:00");

        const result = checkNightShift(state, nightDate);

        expect(result).not.toBeNull();
        expect(result?.achievementId).toBe("night-shift");
      });

      it("does not trigger during day", () => {
        const state = initializeState();
        const dayDate = new Date("2025-01-01T14:30:00");

        const result = checkNightShift(state, dayDate);

        expect(result).toBeNull();
      });
    });

    describe("checkProjectCompleteness", () => {
      it("returns false when file does not exist", () => {
        expect(checkProjectCompleteness(testDir)).toBe(false);
      });

      it("returns false when missing sections", () => {
        const projectPath = path.join(testDir, ".springfield", "project.md");
        fs.writeFileSync(projectPath, "# Project\n\nSome content");

        expect(checkProjectCompleteness(testDir)).toBe(false);
      });

      it("returns true when complete", () => {
        const projectPath = path.join(testDir, ".springfield", "project.md");
        const completeContent = `# Project

## Project Overview
Detailed overview here with lots of content about what this project is all about.
This section describes the high-level goals and purpose of the entire project.
We need to include plenty of detail to make sure this passes the validation check.

## Goals
- Goal 1: Implement the core functionality
- Goal 2: Add comprehensive testing
- Goal 3: Document everything properly
- Goal 4: Ensure maintainability

## Context
This is the context section with detailed information about why we're building this.
The context helps future developers understand the decisions that were made during development.
We should include technical and business context for completeness.

## Technical Scope
Technical details go here with implementation notes and architectural decisions.
This section outlines the technologies used and the overall system architecture.
We use TypeScript for type safety and Vitest for testing.

Additional content to make sure the file is long enough to pass the 500 character validation.
`;
        fs.writeFileSync(projectPath, completeContent);

        expect(checkProjectCompleteness(testDir)).toBe(true);
      });
    });

    describe("syncWithStats", () => {
      it("syncs total invocations with milestones", () => {
        const state = initializeState();

        syncWithStats(state, { totalInvocations: 100 });

        expect(state.progress["first-steps"].unlocked).toBe(true);
        expect(state.progress["getting-started"].unlocked).toBe(true);
        expect(state.progress["regular"].unlocked).toBe(true);
        expect(state.progress["veteran"].unlocked).toBe(true);
      });

      it("syncs character counts", () => {
        const state = initializeState();

        syncWithStats(state, {
          characterCounts: {
            homer: 10,
            marge: 5,
            bart: 55,
          },
        });

        expect(state.progress["_unique_homer"]).toBeDefined();
        expect(state.progress["_unique_marge"]).toBeDefined();
        expect(state.progress["the-chaos-monkey"].unlocked).toBe(true);
      });

      it("syncs artifacts", () => {
        const state = initializeState();

        syncWithStats(state, {
          artifacts: ["project.md", "task.md", "security-review.md"],
        });

        expect(state.progress["security-conscious"].unlocked).toBe(true);
      });
    });
  });

  describe("formatter", () => {
    describe("getCelebrationMessage", () => {
      it("returns celebration with character theme", () => {
        const achievement = getAchievementById("first-steps")!;
        const message = getCelebrationMessage(achievement);

        expect(message).toContain("ACHIEVEMENT UNLOCKED");
        expect(message).toContain("First Steps");
      });

      it("includes achievement icon", () => {
        const achievement = getAchievementById("first-steps")!;
        const message = getCelebrationMessage(achievement);

        expect(message).toContain(achievement.icon);
      });
    });

    describe("formatAchievement", () => {
      it("formats unlocked achievement", () => {
        const achievement = getAchievementById("first-steps")!;
        const progress: AchievementProgress = {
          current: 1,
          target: 1,
          unlocked: true,
          unlockedAt: "2025-01-01T00:00:00Z",
        };

        const formatted = formatAchievement(achievement, progress);

        expect(formatted).toContain("[x]");
        expect(formatted).toContain("First Steps");
        expect(formatted).toContain("Unlocked:");
      });

      it("formats locked achievement with progress", () => {
        const achievement = getAchievementById("the-chaos-monkey")!;
        const progress: AchievementProgress = {
          current: 25,
          target: 50,
          unlocked: false,
          unlockedAt: null,
        };

        const formatted = formatAchievement(achievement, progress);

        expect(formatted).toContain("[ ]");
        expect(formatted).toContain("25/50");
        expect(formatted).toContain("50%");
      });

      it("hides hidden achievement details", () => {
        const hidden = ACHIEVEMENTS.find((a) => a.hidden)!;
        const progress: AchievementProgress = {
          current: 0,
          target: 1,
          unlocked: false,
          unlockedAt: null,
        };

        const formatted = formatAchievement(hidden, progress, false);

        expect(formatted).toContain("???");
        expect(formatted).not.toContain(hidden.name);
      });

      it("shows hidden achievement when unlocked", () => {
        const hidden = ACHIEVEMENTS.find((a) => a.hidden)!;
        const progress: AchievementProgress = {
          current: 1,
          target: 1,
          unlocked: true,
          unlockedAt: "2025-01-01T00:00:00Z",
        };

        const formatted = formatAchievement(hidden, progress);

        expect(formatted).toContain(hidden.name);
      });
    });

    describe("formatProgressBar", () => {
      it("shows empty bar at 0%", () => {
        const bar = formatProgressBar(0, 10, 10);
        expect(bar).toBe("[░░░░░░░░░░]");
      });

      it("shows full bar at 100%", () => {
        const bar = formatProgressBar(10, 10, 10);
        expect(bar).toBe("[██████████]");
      });

      it("shows partial bar", () => {
        const bar = formatProgressBar(5, 10, 10);
        expect(bar).toBe("[█████░░░░░]");
      });
    });

    describe("formatAchievementSummary", () => {
      it("includes total progress", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);

        const summary = formatAchievementSummary(state);

        expect(summary).toContain("Achievement Progress");
        expect(summary).toContain(`1 / ${TOTAL_ACHIEVEMENTS}`);
      });

      it("groups by category", () => {
        const state = initializeState();
        const summary = formatAchievementSummary(state);

        expect(summary).toContain("### Milestones");
        expect(summary).toContain("### Mastery");
      });
    });

    describe("formatCompactAchievements", () => {
      it("shows compact format", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);

        const compact = formatCompactAchievements(state);

        expect(compact).toContain(`Achievements: 1/${TOTAL_ACHIEVEMENTS}`);
      });

      it("shows recent unlocks", () => {
        const state = initializeState();
        updateProgress(state, "first-steps", 1);

        const compact = formatCompactAchievements(state);

        expect(compact).toContain("Recent:");
        expect(compact).toContain("First Steps");
      });
    });

    describe("formatNewUnlocks", () => {
      it("returns empty string for no unlocks", () => {
        const result = formatNewUnlocks([]);
        expect(result).toBe("");
      });

      it("formats multiple unlocks", () => {
        const result = formatNewUnlocks(["first-steps", "getting-started"]);

        expect(result).toContain("First Steps");
        expect(result).toContain("Getting Started");
      });
    });
  });
});
