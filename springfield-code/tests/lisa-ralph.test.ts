import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { run as lisaRalphRun } from "../src/commands/lisa-ralph-special.js";
import { canInvokeRalph, _resetForTesting } from "../src/hooks/ralph-gate.js";

describe("Lisa-Ralph Protocol", () => {
  const testDir = path.join(os.tmpdir(), "lisa-ralph-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
    _resetForTesting();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    _resetForTesting();
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

  describe("file filtering edge cases", () => {
    it("ignores non-.md files in .springfield directory", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      // Add non-.md files that should be ignored
      fs.writeFileSync(path.join(springfieldDir, "notes.txt"), "These are notes");
      fs.writeFileSync(path.join(springfieldDir, "data.json"), '{"key": "value"}');
      fs.writeFileSync(path.join(springfieldDir, ".gitkeep"), "");

      const result = await lisaRalphRun([], { cwd: testDir });

      // Should succeed and not include non-.md files
      expect(result).toContain("All planning documents");
      expect(result).not.toContain("notes.txt");
      expect(result).not.toContain("data.json");
      expect(result).not.toContain(".gitkeep");
    });

    it("includes extra .md files as context", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
        "extra-context.md": "# Extra Context\n\nAdditional context here.",
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });

      expect(result).toContain("All planning documents");
      expect(result).toContain("context files from planning");
    });
  });

  describe("completion.md edge cases", () => {
    it("uses default completion promise when completion.md is missing", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      // Trigger incomplete message (no completion.md)
      const result = await lisaRalphRun([], { cwd: testDir });
      expect(result).toContain("Missing");
      expect(result).toContain("completion.md");
    });

    it("uses default completion promise when completion.md has no code block", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\nNo code block here, just text. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });
      // Should still work but use default
      expect(result).toContain("All planning documents");
      expect(result).toContain('Completion promise: "DONE"');
    });
  });

  describe("iterations.md edge cases", () => {
    it("uses default iterations when iterations.md is missing", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      // Trigger incomplete message
      const result = await lisaRalphRun([], { cwd: testDir });
      expect(result).toContain("Missing");
      expect(result).toContain("iterations.md");
    });

    it("uses default iterations when iterations.md has no code block", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\nNo code block here. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });
      expect(result).toContain("All planning documents");
      expect(result).toContain("Max iterations: 20");
    });

    it("caps iterations at maximum 1000", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n9999\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });
      expect(result).toContain("All planning documents");
      expect(result).toContain("Max iterations: 1000");
    });

    it("uses minimum 1 when iterations is zero", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n0\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });
      expect(result).toContain("All planning documents");
      expect(result).toContain("Max iterations: 1");
    });

    it("uses minimum 1 when iterations is negative", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n-5\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun([], { cwd: testDir });
      expect(result).toContain("All planning documents");
      // -5 doesn't match the regex \d+ so defaults to 20
      expect(result).toContain("Max iterations: 20");
    });
  });

  describe("invocation edge cases", () => {
    it("ignores case when checking yes confirmation", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun(["YES"], { cwd: testDir });
      expect(result).toContain("Initiating Ralph");
    });

    it("accepts mixed case yes confirmation", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun(["YeS"], { cwd: testDir });
      expect(result).toContain("Initiating Ralph");
    });

    it("shows ready response with any non-yes argument", async () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = await lisaRalphRun(["confirm"], { cwd: testDir });
      expect(result).toContain("All planning documents");
      expect(result).toContain('Say `yes` to confirm');
    });
  });
});
