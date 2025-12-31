import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { run as lisaRalphRun } from "../src/commands/lisa-ralph-special.js";
import { setRalphInitiated, canInvokeRalph } from "../src/hooks/ralph-gate.js";

describe("Lisa-Ralph Protocol", () => {
  const testDir = "/tmp/lisa-ralph-test-" + Date.now();
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
    setRalphInitiated(false);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    setRalphInitiated(false);
  });

  describe("prerequisites check", () => {
    it("returns not initialized message when no .springfield", async () => {
      fs.rmSync(springfieldDir, { recursive: true, force: true });
      const result = await lisaRalphRun([], { cwd: testDir });

      expect(result).toContain("isn't initialized");
    });

    it("returns incomplete message when files are missing", async () => {
      // Create only project.md
      fs.writeFileSync(
        path.join(springfieldDir, "project.md"),
        "# Project\n\nThis is a complete project definition with enough content to pass validation. ".repeat(10)
      );

      const result = await lisaRalphRun([], { cwd: testDir });

      expect(result).toContain("not ready");
      expect(result).toContain("Missing");
    });

    it("returns ready message when all files are present and complete", async () => {
      // Create all required files with complete content
      const files = {
        "project.md": "# Project Definition\n\nComplete project description with sufficient content for validation purposes. ".repeat(10),
        "task.md": "# Task Definition\n\nComplete task description with sufficient content for validation purposes. ".repeat(10),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nComplete criteria with sufficient content. ".repeat(10),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfiguration with sufficient content. ".repeat(10),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });

      expect(result).toContain("All planning documents");
      expect(result).toContain("yes");
    });
  });

  describe("confirmation flow", () => {
    it("invokes Ralph when user confirms with yes", async () => {
      // Create all required files
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun(["yes"], { cwd: testDir });

      expect(result).toContain("Initiating Ralph");
      expect(result).toContain("ralph-loop");
    });

    it("sets ralph initiation flag when confirming", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      // Before calling, Ralph should not be allowed
      expect(canInvokeRalph()).toBe(false);

      await lisaRalphRun(["yes"], { cwd: testDir });

      // After Lisa initiates, Ralph should be allowed
      expect(canInvokeRalph()).toBe(true);
    });
  });
});
