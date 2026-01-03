/**
 * Stats Deep Tests (Batch 71)
 *
 * Deep testing of stats utilities with edge cases,
 * character tracking, tier calculations, and reporting.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
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
  SPRINGFIELD_DIR,
  ALL_CHARACTERS,
  CHARACTER_TIERS,
  type UsageStats,
} from "../src/index.js";

describe("loadStats Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-load-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("when Springfield directory does not exist", () => {
    it("returns null", () => {
      expect(loadStats(tempDir)).toBeNull();
    });
  });

  describe("when Springfield directory exists but no stats file", () => {
    beforeEach(() => {
      fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    });

    it("returns empty stats object", () => {
      const stats = loadStats(tempDir);
      expect(stats).not.toBeNull();
    });

    it("sets version to 1.0.0", () => {
      const stats = loadStats(tempDir);
      expect(stats?.version).toBe("1.0.0");
    });

    it("sets totalInvocations to 0", () => {
      const stats = loadStats(tempDir);
      expect(stats?.totalInvocations).toBe(0);
    });

    it("initializes all character counts to 0", () => {
      const stats = loadStats(tempDir);
      for (const char of ALL_CHARACTERS) {
        expect(stats?.characters[char]).toBe(0);
      }
    });

    it("initializes all tier counts to 0", () => {
      const stats = loadStats(tempDir);
      expect(stats?.tiers.simpson_family).toBe(0);
      expect(stats?.tiers.extended).toBe(0);
      expect(stats?.tiers.springfield).toBe(0);
      expect(stats?.tiers.specialists).toBe(0);
    });

    it("includes createdAt timestamp", () => {
      const stats = loadStats(tempDir);
      expect(stats?.createdAt).toBeDefined();
      expect(new Date(stats!.createdAt).getTime()).not.toBeNaN();
    });

    it("includes updatedAt timestamp", () => {
      const stats = loadStats(tempDir);
      expect(stats?.updatedAt).toBeDefined();
      expect(new Date(stats!.updatedAt).getTime()).not.toBeNaN();
    });
  });

  describe("when stats file exists", () => {
    beforeEach(() => {
      fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    });

    it("loads existing stats from file", () => {
      const statsFile = path.join(tempDir, SPRINGFIELD_DIR, "stats.json");
      const existingStats = {
        version: "1.0.0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
        totalInvocations: 42,
        characters: { homer: 10, lisa: 5 },
        tiers: { simpson_family: 15, extended: 0, springfield: 0, specialists: 0 },
      };
      fs.writeFileSync(statsFile, JSON.stringify(existingStats));

      const stats = loadStats(tempDir);
      expect(stats?.totalInvocations).toBe(42);
      expect(stats?.characters.homer).toBe(10);
      expect(stats?.characters.lisa).toBe(5);
    });

    it("adds missing characters from ALL_CHARACTERS", () => {
      const statsFile = path.join(tempDir, SPRINGFIELD_DIR, "stats.json");
      const existingStats = {
        version: "1.0.0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
        totalInvocations: 5,
        characters: { homer: 5 },
        tiers: { simpson_family: 5, extended: 0, springfield: 0, specialists: 0 },
      };
      fs.writeFileSync(statsFile, JSON.stringify(existingStats));

      const stats = loadStats(tempDir);
      // Should preserve existing homer count
      expect(stats?.characters.homer).toBe(5);
      // Should add missing characters with 0 count
      expect(stats?.characters.lisa).toBe(0);
      expect(stats?.characters.bart).toBe(0);
    });

    it("adds specialists tier if missing (migration)", () => {
      const statsFile = path.join(tempDir, SPRINGFIELD_DIR, "stats.json");
      const oldStats = {
        version: "1.0.0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
        totalInvocations: 10,
        characters: {},
        tiers: { simpson_family: 5, extended: 3, springfield: 2 },
      };
      fs.writeFileSync(statsFile, JSON.stringify(oldStats));

      const stats = loadStats(tempDir);
      expect(stats?.tiers.specialists).toBe(0);
    });

    it("handles corrupted JSON gracefully", () => {
      const statsFile = path.join(tempDir, SPRINGFIELD_DIR, "stats.json");
      fs.writeFileSync(statsFile, "{ invalid json }}}");

      const stats = loadStats(tempDir);
      expect(stats).not.toBeNull();
      expect(stats?.totalInvocations).toBe(0);
    });
  });
});

describe("saveStats Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-save-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns false when Springfield directory does not exist", () => {
    const stats: UsageStats = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalInvocations: 0,
      characters: {},
      tiers: { simpson_family: 0, extended: 0, springfield: 0, specialists: 0 },
    };
    expect(saveStats(tempDir, stats)).toBe(false);
  });

  it("returns true when save succeeds", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    const stats: UsageStats = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalInvocations: 5,
      characters: { homer: 5 },
      tiers: { simpson_family: 5, extended: 0, springfield: 0, specialists: 0 },
    };
    expect(saveStats(tempDir, stats)).toBe(true);
  });

  it("writes stats to file", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    const stats: UsageStats = {
      version: "1.0.0",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      totalInvocations: 10,
      characters: { lisa: 10 },
      tiers: { simpson_family: 10, extended: 0, springfield: 0, specialists: 0 },
    };
    saveStats(tempDir, stats);

    const statsFile = path.join(tempDir, SPRINGFIELD_DIR, "stats.json");
    expect(fs.existsSync(statsFile)).toBe(true);
    const content = JSON.parse(fs.readFileSync(statsFile, "utf-8"));
    expect(content.totalInvocations).toBe(10);
  });

  it("updates updatedAt timestamp", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    const oldTime = "2020-01-01T00:00:00.000Z";
    const stats: UsageStats = {
      version: "1.0.0",
      createdAt: oldTime,
      updatedAt: oldTime,
      totalInvocations: 0,
      characters: {},
      tiers: { simpson_family: 0, extended: 0, springfield: 0, specialists: 0 },
    };
    saveStats(tempDir, stats);

    const statsFile = path.join(tempDir, SPRINGFIELD_DIR, "stats.json");
    const content = JSON.parse(fs.readFileSync(statsFile, "utf-8"));
    expect(new Date(content.updatedAt).getTime()).toBeGreaterThan(new Date(oldTime).getTime());
  });
});

describe("recordInvocation Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-record-"));
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns success: false when Springfield directory does not exist", () => {
    const noDir = path.join(tempDir, "nonexistent");
    const result = recordInvocation(noDir, "homer");
    expect(result.success).toBe(false);
    expect(result.milestone).toBeNull();
  });

  it("returns success: true on successful recording", () => {
    const result = recordInvocation(tempDir, "homer");
    expect(result.success).toBe(true);
  });

  it("increments character count", () => {
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "lisa");

    const stats = loadStats(tempDir);
    expect(stats?.characters.lisa).toBe(3);
  });

  it("increments totalInvocations", () => {
    recordInvocation(tempDir, "bart");
    recordInvocation(tempDir, "homer");

    const stats = loadStats(tempDir);
    expect(stats?.totalInvocations).toBe(2);
  });

  it("increments simpson_family tier for simpson characters", () => {
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "marge");
    recordInvocation(tempDir, "bart");

    const stats = loadStats(tempDir);
    expect(stats?.tiers.simpson_family).toBe(3);
  });

  it("increments extended tier for extended characters", () => {
    recordInvocation(tempDir, "grampa");
    recordInvocation(tempDir, "burns");

    const stats = loadStats(tempDir);
    expect(stats?.tiers.extended).toBe(2);
  });

  it("increments springfield tier for springfield characters", () => {
    recordInvocation(tempDir, "moe");
    recordInvocation(tempDir, "krusty");

    const stats = loadStats(tempDir);
    expect(stats?.tiers.springfield).toBe(2);
  });

  it("increments specialists tier for specialist characters", () => {
    recordInvocation(tempDir, "dr-nick");
    recordInvocation(tempDir, "kent");

    const stats = loadStats(tempDir);
    expect(stats?.tiers.specialists).toBe(2);
  });

  it("handles unknown characters", () => {
    recordInvocation(tempDir, "unknown-char");
    const stats = loadStats(tempDir);
    expect(stats?.characters["unknown-char"]).toBe(1);
    expect(stats?.totalInvocations).toBe(1);
  });

  it("tracks multiple characters independently", () => {
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "bart");
    recordInvocation(tempDir, "bart");
    recordInvocation(tempDir, "bart");

    const stats = loadStats(tempDir);
    expect(stats?.characters.homer).toBe(2);
    expect(stats?.characters.lisa).toBe(1);
    expect(stats?.characters.bart).toBe(3);
  });
});

describe("getTopCharacters Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-top-"));
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns empty array when Springfield directory does not exist", () => {
    const noDir = path.join(tempDir, "nonexistent");
    expect(getTopCharacters(noDir)).toEqual([]);
  });

  it("returns empty array when no invocations", () => {
    expect(getTopCharacters(tempDir)).toEqual([]);
  });

  it("returns top N characters by count", () => {
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "bart");

    const top = getTopCharacters(tempDir, 2);
    expect(top).toHaveLength(2);
    expect(top[0].character).toBe("homer");
    expect(top[0].count).toBe(3);
    expect(top[1].character).toBe("lisa");
    expect(top[1].count).toBe(2);
  });

  it("defaults to top 10", () => {
    for (let i = 0; i < 15; i++) {
      recordInvocation(tempDir, CHARACTER_TIERS.simpson_family[i % 5]);
    }
    for (let i = 0; i < 10; i++) {
      recordInvocation(tempDir, CHARACTER_TIERS.extended[i % 4]);
    }

    const top = getTopCharacters(tempDir);
    expect(top.length).toBeLessThanOrEqual(10);
  });

  it("excludes characters with 0 invocations", () => {
    recordInvocation(tempDir, "homer");

    const top = getTopCharacters(tempDir, 100);
    expect(top).toHaveLength(1);
    expect(top[0].character).toBe("homer");
  });

  it("sorts by count descending", () => {
    recordInvocation(tempDir, "bart");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");

    const top = getTopCharacters(tempDir, 10);
    expect(top[0].count).toBeGreaterThanOrEqual(top[1].count);
    expect(top[1].count).toBeGreaterThanOrEqual(top[2].count);
  });

  it("returns correct structure", () => {
    recordInvocation(tempDir, "moe");

    const top = getTopCharacters(tempDir);
    expect(top[0]).toHaveProperty("character");
    expect(top[0]).toHaveProperty("count");
    expect(typeof top[0].character).toBe("string");
    expect(typeof top[0].count).toBe("number");
  });
});

describe("formatStatsReport Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-report-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns no-stats message when Springfield directory does not exist", () => {
    const report = formatStatsReport(tempDir);
    expect(report).toContain("No stats available");
    expect(report).toContain("/springfield init");
  });

  it("returns no-invocations message when no characters invoked", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    const report = formatStatsReport(tempDir);
    expect(report).toContain("No character invocations recorded yet");
  });

  it("includes total invocations in report", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "lisa");

    const report = formatStatsReport(tempDir);
    expect(report).toContain("Total Invocations");
    expect(report).toContain("2");
  });

  it("includes tier breakdown in report", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "burns");
    recordInvocation(tempDir, "moe");

    const report = formatStatsReport(tempDir);
    expect(report).toContain("Simpson Family");
    expect(report).toContain("Extended");
    expect(report).toContain("Springfield");
    expect(report).toContain("Specialists");
  });

  it("includes top characters list", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "lisa");

    const report = formatStatsReport(tempDir);
    expect(report).toContain("Top Characters");
    expect(report).toContain("homer");
    expect(report).toContain("lisa");
  });

  it("formats dates in report", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "bart");

    const report = formatStatsReport(tempDir);
    expect(report).toContain("Tracking Since");
    expect(report).toContain("Last Updated");
  });

  it("uses Markdown formatting", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");

    const report = formatStatsReport(tempDir);
    expect(report).toContain("# Usage Statistics");
    expect(report).toContain("##");
    expect(report).toContain("|");
  });
});

describe("resetStats Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "stats-reset-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns false when Springfield directory does not exist", () => {
    expect(resetStats(tempDir)).toBe(false);
  });

  it("returns true on successful reset", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    expect(resetStats(tempDir)).toBe(true);
  });

  it("resets all character counts to 0", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "lisa");
    recordInvocation(tempDir, "bart");

    resetStats(tempDir);

    const stats = loadStats(tempDir);
    expect(stats?.characters.homer).toBe(0);
    expect(stats?.characters.lisa).toBe(0);
    expect(stats?.characters.bart).toBe(0);
  });

  it("resets totalInvocations to 0", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "homer");

    resetStats(tempDir);

    const stats = loadStats(tempDir);
    expect(stats?.totalInvocations).toBe(0);
  });

  it("resets all tier counts to 0", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    recordInvocation(tempDir, "homer");
    recordInvocation(tempDir, "burns");
    recordInvocation(tempDir, "moe");
    recordInvocation(tempDir, "dr-nick");

    resetStats(tempDir);

    const stats = loadStats(tempDir);
    expect(stats?.tiers.simpson_family).toBe(0);
    expect(stats?.tiers.extended).toBe(0);
    expect(stats?.tiers.springfield).toBe(0);
    expect(stats?.tiers.specialists).toBe(0);
  });

  it("updates createdAt to new timestamp", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    const beforeReset = loadStats(tempDir);
    const beforeCreated = beforeReset?.createdAt;

    // Wait a bit to ensure different timestamp
    const waitStart = Date.now();
    while (Date.now() - waitStart < 10) { /* spin */ }

    resetStats(tempDir);

    const afterReset = loadStats(tempDir);
    expect(afterReset?.createdAt).not.toBe(beforeCreated);
  });
});

describe("Character Tier Mappings", () => {
  it("simpson_family contains homer", () => {
    expect(CHARACTER_TIERS.simpson_family).toContain("homer");
  });

  it("simpson_family contains marge", () => {
    expect(CHARACTER_TIERS.simpson_family).toContain("marge");
  });

  it("simpson_family contains bart", () => {
    expect(CHARACTER_TIERS.simpson_family).toContain("bart");
  });

  it("simpson_family contains lisa", () => {
    expect(CHARACTER_TIERS.simpson_family).toContain("lisa");
  });

  it("simpson_family contains maggie", () => {
    expect(CHARACTER_TIERS.simpson_family).toContain("maggie");
  });

  it("extended contains grampa", () => {
    expect(CHARACTER_TIERS.extended).toContain("grampa");
  });

  it("extended contains burns", () => {
    expect(CHARACTER_TIERS.extended).toContain("burns");
  });

  it("springfield contains moe", () => {
    expect(CHARACTER_TIERS.springfield).toContain("moe");
  });

  it("springfield contains krusty", () => {
    expect(CHARACTER_TIERS.springfield).toContain("krusty");
  });

  it("specialists contains dr-nick", () => {
    expect(CHARACTER_TIERS.specialists).toContain("dr-nick");
  });
});

describe("ALL_CHARACTERS Constant", () => {
  it("contains at least 41 characters", () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThanOrEqual(41);
  });

  it("includes all simpson_family members", () => {
    for (const char of CHARACTER_TIERS.simpson_family) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it("includes all extended members", () => {
    for (const char of CHARACTER_TIERS.extended) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it("includes all springfield members", () => {
    for (const char of CHARACTER_TIERS.springfield) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });

  it("includes all specialists members", () => {
    for (const char of CHARACTER_TIERS.specialists) {
      expect(ALL_CHARACTERS).toContain(char);
    }
  });
});
