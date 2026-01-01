import { describe, it, expect } from "vitest";
import * as path from "path";
import * as os from "os";
import { summonCharacter } from "../src/commands/summon.js";

describe("Simpson Family Commands", () => {
  const context = { cwd: path.join(os.tmpdir(), "test") };

  describe("homer command", () => {
    it("responds in character", async () => {
      const response = await summonCharacter("homer", "Why build this?", context);

      expect(response).toContain("Homer");
      expect(response.toLowerCase()).toMatch(/d'oh|donut|think|question/);
    });

    it("produces questions artifact reference", async () => {
      const response = await summonCharacter("homer", "test", context);

      expect(response).toContain("questions.md");
    });
  });

  describe("marge command", () => {
    it("responds in character", async () => {
      const response = await summonCharacter("marge", "How to organize?", context);

      expect(response).toContain("Marge");
    });

    it("produces structure artifact reference", async () => {
      const response = await summonCharacter("marge", "test", context);

      expect(response).toContain("structure.md");
    });
  });

  describe("bart command", () => {
    it("responds in character", async () => {
      const response = await summonCharacter("bart", "What could break?", context);

      expect(response).toContain("Bart");
    });

    it("produces edge-cases artifact reference", async () => {
      const response = await summonCharacter("bart", "test", context);

      expect(response).toContain("edge-cases.md");
    });
  });

  describe("lisa command", () => {
    it("responds in character", async () => {
      const response = await summonCharacter("lisa", "Design the architecture", context);

      expect(response).toContain("Lisa");
    });

    it("produces project artifact reference", async () => {
      const response = await summonCharacter("lisa", "test", context);

      expect(response).toContain("project.md");
    });
  });

  describe("maggie command", () => {
    it("responds in character", async () => {
      const response = await summonCharacter("maggie", "What to log?", context);

      expect(response).toContain("Maggie");
      expect(response).toContain("squeak");
    });

    it("produces logging artifact reference", async () => {
      const response = await summonCharacter("maggie", "test", context);

      expect(response).toContain("logging.md");
    });
  });

  describe("invalid character", () => {
    it("returns error for unknown character", async () => {
      const response = await summonCharacter("unknown", "test", context);

      expect(response).toContain("Unknown character");
      expect(response).toContain("Available characters");
    });
  });
});
