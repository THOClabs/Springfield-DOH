/**
 * Tests for src/utils/stats.ts - Usage statistics edge cases
 * v3.0.1.1 - Coverage enhancement for branch coverage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  loadStats,
  saveStats,
  recordInvocation,
  getTopCharacters,
  formatStatsReport,
  resetStats,
  checkMilestone,
} from "../src/utils/stats.js";
import type { UsageStats } from "../src/utils/stats.js";

describe("stats.ts utilities", () => {
  let tempDir: string;
  let springfieldDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-utils-test-"));
    springfieldDir = path.join(tempDir, ".springfield");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("loadStats", () => {
    it("returns null when springfield directory does not exist", () => {
      const stats = loadStats(tempDir);
      expect(stats).toBeNull();
    });

    it("creates empty stats when stats file does not exist", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      const stats = loadStats(tempDir);
      
      expect(stats).not.toBeNull();
      expect(stats!.totalInvocations).toBe(0);
      expect(stats!.version).toBe("1.0.0");
    });

    it("loads existing stats from file", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      const statsFile = path.join(springfieldDir, "stats.json");
      const existingStats: UsageStats = {
        version: "1.0.0",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        totalInvocations: 10,
        characters: { homer: 5, bart: 3, lisa: 2 },
        tiers: { simpson_family: 10, extended: 0, springfield: 0, specialists: 0 },
      };
      fs.writeFileSync(statsFile, JSON.stringify(existingStats));
      
      const stats = loadStats(tempDir);
      
      expect(stats!.totalInvocations).toBe(10);
      expect(stats!.characters.homer).toBe(5);
    });

    it("migrates stats with missing character entries", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      const statsFile = path.join(springfieldDir, "stats.json");
      // Old stats missing some characters
      const oldStats = {
        version: "1.0.0",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        totalInvocations: 5,
        characters: { homer: 5 }, // Missing other characters
        tiers: { simpson_family: 5, extended: 0, springfield: 0, specialists: 0 },
      };
      fs.writeFileSync(statsFile, JSON.stringify(oldStats));
      
      const stats = loadStats(tempDir);
      
      // Should have added missing characters with 0 count
      expect(stats!.characters.homer).toBe(5);
      expect(stats!.characters.bart).toBe(0);
      expect(stats!.characters.lisa).toBe(0);
    });

    it("migrates stats missing specialists tier", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      const statsFile = path.join(springfieldDir, "stats.json");
      // v2.0.0 stats without specialists tier
      const oldStats = {
        version: "1.0.0",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        totalInvocations: 5,
        characters: { homer: 5 },
        tiers: { simpson_family: 5, extended: 0, springfield: 0 },
      };
      fs.writeFileSync(statsFile, JSON.stringify(oldStats));
      
      const stats = loadStats(tempDir);
      
      expect(stats!.tiers.specialists).toBe(0);
    });

    it("returns empty stats on parse error", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      const statsFile = path.join(springfieldDir, "stats.json");
      fs.writeFileSync(statsFile, "invalid json content");
      
      const stats = loadStats(tempDir);
      
      expect(stats).not.toBeNull();
      expect(stats!.totalInvocations).toBe(0);
    });
  });

  describe("saveStats", () => {
    it("returns false when springfield directory does not exist", () => {
      const stats: UsageStats = {
        version: "1.0.0",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        totalInvocations: 0,
        characters: {},
        tiers: { simpson_family: 0, extended: 0, springfield: 0, specialists: 0 },
      };
      
      const result = saveStats(tempDir, stats);
      
      expect(result).toBe(false);
    });

    it("saves stats successfully", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      const stats: UsageStats = {
        version: "1.0.0",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        totalInvocations: 5,
        characters: { homer: 5 },
        tiers: { simpson_family: 5, extended: 0, springfield: 0, specialists: 0 },
      };
      
      const result = saveStats(tempDir, stats);
      
      expect(result).toBe(true);
      const saved = JSON.parse(
        fs.readFileSync(path.join(springfieldDir, "stats.json"), "utf-8")
      );
      expect(saved.totalInvocations).toBe(5);
    });

    it("updates timestamp on save", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      const oldDate = "2020-01-01T00:00:00.000Z";
      const stats: UsageStats = {
        version: "1.0.0",
        createdAt: oldDate,
        updatedAt: oldDate,
        totalInvocations: 1,
        characters: { homer: 1 },
        tiers: { simpson_family: 1, extended: 0, springfield: 0, specialists: 0 },
      };
      
      saveStats(tempDir, stats);
      
      const saved = JSON.parse(
        fs.readFileSync(path.join(springfieldDir, "stats.json"), "utf-8")
      );
      expect(saved.updatedAt).not.toBe(oldDate);
    });
  });

  describe("recordInvocation", () => {
    it("returns success: false when springfield directory does not exist", () => {
      const result = recordInvocation(tempDir, "homer");
      expect(result.success).toBe(false);
      expect(result.milestone).toBeNull();
    });

    it("records invocation for existing character", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "homer");
      
      const stats = loadStats(tempDir);
      expect(stats!.characters.homer).toBe(2);
      expect(stats!.totalInvocations).toBe(2);
    });

    it("records invocation for new/unknown character", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "unknown_character");
      
      const stats = loadStats(tempDir);
      expect(stats!.characters.unknown_character).toBe(1);
    });

    it("increments tier count for simpson_family characters", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "bart");
      
      const stats = loadStats(tempDir);
      expect(stats!.tiers.simpson_family).toBe(2);
    });

    it("increments tier count for extended characters", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "flanders");
      
      const stats = loadStats(tempDir);
      expect(stats!.tiers.extended).toBe(1);
    });

    it("increments tier count for springfield characters", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "apu");
      
      const stats = loadStats(tempDir);
      expect(stats!.tiers.springfield).toBe(1);
    });

    it("does not increment tier count for unknown character", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      recordInvocation(tempDir, "not_a_real_character");

      const stats = loadStats(tempDir);
      expect(stats!.tiers.simpson_family).toBe(0);
      expect(stats!.tiers.extended).toBe(0);
      expect(stats!.tiers.springfield).toBe(0);
      expect(stats!.tiers.specialists).toBe(0);
    });
  });

  describe("checkMilestone", () => {
    it("returns null when no milestone crossed", () => {
      expect(checkMilestone(5, 6)).toBeNull();
      expect(checkMilestone(11, 15)).toBeNull();
    });

    it("returns celebration for 10th command milestone", () => {
      const message = checkMilestone(9, 10);
      expect(message).toContain("10 Springfield commands");
      expect(message).toContain("Chief Wiggum");
    });

    it("returns celebration for 100th command milestone", () => {
      const message = checkMilestone(99, 100);
      expect(message).toContain("One hundred commands");
      expect(message).toContain("Burns");
    });

    it("returns celebration when jumping over milestone", () => {
      const message = checkMilestone(8, 12);
      expect(message).toContain("10 Springfield commands");
    });

    it("returns lowest milestone when crossing multiple", () => {
      // If somehow we jump from 5 to 105, should still get milestone 10 first
      const message = checkMilestone(5, 105);
      expect(message).toContain("10 Springfield commands");
    });
  });

  describe("getTopCharacters", () => {
    it("returns empty array when springfield directory does not exist", () => {
      const top = getTopCharacters(tempDir);
      expect(top).toEqual([]);
    });

    it("returns empty array when no invocations", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      const top = getTopCharacters(tempDir);
      
      expect(top).toEqual([]);
    });

    it("returns characters sorted by count descending", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "lisa");
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "bart");
      recordInvocation(tempDir, "bart");
      recordInvocation(tempDir, "bart");
      
      const top = getTopCharacters(tempDir, 3);
      
      expect(top[0].character).toBe("bart");
      expect(top[0].count).toBe(3);
      expect(top[1].character).toBe("homer");
      expect(top[1].count).toBe(2);
      expect(top[2].character).toBe("lisa");
      expect(top[2].count).toBe(1);
    });

    it("limits results to n", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "bart");
      recordInvocation(tempDir, "lisa");
      recordInvocation(tempDir, "marge");
      
      const top = getTopCharacters(tempDir, 2);
      
      expect(top.length).toBe(2);
    });
  });

  describe("formatStatsReport", () => {
    it("shows no stats message when springfield directory does not exist", () => {
      const report = formatStatsReport(tempDir);
      
      expect(report).toContain("No stats available");
      expect(report).toContain("/springfield init");
    });

    it("shows no invocations message when zero invocations", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      const report = formatStatsReport(tempDir);
      
      expect(report).toContain("No character invocations recorded yet");
    });

    it("shows full report with invocation data", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "bart");
      
      const report = formatStatsReport(tempDir);
      
      expect(report).toContain("Total Invocations");
      expect(report).toContain("By Tier");
      expect(report).toContain("Top Characters");
      expect(report).toContain("homer");
      expect(report).toContain("bart");
    });
  });

  describe("resetStats", () => {
    it("returns false when springfield directory does not exist", () => {
      const result = resetStats(tempDir);
      expect(result).toBe(false);
    });

    it("resets all stats to zero", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "bart");
      
      const result = resetStats(tempDir);
      
      expect(result).toBe(true);
      const stats = loadStats(tempDir);
      expect(stats!.totalInvocations).toBe(0);
      expect(stats!.characters.homer).toBe(0);
    });
  });
});
