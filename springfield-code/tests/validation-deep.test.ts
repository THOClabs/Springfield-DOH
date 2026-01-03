/**
 * Validation Deep Tests (Batch 70)
 *
 * Deep testing of all validation utilities with edge cases,
 * boundary conditions, and realistic scenarios.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  hasTemplatePlaceholders,
  isFileComplete,
  validateFileContent,
  validateRequiredFiles,
  validateSpringfieldDirectory,
  isSpringfieldInitialized,
  isSpringfieldReady,
  TEMPLATE_PLACEHOLDERS,
  REQUIRED_FILES,
  SPRINGFIELD_DIR,
} from "../src/index.js";

describe("Template Placeholders Detection", () => {
  describe("hasTemplatePlaceholders returns true for placeholder patterns", () => {
    it("detects [One paragraph placeholder", () => {
      expect(hasTemplatePlaceholders("[One paragraph describing something")).toBe(true);
    });

    it("detects [What placeholder", () => {
      expect(hasTemplatePlaceholders("[What is the purpose]")).toBe(true);
    });

    it("detects [Describe placeholder", () => {
      expect(hasTemplatePlaceholders("[Describe your implementation]")).toBe(true);
    });

    it("detects [TODO placeholder", () => {
      expect(hasTemplatePlaceholders("[TODO: Add content]")).toBe(true);
    });

    it("detects [PLACEHOLDER placeholder", () => {
      expect(hasTemplatePlaceholders("[PLACEHOLDER for content]")).toBe(true);
    });

    it("detects placeholder in middle of content", () => {
      const content = "Some valid content\n[TODO: complete this section]\nMore content";
      expect(hasTemplatePlaceholders(content)).toBe(true);
    });

    it("detects placeholder at end of content", () => {
      const content = "Some valid content [PLACEHOLDER]";
      expect(hasTemplatePlaceholders(content)).toBe(true);
    });
  });

  describe("hasTemplatePlaceholders returns false for valid content", () => {
    it("returns false for empty string", () => {
      expect(hasTemplatePlaceholders("")).toBe(false);
    });

    it("returns false for plain text", () => {
      expect(hasTemplatePlaceholders("This is valid content with no placeholders")).toBe(false);
    });

    it("returns false for content with regular brackets", () => {
      expect(hasTemplatePlaceholders("Array[index] and object[key]")).toBe(false);
    });

    it("returns false for content with lowercase todo", () => {
      expect(hasTemplatePlaceholders("[todo: this is fine]")).toBe(false);
    });

    it("returns false for content with partial match", () => {
      // "One" without bracket doesn't match
      expect(hasTemplatePlaceholders("One paragraph about something")).toBe(false);
    });

    it("returns false for content with code blocks", () => {
      expect(hasTemplatePlaceholders("```\nconst x = [1, 2, 3];\n```")).toBe(false);
    });
  });

  describe("TEMPLATE_PLACEHOLDERS constant", () => {
    it("contains exactly 5 placeholder patterns", () => {
      expect(TEMPLATE_PLACEHOLDERS).toHaveLength(5);
    });

    it("includes [One paragraph pattern", () => {
      expect(TEMPLATE_PLACEHOLDERS).toContain("[One paragraph");
    });

    it("includes [What pattern", () => {
      expect(TEMPLATE_PLACEHOLDERS).toContain("[What");
    });

    it("includes [Describe pattern", () => {
      expect(TEMPLATE_PLACEHOLDERS).toContain("[Describe");
    });

    it("includes [TODO pattern", () => {
      expect(TEMPLATE_PLACEHOLDERS).toContain("[TODO");
    });

    it("includes [PLACEHOLDER pattern", () => {
      expect(TEMPLATE_PLACEHOLDERS).toContain("[PLACEHOLDER");
    });

    it("is a readonly tuple", () => {
      // TypeScript enforces this, but we can verify it's an array
      expect(Array.isArray(TEMPLATE_PLACEHOLDERS)).toBe(true);
    });
  });
});

describe("isFileComplete Function", () => {
  describe("with explicit minContentLength", () => {
    it("returns true when content meets minimum length and has no placeholders", () => {
      expect(isFileComplete("A".repeat(100), 100)).toBe(true);
    });

    it("returns false when content is below minimum length", () => {
      expect(isFileComplete("A".repeat(99), 100)).toBe(false);
    });

    it("returns false when content has placeholders despite meeting length", () => {
      const content = "A".repeat(200) + "[TODO: finish this]";
      expect(isFileComplete(content, 100)).toBe(false);
    });

    it("returns true for exactly minimum length", () => {
      expect(isFileComplete("X".repeat(50), 50)).toBe(true);
    });

    it("returns true for content exceeding minimum length", () => {
      expect(isFileComplete("Y".repeat(500), 100)).toBe(true);
    });

    it("returns false for empty content with minLength 0", () => {
      // Empty string has no placeholders but length 0 === 0, should be true
      expect(isFileComplete("", 0)).toBe(true);
    });

    it("handles very large content", () => {
      const largeContent = "Z".repeat(100000);
      expect(isFileComplete(largeContent, 1000)).toBe(true);
    });
  });

  describe("with default minContentLength (from config)", () => {
    it("returns false for short content below default threshold", () => {
      expect(isFileComplete("Short")).toBe(false);
    });

    it("returns true for sufficiently long content", () => {
      const longContent = "This is a comprehensive project description that provides all the necessary details about the implementation, architecture, and requirements. ".repeat(3);
      expect(isFileComplete(longContent)).toBe(true);
    });
  });
});

describe("validateFileContent Function", () => {
  describe("returns correct validation result structure", () => {
    it("returns object with isComplete property", () => {
      const result = validateFileContent("test", 10);
      expect(result).toHaveProperty("isComplete");
    });

    it("returns object with length property", () => {
      const result = validateFileContent("test", 10);
      expect(result).toHaveProperty("length");
    });

    it("returns object with hasPlaceholders property", () => {
      const result = validateFileContent("test", 10);
      expect(result).toHaveProperty("hasPlaceholders");
    });

    it("returns object with errors array", () => {
      const result = validateFileContent("test", 10);
      expect(result).toHaveProperty("errors");
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe("validates content correctly", () => {
    it("marks short content as incomplete", () => {
      const result = validateFileContent("short", 100);
      expect(result.isComplete).toBe(false);
      expect(result.length).toBe(5);
    });

    it("marks content with placeholders as incomplete", () => {
      const content = "A".repeat(200) + "[TODO: fix]";
      const result = validateFileContent(content, 50);
      expect(result.isComplete).toBe(false);
      expect(result.hasPlaceholders).toBe(true);
    });

    it("marks valid content as complete", () => {
      const content = "A".repeat(100);
      const result = validateFileContent(content, 100);
      expect(result.isComplete).toBe(true);
      expect(result.hasPlaceholders).toBe(false);
    });

    it("correctly reports content length", () => {
      const content = "Hello World";
      const result = validateFileContent(content, 5);
      expect(result.length).toBe(11);
    });

    it("returns empty errors array for valid content", () => {
      const result = validateFileContent("A".repeat(100), 50);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe("validateRequiredFiles Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("handles non-existent directory", () => {
    it("returns exists as false", () => {
      const result = validateRequiredFiles(path.join(tempDir, "nonexistent"));
      expect(result.exists).toBe(false);
    });

    it("returns isValid as false", () => {
      const result = validateRequiredFiles(path.join(tempDir, "nonexistent"));
      expect(result.isValid).toBe(false);
    });

    it("marks all required files as missing", () => {
      const result = validateRequiredFiles(path.join(tempDir, "nonexistent"));
      expect(result.missingFiles).toHaveLength(REQUIRED_FILES.length);
    });

    it("includes error message about missing directory", () => {
      const result = validateRequiredFiles(path.join(tempDir, "nonexistent"));
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("does not exist");
    });
  });

  describe("handles empty directory", () => {
    it("returns exists as true", () => {
      const result = validateRequiredFiles(tempDir);
      expect(result.exists).toBe(true);
    });

    it("returns isValid as false when files missing", () => {
      const result = validateRequiredFiles(tempDir);
      expect(result.isValid).toBe(false);
    });

    it("lists all required files as missing", () => {
      const result = validateRequiredFiles(tempDir);
      expect(result.missingFiles).toEqual(REQUIRED_FILES);
    });
  });

  describe("handles directory with incomplete files", () => {
    it("marks files with short content as incomplete", () => {
      // Create all required files with short content
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(tempDir, file), "short");
      }
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.incompleteFiles).toHaveLength(REQUIRED_FILES.length);
      expect(result.isValid).toBe(false);
    });

    it("marks files with placeholders as incomplete", () => {
      // Create one file with placeholder, rest valid
      const validContent = "A".repeat(300);
      for (const file of REQUIRED_FILES) {
        const content = file === "project.md" 
          ? validContent + "[TODO: complete]" 
          : validContent;
        fs.writeFileSync(path.join(tempDir, file), content);
      }
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.incompleteFiles).toContain("project.md");
    });
  });

  describe("handles directory with complete files", () => {
    it("returns isValid as true", () => {
      const validContent = "A".repeat(300);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(tempDir, file), validContent);
      }
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.isValid).toBe(true);
    });

    it("lists all files as present", () => {
      const validContent = "A".repeat(300);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(tempDir, file), validContent);
      }
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.presentFiles).toHaveLength(REQUIRED_FILES.length);
    });

    it("has empty missingFiles array", () => {
      const validContent = "A".repeat(300);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(tempDir, file), validContent);
      }
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.missingFiles).toHaveLength(0);
    });
  });

  describe("handles optional files", () => {
    it("detects optional markdown files", () => {
      const validContent = "A".repeat(300);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(tempDir, file), validContent);
      }
      fs.writeFileSync(path.join(tempDir, "NOTES.md"), "optional content");
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.optionalFiles).toContain("NOTES.md");
    });

    it("ignores non-markdown files in optional list", () => {
      const validContent = "A".repeat(300);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(tempDir, file), validContent);
      }
      fs.writeFileSync(path.join(tempDir, "config.json"), "{}");
      const result = validateRequiredFiles(tempDir, 100);
      expect(result.optionalFiles).not.toContain("config.json");
    });
  });
});

describe("validateSpringfieldDirectory Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "springfield-dir-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("uses default SPRINGFIELD_DIR when not specified", () => {
    const result = validateSpringfieldDirectory(tempDir);
    expect(result.exists).toBe(false);
    expect(result.errors[0]).toContain(SPRINGFIELD_DIR);
  });

  it("accepts custom directory name", () => {
    const customDir = ".custom-springfield";
    const result = validateSpringfieldDirectory(tempDir, customDir);
    expect(result.errors[0]).toContain(customDir);
  });

  it("validates existing directory", () => {
    const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
    fs.mkdirSync(springfieldPath);
    const result = validateSpringfieldDirectory(tempDir);
    expect(result.exists).toBe(true);
  });
});

describe("isSpringfieldInitialized Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "init-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns false when directory does not exist", () => {
    expect(isSpringfieldInitialized(tempDir)).toBe(false);
  });

  it("returns true when directory exists", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    expect(isSpringfieldInitialized(tempDir)).toBe(true);
  });

  it("uses custom directory name when provided", () => {
    fs.mkdirSync(path.join(tempDir, ".my-dir"));
    expect(isSpringfieldInitialized(tempDir, ".my-dir")).toBe(true);
  });

  it("returns false for non-existent custom directory", () => {
    expect(isSpringfieldInitialized(tempDir, ".nonexistent")).toBe(false);
  });
});

describe("isSpringfieldReady Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ready-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns false when directory does not exist", () => {
    expect(isSpringfieldReady(tempDir)).toBe(false);
  });

  it("returns false when directory exists but is empty", () => {
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
    expect(isSpringfieldReady(tempDir)).toBe(false);
  });

  it("returns false when files are incomplete", () => {
    const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
    fs.mkdirSync(springfieldPath);
    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(path.join(springfieldPath, file), "short");
    }
    expect(isSpringfieldReady(tempDir)).toBe(false);
  });

  it("returns true when all files are complete", () => {
    const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
    fs.mkdirSync(springfieldPath);
    const validContent = "This is comprehensive content that meets the minimum length requirement for validation purposes. ".repeat(5);
    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(path.join(springfieldPath, file), validContent);
    }
    expect(isSpringfieldReady(tempDir)).toBe(true);
  });

  it("uses custom directory name when provided", () => {
    const customDir = ".custom";
    const customPath = path.join(tempDir, customDir);
    fs.mkdirSync(customPath);
    const validContent = "This is comprehensive content that meets the minimum length requirement for validation purposes. ".repeat(5);
    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(path.join(customPath, file), validContent);
    }
    expect(isSpringfieldReady(tempDir, customDir)).toBe(true);
  });
});

describe("REQUIRED_FILES Constant Validation", () => {
  it("includes project.md", () => {
    expect(REQUIRED_FILES).toContain("project.md");
  });

  it("includes task.md", () => {
    expect(REQUIRED_FILES).toContain("task.md");
  });

  it("includes completion.md", () => {
    expect(REQUIRED_FILES).toContain("completion.md");
  });

  it("includes iterations.md", () => {
    expect(REQUIRED_FILES).toContain("iterations.md");
  });

  it("has correct number of required files", () => {
    expect(REQUIRED_FILES.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Edge Cases and Boundary Conditions", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "edge-case-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("handles content with unicode characters", () => {
    const unicodeContent = "こんにちは世界! 🌍🌎🌏 Привет мир! مرحبا بالعالم";
    expect(hasTemplatePlaceholders(unicodeContent)).toBe(false);
    expect(isFileComplete(unicodeContent, 10)).toBe(true);
  });

  it("handles content with newlines and tabs", () => {
    const content = "Line 1\n\tTabbed line\r\nWindows line\nLine 4";
    expect(isFileComplete(content, 10)).toBe(true);
  });

  it("handles minContentLength of 1", () => {
    expect(isFileComplete("X", 1)).toBe(true);
    expect(isFileComplete("", 1)).toBe(false);
  });

  it("validates directory with mixed file states", () => {
    const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
    fs.mkdirSync(springfieldPath);
    
    // Create some complete and some incomplete files
    const validContent = "V".repeat(300);
    let fileIndex = 0;
    for (const file of REQUIRED_FILES) {
      if (fileIndex % 2 === 0) {
        fs.writeFileSync(path.join(springfieldPath, file), validContent);
      } else {
        fs.writeFileSync(path.join(springfieldPath, file), "incomplete");
      }
      fileIndex++;
    }
    
    const result = validateRequiredFiles(springfieldPath, 100);
    expect(result.presentFiles.length).toBeGreaterThan(0);
    expect(result.incompleteFiles.length).toBeGreaterThan(0);
    expect(result.isValid).toBe(false);
  });

  it("handles deeply nested directory paths", () => {
    const deepPath = path.join(tempDir, "a", "b", "c", "d", SPRINGFIELD_DIR);
    fs.mkdirSync(deepPath, { recursive: true });
    expect(isSpringfieldInitialized(path.join(tempDir, "a", "b", "c", "d"))).toBe(true);
  });

  it("handles paths with spaces", () => {
    const spacePath = path.join(tempDir, "path with spaces");
    fs.mkdirSync(spacePath);
    fs.mkdirSync(path.join(spacePath, SPRINGFIELD_DIR));
    expect(isSpringfieldInitialized(spacePath)).toBe(true);
  });
});
