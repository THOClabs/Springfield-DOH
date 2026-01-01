import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { run } from "../src/commands/summon-batch.js";

describe("Summon Batch Command", () => {
  const testDir = path.join(os.tmpdir(), "summon-batch-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("help and usage", () => {
    it("returns usage info when no arguments provided", async () => {
      const result = await run([], { cwd: testDir });

      expect(result).toContain("Batch Summon");
      expect(result).toContain("Usage");
      expect(result).toContain("Available Tiers");
      expect(result).toContain("family");
      expect(result).toContain("extended");
      expect(result).toContain("springfield");
      expect(result).toContain("specialists");
    });
  });

  describe("tier validation", () => {
    it("returns error for unknown tier", async () => {
      const result = await run(["invalid-tier"], { cwd: testDir });

      expect(result).toContain("Error");
      expect(result).toContain("Unknown Tier");
      expect(result).toContain("invalid-tier");
      expect(result).toContain("Valid tiers");
    });

    it("accepts 'family' tier alias", async () => {
      const result = await run(["family"], { cwd: testDir });

      expect(result).toContain("Batch Summon: family");
      expect(result).not.toContain("Error");
    });

    it("accepts 'simpsons' tier alias", async () => {
      const result = await run(["simpsons"], { cwd: testDir });

      expect(result).toContain("Batch Summon: simpsons");
      expect(result).not.toContain("Error");
    });

    it("accepts 'simpson_family' tier alias", async () => {
      const result = await run(["simpson_family"], { cwd: testDir });

      expect(result).toContain("Batch Summon: simpson_family");
    });

    it("accepts 'extended' tier", async () => {
      const result = await run(["extended"], { cwd: testDir });

      expect(result).toContain("Batch Summon: extended");
    });

    it("accepts 'town' tier alias for springfield", async () => {
      const result = await run(["town"], { cwd: testDir });

      expect(result).toContain("Batch Summon: town");
    });

    it("accepts 'specialist' tier alias", async () => {
      const result = await run(["specialist"], { cwd: testDir });

      expect(result).toContain("Batch Summon: specialist");
    });

    it("accepts 'all' tier", async () => {
      const result = await run(["all"], { cwd: testDir });

      expect(result).toContain("Batch Summon: all");
    });
  });

  describe("listing characters", () => {
    it("lists family characters without input", async () => {
      const result = await run(["family"], { cwd: testDir });

      expect(result).toContain("homer");
      expect(result).toContain("marge");
      expect(result).toContain("bart");
      expect(result).toContain("lisa");
      expect(result).toContain("maggie");
      expect(result).toContain("Tip:");
    });

    it("lists all characters for 'all' tier", async () => {
      const result = await run(["all"], { cwd: testDir });

      // Should contain characters from all tiers
      expect(result).toContain("homer"); // simpson_family
      expect(result).toContain("grampa"); // extended
      expect(result).toContain("moe"); // springfield
    });
  });

  describe("batch summoning with input", () => {
    it("summons all family characters with input", async () => {
      const result = await run(["family", "Review", "this", "API"], { cwd: testDir });

      expect(result).toContain("Summoning");
      expect(result).toContain("characters for");
      expect(result).toContain("Review this API");
      expect(result).toContain("Homer");
      expect(result).toContain("Marge");
      expect(result).toContain("Batch complete");
    });

    it("includes character responses in output", async () => {
      const result = await run(["family", "test"], { cwd: testDir });

      // Each character should have a section
      expect(result).toContain("## Homer");
      expect(result).toContain("## Marge");
      expect(result).toContain("## Bart");
      expect(result).toContain("## Lisa");
      expect(result).toContain("## Maggie");
      expect(result).toContain("---");
    });

    it("reports total characters summoned", async () => {
      const result = await run(["family", "test"], { cwd: testDir });

      expect(result).toContain("Batch complete: 5 characters summoned");
    });

    it("handles extended tier summoning", async () => {
      const result = await run(["extended", "test"], { cwd: testDir });

      expect(result).toContain("## Grampa");
      expect(result).toContain("## Burns");
      expect(result).toContain("## Smithers");
      expect(result).toContain("## Flanders");
    });

    it("handles specialists tier summoning", async () => {
      const result = await run(["specialists", "security audit"], { cwd: testDir });

      expect(result).toContain("Summoning");
      expect(result).toContain("security audit");
    });
  });

  describe("edge cases", () => {
    it("handles case-insensitive tier names", async () => {
      const result = await run(["FAMILY"], { cwd: testDir });

      expect(result).toContain("Batch Summon: FAMILY");
      expect(result).not.toContain("Error");
    });

    it("handles empty string input", async () => {
      const result = await run(["family", ""], { cwd: testDir });

      // Empty string should still trigger listing mode
      expect(result).toContain("Tip:");
    });

    it("preserves multi-word input", async () => {
      const result = await run(["family", "multiple", "word", "input", "here"], { cwd: testDir });

      expect(result).toContain("multiple word input here");
    });
  });
});
