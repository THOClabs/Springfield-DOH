import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { generateArtifact, artifactExists } from "../src/artifacts/generator.js";

describe("Artifact Generator", () => {
  const testDir = path.join(os.tmpdir(), "artifact-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("generateArtifact", () => {
    it("creates Homer artifact", () => {
      const result = generateArtifact("homer", "Why build this?", testDir);

      expect(result).toContain("questions.md");
      expect(fs.existsSync(result!)).toBe(true);

      const content = fs.readFileSync(result!, "utf-8");
      expect(content).toContain("Homer's Questions");
      expect(content).toContain("Why build this?");
    });

    it("creates Marge artifact", () => {
      const result = generateArtifact("marge", "How to organize?", testDir);

      expect(result).toContain("structure.md");
      expect(fs.existsSync(result!)).toBe(true);

      const content = fs.readFileSync(result!, "utf-8");
      expect(content).toContain("Marge's Organization");
    });

    it("creates Bart artifact", () => {
      const result = generateArtifact("bart", "What could break?", testDir);

      expect(result).toContain("edge-cases.md");
      expect(fs.existsSync(result!)).toBe(true);

      const content = fs.readFileSync(result!, "utf-8");
      expect(content).toContain("Chaos Report");
    });

    it("creates Lisa artifact", () => {
      const result = generateArtifact("lisa", "Design the system", testDir);

      expect(result).toContain("project.md");
      expect(fs.existsSync(result!)).toBe(true);

      const content = fs.readFileSync(result!, "utf-8");
      expect(content).toContain("Lisa's Analysis");
    });

    it("returns null if Springfield not initialized", () => {
      fs.rmSync(springfieldDir, { recursive: true, force: true });
      const result = generateArtifact("homer", "test", testDir);

      expect(result).toBeNull();
    });

    it("returns null for unknown character", () => {
      const result = generateArtifact("unknown", "test", testDir);

      expect(result).toBeNull();
    });
  });

  describe("artifactExists", () => {
    it("returns false when artifact doesn't exist", () => {
      expect(artifactExists("homer", testDir)).toBe(false);
    });

    it("returns true when artifact exists", () => {
      generateArtifact("homer", "test", testDir);
      expect(artifactExists("homer", testDir)).toBe(true);
    });
  });

  describe("all characters have generators", () => {
    const characters = [
      "homer", "marge", "bart", "lisa", "maggie",
      "grampa", "burns", "smithers", "flanders",
      "milhouse", "moe", "wiggum", "krusty", "bob",
      "skinner", "nelson", "apu", "frink", "cbg", "willie"
    ];

    characters.forEach((character) => {
      it(`generates artifact for ${character}`, () => {
        const result = generateArtifact(character, "test input", testDir);

        expect(result).not.toBeNull();
        expect(fs.existsSync(result!)).toBe(true);

        const content = fs.readFileSync(result!, "utf-8");
        expect(content.length).toBeGreaterThan(100);
      });
    });
  });

  describe("input sanitization edge cases", () => {
    it("handles null input gracefully", () => {
      const result = generateArtifact("homer", null as unknown as string, testDir);
      expect(result).not.toBeNull();
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).not.toContain("null");
    });

    it("handles undefined input gracefully", () => {
      const result = generateArtifact("homer", undefined as unknown as string, testDir);
      expect(result).not.toBeNull();
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).not.toContain("undefined");
    });

    it("strips script tags from input", () => {
      const maliciousInput = '<script>alert("xss")</script>Please help me design';
      const result = generateArtifact("lisa", maliciousInput, testDir);
      
      expect(result).not.toBeNull();
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).not.toContain("<script>");
      expect(content).not.toContain("alert");
      expect(content).toContain("[removed]");
    });

    it("strips HTML tags from input", () => {
      const htmlInput = '<div onclick="bad()">Help <b>me</b></div>';
      const result = generateArtifact("marge", htmlInput, testDir);
      
      expect(result).not.toBeNull();
      const content = fs.readFileSync(result!, "utf-8");
      expect(content).not.toContain("<div");
      expect(content).not.toContain("<b>");
      expect(content).toContain("Help");
      expect(content).toContain("me");
    });

    it("escapes triple backticks to prevent code block injection", () => {
      const codeBlockInput = '```javascript\nmalicious\n```';
      const result = generateArtifact("frink", codeBlockInput, testDir);
      
      expect(result).not.toBeNull();
      const content = fs.readFileSync(result!, "utf-8");
      // Should have escaped backticks
      expect(content).toContain("\\`\\`\\`");
    });

    it("truncates very long input to prevent buffer issues", () => {
      const longInput = "A".repeat(20000);
      const result = generateArtifact("bart", longInput, testDir);
      
      expect(result).not.toBeNull();
      const content = fs.readFileSync(result!, "utf-8");
      // The sanitized input should be limited to 10000 chars
      expect(content.length).toBeLessThan(15000);
    });
  });

  describe("character validation edge cases", () => {
    it("returns null for null character", () => {
      const result = generateArtifact(null as unknown as string, "test", testDir);
      expect(result).toBeNull();
    });

    it("returns null for undefined character", () => {
      const result = generateArtifact(undefined as unknown as string, "test", testDir);
      expect(result).toBeNull();
    });

    it("returns null for empty string character", () => {
      const result = generateArtifact("", "test", testDir);
      expect(result).toBeNull();
    });

    it("returns null for non-string character", () => {
      const result = generateArtifact(123 as unknown as string, "test", testDir);
      expect(result).toBeNull();
    });

    it("returns null for path traversal in character name", () => {
      const result = generateArtifact("../../../etc/passwd", "test", testDir);
      expect(result).toBeNull();
    });

    it("returns null for character with special chars", () => {
      const result = generateArtifact("homer/../bart", "test", testDir);
      expect(result).toBeNull();
    });
  });

  describe("artifactExists edge cases", () => {
    it("returns false for null character", () => {
      expect(artifactExists(null as unknown as string, testDir)).toBe(false);
    });

    it("returns false for undefined character", () => {
      expect(artifactExists(undefined as unknown as string, testDir)).toBe(false);
    });

    it("returns false for unknown character", () => {
      expect(artifactExists("unknowncharacter", testDir)).toBe(false);
    });

    it("returns false when springfield dir doesn't exist", () => {
      fs.rmSync(springfieldDir, { recursive: true, force: true });
      expect(artifactExists("homer", testDir)).toBe(false);
    });
  });
});
