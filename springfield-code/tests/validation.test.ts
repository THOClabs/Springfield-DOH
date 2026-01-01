/**
 * Tests for validation utilities
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  isFileComplete,
  hasTemplatePlaceholders,
  validateFileContent,
  validateRequiredFiles,
  validateSpringfieldDirectory,
  isSpringfieldInitialized,
  isSpringfieldReady,
  TEMPLATE_PLACEHOLDERS,
} from "../src/utils/validation.js";
import { clearConfigCache } from "../src/config.js";

describe("Validation Utilities", () => {
  let tempDir: string;

  beforeEach(() => {
    clearConfigCache();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("TEMPLATE_PLACEHOLDERS", () => {
    it("contains expected placeholder patterns", () => {
      expect(TEMPLATE_PLACEHOLDERS).toContain("[One paragraph");
      expect(TEMPLATE_PLACEHOLDERS).toContain("[TODO");
      expect(TEMPLATE_PLACEHOLDERS).toContain("[PLACEHOLDER");
    });
  });

  describe("hasTemplatePlaceholders", () => {
    it("returns true for content with placeholders", () => {
      expect(hasTemplatePlaceholders("[One paragraph about the project")).toBe(true);
      expect(hasTemplatePlaceholders("Some text [TODO fix this] more")).toBe(true);
      expect(hasTemplatePlaceholders("[What is the goal?")).toBe(true);
      expect(hasTemplatePlaceholders("[Describe the feature")).toBe(true);
      expect(hasTemplatePlaceholders("[PLACEHOLDER]")).toBe(true);
    });

    it("returns false for content without placeholders", () => {
      expect(hasTemplatePlaceholders("Normal content here")).toBe(false);
      expect(hasTemplatePlaceholders("Complete documentation")).toBe(false);
      expect(hasTemplatePlaceholders("")).toBe(false);
    });
  });

  describe("isFileComplete", () => {
    it("returns true for complete content", () => {
      const longContent = "A".repeat(250);
      expect(isFileComplete(longContent)).toBe(true);
    });

    it("returns false for short content", () => {
      expect(isFileComplete("Short")).toBe(false);
      expect(isFileComplete("A".repeat(100))).toBe(false);
    });

    it("returns false for content with placeholders", () => {
      const content = "A".repeat(300) + "[TODO complete this]";
      expect(isFileComplete(content)).toBe(false);
    });

    it("respects custom minContentLength", () => {
      expect(isFileComplete("A".repeat(50), 40)).toBe(true);
      expect(isFileComplete("A".repeat(30), 40)).toBe(false);
    });
  });

  describe("validateFileContent", () => {
    it("returns complete result for valid content", () => {
      const content = "A".repeat(250);
      const result = validateFileContent(content);
      
      expect(result.isComplete).toBe(true);
      expect(result.length).toBe(250);
      expect(result.hasPlaceholders).toBe(false);
      expect(result.errors).toEqual([]);
    });

    it("returns incomplete result for short content", () => {
      const result = validateFileContent("Short");
      
      expect(result.isComplete).toBe(false);
      expect(result.length).toBe(5);
    });

    it("detects placeholders", () => {
      const content = "A".repeat(300) + "[TODO fix]";
      const result = validateFileContent(content);
      
      expect(result.hasPlaceholders).toBe(true);
      expect(result.isComplete).toBe(false);
    });
  });

  describe("validateRequiredFiles", () => {
    it("handles non-existent directory", () => {
      const result = validateRequiredFiles("/nonexistent/path");
      
      expect(result.exists).toBe(false);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.missingFiles).toContain("project.md");
    });

    it("detects missing files", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      const result = validateRequiredFiles(springfieldDir);
      
      expect(result.exists).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.missingFiles).toContain("project.md");
      expect(result.missingFiles).toContain("task.md");
    });

    it("detects incomplete files (too short)", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      // Create short files
      fs.writeFileSync(path.join(springfieldDir, "project.md"), "Short");
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "Short");
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "Short");
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "Short");
      
      const result = validateRequiredFiles(springfieldDir);
      
      expect(result.isValid).toBe(false);
      expect(result.incompleteFiles.length).toBe(4);
    });

    it("detects incomplete files (has placeholders)", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      const content = "A".repeat(250) + "[TODO complete this]";
      fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), "A".repeat(250));
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), "A".repeat(250));
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), "A".repeat(250));
      
      const result = validateRequiredFiles(springfieldDir);
      
      expect(result.isValid).toBe(false);
      expect(result.incompleteFiles).toContain("project.md");
    });

    it("validates complete directory", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      const goodContent = "A".repeat(250);
      fs.writeFileSync(path.join(springfieldDir, "project.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), goodContent);
      
      const result = validateRequiredFiles(springfieldDir);
      
      expect(result.exists).toBe(true);
      expect(result.isValid).toBe(true);
      expect(result.presentFiles).toHaveLength(4);
      expect(result.missingFiles).toHaveLength(0);
      expect(result.incompleteFiles).toHaveLength(0);
    });

    it("finds optional files", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      const goodContent = "A".repeat(250);
      fs.writeFileSync(path.join(springfieldDir, "project.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "questions.md"), "Optional file");
      fs.writeFileSync(path.join(springfieldDir, "structure.md"), "Another optional");
      
      const result = validateRequiredFiles(springfieldDir);
      
      expect(result.optionalFiles).toContain("questions.md");
      expect(result.optionalFiles).toContain("structure.md");
    });
  });

  describe("validateSpringfieldDirectory", () => {
    it("validates directory using cwd and dirname", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      const result = validateSpringfieldDirectory(tempDir);
      
      expect(result.exists).toBe(true);
      expect(result.isValid).toBe(false); // No required files
    });

    it("supports custom directory name", () => {
      const customDir = path.join(tempDir, ".custom-dir");
      fs.mkdirSync(customDir);
      
      const result = validateSpringfieldDirectory(tempDir, ".custom-dir");
      
      expect(result.exists).toBe(true);
    });
  });

  describe("isSpringfieldInitialized", () => {
    it("returns true when directory exists", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      expect(isSpringfieldInitialized(tempDir)).toBe(true);
    });

    it("returns false when directory does not exist", () => {
      expect(isSpringfieldInitialized(tempDir)).toBe(false);
    });

    it("supports custom directory name", () => {
      const customDir = path.join(tempDir, ".custom");
      fs.mkdirSync(customDir);
      
      expect(isSpringfieldInitialized(tempDir, ".custom")).toBe(true);
      expect(isSpringfieldInitialized(tempDir, ".other")).toBe(false);
    });
  });

  describe("isSpringfieldReady", () => {
    it("returns false when directory does not exist", () => {
      expect(isSpringfieldReady(tempDir)).toBe(false);
    });

    it("returns false when files are incomplete", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      expect(isSpringfieldReady(tempDir)).toBe(false);
    });

    it("returns true when all files are complete", () => {
      const springfieldDir = path.join(tempDir, ".springfield");
      fs.mkdirSync(springfieldDir);
      
      const goodContent = "A".repeat(250);
      fs.writeFileSync(path.join(springfieldDir, "project.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "task.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "completion.md"), goodContent);
      fs.writeFileSync(path.join(springfieldDir, "iterations.md"), goodContent);
      
      expect(isSpringfieldReady(tempDir)).toBe(true);
    });
  });
});
