import { describe, it, expect } from "vitest";
import { getArtifactTemplate } from "../src/artifacts/generators/index.js";
import type { ConversationContext } from "../src/types.js";

describe("Artifact Template Generator", () => {
  describe("getArtifactTemplate", () => {
    const createContext = (userInput: string): ConversationContext => ({
      character: "test",
      userInput,
      timestamp: new Date(),
    });

    it("returns template for known character (homer)", () => {
      const context = createContext("Test input");
      const result = getArtifactTemplate("homer", context);
      
      expect(result).toContain("Homer's Questions");
      expect(result).toContain("Test input");
    });

    it("returns template for known character (lisa)", () => {
      const context = createContext("Architecture review");
      const result = getArtifactTemplate("lisa", context);
      
      expect(result).toContain("Lisa's Analysis");
    });

    it("returns template for known character (bart)", () => {
      const context = createContext("Edge cases");
      const result = getArtifactTemplate("bart", context);
      
      expect(result).toContain("Chaos Report");
    });

    it("returns fallback template for unknown character", () => {
      const context = createContext("Test input for unknown");
      const result = getArtifactTemplate("unknowncharacter", context);
      
      expect(result).toContain("Unknowncharacter's Notes");
      expect(result).toContain("Test input for unknown");
    });

    it("capitalizes first letter in fallback template", () => {
      const context = createContext("Input");
      const result = getArtifactTemplate("testchar", context);
      
      expect(result).toContain("Testchar's Notes");
    });

    it("handles empty user input in fallback", () => {
      const context = createContext("");
      const result = getArtifactTemplate("mystery", context);
      
      expect(result).toContain("Mystery's Notes");
    });
  });
});
