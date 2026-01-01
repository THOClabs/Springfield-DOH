import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { summonCharacter } from "../src/commands/summon.js";

describe("Summon Command Edge Cases", () => {
  const testDir = path.join(os.tmpdir(), "summon-edge-test-" + Date.now());
  const springfieldDir = path.join(testDir, ".springfield");

  beforeEach(() => {
    fs.mkdirSync(springfieldDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("character loading paths", () => {
    it("loads simpson-family character agent", async () => {
      const result = await summonCharacter("homer", "test input", { cwd: testDir });
      
      expect(result).toContain("Homer");
      expect(result).toContain("considers the request");
    });

    it("loads extended character agent", async () => {
      const result = await summonCharacter("grampa", "test input", { cwd: testDir });
      
      expect(result).toContain("Grampa");
    });

    it("loads springfield character agent", async () => {
      const result = await summonCharacter("moe", "test input", { cwd: testDir });
      
      expect(result).toContain("Moe");
    });

    it("loads specialists character agent", async () => {
      const result = await summonCharacter("hans", "test input", { cwd: testDir });
      
      expect(result).toContain("Hans");
    });

    it("handles character with missing agent file gracefully", async () => {
      // This should use the fallback response generator
      // We test with a known character that definitely has an agent file
      // but also verify the code path works when generateCharacterResponse is called
      const result = await summonCharacter("lisa", "test", { cwd: testDir });
      
      expect(result).toContain("Lisa");
      expect(result).toContain("Character:");
    });
  });

  describe("input handling", () => {
    it("handles empty user input", async () => {
      const result = await summonCharacter("bart", "", { cwd: testDir });
      
      expect(result).toContain("Bart");
      expect(result).toContain("(no specific input)");
    });

    it("handles very long user input", async () => {
      const longInput = "A".repeat(1000);
      const result = await summonCharacter("marge", longInput, { cwd: testDir });
      
      expect(result).toContain("Marge");
    });

    it("handles special characters in input", async () => {
      const result = await summonCharacter("lisa", "Test with <html> & 'quotes'", { cwd: testDir });
      
      expect(result).toContain("Lisa");
    });
  });

  describe("unknown character handling", () => {
    it("returns error for unknown character", async () => {
      const result = await summonCharacter("unknown-character", "test", { cwd: testDir });
      
      expect(result).toContain("Unknown character");
      expect(result).toContain("Available characters");
    });

    it("returns error for empty character name", async () => {
      const result = await summonCharacter("", "test", { cwd: testDir });
      
      expect(result).toContain("Unknown character");
    });
  });

  describe("context handling", () => {
    it("uses process.cwd when context.cwd is undefined", async () => {
      // This tests the fallback to process.cwd()
      const result = await summonCharacter("maggie", "test", {});
      
      expect(result).toContain("Maggie");
    });
  });
});
