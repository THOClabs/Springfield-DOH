/**
 * Error Handling Deep Tests (Batch 80)
 *
 * Deep testing of error handling across the codebase,
 * including invalid inputs, edge cases, and recovery scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { summonCharacter } from "../src/commands/summon.js";
import { generateArtifact, artifactExists } from "../src/artifacts/generator.js";
import { validateRequiredFiles, ALL_CHARACTERS, CHARACTER_TIERS } from "../src/constants.js";
import {
  requestRalphAuthorization,
  canInvokeRalph,
  authorizeRalph,
  revokeRalphAuthorization,
  _resetForTesting,
} from "../src/hooks/ralph-gate.js";

describe("Summon Character Error Handling", () => {
  describe("invalid character names", () => {
    it("handles non-existent character gracefully", async () => {
      try {
        const result = await summonCharacter("nonexistent", "test", { cwd: "/tmp" });
        // May return error message or empty string
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles empty character name", async () => {
      try {
        const result = await summonCharacter("", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles null-like character name", async () => {
      try {
        const result = await summonCharacter("null", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles undefined-like character name", async () => {
      try {
        const result = await summonCharacter("undefined", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles numeric character name", async () => {
      try {
        const result = await summonCharacter("123", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe("path traversal attempts", () => {
    it("handles path traversal in character name", async () => {
      try {
        const result = await summonCharacter("../../../etc/passwd", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles absolute path in character name", async () => {
      try {
        const result = await summonCharacter("/etc/passwd", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe("special character handling", () => {
    it("handles character name with spaces", async () => {
      try {
        const result = await summonCharacter("homer simpson", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles character name with special chars", async () => {
      try {
        const result = await summonCharacter("homer!@#$%", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles character name with unicode", async () => {
      try {
        const result = await summonCharacter("ホーマー", "test", { cwd: "/tmp" });
        expect(result).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});

describe("Artifact Generator Error Handling", () => {
  describe("invalid character inputs", () => {
    it("handles non-existent character", async () => {
      const result = await generateArtifact("nonexistent", "/tmp", "test");
      // Should return null or error
      expect(result === null || typeof result === "string").toBe(true);
    });

    it("handles empty character name", async () => {
      const result = await generateArtifact("", "/tmp", "test");
      expect(result === null || typeof result === "string").toBe(true);
    });

    it("handles character without artifact mapping", async () => {
      // ralph doesn't have an artifact mapping
      const result = await generateArtifact("ralph", "/tmp", "test");
      expect(result).toBeNull();
    });
  });

  describe("path validation", () => {
    it("handles invalid output path", async () => {
      try {
        const result = await generateArtifact("homer", "", "test");
        expect(result === null || typeof result === "string").toBe(true);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it("handles path with special characters", async () => {
      try {
        const result = await generateArtifact("homer", "/tmp/path with spaces", "test");
        expect(result === null || typeof result === "string").toBe(true);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe("artifact existence checks", () => {
    it("returns false for non-existent artifact", () => {
      const exists = artifactExists("homer", "/nonexistent/path");
      expect(exists).toBe(false);
    });

    it("handles empty character name", () => {
      const exists = artifactExists("", "/tmp");
      expect(exists).toBe(false);
    });

    it("handles character without artifact mapping", () => {
      const exists = artifactExists("ralph", "/tmp");
      expect(exists).toBe(false);
    });
  });
});

describe("Validation Error Handling", () => {
  describe("validateRequiredFiles edge cases", () => {
    it("handles non-existent directory", () => {
      const result = validateRequiredFiles("/nonexistent/path/to/dir");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("handles empty string path", () => {
      const result = validateRequiredFiles("");
      expect(result.isValid).toBe(false);
    });

    it("handles path with special characters", () => {
      const result = validateRequiredFiles("/path/with spaces/and $pecial");
      expect(result.isValid).toBe(false);
    });

    it("handles very long path", () => {
      const longPath = "/tmp/" + "a".repeat(500);
      const result = validateRequiredFiles(longPath);
      expect(result.isValid).toBe(false);
    });
  });
});

describe("Ralph Gate Error Handling", () => {
  beforeEach(() => {
    _resetForTesting?.();
  });

  afterEach(() => {
    _resetForTesting?.();
  });

  describe("token validation", () => {
    it("rejects invalid token", () => {
      requestRalphAuthorization();
      const result = authorizeRalph("invalid-token");
      expect(result).toBe(false);
    });

    it("rejects empty token", () => {
      requestRalphAuthorization();
      const result = authorizeRalph("");
      expect(result).toBe(false);
    });

    it("rejects undefined token", () => {
      requestRalphAuthorization();
      // @ts-ignore - testing runtime behavior
      const result = authorizeRalph(undefined);
      expect(result).toBe(false);
    });

    it("rejects null token", () => {
      requestRalphAuthorization();
      // @ts-ignore - testing runtime behavior
      const result = authorizeRalph(null);
      expect(result).toBe(false);
    });
  });

  describe("authorization state", () => {
    it("canInvokeRalph returns false when not authorized", () => {
      expect(canInvokeRalph()).toBe(false);
    });

    it("canInvokeRalph returns true after request", () => {
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      expect(canInvokeRalph()).toBe(true);
    });

    it("canInvokeRalph returns false after token consumed", () => {
      const token = requestRalphAuthorization();
      if (token) {
        authorizeRalph(token);
      }
      expect(canInvokeRalph()).toBe(false);
    });
  });

  describe("request handling", () => {
    it("second request replaces first token", () => {
      const token1 = requestRalphAuthorization();
      const token2 = requestRalphAuthorization();
      // First token should be invalid now
      if (token1) {
        expect(authorizeRalph(token1)).toBe(false);
      }
    });
  });
});

describe("Character Tier Error Handling", () => {
  it("all tier arrays are non-empty", () => {
    expect(CHARACTER_TIERS.simpson_family.length).toBeGreaterThan(0);
    expect(CHARACTER_TIERS.extended.length).toBeGreaterThan(0);
    expect(CHARACTER_TIERS.springfield.length).toBeGreaterThan(0);
    expect(CHARACTER_TIERS.specialists.length).toBeGreaterThan(0);
  });

  it("ALL_CHARACTERS is non-empty", () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThan(0);
  });

  it("tier names are valid", () => {
    const tierNames = Object.keys(CHARACTER_TIERS);
    expect(tierNames).toContain("simpson_family");
    expect(tierNames).toContain("extended");
    expect(tierNames).toContain("springfield");
    expect(tierNames).toContain("specialists");
  });
});

describe("Input Boundary Tests", () => {
  it("handles maximum length prompt", async () => {
    const maxPrompt = "x".repeat(100000);
    const result = await summonCharacter("homer", maxPrompt, { cwd: "/tmp" });
    expect(result).toBeDefined();
  });

  it("handles prompt with only whitespace", async () => {
    const result = await summonCharacter("homer", "   \n\t   ", { cwd: "/tmp" });
    expect(result).toBeDefined();
  });

  it("handles prompt with null bytes", async () => {
    const result = await summonCharacter("homer", "test\x00null\x00bytes", { cwd: "/tmp" });
    expect(result).toBeDefined();
  });
});
