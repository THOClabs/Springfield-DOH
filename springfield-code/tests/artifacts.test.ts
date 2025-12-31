import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { generateArtifact, artifactExists } from "../src/artifacts/generator.js";

describe("Artifact Generator", () => {
  const testDir = "/tmp/artifact-test-" + Date.now();
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
});
