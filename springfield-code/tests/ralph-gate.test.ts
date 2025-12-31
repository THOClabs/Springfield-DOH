import { describe, it, expect, beforeEach } from "vitest";
import {
  setRalphInitiated,
  canInvokeRalph,
} from "../src/hooks/ralph-gate.js";

describe("ralph-gate hook", () => {
  beforeEach(() => {
    // Reset state before each test
    setRalphInitiated(false);
  });

  describe("canInvokeRalph", () => {
    it("returns false by default", () => {
      expect(canInvokeRalph()).toBe(false);
    });

    it("returns true after Lisa initiation", () => {
      setRalphInitiated(true);
      expect(canInvokeRalph()).toBe(true);
    });
  });

  describe("setRalphInitiated", () => {
    it("sets the flag to true", () => {
      setRalphInitiated(true);
      expect(canInvokeRalph()).toBe(true);
    });

    it("sets the flag to false", () => {
      setRalphInitiated(true);
      setRalphInitiated(false);
      expect(canInvokeRalph()).toBe(false);
    });
  });
});
