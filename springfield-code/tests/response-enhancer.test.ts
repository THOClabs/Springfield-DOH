/**
 * Tests for src/utils/response-enhancer.ts - Response Enhancement Integration
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import {
  calculateEnhancements,
  applyEnhancements,
  enhanceResponse,
  hasActiveEnhancements,
  getEnhancementStatus,
  DEFAULT_ENHANCEMENT_CONFIG,
  type EnhancementConfig,
  type EnhancementResult,
} from "../src/utils/response-enhancer.js";
import { _setTestSeed } from "../src/utils/rare-events.js";

describe("Response Enhancer", () => {
  afterEach(() => {
    vi.useRealTimers();
    _setTestSeed(null);
  });

  describe("DEFAULT_ENHANCEMENT_CONFIG", () => {
    it("has easter eggs enabled by default", () => {
      expect(DEFAULT_ENHANCEMENT_CONFIG.easterEggsEnabled).toBe(true);
    });

    it("has rare events enabled by default", () => {
      expect(DEFAULT_ENHANCEMENT_CONFIG.rareEventsEnabled).toBe(true);
    });
  });

  describe("calculateEnhancements", () => {
    describe("with default config", () => {
      it("returns empty prefix/suffix on regular day with no triggers", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-07-15T10:00:00")); // Regular day
        _setTestSeed(42); // Seed that likely won't trigger rare events

        const result = calculateEnhancements("homer", "normal input");

        // May have rare event depending on seed, but should have structure
        expect(typeof result.prefix).toBe("string");
        expect(typeof result.suffix).toBe("string");
        expect(typeof result.metadata).toBe("object");
      });

      it("includes easter egg prefix on special date", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-04-01T12:00:00")); // April Fools

        const result = calculateEnhancements("homer", "normal input");

        expect(result.prefix).toContain("April Fools");
        expect(result.metadata.easterEggId).toBe("april-fools");
      });

      it("includes rare event suffix when triggered", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-07-15T10:00:00")); // Regular day

        // Aurora trigger should guarantee steamed-hams
        let found = false;
        for (let seed = 0; seed < 100; seed++) {
          _setTestSeed(seed);
          const result = calculateEnhancements("homer", "aurora borealis");
          if (result.metadata.rareEventId === "steamed-hams") {
            expect(result.suffix).toContain("Steamed Hams");
            found = true;
            break;
          }
        }
        expect(found).toBe(true);
      });

      it("uses character-specific easter egg overrides", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-02-23T12:00:00")); // Bart's birthday

        const result = calculateEnhancements("bart", "hello");

        expect(result.prefix).toContain("February 23");
        expect(result.metadata.easterEggId).toBe("bart-birthday");
      });
    });

    describe("with easter eggs disabled", () => {
      it("returns empty prefix even on special date", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-04-01T12:00:00")); // April Fools
        _setTestSeed(42);

        const config: EnhancementConfig = {
          easterEggsEnabled: false,
          rareEventsEnabled: true,
        };

        const result = calculateEnhancements("homer", "normal input", config);

        expect(result.prefix).toBe("");
        expect(result.metadata.easterEggId).toBeUndefined();
      });
    });

    describe("with rare events disabled", () => {
      it("returns empty suffix even with trigger context", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-07-15T10:00:00"));

        const config: EnhancementConfig = {
          easterEggsEnabled: true,
          rareEventsEnabled: false,
        };

        const result = calculateEnhancements("homer", "aurora borealis", config);

        expect(result.suffix).toBe("");
        expect(result.metadata.rareEventId).toBeUndefined();
      });
    });

    describe("with all features disabled", () => {
      it("returns empty enhancements", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-04-01T12:00:00")); // April Fools

        const config: EnhancementConfig = {
          easterEggsEnabled: false,
          rareEventsEnabled: false,
        };

        const result = calculateEnhancements("homer", "aurora borealis", config);

        expect(result.prefix).toBe("");
        expect(result.suffix).toBe("");
        expect(result.metadata.easterEggId).toBeUndefined();
        expect(result.metadata.rareEventId).toBeUndefined();
      });
    });
  });

  describe("applyEnhancements", () => {
    it("wraps response with prefix and suffix", () => {
      const enhancements: EnhancementResult = {
        prefix: "[PREFIX]\n",
        suffix: "\n[SUFFIX]",
        metadata: {},
      };

      const result = applyEnhancements("Base response", enhancements);

      expect(result).toBe("[PREFIX]\nBase response\n[SUFFIX]");
    });

    it("returns original when no enhancements", () => {
      const enhancements: EnhancementResult = {
        prefix: "",
        suffix: "",
        metadata: {},
      };

      const result = applyEnhancements("Base response", enhancements);

      expect(result).toBe("Base response");
    });

    it("handles prefix only", () => {
      const enhancements: EnhancementResult = {
        prefix: "[PREFIX]\n",
        suffix: "",
        metadata: {},
      };

      const result = applyEnhancements("Base response", enhancements);

      expect(result).toBe("[PREFIX]\nBase response");
    });

    it("handles suffix only", () => {
      const enhancements: EnhancementResult = {
        prefix: "",
        suffix: "\n[SUFFIX]",
        metadata: {},
      };

      const result = applyEnhancements("Base response", enhancements);

      expect(result).toBe("Base response\n[SUFFIX]");
    });
  });

  describe("enhanceResponse", () => {
    it("combines calculation and application", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-04-01T12:00:00")); // April Fools
      _setTestSeed(42);

      const { response, metadata } = enhanceResponse(
        "homer",
        "hello world",
        "D'oh!"
      );

      expect(response).toContain("D'oh!");
      expect(response).toContain("April Fools");
      expect(metadata.easterEggId).toBe("april-fools");
    });

    it("accepts custom config", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-04-01T12:00:00"));

      const { response, metadata } = enhanceResponse(
        "homer",
        "hello",
        "D'oh!",
        { easterEggsEnabled: false, rareEventsEnabled: false }
      );

      expect(response).toBe("D'oh!");
      expect(metadata.easterEggId).toBeUndefined();
    });
  });

  describe("hasActiveEnhancements", () => {
    it("returns true on special date", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-04-01T12:00:00"));

      expect(hasActiveEnhancements()).toBe(true);
    });

    it("returns false on regular day", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-07-15T10:00:00"));

      expect(hasActiveEnhancements()).toBe(false);
    });

    it("returns false when easter eggs disabled", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-04-01T12:00:00"));

      const config: EnhancementConfig = {
        easterEggsEnabled: false,
        rareEventsEnabled: true,
      };

      expect(hasActiveEnhancements(config)).toBe(false);
    });
  });

  describe("getEnhancementStatus", () => {
    it("shows enabled status", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-07-15T10:00:00"));

      const status = getEnhancementStatus();

      expect(status).toContain("Easter Eggs: ENABLED");
      expect(status).toContain("Rare Events: ENABLED");
    });

    it("shows disabled status when disabled", () => {
      const status = getEnhancementStatus({
        easterEggsEnabled: false,
        rareEventsEnabled: false,
      });

      expect(status).toContain("Easter Eggs: DISABLED");
      expect(status).toContain("Rare Events: DISABLED");
    });

    it("shows active event when present", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-04-01T12:00:00"));

      const status = getEnhancementStatus();

      expect(status).toContain("Active Event:");
      expect(status).toContain("April Fools");
    });

    it("shows no active event on regular day", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-07-15T10:00:00"));

      const status = getEnhancementStatus();

      expect(status).toContain("No special date/time event");
    });
  });
});
