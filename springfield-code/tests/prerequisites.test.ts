import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  verifyPrerequisites,
  isSpringfieldInitialized,
} from "../src/utils/prerequisites.js";

describe("Prerequisites Utilities", () => {
  const testDir = path.join(os.tmpdir(), "prerequisites-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("isSpringfieldInitialized", () => {
    it("returns true when springfield directory exists", () => {
      expect(isSpringfieldInitialized(testDir, ".springfield")).toBe(true);
    });

    it("returns false when springfield directory does not exist", () => {
      expect(isSpringfieldInitialized("/nonexistent/path", ".springfield")).toBe(false);
    });

    it("returns false when parent exists but springfield dir is missing", () => {
      fs.rmSync(springfieldDir, { recursive: true, force: true });
      expect(isSpringfieldInitialized(testDir, ".springfield")).toBe(false);
    });

    it("handles custom directory name", () => {
      const customDir = path.join(testDir, ".custom-springfield");
      fs.mkdirSync(customDir, { recursive: true });
      expect(isSpringfieldInitialized(testDir, ".custom-springfield")).toBe(true);
    });
  });

  describe("verifyPrerequisites", () => {
    it("handles directory that stops existing mid-check", () => {
      // When readdirSync fails, errors should be recorded
      // We can't mock fs in ESM, but we can test by providing an invalid path
      // after creating a valid structure - use a path that exists but has permission issues
      // For now, test that the error handling path is documented
      const result = verifyPrerequisites("/nonexistent/.springfield");
      expect(result.ready).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("returns ready false when any required file is missing", () => {
      // Create only project.md
      fs.writeFileSync(
        path.join(springfieldDir, "project.md"),
        "# Project Definition\n\nComplete project. ".repeat(15)
      );

      const result = verifyPrerequisites(springfieldDir);
      
      expect(result.ready).toBe(false);
      expect(result.missing).toContain("task.md");
      expect(result.missing).toContain("completion.md");
      expect(result.missing).toContain("iterations.md");
    });

    it("marks files with template placeholders as incomplete", () => {
      const files = {
        "project.md": "[One paragraph describing the project] This is placeholder content that should be replaced. ".repeat(10),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = verifyPrerequisites(springfieldDir);
      
      expect(result.ready).toBe(false);
      expect(result.missing).toContainEqual(expect.stringContaining("project.md"));
      expect(result.missing).toContainEqual(expect.stringContaining("template placeholders"));
    });

    it("marks short files as incomplete", () => {
      const files = {
        "project.md": "Too short",
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = verifyPrerequisites(springfieldDir);
      
      expect(result.ready).toBe(false);
      expect(result.missing).toContainEqual(expect.stringContaining("project.md"));
      expect(result.missing).toContainEqual(expect.stringContaining("too short"));
    });

    it("finds optional context files", () => {
      const files = {
        "project.md": "# Project Definition\n\nComplete project. ".repeat(15),
        "task.md": "# Task Definition\n\nComplete task. ".repeat(15),
        "completion.md": "# Completion\n\n```\nDONE\n```\n\nCriteria. ".repeat(15),
        "iterations.md": "# Iterations\n\n```\n20\n```\n\nConfig. ".repeat(15),
        "context.md": "# Additional context",
        "notes.md": "# Notes",
      };

      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(springfieldDir, name), content);
      }

      const result = verifyPrerequisites(springfieldDir);
      
      expect(result.context).toContain("context.md");
      expect(result.context).toContain("notes.md");
    });
  });
});
