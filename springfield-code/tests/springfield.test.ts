import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { run as springfieldRun } from "../src/commands/springfield.js";

describe("springfield command", () => {
  const testDir = "/tmp/springfield-test-" + Date.now();
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("init subcommand", () => {
    it("creates .springfield directory", async () => {
      const result = await springfieldRun(["init"], { cwd: testDir });

      expect(fs.existsSync(springfieldDir)).toBe(true);
      expect(result).toContain("SPRINGFIELD CODE INITIALIZED");
    });

    it("creates all required template files", async () => {
      await springfieldRun(["init"], { cwd: testDir });

      expect(fs.existsSync(path.join(springfieldDir, "project.md"))).toBe(true);
      expect(fs.existsSync(path.join(springfieldDir, "task.md"))).toBe(true);
      expect(fs.existsSync(path.join(springfieldDir, "completion.md"))).toBe(true);
      expect(fs.existsSync(path.join(springfieldDir, "iterations.md"))).toBe(true);
    });

    it("returns error if already initialized", async () => {
      await springfieldRun(["init"], { cwd: testDir });
      const result = await springfieldRun(["init"], { cwd: testDir });

      expect(result).toContain("already initialized");
    });
  });

  describe("status subcommand", () => {
    it("returns not initialized message if .springfield missing", async () => {
      const result = await springfieldRun(["status"], { cwd: testDir });

      expect(result).toContain("not initialized");
    });

    it("shows status after init", async () => {
      await springfieldRun(["init"], { cwd: testDir });
      const result = await springfieldRun(["status"], { cwd: testDir });

      expect(result).toContain("SPRINGFIELD STATUS");
      expect(result).toContain("project.md");
    });

    it("shows Ralph NOT READY with template files", async () => {
      await springfieldRun(["init"], { cwd: testDir });
      const result = await springfieldRun(["status"], { cwd: testDir });

      expect(result).toContain("NOT READY");
    });
  });

  describe("reset subcommand", () => {
    it("reinitializes if already exists", async () => {
      await springfieldRun(["init"], { cwd: testDir });

      // Add a custom file
      fs.writeFileSync(path.join(springfieldDir, "custom.md"), "test");

      const result = await springfieldRun(["reset"], { cwd: testDir });

      expect(result).toContain("SPRINGFIELD CODE INITIALIZED");
      expect(fs.existsSync(path.join(springfieldDir, "custom.md"))).toBe(false);
    });

    it("initializes even if not existing", async () => {
      const result = await springfieldRun(["reset"], { cwd: testDir });

      expect(result).toContain("SPRINGFIELD CODE INITIALIZED");
      expect(fs.existsSync(springfieldDir)).toBe(true);
    });
  });

  describe("help", () => {
    it("shows help with no subcommand", async () => {
      const result = await springfieldRun([], { cwd: testDir });

      expect(result).toContain("Springfield Code");
      expect(result).toContain("/springfield init");
      expect(result).toContain("/springfield status");
      expect(result).toContain("/springfield reset");
    });

    it("shows help with unknown subcommand", async () => {
      const result = await springfieldRun(["unknown"], { cwd: testDir });

      expect(result).toContain("Springfield Code");
    });
  });
});
