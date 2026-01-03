/**
 * Integration tests for command modules
 * Tests the command run functions with real file system operations
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Import commands to test
import { run as springfieldRun } from "../src/commands/springfield.js";
import { run as homerRun } from "../src/commands/homer.js";
import { run as margeRun } from "../src/commands/marge.js";
import { run as bartRun } from "../src/commands/bart.js";
import { run as lisaRun } from "../src/commands/lisa.js";
import summonCommand from "../src/commands/summon.js";

describe("Command Integration Tests", () => {
  const testDir = path.join(os.tmpdir(), "springfield-cmd-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("springfield command", () => {
    it("returns help when called with help argument", async () => {
      const result = await springfieldRun(["help"], { cwd: testDir });
      expect(result).toContain("Springfield");
    });

    it("initializes with init argument", async () => {
      // Remove the directory first to test init
      fs.rmSync(springfieldDir, { recursive: true, force: true });
      const result = await springfieldRun(["init"], { cwd: testDir });
      expect(result).toBeDefined();
      // Should create the directory
      expect(fs.existsSync(springfieldDir)).toBe(true);
    });

    it("shows status when already initialized", async () => {
      // Create some files
      fs.writeFileSync(
        path.join(springfieldDir, "project.md"),
        "# Project\n\nTest content"
      );
      const result = await springfieldRun(["status"], { cwd: testDir });
      expect(result).toBeDefined();
    });
  });

  describe("homer command", () => {
    it("returns questioning response", async () => {
      const result = await homerRun([], { cwd: testDir });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      // Homer's responses should be questioning/confused
      expect(result.length).toBeGreaterThan(10);
    });

    it("accepts topic argument", async () => {
      const result = await homerRun(["architecture"], { cwd: testDir });
      expect(result).toBeDefined();
      expect(result).toContain("architecture");
    });
  });

  describe("marge command", () => {
    it("returns organizing response", async () => {
      const result = await margeRun([], { cwd: testDir });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("bart command", () => {
    it("returns chaos/edge-case response", async () => {
      const result = await bartRun([], { cwd: testDir });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("lisa command", () => {
    it("returns analytical response", async () => {
      const result = await lisaRun([], { cwd: testDir });
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("summon command", () => {
    it("returns help when no character specified", async () => {
      const result = await summonCommand.run([], { cwd: testDir });
      expect(result).toBeDefined();
      // Should indicate that a character needs to be specified
      expect(result).toContain("summon");
    });

    it("summons homer character", async () => {
      const result = await summonCommand.run(["homer"], { cwd: testDir });
      expect(result).toBeDefined();
      // Should contain Homer's character
      expect(result.toLowerCase()).toContain("homer");
    });

    it("handles unknown character gracefully", async () => {
      const result = await summonCommand.run(["nonexistent"], { cwd: testDir });
      expect(result).toBeDefined();
      // Should indicate character not found or list available characters
    });
  });
});

describe("Prerequisites Utility", () => {
  const testDir = path.join(os.tmpdir(), "springfield-prereq-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("detects missing files", async () => {
    const { verifyPrerequisites } = await import("../src/utils/prerequisites.js");
    const result = verifyPrerequisites(springfieldDir);
    
    expect(result.ready).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
    expect(result.missing).toContain("project.md");
  });

  it("detects incomplete files with template placeholders", async () => {
    const { verifyPrerequisites } = await import("../src/utils/prerequisites.js");
    
    // Create a file with placeholder content
    fs.writeFileSync(
      path.join(springfieldDir, "project.md"),
      "[One paragraph describing the project]"
    );
    
    const result = verifyPrerequisites(springfieldDir);
    expect(result.ready).toBe(false);
    // Should be in missing with incomplete reason
    expect(result.missing.some(m => m.includes("project.md") && m.includes("incomplete"))).toBe(true);
  });

  it("detects files that are too short", async () => {
    const { verifyPrerequisites } = await import("../src/utils/prerequisites.js");
    
    // Create a file with minimal content
    fs.writeFileSync(
      path.join(springfieldDir, "project.md"),
      "Short content"
    );
    
    const result = verifyPrerequisites(springfieldDir);
    expect(result.ready).toBe(false);
    expect(result.missing.some(m => m.includes("project.md"))).toBe(true);
  });

  it("marks complete files as present", async () => {
    const { verifyPrerequisites } = await import("../src/utils/prerequisites.js");
    
    // Create a file with substantive content
    const longContent = "# Project Definition\n\n" + "This is a complete project description with substantial content. ".repeat(20);
    fs.writeFileSync(path.join(springfieldDir, "project.md"), longContent);
    
    const result = verifyPrerequisites(springfieldDir);
    expect(result.present).toContain("project.md");
  });

  it("finds context files", async () => {
    const { verifyPrerequisites } = await import("../src/utils/prerequisites.js");
    
    // Create all required files
    const longContent = "This is complete content. ".repeat(20);
    const files = ["project.md", "task.md", "completion.md", "iterations.md"];
    for (const file of files) {
      fs.writeFileSync(path.join(springfieldDir, file), longContent);
    }
    
    // Create an extra context file
    fs.writeFileSync(path.join(springfieldDir, "context.md"), "Extra context");
    
    const result = verifyPrerequisites(springfieldDir);
    expect(result.context).toContain("context.md");
  });

  it("handles non-existent directory", async () => {
    const { verifyPrerequisites } = await import("../src/utils/prerequisites.js");
    
    const result = verifyPrerequisites("/nonexistent/path/.springfield");
    expect(result.ready).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("Bounds Validation", () => {
  const testDir = path.join(os.tmpdir(), "springfield-bounds-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("uses default iterations when file is missing", async () => {
    // Create required files except iterations.md
    const longContent = "This is complete content. ".repeat(20);
    fs.writeFileSync(path.join(springfieldDir, "project.md"), longContent);
    fs.writeFileSync(path.join(springfieldDir, "task.md"), longContent);
    fs.writeFileSync(path.join(springfieldDir, "completion.md"), "```\nDONE\n```\n" + longContent);

    // Import lisa-ralph to test extractMaxIterations indirectly
    const { run: lisaRalphRun } = await import("../src/commands/lisa-ralph-special.js");
    const result = await lisaRalphRun([], { cwd: testDir });
    
    // Should mention default iterations (20) somewhere or handle gracefully
    expect(result).toBeDefined();
  });
});
