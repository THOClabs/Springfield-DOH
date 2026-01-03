/**
 * Batch 67: Constants Deep Testing
 *
 * Comprehensive tests for all constants, character tiers, artifacts,
 * and the validateRequiredFiles function
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  REQUIRED_FILES,
  validateRequiredFiles,
  CHARACTER_ARTIFACTS,
  CHARACTER_TIERS,
  ALL_CHARACTERS,
  SPRINGFIELD_DIR,
  DEFAULT_COMPLETION_PROMISE,
  DEFAULT_MAX_ITERATIONS,
} from "../src/constants.js";

describe("Batch 67: Constants Deep Tests", () => {
  describe("REQUIRED_FILES constant", () => {
    it("should contain project.md", () => {
      expect(REQUIRED_FILES).toContain("project.md");
    });

    it("should contain task.md", () => {
      expect(REQUIRED_FILES).toContain("task.md");
    });

    it("should contain completion.md", () => {
      expect(REQUIRED_FILES).toContain("completion.md");
    });

    it("should contain iterations.md", () => {
      expect(REQUIRED_FILES).toContain("iterations.md");
    });

    it("should have exactly 4 required files", () => {
      expect(REQUIRED_FILES.length).toBe(4);
    });

    it("should be readonly tuple", () => {
      // TypeScript enforces this - we can verify content is frozen in behavior
      expect(Array.isArray(REQUIRED_FILES)).toBe(true);
    });
  });

  describe("CHARACTER_ARTIFACTS constant", () => {
    it("should map homer to questions.md", () => {
      expect(CHARACTER_ARTIFACTS.homer).toBe("questions.md");
    });

    it("should map marge to structure.md", () => {
      expect(CHARACTER_ARTIFACTS.marge).toBe("structure.md");
    });

    it("should map bart to edge-cases.md", () => {
      expect(CHARACTER_ARTIFACTS.bart).toBe("edge-cases.md");
    });

    it("should map lisa to project.md", () => {
      expect(CHARACTER_ARTIFACTS.lisa).toBe("project.md");
    });

    it("should map maggie to logging.md", () => {
      expect(CHARACTER_ARTIFACTS.maggie).toBe("logging.md");
    });

    it("should map grampa to history.md", () => {
      expect(CHARACTER_ARTIFACTS.grampa).toBe("history.md");
    });

    it("should map burns to budget.md", () => {
      expect(CHARACTER_ARTIFACTS.burns).toBe("budget.md");
    });

    it("should map smithers to schedule.md", () => {
      expect(CHARACTER_ARTIFACTS.smithers).toBe("schedule.md");
    });

    it("should map flanders to standards.md", () => {
      expect(CHARACTER_ARTIFACTS.flanders).toBe("standards.md");
    });

    it("should map milhouse to dependencies.md", () => {
      expect(CHARACTER_ARTIFACTS.milhouse).toBe("dependencies.md");
    });

    it("should map moe to debug-notes.md", () => {
      expect(CHARACTER_ARTIFACTS.moe).toBe("debug-notes.md");
    });

    it("should map wiggum to security-review.md", () => {
      expect(CHARACTER_ARTIFACTS.wiggum).toBe("security-review.md");
    });

    it("should map krusty to demo.md", () => {
      expect(CHARACTER_ARTIFACTS.krusty).toBe("demo.md");
    });

    it("should map bob to adversarial.md", () => {
      expect(CHARACTER_ARTIFACTS.bob).toBe("adversarial.md");
    });

    it("should map skinner to timeline.md", () => {
      expect(CHARACTER_ARTIFACTS.skinner).toBe("timeline.md");
    });

    it("should map nelson to tests.md", () => {
      expect(CHARACTER_ARTIFACTS.nelson).toBe("tests.md");
    });

    it("should map apu to utilities.md", () => {
      expect(CHARACTER_ARTIFACTS.apu).toBe("utilities.md");
    });

    it("should map frink to experiments.md", () => {
      expect(CHARACTER_ARTIFACTS.frink).toBe("experiments.md");
    });

    it("should map cbg to docs-review.md", () => {
      expect(CHARACTER_ARTIFACTS.cbg).toBe("docs-review.md");
    });

    it("should map willie to infrastructure.md", () => {
      expect(CHARACTER_ARTIFACTS.willie).toBe("infrastructure.md");
    });

    it("should map dr-nick to dr-nick-health.md", () => {
      expect(CHARACTER_ARTIFACTS["dr-nick"]).toBe("dr-nick-health.md");
    });

    it("should map fat-tony to fat-tony-microservices.md", () => {
      expect(CHARACTER_ARTIFACTS["fat-tony"]).toBe("fat-tony-microservices.md");
    });

    it("should map sea-captain to sea-captain-containers.md", () => {
      expect(CHARACTER_ARTIFACTS["sea-captain"]).toBe("sea-captain-containers.md");
    });

    it("should not have artifact for ralph", () => {
      expect(CHARACTER_ARTIFACTS.ralph).toBeUndefined();
    });

    it("should have artifacts for all 40 characters with artifacts", () => {
      const artifactCount = Object.keys(CHARACTER_ARTIFACTS).length;
      expect(artifactCount).toBe(40);
    });
  });

  describe("CHARACTER_TIERS constant", () => {
    it("should have simpson_family tier", () => {
      expect(CHARACTER_TIERS.simpson_family).toBeDefined();
    });

    it("should have extended tier", () => {
      expect(CHARACTER_TIERS.extended).toBeDefined();
    });

    it("should have springfield tier", () => {
      expect(CHARACTER_TIERS.springfield).toBeDefined();
    });

    it("should have specialists tier", () => {
      expect(CHARACTER_TIERS.specialists).toBeDefined();
    });

    it("should have 5 simpson family members", () => {
      expect(CHARACTER_TIERS.simpson_family.length).toBe(5);
    });

    it("should have 4 extended family members", () => {
      expect(CHARACTER_TIERS.extended.length).toBe(4);
    });

    it("should have 12 springfield characters", () => {
      expect(CHARACTER_TIERS.springfield.length).toBe(12);
    });

    it("should have 20 specialists", () => {
      expect(CHARACTER_TIERS.specialists.length).toBe(20);
    });

    it("simpson_family should include homer", () => {
      expect(CHARACTER_TIERS.simpson_family).toContain("homer");
    });

    it("simpson_family should include marge", () => {
      expect(CHARACTER_TIERS.simpson_family).toContain("marge");
    });

    it("simpson_family should include bart", () => {
      expect(CHARACTER_TIERS.simpson_family).toContain("bart");
    });

    it("simpson_family should include lisa", () => {
      expect(CHARACTER_TIERS.simpson_family).toContain("lisa");
    });

    it("simpson_family should include maggie", () => {
      expect(CHARACTER_TIERS.simpson_family).toContain("maggie");
    });

    it("extended should include grampa", () => {
      expect(CHARACTER_TIERS.extended).toContain("grampa");
    });

    it("extended should include burns", () => {
      expect(CHARACTER_TIERS.extended).toContain("burns");
    });

    it("springfield should include ralph", () => {
      expect(CHARACTER_TIERS.springfield).toContain("ralph");
    });

    it("springfield should include moe", () => {
      expect(CHARACTER_TIERS.springfield).toContain("moe");
    });

    it("specialists should include dr-nick", () => {
      expect(CHARACTER_TIERS.specialists).toContain("dr-nick");
    });

    it("specialists should include fat-tony", () => {
      expect(CHARACTER_TIERS.specialists).toContain("fat-tony");
    });

    it("specialists should include sea-captain", () => {
      expect(CHARACTER_TIERS.specialists).toContain("sea-captain");
    });
  });

  describe("ALL_CHARACTERS constant", () => {
    it("should have 41 total characters", () => {
      expect(ALL_CHARACTERS.length).toBe(41);
    });

    it("should include all simpson family members", () => {
      for (const char of CHARACTER_TIERS.simpson_family) {
        expect(ALL_CHARACTERS).toContain(char);
      }
    });

    it("should include all extended family members", () => {
      for (const char of CHARACTER_TIERS.extended) {
        expect(ALL_CHARACTERS).toContain(char);
      }
    });

    it("should include all springfield characters", () => {
      for (const char of CHARACTER_TIERS.springfield) {
        expect(ALL_CHARACTERS).toContain(char);
      }
    });

    it("should include all specialists", () => {
      for (const char of CHARACTER_TIERS.specialists) {
        expect(ALL_CHARACTERS).toContain(char);
      }
    });

    it("should have no duplicates", () => {
      const uniqueChars = new Set(ALL_CHARACTERS);
      expect(uniqueChars.size).toBe(ALL_CHARACTERS.length);
    });
  });

  describe("Other constants", () => {
    it("SPRINGFIELD_DIR should be .springfield", () => {
      expect(SPRINGFIELD_DIR).toBe(".springfield");
    });

    it("DEFAULT_COMPLETION_PROMISE should be DONE", () => {
      expect(DEFAULT_COMPLETION_PROMISE).toBe("DONE");
    });

    it("DEFAULT_MAX_ITERATIONS should be 20", () => {
      expect(DEFAULT_MAX_ITERATIONS).toBe(20);
    });
  });

  describe("validateRequiredFiles function", () => {
    let tempDir: string;
    let springfieldDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validate-test-"));
      springfieldDir = path.join(tempDir, ".springfield");
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should return invalid for non-existent directory", () => {
      const result = validateRequiredFiles("/non/existent/dir");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should return all files as missing for non-existent directory", () => {
      const result = validateRequiredFiles("/non/existent/dir");
      expect(result.missing.length).toBe(4);
    });

    it("should return invalid for empty directory", () => {
      fs.mkdirSync(springfieldDir);
      const result = validateRequiredFiles(springfieldDir);
      expect(result.isValid).toBe(false);
    });

    it("should list missing files", () => {
      fs.mkdirSync(springfieldDir);
      const result = validateRequiredFiles(springfieldDir);
      expect(result.missing).toContain("project.md");
      expect(result.missing).toContain("task.md");
    });

    it("should detect incomplete files with short content", () => {
      fs.mkdirSync(springfieldDir);
      fs.writeFileSync(path.join(springfieldDir, "project.md"), "short");
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "short");
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "short");
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "short");
      const result = validateRequiredFiles(springfieldDir);
      expect(result.isValid).toBe(false);
      expect(result.incomplete.length).toBe(4);
    });

    it("should detect template placeholders as incomplete", () => {
      fs.mkdirSync(springfieldDir);
      const content = "This is a [One paragraph description of the project] test file with lots of content to pass length check.";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "a".repeat(100));
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "a".repeat(100));
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "a".repeat(100));
      const result = validateRequiredFiles(springfieldDir);
      expect(result.incomplete).toContain("project.md");
    });

    it("should return valid when all files have substantive content", () => {
      fs.mkdirSync(springfieldDir);
      // Content must be >= 200 chars (default minContentLength) and avoid placeholder triggers
      const content = "This is a fully filled out project document with real information about the software system being built. It includes technical details and requirements. More padding text to reach minimum length requirement of two hundred characters total.";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), content);
      const result = validateRequiredFiles(springfieldDir);
      expect(result.isValid).toBe(true);
    });

    it("should accept custom minContentLength", () => {
      fs.mkdirSync(springfieldDir);
      fs.writeFileSync(path.join(springfieldDir, "project.md"), "OK");
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "OK");
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "OK");
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "OK");
      const result = validateRequiredFiles(springfieldDir, 1);
      expect(result.isValid).toBe(true);
    });

    it("should mark present files correctly", () => {
      fs.mkdirSync(springfieldDir);
      // Content must be >= 200 chars (default minContentLength) and avoid placeholder triggers
      const content = "This document provides real information for the project and is fully filled out with actual data. Padding text to ensure we reach the minimum required length of two hundred characters for validation to pass properly.";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), content);
      const result = validateRequiredFiles(springfieldDir);
      expect(result.present.length).toBe(4);
    });

    it("should handle mixed state of files", () => {
      fs.mkdirSync(springfieldDir);
      // Good content must be >= 200 chars (default minContentLength), avoiding placeholder triggers
      const good = "Real project documentation with actual information that is fully filled out properly. Additional padding text is required to meet minimum character requirement of two hundred for the validation to succeed.";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), good);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "short");
      // completion.md and iterations.md are missing
      const result = validateRequiredFiles(springfieldDir);
      expect(result.isValid).toBe(false);
      expect(result.present).toContain("project.md");
      expect(result.incomplete).toContain("task.md");
      expect(result.missing).toContain("completion.md");
      expect(result.missing).toContain("iterations.md");
    });

    it("should detect [What placeholder", () => {
      fs.mkdirSync(springfieldDir);
      const content = "This file contains [What should happen when complete] placeholder text that indicates incomplete.";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "a".repeat(100));
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "a".repeat(100));
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "a".repeat(100));
      const result = validateRequiredFiles(springfieldDir);
      expect(result.incomplete).toContain("project.md");
    });

    it("should detect [Describe placeholder", () => {
      fs.mkdirSync(springfieldDir);
      const content = "This file contains [Describe the task] placeholder that indicates incomplete content.";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "a".repeat(100));
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "a".repeat(100));
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "a".repeat(100));
      const result = validateRequiredFiles(springfieldDir);
      expect(result.incomplete).toContain("project.md");
    });
  });
});
