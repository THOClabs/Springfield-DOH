import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { run as lisaRun } from "../src/commands/lisa.js";
import { run as statsRun } from "../src/commands/stats.js";

describe("Lisa Command Edge Cases", () => {
  const testDir = path.join(os.tmpdir(), "lisa-stats-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("normal summon path (non-ralph)", () => {
    it("summons lisa normally with non-ralph arguments", async () => {
      const result = await lisaRun(["architecture", "review"], { cwd: testDir });

      expect(result).toContain("Lisa");
      expect(result).toContain("considers the request");
    });

    it("summons lisa with empty args", async () => {
      const result = await lisaRun([], { cwd: testDir });

      expect(result).toContain("Lisa");
    });

    it("summons lisa with single word input", async () => {
      const result = await lisaRun(["analyze"], { cwd: testDir });

      expect(result).toContain("Lisa");
    });

    it("handles 'RALPH' in uppercase as ralph subcommand", async () => {
      const result = await lisaRun(["RALPH"], { cwd: testDir });

      // Should trigger lisa-ralph-special path (shows not ready message)
      expect(result).toContain("not ready for Ralph");
    });

    it("handles 'Ralph' with mixed case as ralph subcommand", async () => {
      const result = await lisaRun(["Ralph"], { cwd: testDir });

      expect(result).toContain("not ready for Ralph");
    });

    it("treats 'ralph-something' as normal input, not subcommand", async () => {
      const result = await lisaRun(["ralph-something"], { cwd: testDir });

      // This should NOT trigger lisa-ralph since it's not exactly "ralph"
      expect(result).toContain("Lisa");
      expect(result).toContain("considers the request");
    });
  });
});

describe("Stats Command Edge Cases", () => {
  const testDir = path.join(os.tmpdir(), "stats-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("reset failure branch", () => {
    it("returns error when reset fails (no Springfield dir)", async () => {
      // Remove the springfield directory
      fs.rmSync(springfieldDir, { recursive: true, force: true });

      const result = await statsRun(["reset"], { cwd: testDir });

      expect(result).toContain("Error");
      expect(result).toContain("Could not reset stats");
      expect(result).toContain("Springfield initialized");
    });

    it("returns error when reset fails on nonexistent path", async () => {
      const result = await statsRun(["reset"], { cwd: "/nonexistent/path" });

      expect(result).toContain("Error");
      expect(result).toContain("Could not reset stats");
    });
  });

  describe("successful reset", () => {
    it("resets stats successfully when Springfield is initialized", async () => {
      // Write a stats file first
      fs.writeFileSync(
        path.join(springfieldDir, "stats.json"),
        JSON.stringify({ totalInvocations: 10, characters: { homer: 5 } })
      );

      const result = await statsRun(["reset"], { cwd: testDir });

      expect(result).toContain("Stats Reset");
      expect(result).toContain("cleared");
    });
  });

  describe("view stats", () => {
    it("returns stats report when no subcommand", async () => {
      const result = await statsRun([], { cwd: testDir });

      expect(result).toContain("Statistics");
    });

    it("returns stats report with unknown subcommand", async () => {
      const result = await statsRun(["unknown"], { cwd: testDir });

      // Unknown subcommand falls through to formatStatsReport
      expect(result).toContain("Statistics");
    });
  });
});
