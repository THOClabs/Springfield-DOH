/**
 * Tests for config.ts - Configuration system edge cases
 * v3.0.1.1 - Coverage enhancement for branch coverage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  getConfig,
  getCachedConfig,
  clearConfigCache,
  validateConfig,
  DEFAULT_CONFIG,
} from "../src/config.js";

describe("config.ts", () => {
  const originalEnv = { ...process.env };
  let tempDir: string;

  beforeEach(() => {
    clearConfigCache();
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "config-test-"));
  });

  afterEach(() => {
    process.env = originalEnv;
    clearConfigCache();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("parseValue via environment variables", () => {
    it("parses tokenTtlMs from environment", () => {
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "5000";
      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(5000);
    });

    it("parses tokenMaxUses from environment", () => {
      process.env.SPRINGFIELD_TOKEN_MAX_USES = "3";
      const config = getConfig(tempDir);
      expect(config.tokenMaxUses).toBe(3);
    });

    it("parses maxTokensPerMinute from environment", () => {
      process.env.SPRINGFIELD_RATE_LIMIT = "20";
      const config = getConfig(tempDir);
      expect(config.maxTokensPerMinute).toBe(20);
    });

    it("parses rateLimitWindowMs from environment", () => {
      process.env.SPRINGFIELD_RATE_WINDOW_MS = "120000";
      const config = getConfig(tempDir);
      expect(config.rateLimitWindowMs).toBe(120000);
    });

    it("parses minContentLength from environment", () => {
      process.env.SPRINGFIELD_MIN_CONTENT_LENGTH = "500";
      const config = getConfig(tempDir);
      expect(config.minContentLength).toBe(500);
    });

    it("parses defaultMaxIterations from environment", () => {
      process.env.SPRINGFIELD_MAX_ITERATIONS = "50";
      const config = getConfig(tempDir);
      expect(config.defaultMaxIterations).toBe(50);
    });

    it("parses defaultCompletionPromise from environment", () => {
      process.env.SPRINGFIELD_COMPLETION_PROMISE = "FINISHED";
      const config = getConfig(tempDir);
      expect(config.defaultCompletionPromise).toBe("FINISHED");
    });

    it("parses valid logLevel from environment", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "debug";
      const config = getConfig(tempDir);
      expect(config.logLevel).toBe("debug");
    });

    it("returns default for invalid logLevel", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "invalid_level";
      const config = getConfig(tempDir);
      expect(config.logLevel).toBe(DEFAULT_CONFIG.logLevel);
    });

    it("parses all valid logLevel values", () => {
      const validLevels = ["debug", "info", "warn", "error", "silent"] as const;
      for (const level of validLevels) {
        clearConfigCache();
        process.env.SPRINGFIELD_LOG_LEVEL = level;
        const config = getConfig(tempDir);
        expect(config.logLevel).toBe(level);
      }
    });
  });

  describe("loadConfigFile", () => {
    it("loads config from .springfieldrc.json", () => {
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(
        configPath,
        JSON.stringify({ tokenTtlMs: 10000, minContentLength: 300 })
      );

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(10000);
      expect(config.minContentLength).toBe(300);
    });

    it("loads config from .springfieldrc (no extension)", () => {
      const configPath = path.join(tempDir, ".springfieldrc");
      fs.writeFileSync(
        configPath,
        JSON.stringify({ tokenMaxUses: 5 })
      );

      const config = getConfig(tempDir);
      expect(config.tokenMaxUses).toBe(5);
    });

    it("loads config from springfield.config.json", () => {
      const configPath = path.join(tempDir, "springfield.config.json");
      fs.writeFileSync(
        configPath,
        JSON.stringify({ maxTokensPerMinute: 25 })
      );

      const config = getConfig(tempDir);
      expect(config.maxTokensPerMinute).toBe(25);
    });

    it("skips malformed JSON and continues to next file", () => {
      // Write malformed JSON to first config path
      const malformedPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(malformedPath, "{ invalid json }");

      // Write valid JSON to second config path
      const validPath = path.join(tempDir, ".springfieldrc");
      fs.writeFileSync(
        validPath,
        JSON.stringify({ tokenTtlMs: 15000 })
      );

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(15000);
    });

    it("returns defaults when all config files are malformed", () => {
      const malformedPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(malformedPath, "not valid json at all");

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
    });

    it("returns defaults when no config file exists", () => {
      const config = getConfig(tempDir);
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("prioritizes first valid config file found", () => {
      // Write different values to each config file
      fs.writeFileSync(
        path.join(tempDir, ".springfieldrc.json"),
        JSON.stringify({ tokenTtlMs: 1000 })
      );
      fs.writeFileSync(
        path.join(tempDir, ".springfieldrc"),
        JSON.stringify({ tokenTtlMs: 2000 })
      );
      fs.writeFileSync(
        path.join(tempDir, "springfield.config.json"),
        JSON.stringify({ tokenTtlMs: 3000 })
      );

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(1000); // First file wins
    });
  });

  describe("config priority", () => {
    it("environment variables override config file values", () => {
      // Set in config file
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(
        configPath,
        JSON.stringify({ tokenTtlMs: 10000 })
      );

      // Set in environment (should win)
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "5000";

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(5000);
    });
  });

  describe("getCachedConfig", () => {
    it("caches configuration after first call", () => {
      const config1 = getCachedConfig(tempDir);
      
      // Change env var - should not affect cached config
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "99999";
      
      const config2 = getCachedConfig(tempDir);
      expect(config2.tokenTtlMs).toBe(config1.tokenTtlMs);
    });

    it("returns fresh config after cache cleared", () => {
      getCachedConfig(tempDir);
      
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "88888";
      clearConfigCache();
      
      const config = getCachedConfig(tempDir);
      expect(config.tokenTtlMs).toBe(88888);
    });
  });

  describe("validateConfig", () => {
    it("returns error for tokenTtlMs below 1000", () => {
      const errors = validateConfig({ tokenTtlMs: 500 });
      expect(errors).toContain("tokenTtlMs must be at least 1000ms (1 second)");
    });

    it("returns error for tokenMaxUses below 1", () => {
      const errors = validateConfig({ tokenMaxUses: 0 });
      expect(errors).toContain("tokenMaxUses must be at least 1");
    });

    it("returns error for negative tokenMaxUses", () => {
      const errors = validateConfig({ tokenMaxUses: -5 });
      expect(errors).toContain("tokenMaxUses must be at least 1");
    });

    it("returns error for maxTokensPerMinute below 1", () => {
      const errors = validateConfig({ maxTokensPerMinute: 0 });
      expect(errors).toContain("maxTokensPerMinute must be at least 1");
    });

    it("returns error for rateLimitWindowMs below 1000", () => {
      const errors = validateConfig({ rateLimitWindowMs: 500 });
      expect(errors).toContain("rateLimitWindowMs must be at least 1000ms (1 second)");
    });

    it("returns error for negative minContentLength", () => {
      const errors = validateConfig({ minContentLength: -1 });
      expect(errors).toContain("minContentLength cannot be negative");
    });

    it("returns error for defaultMaxIterations below 1", () => {
      const errors = validateConfig({ defaultMaxIterations: 0 });
      expect(errors).toContain("defaultMaxIterations must be at least 1");
    });

    it("returns multiple errors for multiple invalid values", () => {
      const errors = validateConfig({
        tokenTtlMs: 100,
        tokenMaxUses: -1,
        minContentLength: -10,
      });
      expect(errors.length).toBe(3);
    });

    it("returns empty array for valid config", () => {
      const errors = validateConfig({
        tokenTtlMs: 5000,
        tokenMaxUses: 3,
        minContentLength: 100,
      });
      expect(errors).toEqual([]);
    });

    it("returns empty array for empty config", () => {
      const errors = validateConfig({});
      expect(errors).toEqual([]);
    });
  });
});
