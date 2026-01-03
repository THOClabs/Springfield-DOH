/**
 * Tests for src/utils/private-mode.ts - Private mode utilities
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  isPrivateModeEnabled,
  enablePrivateMode,
  disablePrivateMode,
  getPrivateModeStatus,
  getArtifactDirectory,
  hasPrivateFlag,
  getPrivateModeIndicator,
  formatPrivateModeStatus,
  PRIVATE_DIR,
} from "../src/utils/private-mode.js";
import { SPRINGFIELD_DIR } from "../src/constants.js";

describe("private-mode utilities", () => {
  let tempDir: string;
  let springfieldDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "private-mode-test-"));
    springfieldDir = path.join(tempDir, SPRINGFIELD_DIR);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("isPrivateModeEnabled", () => {
    it("returns false when springfield directory does not exist", () => {
      expect(isPrivateModeEnabled(tempDir)).toBe(false);
    });

    it("returns false when no config file exists", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      expect(isPrivateModeEnabled(tempDir)).toBe(false);
    });

    it("returns false when privateMode is not set", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      fs.writeFileSync(
        path.join(springfieldDir, "config.json"),
        JSON.stringify({ someOther: "value" })
      );
      expect(isPrivateModeEnabled(tempDir)).toBe(false);
    });

    it("returns false when privateMode is false", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      fs.writeFileSync(
        path.join(springfieldDir, "config.json"),
        JSON.stringify({ privateMode: false })
      );
      expect(isPrivateModeEnabled(tempDir)).toBe(false);
    });

    it("returns true when privateMode is true", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      fs.writeFileSync(
        path.join(springfieldDir, "config.json"),
        JSON.stringify({ privateMode: true })
      );
      expect(isPrivateModeEnabled(tempDir)).toBe(true);
    });

    it("returns false on invalid JSON", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      fs.writeFileSync(
        path.join(springfieldDir, "config.json"),
        "invalid json content"
      );
      expect(isPrivateModeEnabled(tempDir)).toBe(false);
    });
  });

  describe("enablePrivateMode", () => {
    it("enables private mode and creates private directory", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      const result = enablePrivateMode(tempDir);

      expect(result.enabled).toBe(true);
      expect(result.enabledAt).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.sessionId).toMatch(/^private-\d+-\w+$/);
      expect(isPrivateModeEnabled(tempDir)).toBe(true);
      expect(fs.existsSync(path.join(tempDir, PRIVATE_DIR))).toBe(true);
    });

    it("returns state even when springfield directory does not exist", () => {
      const result = enablePrivateMode(tempDir);

      // Can't save, but returns the state it would set
      expect(result.enabled).toBe(true);
      expect(result.sessionId).toBeDefined();
    });

    it("persists state to config file", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      enablePrivateMode(tempDir);

      const configPath = path.join(springfieldDir, "config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      expect(config.privateMode).toBe(true);
      expect(config.privateModeEnabledAt).toBeDefined();
      expect(config.privateModeSessionId).toBeDefined();
    });
  });

  describe("disablePrivateMode", () => {
    it("disables private mode", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      enablePrivateMode(tempDir);

      const result = disablePrivateMode(tempDir);

      expect(result.enabled).toBe(false);
      expect(result.enabledAt).toBeUndefined();
      expect(result.sessionId).toBeUndefined();
      expect(isPrivateModeEnabled(tempDir)).toBe(false);
    });

    it("clears private mode properties from config", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      enablePrivateMode(tempDir);

      disablePrivateMode(tempDir);

      const configPath = path.join(springfieldDir, "config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      expect(config.privateMode).toBe(false);
      expect(config.privateModeEnabledAt).toBeUndefined();
      expect(config.privateModeSessionId).toBeUndefined();
    });

    it("works when not previously enabled", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      const result = disablePrivateMode(tempDir);

      expect(result.enabled).toBe(false);
    });
  });

  describe("getPrivateModeStatus", () => {
    it("returns disabled state when not enabled", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      const status = getPrivateModeStatus(tempDir);

      expect(status.enabled).toBe(false);
      expect(status.enabledAt).toBeUndefined();
      expect(status.sessionId).toBeUndefined();
    });

    it("returns enabled state with details when enabled", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      enablePrivateMode(tempDir);

      const status = getPrivateModeStatus(tempDir);

      expect(status.enabled).toBe(true);
      expect(status.enabledAt).toBeDefined();
      expect(status.sessionId).toBeDefined();
    });

    it("returns disabled state when springfield directory does not exist", () => {
      const status = getPrivateModeStatus(tempDir);

      expect(status.enabled).toBe(false);
    });
  });

  describe("getArtifactDirectory", () => {
    it("returns springfield directory when private mode disabled", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      const dir = getArtifactDirectory(tempDir);

      expect(dir).toBe(path.join(tempDir, SPRINGFIELD_DIR));
    });

    it("returns private directory when private mode enabled", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      enablePrivateMode(tempDir);

      const dir = getArtifactDirectory(tempDir);

      expect(dir).toBe(path.join(tempDir, PRIVATE_DIR));
    });

    it("returns private directory when forcePrivate is true", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });

      const dir = getArtifactDirectory(tempDir, true);

      expect(dir).toBe(path.join(tempDir, PRIVATE_DIR));
    });

    it("returns springfield directory when forcePrivate is false", () => {
      fs.mkdirSync(springfieldDir, { recursive: true });
      enablePrivateMode(tempDir);

      const dir = getArtifactDirectory(tempDir, false);

      expect(dir).toBe(path.join(tempDir, SPRINGFIELD_DIR));
    });
  });

  describe("hasPrivateFlag", () => {
    it("detects --private flag", () => {
      const result = hasPrivateFlag(["homer", "--private", "some question"]);

      expect(result.hasFlag).toBe(true);
      expect(result.cleanArgs).toEqual(["homer", "some question"]);
    });

    it("detects -p shorthand flag", () => {
      const result = hasPrivateFlag(["homer", "-p", "some question"]);

      expect(result.hasFlag).toBe(true);
      expect(result.cleanArgs).toEqual(["homer", "some question"]);
    });

    it("returns false when no flag present", () => {
      const result = hasPrivateFlag(["homer", "some question"]);

      expect(result.hasFlag).toBe(false);
      expect(result.cleanArgs).toEqual(["homer", "some question"]);
    });

    it("handles empty args", () => {
      const result = hasPrivateFlag([]);

      expect(result.hasFlag).toBe(false);
      expect(result.cleanArgs).toEqual([]);
    });

    it("handles multiple flags (removes all)", () => {
      const result = hasPrivateFlag(["--private", "homer", "-p"]);

      expect(result.hasFlag).toBe(true);
      expect(result.cleanArgs).toEqual(["homer"]);
    });
  });

  describe("getPrivateModeIndicator", () => {
    it("returns formatted indicator string", () => {
      const indicator = getPrivateModeIndicator();

      expect(indicator).toContain("PRIVATE MODE");
      expect(indicator).toContain(PRIVATE_DIR);
    });
  });

  describe("formatPrivateModeStatus", () => {
    it("formats disabled state", () => {
      const status = formatPrivateModeStatus({ enabled: false });

      expect(status).toContain("Private Mode: OFF");
      expect(status).toContain("private-mode on");
    });

    it("formats enabled state with details", () => {
      const status = formatPrivateModeStatus({
        enabled: true,
        enabledAt: new Date().toISOString(),
        sessionId: "private-123-abc",
      });

      expect(status).toContain("Private Mode: ON");
      expect(status).toContain("Moe");
      expect(status).toContain("private-123-abc");
      expect(status).toContain("private-mode off");
    });

    it("handles missing enabledAt gracefully", () => {
      const status = formatPrivateModeStatus({
        enabled: true,
        sessionId: "test-session",
      });

      expect(status).toContain("Private Mode: ON");
      expect(status).toContain("unknown");
    });

    it("handles missing sessionId gracefully", () => {
      const status = formatPrivateModeStatus({
        enabled: true,
        enabledAt: new Date().toISOString(),
      });

      expect(status).toContain("Private Mode: ON");
      expect(status).toContain("unknown");
    });
  });

  describe("PRIVATE_DIR constant", () => {
    it("is defined as .springfield-private", () => {
      expect(PRIVATE_DIR).toBe(".springfield-private");
    });
  });
});
