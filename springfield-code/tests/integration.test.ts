/**
 * Integration Tests for Springfield Code v2.2.0+ Features
 *
 * Tests for stats, summon-batch, cancel-ralph commands, and configuration system.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

// Stats utilities - uses projectDir as first arg
import {
  loadStats,
  recordInvocation,
  getTopCharacters,
  formatStatsReport,
  resetStats,
} from "../src/utils/stats.js";

// Ralph gate - import from index.ts to use the proper export name
import {
  requestRalphAuthorization,
  revokeRalphAuthorization,
  canInvokeRalph,
  resetRalphGateForTesting,
} from "../src/index.js";

// Config
import {
  getConfig,
  getCachedConfig,
  clearConfigCache,
  validateConfig,
  DEFAULT_CONFIG,
} from "../src/config.js";

// Commands - use run function, not handler
import { run as summonBatchRun } from "../src/commands/summon-batch.js";
import { run as cancelRalphRun } from "../src/commands/cancel-ralph.js";

describe("Integration Tests", () => {
  let testDir: string;
  let springfieldDir: string;

  beforeEach(() => {
    testDir = path.join(os.tmpdir(), `springfield-int-test-${Date.now()}`);
    springfieldDir = path.join(testDir, ".springfield");
    fs.mkdirSync(springfieldDir, { recursive: true });
    clearConfigCache();
    resetRalphGateForTesting();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    clearConfigCache();
    resetRalphGateForTesting();
  });

  describe("Stats Command Integration", () => {
    it("returns empty stats when no invocations", () => {
      const stats = loadStats(testDir);
      expect(stats).not.toBeNull();
      expect(stats!.totalInvocations).toBe(0);
    });

    it("tracks invocations after character recording", () => {
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "bart");

      const stats = loadStats(testDir);
      expect(stats).not.toBeNull();
      expect(stats!.totalInvocations).toBe(3);
      expect(stats!.characters.homer).toBe(2);
      expect(stats!.characters.bart).toBe(1);
      expect(stats!.tiers.simpson_family).toBe(3);
    });

    it("resets stats correctly", () => {
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "lisa");

      let stats = loadStats(testDir);
      expect(stats!.totalInvocations).toBe(2);

      resetStats(testDir);

      stats = loadStats(testDir);
      expect(stats!.totalInvocations).toBe(0);
    });

    it("shows top characters correctly", () => {
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "bart");
      recordInvocation(testDir, "lisa");

      const top = getTopCharacters(testDir, 2);
      expect(top).toHaveLength(2);
      expect(top[0].character).toBe("homer");
      expect(top[0].count).toBe(3);
      expect(top[1].character).toBe("bart");
    });

    it("increments tier counts correctly", () => {
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "burns");
      recordInvocation(testDir, "moe");
      recordInvocation(testDir, "dr-nick");

      const stats = loadStats(testDir);
      expect(stats!.tiers.simpson_family).toBe(1);
      expect(stats!.tiers.extended).toBe(1);
      expect(stats!.tiers.springfield).toBe(1);
      expect(stats!.tiers.specialists).toBe(1);
    });

    it("formats stats report with data", () => {
      recordInvocation(testDir, "homer");
      recordInvocation(testDir, "homer");

      const report = formatStatsReport(testDir);

      expect(report).toContain("Usage Statistics");
      expect(report).toContain("homer");
    });
  });

  describe("Summon Batch Command Integration", () => {
    it("returns help content when no tier specified", async () => {
      const result = await summonBatchRun([], { cwd: testDir });
      expect(result).toContain("Batch Summon");
      expect(result).toContain("family");
      expect(result).toContain("specialists");
    });

    it("lists family tier characters", async () => {
      const result = await summonBatchRun(["family"], { cwd: testDir });
      expect(result).toContain("homer");
      expect(result).toContain("marge");
      expect(result).toContain("bart");
      expect(result).toContain("lisa");
      expect(result).toContain("maggie");
    });

    it("lists extended tier characters", async () => {
      const result = await summonBatchRun(["extended"], { cwd: testDir });
      expect(result).toContain("grampa");
      expect(result).toContain("burns");
      expect(result).toContain("smithers");
      expect(result).toContain("flanders");
    });

    it("lists springfield tier characters", async () => {
      const result = await summonBatchRun(["springfield"], { cwd: testDir });
      expect(result).toContain("moe");
      expect(result).toContain("wiggum");
      expect(result).toContain("krusty");
    });

    it("lists specialists tier characters", async () => {
      const result = await summonBatchRun(["specialists"], { cwd: testDir });
      expect(result).toContain("dr-nick");
      expect(result).toContain("patty");
      expect(result).toContain("agnes");
    });

    it("rejects unknown tier", async () => {
      const result = await summonBatchRun(["unknown-tier"], { cwd: testDir });
      expect(result).toContain("Unknown");
    });
  });

  describe("Cancel Ralph Command Integration", () => {
    it("reports no active session when not authorized", async () => {
      const result = await cancelRalphRun([], { cwd: testDir });
      expect(result).toContain("No Active Ralph");
    });

    it("revokes authorization when Ralph is pending", async () => {
      // Request authorization
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      expect(canInvokeRalph()).toBe(true);

      // Cancel
      const result = await cancelRalphRun([], { cwd: testDir });
      expect(result).toContain("Revoked");

      // Should no longer be invocable
      expect(canInvokeRalph()).toBe(false);
    });

    it("allows re-authorization after cancel", async () => {
      // First authorization
      const token1 = requestRalphAuthorization();
      expect(token1).not.toBeNull();

      // Cancel
      revokeRalphAuthorization();
      expect(canInvokeRalph()).toBe(false);

      // Re-authorize
      const token2 = requestRalphAuthorization();
      expect(token2).not.toBeNull();
      expect(canInvokeRalph()).toBe(true);
    });
  });

  describe("Configuration System Integration", () => {
    it("returns default config when no file exists", () => {
      const config = getConfig(testDir);
      expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
      expect(config.maxTokensPerMinute).toBe(DEFAULT_CONFIG.maxTokensPerMinute);
      expect(config.logLevel).toBe(DEFAULT_CONFIG.logLevel);
    });

    it("loads config from .springfieldrc.json file", () => {
      const configFile = path.join(testDir, ".springfieldrc.json");
      fs.writeFileSync(
        configFile,
        JSON.stringify({ tokenTtlMs: 60000, logLevel: "debug" })
      );

      clearConfigCache();
      const config = getConfig(testDir);
      expect(config.tokenTtlMs).toBe(60000);
      expect(config.logLevel).toBe("debug");
      // Other values should be defaults
      expect(config.maxTokensPerMinute).toBe(DEFAULT_CONFIG.maxTokensPerMinute);
    });

    it("environment variables take precedence over file", () => {
      const configFile = path.join(testDir, ".springfieldrc.json");
      fs.writeFileSync(
        configFile,
        JSON.stringify({ tokenTtlMs: 60000 })
      );

      // Set env var
      const originalEnv = process.env.SPRINGFIELD_TOKEN_TTL_MS;
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "120000";

      clearConfigCache();
      const config = getConfig(testDir);
      expect(config.tokenTtlMs).toBe(120000); // Env wins

      // Restore
      if (originalEnv !== undefined) {
        process.env.SPRINGFIELD_TOKEN_TTL_MS = originalEnv;
      } else {
        delete process.env.SPRINGFIELD_TOKEN_TTL_MS;
      }
    });

    it("caches config correctly", () => {
      const config1 = getCachedConfig(testDir);
      const config2 = getCachedConfig(testDir);
      expect(config1).toBe(config2); // Same reference
    });

    it("clears cache correctly", () => {
      const config1 = getCachedConfig(testDir);
      clearConfigCache();
      const config2 = getCachedConfig(testDir);
      expect(config1).not.toBe(config2); // Different reference
    });

    it("validates config correctly", () => {
      const valid = validateConfig({ tokenTtlMs: 5000, maxTokensPerMinute: 5 });
      expect(valid).toHaveLength(0);

      const invalid = validateConfig({ tokenTtlMs: 100, maxTokensPerMinute: 0 });
      expect(invalid).toHaveLength(2);
      expect(invalid[0]).toContain("tokenTtlMs");
      expect(invalid[1]).toContain("maxTokensPerMinute");
    });
  });
});
