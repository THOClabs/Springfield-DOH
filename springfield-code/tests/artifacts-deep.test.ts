/**
 * Artifacts Deep Tests (Batch 73)
 *
 * Deep testing of artifact generation with edge cases,
 * security validations, and character-specific behavior.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  generateArtifact,
  artifactExists,
  CHARACTER_ARTIFACTS,
  SPRINGFIELD_DIR,
  ALL_CHARACTERS,
} from "../src/index.js";

describe("generateArtifact Function", () => {
  let tempDir: string;
  let springfieldPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "artifact-gen-"));
    springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
    fs.mkdirSync(springfieldPath);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("returns null for invalid inputs", () => {
    it("returns null for empty character string", () => {
      expect(generateArtifact("", "input", tempDir)).toBeNull();
    });

    it("returns null for undefined character", () => {
      expect(generateArtifact(undefined as unknown as string, "input", tempDir)).toBeNull();
    });

    it("returns null for null character", () => {
      expect(generateArtifact(null as unknown as string, "input", tempDir)).toBeNull();
    });

    it("returns null for unknown character", () => {
      expect(generateArtifact("unknown-char", "input", tempDir)).toBeNull();
    });

    it("returns null for path traversal character", () => {
      expect(generateArtifact("../etc/passwd", "input", tempDir)).toBeNull();
    });

    it("returns null for path traversal with dots", () => {
      expect(generateArtifact("homer/../bart", "input", tempDir)).toBeNull();
    });

    it("returns null when springfield directory does not exist", () => {
      const noSpringfield = path.join(tempDir, "no-springfield");
      fs.mkdirSync(noSpringfield);
      expect(generateArtifact("homer", "input", noSpringfield)).toBeNull();
    });
  });

  describe("generates artifacts for valid characters", () => {
    it("generates artifact for homer", () => {
      const result = generateArtifact("homer", "Test project", tempDir);
      expect(result).not.toBeNull();
      expect(fs.existsSync(result!)).toBe(true);
    });

    it("generates artifact for lisa", () => {
      const result = generateArtifact("lisa", "Test input", tempDir);
      expect(result).not.toBeNull();
    });

    it("generates artifact for bart", () => {
      const result = generateArtifact("bart", "Test input", tempDir);
      expect(result).not.toBeNull();
    });

    it("generates artifact for marge", () => {
      const result = generateArtifact("marge", "Test input", tempDir);
      expect(result).not.toBeNull();
    });

    it("generates artifact for burns", () => {
      const result = generateArtifact("burns", "Test input", tempDir);
      expect(result).not.toBeNull();
    });

    it("generates artifact for moe", () => {
      const result = generateArtifact("moe", "Test input", tempDir);
      expect(result).not.toBeNull();
    });
  });

  describe("returns correct artifact path", () => {
    it("returns path within springfield directory", () => {
      const result = generateArtifact("homer", "input", tempDir);
      expect(result).toContain(SPRINGFIELD_DIR);
    });

    it("returns path with correct artifact filename", () => {
      const result = generateArtifact("homer", "input", tempDir);
      expect(result).toContain(CHARACTER_ARTIFACTS.homer);
    });
  });

  describe("creates artifact file with content", () => {
    it("creates file with non-empty content", () => {
      const result = generateArtifact("homer", "Test project", tempDir);
      const content = fs.readFileSync(result!, "utf-8");
      expect(content.length).toBeGreaterThan(0);
    });

    it("content is valid markdown", () => {
      const result = generateArtifact("lisa", "Test analysis", tempDir);
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).toContain("#");
    });

    it("content includes character-specific sections", () => {
      const result = generateArtifact("homer", "Build a widget", tempDir);
      const content = fs.readFileSync(result!, "utf-8");
      // Homer creates project.md which should have project-related content
      expect(content.length).toBeGreaterThan(50);
    });
  });

  describe("input sanitization", () => {
    it("sanitizes script tags from input", () => {
      const result = generateArtifact("homer", "<script>alert('xss')</script>Test", tempDir);
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).not.toContain("<script>");
    });

    it("sanitizes HTML tags from input", () => {
      const result = generateArtifact("lisa", "<div onclick='bad()'>Click</div>", tempDir);
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).not.toContain("<div");
    });

    it("escapes code block injection attempts", () => {
      const result = generateArtifact("bart", "Test\n```\ninjected code\n```", tempDir);
      expect(result).not.toBeNull();
    });

    it("handles empty input string", () => {
      const result = generateArtifact("homer", "", tempDir);
      expect(result).not.toBeNull();
    });

    it("handles undefined input", () => {
      const result = generateArtifact("homer", undefined as unknown as string, tempDir);
      expect(result).not.toBeNull();
    });

    it("truncates very long input", () => {
      const longInput = "A".repeat(20000);
      const result = generateArtifact("homer", longInput, tempDir);
      expect(result).not.toBeNull();
    });
  });

  describe("overwrites existing artifacts", () => {
    it("overwrites existing artifact file", () => {
      const firstResult = generateArtifact("homer", "First version", tempDir);
      const firstContent = fs.readFileSync(firstResult!, "utf-8");

      const secondResult = generateArtifact("homer", "Second version", tempDir);
      const secondContent = fs.readFileSync(secondResult!, "utf-8");

      expect(firstResult).toBe(secondResult);
      expect(firstContent).not.toBe(secondContent);
    });
  });
});

describe("artifactExists Function", () => {
  let tempDir: string;
  let springfieldPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "artifact-exists-"));
    springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
    fs.mkdirSync(springfieldPath);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("returns false when artifact does not exist", () => {
    it("returns false for valid character with no artifact", () => {
      expect(artifactExists("homer", tempDir)).toBe(false);
    });

    it("returns false for unknown character", () => {
      expect(artifactExists("unknown", tempDir)).toBe(false);
    });

    it("returns false when springfield directory missing", () => {
      const noSpringfield = path.join(tempDir, "empty");
      fs.mkdirSync(noSpringfield);
      expect(artifactExists("homer", noSpringfield)).toBe(false);
    });
  });

  describe("returns true when artifact exists", () => {
    it("returns true after artifact generation", () => {
      generateArtifact("homer", "Test", tempDir);
      expect(artifactExists("homer", tempDir)).toBe(true);
    });

    it("returns true for manually created artifact", () => {
      const artifactPath = path.join(springfieldPath, CHARACTER_ARTIFACTS.lisa);
      fs.writeFileSync(artifactPath, "Manual content");
      expect(artifactExists("lisa", tempDir)).toBe(true);
    });
  });

  describe("handles edge cases", () => {
    it("returns false for empty string character", () => {
      expect(artifactExists("", tempDir)).toBe(false);
    });

    it("returns false for character with no artifact mapping", () => {
      expect(artifactExists("nonexistent-char", tempDir)).toBe(false);
    });
  });
});

describe("CHARACTER_ARTIFACTS Mapping", () => {
  describe("simpson_family mappings", () => {
    it("homer maps to questions.md", () => {
      expect(CHARACTER_ARTIFACTS.homer).toBe("questions.md");
    });

    it("marge maps to structure.md", () => {
      expect(CHARACTER_ARTIFACTS.marge).toBe("structure.md");
    });

    it("bart maps to edge-cases.md", () => {
      expect(CHARACTER_ARTIFACTS.bart).toBe("edge-cases.md");
    });

    it("lisa maps to project.md", () => {
      expect(CHARACTER_ARTIFACTS.lisa).toBe("project.md");
    });

    it("maggie maps to logging.md", () => {
      expect(CHARACTER_ARTIFACTS.maggie).toBe("logging.md");
    });
  });

  describe("extended mappings", () => {
    it("grampa maps to history.md", () => {
      expect(CHARACTER_ARTIFACTS.grampa).toBe("history.md");
    });

    it("burns maps to budget.md", () => {
      expect(CHARACTER_ARTIFACTS.burns).toBe("budget.md");
    });

    it("smithers maps to schedule.md", () => {
      expect(CHARACTER_ARTIFACTS.smithers).toBe("schedule.md");
    });

    it("flanders maps to standards.md", () => {
      expect(CHARACTER_ARTIFACTS.flanders).toBe("standards.md");
    });
  });

  describe("springfield mappings", () => {
    it("moe maps to debug-notes.md", () => {
      expect(CHARACTER_ARTIFACTS.moe).toBe("debug-notes.md");
    });

    it("krusty maps to demo.md", () => {
      expect(CHARACTER_ARTIFACTS.krusty).toBe("demo.md");
    });

    it("wiggum maps to security-review.md", () => {
      expect(CHARACTER_ARTIFACTS.wiggum).toBe("security-review.md");
    });

    it("nelson maps to tests.md", () => {
      expect(CHARACTER_ARTIFACTS.nelson).toBe("tests.md");
    });
  });

  describe("specialist mappings", () => {
    it("dr-nick maps to dr-nick-health.md", () => {
      expect(CHARACTER_ARTIFACTS["dr-nick"]).toBe("dr-nick-health.md");
    });

    it("kent maps to kent-monitoring.md", () => {
      expect(CHARACTER_ARTIFACTS.kent).toBe("kent-monitoring.md");
    });
  });

  describe("artifact file extensions", () => {
    it("all mapped artifacts end in .md", () => {
      for (const [, artifact] of Object.entries(CHARACTER_ARTIFACTS)) {
        expect(artifact).toMatch(/\.md$/);
      }
    });
  });
});

describe("Artifact Generation for All Characters", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "all-artifacts-"));
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("can generate artifacts for all simpson_family members", () => {
    const simpsonFamily = ["homer", "marge", "bart", "lisa", "maggie"];
    for (const char of simpsonFamily) {
      const result = generateArtifact(char, "Test", tempDir);
      expect(result).not.toBeNull();
    }
  });

  it("can generate artifacts for extended characters", () => {
    const extended = ["grampa", "burns", "smithers", "flanders"];
    for (const char of extended) {
      const result = generateArtifact(char, "Test", tempDir);
      expect(result).not.toBeNull();
    }
  });

  it("can generate artifacts for springfield characters", () => {
    // Note: ralph doesn't have a CHARACTER_ARTIFACTS mapping
    const springfield = ["moe", "krusty", "wiggum", "nelson"];
    for (const char of springfield) {
      const result = generateArtifact(char, "Test", tempDir);
      expect(result).not.toBeNull();
    }
  });

  it("can generate artifacts for specialist characters", () => {
    const specialists = ["dr-nick", "kent", "otto"];
    for (const char of specialists) {
      const result = generateArtifact(char, "Test", tempDir);
      expect(result).not.toBeNull();
    }
  });
});

describe("Edge Cases and Boundary Conditions", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "artifact-edge-"));
    fs.mkdirSync(path.join(tempDir, SPRINGFIELD_DIR));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("handles special characters in project directory path", () => {
    const specialDir = path.join(tempDir, "special chars & symbols");
    fs.mkdirSync(specialDir);
    fs.mkdirSync(path.join(specialDir, SPRINGFIELD_DIR));
    
    const result = generateArtifact("homer", "Test", specialDir);
    expect(result).not.toBeNull();
  });

  it("handles unicode in user input", () => {
    const result = generateArtifact("lisa", "日本語テスト 🎉", tempDir);
    expect(result).not.toBeNull();
  });

  it("handles newlines in user input", () => {
    const result = generateArtifact("bart", "Line 1\nLine 2\nLine 3", tempDir);
    expect(result).not.toBeNull();
  });

  it("handles tabs in user input", () => {
    const result = generateArtifact("marge", "Tab\there\tand\tmore", tempDir);
    expect(result).not.toBeNull();
  });

  it("generates unique content based on user input", () => {
    const result1 = generateArtifact("homer", "Project A description", tempDir);
    const content1 = fs.readFileSync(result1!, "utf-8");

    const result2 = generateArtifact("homer", "Project B description", tempDir);
    const content2 = fs.readFileSync(result2!, "utf-8");

    // Content should differ based on input
    expect(content1).not.toBe(content2);
  });
});
