/**
 * Tests for constants.ts - validateRequiredFiles function
 * v3.0.1 - Coverage enhancement
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { validateRequiredFiles, REQUIRED_FILES } from "../src/constants.js";

describe("validateRequiredFiles", () => {
  let tempDir: string;
  let springfieldDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validate-files-test-"));
    springfieldDir = path.join(tempDir, ".springfield");
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("returns error when directory does not exist", () => {
    const result = validateRequiredFiles(springfieldDir);

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("does not exist");
    expect(result.missing).toEqual([...REQUIRED_FILES]);
  });

  it("returns missing files when directory is empty", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    const result = validateRequiredFiles(springfieldDir);

    expect(result.isValid).toBe(false);
    expect(result.missing.length).toBe(REQUIRED_FILES.length);
    expect(result.present.length).toBe(0);
    expect(result.incomplete.length).toBe(0);
  });

  it("marks files with short content as incomplete", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    // Create files with short content (less than minContentLength)
    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(
        path.join(springfieldDir, file),
        "too short"
      );
    }

    const result = validateRequiredFiles(springfieldDir, 200);

    expect(result.isValid).toBe(false);
    expect(result.incomplete.length).toBe(REQUIRED_FILES.length);
    expect(result.present.length).toBe(0);
  });

  it("marks files with template placeholders as incomplete", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    // Create files with template placeholders
    const placeholderContent = `This is a file with enough content length to pass the minimum check.
[One paragraph describing the project]
More content here to ensure we hit the length requirement properly.`;

    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(path.join(springfieldDir, file), placeholderContent);
    }

    const result = validateRequiredFiles(springfieldDir, 50);

    expect(result.isValid).toBe(false);
    expect(result.incomplete.length).toBe(REQUIRED_FILES.length);
  });

  it("marks files with [What as placeholder incomplete", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    const content = `This is content with a template placeholder.
[What should go here?]
Some additional text to make it long enough.`;

    fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
    // Create other files with valid content
    for (const file of REQUIRED_FILES) {
      if (file !== "project.md") {
        fs.writeFileSync(
          path.join(springfieldDir, file),
          "A".repeat(250)
        );
      }
    }

    const result = validateRequiredFiles(springfieldDir, 50);

    expect(result.incomplete).toContain("project.md");
  });

  it("marks files with [Describe as placeholder incomplete", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    const content = `This is content with another template placeholder.
[Describe the implementation]
Some additional text to make it long enough.`;

    fs.writeFileSync(path.join(springfieldDir, "project.md"), content);
    // Create other files with valid content
    for (const file of REQUIRED_FILES) {
      if (file !== "project.md") {
        fs.writeFileSync(
          path.join(springfieldDir, file),
          "A".repeat(250)
        );
      }
    }

    const result = validateRequiredFiles(springfieldDir, 50);

    expect(result.incomplete).toContain("project.md");
  });

  it("validates files with substantive content as present", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    // Create files with valid substantive content (no placeholders)
    const validContent = `This is a comprehensive project document that describes the implementation.
It has multiple paragraphs of real content without any template placeholders.
The content is substantial enough to pass the minimum length requirements.
This should be considered a valid, complete file.`;

    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(path.join(springfieldDir, file), validContent);
    }

    const result = validateRequiredFiles(springfieldDir, 50);

    expect(result.isValid).toBe(true);
    expect(result.present.length).toBe(REQUIRED_FILES.length);
    expect(result.missing.length).toBe(0);
    expect(result.incomplete.length).toBe(0);
    expect(result.errors.length).toBe(0);
  });

  it("uses default minContentLength from config when not specified", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    // Create files - we just verify it doesn't throw
    for (const file of REQUIRED_FILES) {
      fs.writeFileSync(
        path.join(springfieldDir, file),
        "Short content"
      );
    }

    // Call without minContentLength parameter to use config default
    const result = validateRequiredFiles(springfieldDir);

    // Should still work (using config default)
    expect(result).toBeDefined();
    expect(typeof result.isValid).toBe("boolean");
  });

  it("handles mixed valid, missing, and incomplete files", () => {
    fs.mkdirSync(springfieldDir, { recursive: true });

    // Create project.md with valid content
    fs.writeFileSync(
      path.join(springfieldDir, "project.md"),
      "A".repeat(250) // Valid
    );

    // Create task.md with short content
    fs.writeFileSync(
      path.join(springfieldDir, "task.md"),
      "short" // Incomplete
    );

    // Don't create completion.md - Missing
    // Don't create iterations.md - Missing

    const result = validateRequiredFiles(springfieldDir, 200);

    expect(result.isValid).toBe(false);
    expect(result.present).toContain("project.md");
    expect(result.incomplete).toContain("task.md");
    expect(result.missing).toContain("completion.md");
    expect(result.missing).toContain("iterations.md");
  });
});
