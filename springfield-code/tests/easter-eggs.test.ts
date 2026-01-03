/**
 * Tests for src/utils/easter-eggs.ts - Date/Time Easter Eggs
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import {
  checkActiveEasterEgg,
  getEasterEggMessage,
  formatEasterEggPrefix,
  getAllEasterEggs,
  getEasterEggById,
  type EasterEggEvent,
} from "../src/utils/easter-eggs.js";

describe("Easter Egg Events", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("checkActiveEasterEgg", () => {
    describe("Stonecutters (Tuesday 3:15 PM)", () => {
      it("returns stonecutters event on Tuesday at 3:15 PM", () => {
        // January 7, 2025 is a Tuesday
        const tuesday315 = new Date("2025-01-07T15:15:00");
        const event = checkActiveEasterEgg(tuesday315);

        expect(event).not.toBeNull();
        expect(event?.id).toBe("stonecutters");
        expect(event?.name).toBe("Stonecutters Greeting");
      });

      it("returns stonecutters at 3:19 PM (within window)", () => {
        const tuesday319 = new Date("2025-01-07T15:19:00");
        const event = checkActiveEasterEgg(tuesday319);

        expect(event?.id).toBe("stonecutters");
      });

      it("does not return stonecutters at 3:20 PM (outside window)", () => {
        const tuesday320 = new Date("2025-01-07T15:20:00");
        const event = checkActiveEasterEgg(tuesday320);

        // Should return null (no active event on a random Tuesday afternoon)
        expect(event?.id).not.toBe("stonecutters");
      });

      it("does not return stonecutters on Wednesday at 3:15 PM", () => {
        // January 8, 2025 is a Wednesday
        const wednesday315 = new Date("2025-01-08T15:15:00");
        const event = checkActiveEasterEgg(wednesday315);

        expect(event?.id).not.toBe("stonecutters");
      });
    });

    describe("Bart Birthday (February 23)", () => {
      it("returns bart-birthday on February 23", () => {
        const bartBday = new Date("2025-02-23T12:00:00");
        const event = checkActiveEasterEgg(bartBday);

        expect(event).not.toBeNull();
        expect(event?.id).toBe("bart-birthday");
      });

      it("does not return bart-birthday on February 22", () => {
        const dayBefore = new Date("2025-02-22T12:00:00");
        const event = checkActiveEasterEgg(dayBefore);

        expect(event?.id).not.toBe("bart-birthday");
      });
    });

    describe("April Fools (April 1)", () => {
      it("returns april-fools on April 1", () => {
        const aprilFools = new Date("2025-04-01T12:00:00");
        const event = checkActiveEasterEgg(aprilFools);

        expect(event).not.toBeNull();
        expect(event?.id).toBe("april-fools");
      });
    });

    describe("Treehouse of Horror (October)", () => {
      it("returns treehouse-of-horror on October 1", () => {
        const oct1 = new Date("2025-10-01T12:00:00");
        const event = checkActiveEasterEgg(oct1);

        expect(event).not.toBeNull();
        expect(event?.id).toBe("treehouse-of-horror");
      });

      it("returns treehouse-of-horror on October 31", () => {
        const halloween = new Date("2025-10-31T12:00:00");
        const event = checkActiveEasterEgg(halloween);

        expect(event?.id).toBe("treehouse-of-horror");
      });

      it("does not return treehouse-of-horror on November 1", () => {
        const nov1 = new Date("2025-11-01T12:00:00");
        const event = checkActiveEasterEgg(nov1);

        expect(event?.id).not.toBe("treehouse-of-horror");
      });
    });

    describe("Holiday Season (December 20-31)", () => {
      it("returns holiday-season on December 25", () => {
        const xmas = new Date("2025-12-25T12:00:00");
        const event = checkActiveEasterEgg(xmas);

        expect(event).not.toBeNull();
        expect(event?.id).toBe("holiday-season");
      });

      it("returns holiday-season on December 20", () => {
        const dec20 = new Date("2025-12-20T12:00:00");
        const event = checkActiveEasterEgg(dec20);

        expect(event?.id).toBe("holiday-season");
      });

      it("returns holiday-season on December 31", () => {
        const dec31 = new Date("2025-12-31T12:00:00");
        const event = checkActiveEasterEgg(dec31);

        expect(event?.id).toBe("holiday-season");
      });

      it("does not return holiday-season on December 19", () => {
        const dec19 = new Date("2025-12-19T12:00:00");
        const event = checkActiveEasterEgg(dec19);

        expect(event?.id).not.toBe("holiday-season");
      });
    });

    describe("Lisa Birthday (May 12)", () => {
      it("returns lisa-birthday on May 12", () => {
        const lisaBday = new Date("2025-05-12T12:00:00");
        const event = checkActiveEasterEgg(lisaBday);

        expect(event?.id).toBe("lisa-birthday");
      });
    });

    describe("Maggie Birthday (June 2)", () => {
      it("returns maggie-birthday on June 2", () => {
        const maggieBday = new Date("2025-06-02T12:00:00");
        const event = checkActiveEasterEgg(maggieBday);

        expect(event?.id).toBe("maggie-birthday");
      });
    });

    describe("Homer Birthday (May 10)", () => {
      it("returns homer-birthday on May 10", () => {
        const homerBday = new Date("2025-05-10T12:00:00");
        const event = checkActiveEasterEgg(homerBday);

        expect(event?.id).toBe("homer-birthday");
      });
    });

    describe("Regular days (no event)", () => {
      it("returns null on a regular day", () => {
        // July 15 - no special event
        const boringDay = new Date("2025-07-15T10:00:00");
        const event = checkActiveEasterEgg(boringDay);

        expect(event).toBeNull();
      });
    });

    describe("Priority handling", () => {
      it("prefers higher priority events when multiple could match", () => {
        // If Bart's birthday happened to be a Tuesday at 3:15 PM,
        // Stonecutters should win due to higher priority
        // Let's test that priority is respected

        const events = getAllEasterEggs();
        const stonecutters = events.find((e) => e.id === "stonecutters");
        const bartBirthday = events.find((e) => e.id === "bart-birthday");

        expect(stonecutters?.priority).toBeGreaterThan(bartBirthday?.priority || 0);
      });
    });
  });

  describe("getEasterEggMessage", () => {
    it("returns character override when available", () => {
      const event: EasterEggEvent = {
        id: "test",
        name: "Test Event",
        message: "default message",
        characterOverrides: { bart: "special bart message" },
        isActive: () => true,
        priority: 50,
      };

      const msg = getEasterEggMessage(event, "bart");

      expect(msg).toBe("special bart message");
    });

    it("returns default message for non-overridden characters", () => {
      const event: EasterEggEvent = {
        id: "test",
        name: "Test Event",
        message: "default message",
        characterOverrides: { bart: "special" },
        isActive: () => true,
        priority: 50,
      };

      const msg = getEasterEggMessage(event, "homer");

      expect(msg).toBe("default message");
    });

    it("returns default message when no character specified", () => {
      const event: EasterEggEvent = {
        id: "test",
        name: "Test Event",
        message: "default message",
        characterOverrides: { bart: "special" },
        isActive: () => true,
        priority: 50,
      };

      const msg = getEasterEggMessage(event);

      expect(msg).toBe("default message");
    });

    it("returns default message when no overrides defined", () => {
      const event: EasterEggEvent = {
        id: "test",
        name: "Test Event",
        message: "default message",
        isActive: () => true,
        priority: 50,
      };

      const msg = getEasterEggMessage(event, "bart");

      expect(msg).toBe("default message");
    });
  });

  describe("formatEasterEggPrefix", () => {
    it("formats event with separators and title", () => {
      const event: EasterEggEvent = {
        id: "test",
        name: "Test Event",
        message: "Test content",
        isActive: () => true,
        priority: 50,
      };

      const formatted = formatEasterEggPrefix(event);

      expect(formatted).toContain("---");
      expect(formatted).toContain("*[Special Event: Test Event]*");
      expect(formatted).toContain("Test content");
    });

    it("uses character override in formatted output", () => {
      const event: EasterEggEvent = {
        id: "test",
        name: "Test Event",
        message: "default",
        characterOverrides: { homer: "Homer's special message" },
        isActive: () => true,
        priority: 50,
      };

      const formatted = formatEasterEggPrefix(event, "homer");

      expect(formatted).toContain("Homer's special message");
      expect(formatted).not.toContain("default");
    });
  });

  describe("getAllEasterEggs", () => {
    it("returns array of events", () => {
      const events = getAllEasterEggs();

      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it("returns a copy (not the original array)", () => {
      const events1 = getAllEasterEggs();
      const events2 = getAllEasterEggs();

      expect(events1).not.toBe(events2);
      expect(events1).toEqual(events2);
    });
  });

  describe("getEasterEggById", () => {
    it("returns event by id", () => {
      const event = getEasterEggById("stonecutters");

      expect(event).not.toBeUndefined();
      expect(event?.id).toBe("stonecutters");
      expect(event?.name).toBe("Stonecutters Greeting");
    });

    it("returns undefined for unknown id", () => {
      const event = getEasterEggById("nonexistent");

      expect(event).toBeUndefined();
    });
  });

  describe("Event content validation", () => {
    it("all events have required properties", () => {
      const events = getAllEasterEggs();

      for (const event of events) {
        expect(event.id).toBeTruthy();
        expect(event.name).toBeTruthy();
        expect(event.message).toBeTruthy();
        expect(typeof event.isActive).toBe("function");
        expect(typeof event.priority).toBe("number");
      }
    });

    it("stonecutters message contains signature phrase", () => {
      const event = getEasterEggById("stonecutters");
      expect(event?.message).toContain("We do!");
    });

    it("treehouse-of-horror message is spooky", () => {
      const event = getEasterEggById("treehouse-of-horror");
      expect(event?.message).toContain("HORROR");
    });

    it("holiday-season message is festive", () => {
      const event = getEasterEggById("holiday-season");
      expect(event?.message).toContain("Happy Holidays");
    });
  });
});
