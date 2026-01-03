/**
 * Tests for src/commands/veterans-lounge.ts - Veterans Lounge command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  run,
  isVeteran,
  getVeteranProgress,
  VETERAN_THRESHOLD,
} from "../src/commands/veterans-lounge.js";
import { recordInvocation } from "../src/utils/stats.js";
import { SPRINGFIELD_DIR } from "../src/constants.js";

describe("veterans-lounge command", () => {
  let tempDir: string;
  let springfieldDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "veterans-lounge-test-"));
    springfieldDir = path.join(tempDir, SPRINGFIELD_DIR);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("VETERAN_THRESHOLD", () => {
    it("is defined as 100", () => {
      expect(VETERAN_THRESHOLD).toBe(100);
    });
  });

  describe("isVeteran", () => {
    it("returns false when springfield directory does not exist", () => {
      expect(isVeteran(tempDir)).toBe(false);
    });

    it("returns false when stats have zero invocations", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      expect(isVeteran(tempDir)).toBe(false);
    });

    it("returns false when under threshold", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      for (let i = 0; i < 99; i++) {
        recordInvocation(tempDir, "homer");
      }
      expect(isVeteran(tempDir)).toBe(false);
    });

    it("returns true when at threshold", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      for (let i = 0; i < 100; i++) {
        recordInvocation(tempDir, "homer");
      }
      expect(isVeteran(tempDir)).toBe(true);
    });

    it("returns true when over threshold", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      for (let i = 0; i < 150; i++) {
        recordInvocation(tempDir, "homer");
      }
      expect(isVeteran(tempDir)).toBe(true);
    });
  });

  describe("getVeteranProgress", () => {
    it("returns zero progress when no stats", () => {
      const progress = getVeteranProgress(tempDir);
      expect(progress.current).toBe(0);
      expect(progress.required).toBe(100);
      expect(progress.percentage).toBe(0);
      expect(progress.isUnlocked).toBe(false);
    });

    it("returns correct progress when under threshold", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      for (let i = 0; i < 50; i++) {
        recordInvocation(tempDir, "homer");
      }

      const progress = getVeteranProgress(tempDir);
      expect(progress.current).toBe(50);
      expect(progress.required).toBe(100);
      expect(progress.percentage).toBe(50);
      expect(progress.isUnlocked).toBe(false);
    });

    it("caps percentage at 100", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      for (let i = 0; i < 150; i++) {
        recordInvocation(tempDir, "homer");
      }

      const progress = getVeteranProgress(tempDir);
      expect(progress.percentage).toBe(100);
      expect(progress.isUnlocked).toBe(true);
    });
  });

  describe("run command", () => {
    describe("when locked (under 100 invocations)", () => {
      it("shows locked message with progress", async () => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        for (let i = 0; i < 25; i++) {
          recordInvocation(tempDir, "homer");
        }

        const result = await run([], { cwd: tempDir });

        expect(result).toContain("Veterans Lounge");
        expect(result).toContain("LOCKED");
        expect(result).toContain("25/100");
        expect(result).toContain("75 more commands");
      });

      it("shows singular 'command' when 1 remaining", async () => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        for (let i = 0; i < 99; i++) {
          recordInvocation(tempDir, "homer");
        }

        const result = await run([], { cwd: tempDir });

        expect(result).toContain("1 more command");
        expect(result).not.toContain("1 more commands");
      });
    });

    describe("when unlocked (100+ invocations)", () => {
      beforeEach(() => {
        fs.mkdirSync(springfieldDir, { recursive: true });
        for (let i = 0; i < 100; i++) {
          recordInvocation(tempDir, "homer");
        }
      });

      it("shows help text by default", async () => {
        const result = await run([], { cwd: tempDir });

        expect(result).toContain("Veterans Lounge");
        expect(result).toContain("Available Commands");
        expect(result).toContain("dashboard");
        expect(result).toContain("export");
      });

      it("shows help with 'help' subcommand", async () => {
        const result = await run(["help"], { cwd: tempDir });

        expect(result).toContain("Available Commands");
      });

      describe("dashboard subcommand", () => {
        it("shows advanced statistics", async () => {
          const result = await run(["dashboard"], { cwd: tempDir });

          expect(result).toContain("Dashboard");
          expect(result).toContain("Overview");
          expect(result).toContain("Total Invocations");
          expect(result).toContain("Tier Distribution");
          expect(result).toContain("Character Usage Heatmap");
        });

        it("works with 'dash' shorthand", async () => {
          const result = await run(["dash"], { cwd: tempDir });

          expect(result).toContain("Dashboard");
        });

        it("shows top characters", async () => {
          // Add some variety
          for (let i = 0; i < 10; i++) {
            recordInvocation(tempDir, "bart");
          }
          for (let i = 0; i < 5; i++) {
            recordInvocation(tempDir, "lisa");
          }

          const result = await run(["dashboard"], { cwd: tempDir });

          expect(result).toContain("homer");
          expect(result).toContain("bart");
          expect(result).toContain("lisa");
        });
      });

      describe("export subcommand", () => {
        it("exports to JSON by default", async () => {
          const result = await run(["export"], { cwd: tempDir });

          expect(result).toContain("Export Complete");
          expect(result).toContain("Format: JSON");

          // Check file was created
          const exportsDir = path.join(springfieldDir, "exports");
          expect(fs.existsSync(exportsDir)).toBe(true);

          const files = fs.readdirSync(exportsDir);
          expect(files.some((f) => f.endsWith(".json"))).toBe(true);
        });

        it("exports to JSON with explicit format", async () => {
          const result = await run(["export", "json"], { cwd: tempDir });

          expect(result).toContain("Format: JSON");
        });

        it("exports to Markdown with 'markdown' format", async () => {
          const result = await run(["export", "markdown"], { cwd: tempDir });

          expect(result).toContain("Export Complete");
          expect(result).toContain("Format: Markdown");

          const exportsDir = path.join(springfieldDir, "exports");
          const files = fs.readdirSync(exportsDir);
          expect(files.some((f) => f.endsWith(".md"))).toBe(true);
        });

        it("exports to Markdown with 'md' shorthand", async () => {
          const result = await run(["export", "md"], { cwd: tempDir });

          expect(result).toContain("Format: Markdown");
        });

        it("shows error for unknown format", async () => {
          const result = await run(["export", "xml"], { cwd: tempDir });

          expect(result).toContain("Unknown export format");
          expect(result).toContain("Supported formats");
        });
      });
    });
  });

  describe("integration with springfield command", () => {
    // Note: Full integration tested in springfield.test.ts
    it("exports run function correctly", () => {
      expect(typeof run).toBe("function");
    });
  });
});
