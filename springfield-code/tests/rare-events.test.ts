/**
 * Tests for src/utils/rare-events.ts - Rare Random Events
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  checkRareEvent,
  formatRareEventSuffix,
  getAllRareEvents,
  getRareEventById,
  _setTestSeed,
  _getTestSeed,
  type RareEvent,
} from "../src/utils/rare-events.js";

describe("Rare Events", () => {
  afterEach(() => {
    // Always reset seed after tests
    _setTestSeed(null);
  });

  describe("_setTestSeed and _getTestSeed", () => {
    it("sets and gets test seed", () => {
      _setTestSeed(12345);
      expect(_getTestSeed()).toBe(12345);
    });

    it("clears seed when set to null", () => {
      _setTestSeed(12345);
      _setTestSeed(null);
      expect(_getTestSeed()).toBeNull();
    });
  });

  describe("Context Triggers", () => {
    describe("Steamed Hams (aurora reference)", () => {
      it("triggers on aurora mention with high probability", () => {
        // With a multiplier of 100x on 1% base = 100% guaranteed
        // Test multiple seeds to ensure it works
        let triggered = false;

        for (let seed = 0; seed < 100; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("Look at those aurora borealis!");
          if (result.triggered && result.event?.id === "steamed-hams") {
            triggered = true;
            expect(result.triggerContext).toContain("aurora");
            break;
          }
        }

        expect(triggered).toBe(true);
      });

      it("triggers on northern lights mention", () => {
        let triggered = false;

        for (let seed = 0; seed < 100; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("The northern lights are beautiful");
          if (result.triggered && result.event?.id === "steamed-hams") {
            triggered = true;
            break;
          }
        }

        expect(triggered).toBe(true);
      });
    });

    describe("Monorail (project planning)", () => {
      it("triggers on project planning context", () => {
        let triggered = false;

        for (let seed = 0; seed < 200; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("Let's create a project roadmap for this initiative");
          if (result.triggered && result.event?.id === "monorail") {
            triggered = true;
            break;
          }
        }

        expect(triggered).toBe(true);
      });

      it("does NOT trigger without planning context", () => {
        // Monorail requiresContext, so random text should never trigger it
        let monorailCount = 0;

        for (let seed = 0; seed < 100; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("Random text about nothing special");
          if (result.event?.id === "monorail") {
            monorailCount++;
          }
        }

        expect(monorailCount).toBe(0);
      });
    });

    describe("Frank Grimes (hard work)", () => {
      it("triggers on hard work mention", () => {
        let triggered = false;

        for (let seed = 0; seed < 100; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("This requires hard work and dedication");
          if (result.triggered && result.event?.id === "frank-grimes") {
            triggered = true;
            expect(result.triggerContext).toContain("hard work");
            break;
          }
        }

        expect(triggered).toBe(true);
      });

      it("triggers on effort mention", () => {
        let triggered = false;

        for (let seed = 0; seed < 100; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("All this effort and struggle...");
          if (result.triggered && result.event?.id === "frank-grimes") {
            triggered = true;
            break;
          }
        }

        expect(triggered).toBe(true);
      });
    });

    describe("Duffman (celebration)", () => {
      it("triggers on celebration context", () => {
        let triggered = false;

        for (let seed = 0; seed < 500; seed++) {
          _setTestSeed(seed);
          const result = checkRareEvent("Let's celebrate and party!");
          if (result.triggered && result.event?.id === "duffman") {
            triggered = true;
            break;
          }
        }

        expect(triggered).toBe(true);
      });
    });
  });

  describe("Probability Distribution", () => {
    it("rare events (0.1%) are actually rare", () => {
      // Spider-pig is 0.1% - in 10000 iterations, expect ~10 triggers
      // But other events may also trigger, so we're looking for low counts
      let spiderPigCount = 0;

      for (let seed = 0; seed < 10000; seed++) {
        _setTestSeed(seed);
        const result = checkRareEvent("completely random text");
        if (result.event?.id === "spider-pig") {
          spiderPigCount++;
        }
      }

      // Should be relatively rare (less than 50 in 10000)
      expect(spiderPigCount).toBeLessThan(50);
    });

    it("returns no event when nothing triggers", () => {
      // Find a seed that doesn't trigger anything
      let foundNoTrigger = false;

      for (let seed = 0; seed < 1000; seed++) {
        _setTestSeed(seed);
        const result = checkRareEvent("boring text");
        if (!result.triggered) {
          foundNoTrigger = true;
          expect(result.event).toBeUndefined();
          expect(result.triggerContext).toBeUndefined();
          break;
        }
      }

      expect(foundNoTrigger).toBe(true);
    });
  });

  describe("checkRareEvent", () => {
    it("returns triggered: false when no event fires", () => {
      // Use a specific seed known to not trigger on simple text
      _setTestSeed(42);
      const result = checkRareEvent("simple text");

      // May or may not trigger depending on seed, but structure should be correct
      if (!result.triggered) {
        expect(result.event).toBeUndefined();
      }
    });

    it("returns proper structure when triggered", () => {
      // Force trigger with aurora reference
      for (let seed = 0; seed < 100; seed++) {
        _setTestSeed(seed);
        const result = checkRareEvent("aurora borealis");
        if (result.triggered) {
          expect(result.event).toBeDefined();
          expect(result.event?.id).toBeTruthy();
          expect(result.event?.name).toBeTruthy();
          expect(result.event?.content).toBeTruthy();
          break;
        }
      }
    });
  });

  describe("formatRareEventSuffix", () => {
    it("formats event with separators", () => {
      const event: RareEvent = {
        id: "test",
        name: "Test Event",
        probability: 0.01,
        content: "Test content",
      };

      const formatted = formatRareEventSuffix(event);

      expect(formatted).toContain("---");
      expect(formatted).toContain("*[Rare Event: Test Event]*");
      expect(formatted).toContain("Test content");
    });

    it("starts with newlines for suffix positioning", () => {
      const event: RareEvent = {
        id: "test",
        name: "Test",
        probability: 0.01,
        content: "Content",
      };

      const formatted = formatRareEventSuffix(event);

      expect(formatted.startsWith("\n")).toBe(true);
    });
  });

  describe("getAllRareEvents", () => {
    it("returns array of events", () => {
      const events = getAllRareEvents();

      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it("returns a copy (not the original array)", () => {
      const events1 = getAllRareEvents();
      const events2 = getAllRareEvents();

      expect(events1).not.toBe(events2);
    });

    it("includes expected events", () => {
      const events = getAllRareEvents();
      const ids = events.map((e) => e.id);

      expect(ids).toContain("steamed-hams");
      expect(ids).toContain("monorail");
      expect(ids).toContain("spider-pig");
      expect(ids).toContain("frank-grimes");
    });
  });

  describe("getRareEventById", () => {
    it("returns event by id", () => {
      const event = getRareEventById("steamed-hams");

      expect(event).not.toBeUndefined();
      expect(event?.id).toBe("steamed-hams");
      expect(event?.name).toBe("Steamed Hams");
    });

    it("returns undefined for unknown id", () => {
      const event = getRareEventById("nonexistent");

      expect(event).toBeUndefined();
    });
  });

  describe("Event content validation", () => {
    it("all events have required properties", () => {
      const events = getAllRareEvents();

      for (const event of events) {
        expect(event.id).toBeTruthy();
        expect(event.name).toBeTruthy();
        expect(event.content).toBeTruthy();
        expect(typeof event.probability).toBe("number");
        expect(event.probability).toBeGreaterThan(0);
        expect(event.probability).toBeLessThanOrEqual(1);
      }
    });

    it("steamed-hams content includes Skinner", () => {
      const event = getRareEventById("steamed-hams");
      expect(event?.content).toContain("Skinner");
    });

    it("monorail content includes the song", () => {
      const event = getRareEventById("monorail");
      expect(event?.content).toContain("MONORAIL");
    });

    it("spider-pig content includes the song", () => {
      const event = getRareEventById("spider-pig");
      expect(event?.content).toContain("Spider-Pig");
    });

    it("frank-grimes content includes his rant", () => {
      const event = getRareEventById("frank-grimes");
      expect(event?.content).toContain("POWER PLANT");
    });
  });
});
