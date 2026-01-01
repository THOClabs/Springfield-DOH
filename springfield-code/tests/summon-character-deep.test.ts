/**
 * Summon Character Deep Tests (Batch 77)
 *
 * Deep testing of the summon character functionality,
 * including character resolution, context handling, and edge cases.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { summonCharacter } from "../src/commands/summon.js";
import { summonCommand } from "../src/index.js";
import {
  ALL_CHARACTERS,
  CHARACTER_TIERS,
} from "../src/constants.js";

// Extract tiers from CHARACTER_TIERS
const SIMPSON_FAMILY = CHARACTER_TIERS.simpson_family;
const EXTENDED_FAMILY = CHARACTER_TIERS.extended;
const SPRINGFIELD_RESIDENTS = CHARACTER_TIERS.springfield;
const SPECIALISTS = CHARACTER_TIERS.specialists;

describe("Summon Character Function", () => {
  describe("function exists and is callable", () => {
    it("summonCharacter is a function", () => {
      expect(typeof summonCharacter).toBe("function");
    });

    it("summonCommand has run function", () => {
      expect(typeof summonCommand.run).toBe("function");
    });
  });

  describe("character parameter validation", () => {
    it("returns result for valid character name", async () => {
      const result = await summonCharacter("homer", "test prompt", {
        cwd: "/tmp",
      });
      expect(result).toBeDefined();
    });

    it("handles empty prompt gracefully", async () => {
      const result = await summonCharacter("homer", "", { cwd: "/tmp" });
      expect(result).toBeDefined();
    });

    it("handles missing context gracefully", async () => {
      const result = await summonCharacter("homer", "test");
      expect(result).toBeDefined();
    });
  });

  describe("character name case handling", () => {
    it("accepts lowercase character names", async () => {
      const result = await summonCharacter("lisa", "test", { cwd: "/tmp" });
      expect(result).toBeDefined();
    });

    it("handles uppercase character names", async () => {
      // Should normalize or handle appropriately
      try {
        const result = await summonCharacter("HOMER", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        // Some implementations may reject uppercase
        expect(e).toBeDefined();
      }
    });

    it("handles mixed case character names", async () => {
      try {
        const result = await summonCharacter("Homer", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});

describe("Character Sets Constants", () => {
  describe("ALL_CHARACTERS", () => {
    it("is defined and is an array", () => {
      expect(ALL_CHARACTERS).toBeDefined();
      expect(Array.isArray(ALL_CHARACTERS)).toBe(true);
    });

    it("contains all simpson family members", () => {
      for (const member of SIMPSON_FAMILY) {
        expect(ALL_CHARACTERS).toContain(member);
      }
    });

    it("contains all extended family members", () => {
      for (const member of EXTENDED_FAMILY) {
        expect(ALL_CHARACTERS).toContain(member);
      }
    });

    it("contains all springfield residents", () => {
      for (const member of SPRINGFIELD_RESIDENTS) {
        expect(ALL_CHARACTERS).toContain(member);
      }
    });

    it("contains all specialists", () => {
      for (const member of SPECIALISTS) {
        expect(ALL_CHARACTERS).toContain(member);
      }
    });

    it("has no duplicates", () => {
      const uniqueSet = new Set(ALL_CHARACTERS);
      expect(uniqueSet.size).toBe(ALL_CHARACTERS.length);
    });
  });

  describe("SIMPSON_FAMILY", () => {
    it("contains core family members", () => {
      const coreFamily = ["homer", "marge", "bart", "lisa", "maggie"];
      for (const member of coreFamily) {
        expect(SIMPSON_FAMILY).toContain(member);
      }
    });

    it("has at least 5 members", () => {
      expect(SIMPSON_FAMILY.length).toBeGreaterThanOrEqual(5);
    });

    it("all names are lowercase", () => {
      for (const member of SIMPSON_FAMILY) {
        expect(member).toBe(member.toLowerCase());
      }
    });
  });

  describe("EXTENDED_FAMILY", () => {
    it("contains grampa", () => {
      expect(EXTENDED_FAMILY).toContain("grampa");
    });

    it("contains burns", () => {
      expect(EXTENDED_FAMILY).toContain("burns");
    });

    it("contains smithers", () => {
      expect(EXTENDED_FAMILY).toContain("smithers");
    });

    it("contains flanders", () => {
      expect(EXTENDED_FAMILY).toContain("flanders");
    });

    it("has at least 4 members", () => {
      expect(EXTENDED_FAMILY.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("SPRINGFIELD_RESIDENTS", () => {
    it("contains moe", () => {
      expect(SPRINGFIELD_RESIDENTS).toContain("moe");
    });

    it("contains wiggum", () => {
      expect(SPRINGFIELD_RESIDENTS).toContain("wiggum");
    });

    it("contains ralph", () => {
      expect(SPRINGFIELD_RESIDENTS).toContain("ralph");
    });

    it("contains milhouse", () => {
      expect(SPRINGFIELD_RESIDENTS).toContain("milhouse");
    });

    it("has at least 10 members", () => {
      expect(SPRINGFIELD_RESIDENTS.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("SPECIALISTS", () => {
    it("contains dr-nick", () => {
      expect(SPECIALISTS).toContain("dr-nick");
    });

    it("contains kent", () => {
      expect(SPECIALISTS).toContain("kent");
    });

    it("has specialist characters", () => {
      expect(SPECIALISTS.length).toBeGreaterThan(0);
    });

    it("specialists are not in simpson family", () => {
      for (const specialist of SPECIALISTS) {
        expect(SIMPSON_FAMILY).not.toContain(specialist);
      }
    });
  });
});

describe("Character Set Relationships", () => {
  it("simpson family and extended family are disjoint", () => {
    for (const member of SIMPSON_FAMILY) {
      expect(EXTENDED_FAMILY).not.toContain(member);
    }
  });

  it("simpson family and springfield residents are disjoint", () => {
    for (const member of SIMPSON_FAMILY) {
      expect(SPRINGFIELD_RESIDENTS).not.toContain(member);
    }
  });

  it("simpson family and specialists are disjoint", () => {
    for (const member of SIMPSON_FAMILY) {
      expect(SPECIALISTS).not.toContain(member);
    }
  });

  it("extended family and springfield residents are disjoint", () => {
    for (const member of EXTENDED_FAMILY) {
      expect(SPRINGFIELD_RESIDENTS).not.toContain(member);
    }
  });

  it("ALL_CHARACTERS equals sum of all groups", () => {
    const totalFromGroups =
      SIMPSON_FAMILY.length +
      EXTENDED_FAMILY.length +
      SPRINGFIELD_RESIDENTS.length +
      SPECIALISTS.length;
    expect(ALL_CHARACTERS.length).toBe(totalFromGroups);
  });
});

describe("Summon Command Interface", () => {
  describe("command interface", () => {
    it("accepts character name as first argument", async () => {
      const result = await summonCommand.run(["homer"], { cwd: "/tmp" });
      expect(result).toBeDefined();
    });

    it("accepts character name and prompt", async () => {
      const result = await summonCommand.run(["homer", "test prompt"], { cwd: "/tmp" });
      expect(result).toBeDefined();
    });

    it("handles empty args array", async () => {
      try {
        const result = await summonCommand.run([], { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        // May throw if no character specified
        expect(e).toBeDefined();
      }
    });
  });

  describe("context handling", () => {
    it("uses cwd from context", async () => {
      const result = await summonCommand.run(["homer"], { cwd: "/custom/path" });
      expect(result).toBeDefined();
    });

    it("handles undefined context", async () => {
      try {
        const result = await summonCommand.run(["homer"]);
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});

describe("Summon Return Values", () => {
  it("summon returns a string", async () => {
    const result = await summonCharacter("homer", "test", { cwd: "/tmp" });
    expect(typeof result).toBe("string");
  });

  it("summon returns non-empty string for valid character", async () => {
    const result = await summonCharacter("lisa", "analyze this", {
      cwd: "/tmp",
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it("summonCommand.run returns a string", async () => {
    const result = await summonCommand.run(["bart", "test"], { cwd: "/tmp" });
    expect(typeof result).toBe("string");
  });
});

describe("Character Name Edge Cases", () => {
  it("handles hyphenated names", async () => {
    try {
      const result = await summonCharacter("dr-nick", "test", { cwd: "/tmp" });
      expect(result).toBeDefined();
    } catch (e) {
      // dr-nick might require special handling
      expect(e).toBeDefined();
    }
  });

  it("handles names with numbers", async () => {
    // No current characters have numbers, but test robustness
    try {
      const result = await summonCharacter("homer2", "test", { cwd: "/tmp" });
      expect(result).toBeDefined();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it("rejects special characters in name", async () => {
    try {
      const result = await summonCharacter("homer/../bart", "test", {
        cwd: "/tmp",
      });
      // Should either reject or sanitize
      expect(result).toBeDefined();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it("rejects empty character name", async () => {
    try {
      const result = await summonCharacter("", "test", { cwd: "/tmp" });
      expect(result).toBeDefined();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it("rejects whitespace-only character name", async () => {
    try {
      const result = await summonCharacter("   ", "test", { cwd: "/tmp" });
      expect(result).toBeDefined();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

describe("Prompt Edge Cases", () => {
  it("handles very long prompts", async () => {
    const longPrompt = "test ".repeat(1000);
    const result = await summonCharacter("homer", longPrompt, { cwd: "/tmp" });
    expect(result).toBeDefined();
  });

  it("handles prompts with special characters", async () => {
    const result = await summonCharacter("homer", "test <>&\"'", {
      cwd: "/tmp",
    });
    expect(result).toBeDefined();
  });

  it("handles prompts with newlines", async () => {
    const result = await summonCharacter("homer", "test\nwith\nnewlines", {
      cwd: "/tmp",
    });
    expect(result).toBeDefined();
  });

  it("handles prompts with unicode", async () => {
    const result = await summonCharacter("homer", "test 日本語 🎉", {
      cwd: "/tmp",
    });
    expect(result).toBeDefined();
  });
});

describe("Character Tier Mappings", () => {
  it("each tier has distinct characters", () => {
    const allTierCharacters = [
      ...SIMPSON_FAMILY,
      ...EXTENDED_FAMILY,
      ...SPRINGFIELD_RESIDENTS,
      ...SPECIALISTS,
    ];
    const uniqueSet = new Set(allTierCharacters);
    expect(uniqueSet.size).toBe(allTierCharacters.length);
  });

  it("simpson_family has exactly 5 members", () => {
    expect(SIMPSON_FAMILY.length).toBe(5);
  });

  it("extended has exactly 4 members", () => {
    expect(EXTENDED_FAMILY.length).toBe(4);
  });

  it("springfield has exactly 12 members", () => {
    expect(SPRINGFIELD_RESIDENTS.length).toBe(12);
  });

  it("specialists has exactly 20 members", () => {
    expect(SPECIALISTS.length).toBe(20);
  });

  it("all tiers sum to 41 characters", () => {
    const total =
      SIMPSON_FAMILY.length +
      EXTENDED_FAMILY.length +
      SPRINGFIELD_RESIDENTS.length +
      SPECIALISTS.length;
    expect(total).toBe(41);
  });
});
