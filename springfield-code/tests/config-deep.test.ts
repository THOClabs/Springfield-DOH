/**
 * Config Deep Tests (Batch 72)
 *
 * Deep testing of configuration system including
 * defaults, file loading, environment variables, caching, and validation.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  getConfig,
  getCachedConfig,
  clearConfigCache,
  validateConfig,
  DEFAULT_CONFIG,
  type SpringfieldConfig,
} from "../src/index.js";

describe("DEFAULT_CONFIG Constants", () => {
  describe("Ralph Gate defaults", () => {
    it("tokenTtlMs defaults to 30000", () => {
      expect(DEFAULT_CONFIG.tokenTtlMs).toBe(30_000);
    });

    it("tokenMaxUses defaults to 1", () => {
      expect(DEFAULT_CONFIG.tokenMaxUses).toBe(1);
    });

    it("maxTokensPerMinute defaults to 10", () => {
      expect(DEFAULT_CONFIG.maxTokensPerMinute).toBe(10);
    });

    it("rateLimitWindowMs defaults to 60000", () => {
      expect(DEFAULT_CONFIG.rateLimitWindowMs).toBe(60_000);
    });
  });

  describe("Validation defaults", () => {
    it("minContentLength defaults to 200", () => {
      expect(DEFAULT_CONFIG.minContentLength).toBe(200);
    });
  });

  describe("Ralph Loop defaults", () => {
    it("defaultMaxIterations defaults to 20", () => {
      expect(DEFAULT_CONFIG.defaultMaxIterations).toBe(20);
    });

    it("defaultCompletionPromise defaults to DONE", () => {
      expect(DEFAULT_CONFIG.defaultCompletionPromise).toBe("DONE");
    });
  });

  describe("Logging defaults", () => {
    it("logLevel defaults to warn", () => {
      expect(DEFAULT_CONFIG.logLevel).toBe("warn");
    });
  });

  describe("DEFAULT_CONFIG structure", () => {
    it("is typed as Readonly", () => {
      // TypeScript enforces Readonly<T> at compile time
      // At runtime, the object is still mutable but should not be modified
      expect(typeof DEFAULT_CONFIG).toBe("object");
      expect(DEFAULT_CONFIG).not.toBeNull();
    });

    it("has all required properties", () => {
      expect(DEFAULT_CONFIG).toHaveProperty("tokenTtlMs");
      expect(DEFAULT_CONFIG).toHaveProperty("tokenMaxUses");
      expect(DEFAULT_CONFIG).toHaveProperty("maxTokensPerMinute");
      expect(DEFAULT_CONFIG).toHaveProperty("rateLimitWindowMs");
      expect(DEFAULT_CONFIG).toHaveProperty("minContentLength");
      expect(DEFAULT_CONFIG).toHaveProperty("defaultMaxIterations");
      expect(DEFAULT_CONFIG).toHaveProperty("defaultCompletionPromise");
      expect(DEFAULT_CONFIG).toHaveProperty("logLevel");
    });
  });
});

describe("getConfig Function", () => {
  let tempDir: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "config-get-"));
    originalEnv = { ...process.env };
    clearConfigCache();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    process.env = originalEnv;
    clearConfigCache();
  });

  describe("when no config file exists", () => {
    it("returns default config values", () => {
      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
      expect(config.minContentLength).toBe(DEFAULT_CONFIG.minContentLength);
    });

    it("returns complete config object", () => {
      const config = getConfig(tempDir);
      expect(Object.keys(config).length).toBe(Object.keys(DEFAULT_CONFIG).length);
    });
  });

  describe("when .springfieldrc.json exists", () => {
    it("loads values from config file", () => {
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(configPath, JSON.stringify({ tokenTtlMs: 60000 }));

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(60000);
    });

    it("merges with defaults for missing values", () => {
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(configPath, JSON.stringify({ tokenTtlMs: 60000 }));

      const config = getConfig(tempDir);
      expect(config.minContentLength).toBe(DEFAULT_CONFIG.minContentLength);
    });

    it("handles multiple config properties", () => {
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(configPath, JSON.stringify({
        tokenTtlMs: 45000,
        tokenMaxUses: 5,
        logLevel: "debug",
      }));

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(45000);
      expect(config.tokenMaxUses).toBe(5);
      expect(config.logLevel).toBe("debug");
    });
  });

  describe("when .springfieldrc exists (without .json)", () => {
    it("loads values from config file", () => {
      const configPath = path.join(tempDir, ".springfieldrc");
      fs.writeFileSync(configPath, JSON.stringify({ minContentLength: 500 }));

      const config = getConfig(tempDir);
      expect(config.minContentLength).toBe(500);
    });
  });

  describe("when springfield.config.json exists", () => {
    it("loads values from config file", () => {
      const configPath = path.join(tempDir, "springfield.config.json");
      fs.writeFileSync(configPath, JSON.stringify({ defaultMaxIterations: 50 }));

      const config = getConfig(tempDir);
      expect(config.defaultMaxIterations).toBe(50);
    });
  });

  describe("config file priority", () => {
    it("prefers .springfieldrc.json over .springfieldrc", () => {
      fs.writeFileSync(
        path.join(tempDir, ".springfieldrc.json"),
        JSON.stringify({ tokenTtlMs: 10000 })
      );
      fs.writeFileSync(
        path.join(tempDir, ".springfieldrc"),
        JSON.stringify({ tokenTtlMs: 20000 })
      );

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(10000);
    });
  });

  describe("handles invalid config files", () => {
    it("falls back to defaults for invalid JSON", () => {
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(configPath, "{ invalid json }}}");

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
    });
  });

  describe("environment variable overrides", () => {
    it("SPRINGFIELD_TOKEN_TTL_MS overrides config", () => {
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "90000";
      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(90000);
    });

    it("SPRINGFIELD_TOKEN_MAX_USES overrides config", () => {
      process.env.SPRINGFIELD_TOKEN_MAX_USES = "10";
      const config = getConfig(tempDir);
      expect(config.tokenMaxUses).toBe(10);
    });

    it("SPRINGFIELD_RATE_LIMIT overrides config", () => {
      process.env.SPRINGFIELD_RATE_LIMIT = "25";
      const config = getConfig(tempDir);
      expect(config.maxTokensPerMinute).toBe(25);
    });

    it("SPRINGFIELD_MIN_CONTENT_LENGTH overrides config", () => {
      process.env.SPRINGFIELD_MIN_CONTENT_LENGTH = "100";
      const config = getConfig(tempDir);
      expect(config.minContentLength).toBe(100);
    });

    it("SPRINGFIELD_MAX_ITERATIONS overrides config", () => {
      process.env.SPRINGFIELD_MAX_ITERATIONS = "50";
      const config = getConfig(tempDir);
      expect(config.defaultMaxIterations).toBe(50);
    });

    it("SPRINGFIELD_COMPLETION_PROMISE overrides config", () => {
      process.env.SPRINGFIELD_COMPLETION_PROMISE = "FINISHED";
      const config = getConfig(tempDir);
      expect(config.defaultCompletionPromise).toBe("FINISHED");
    });

    it("SPRINGFIELD_LOG_LEVEL overrides config", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "debug";
      const config = getConfig(tempDir);
      expect(config.logLevel).toBe("debug");
    });

    it("env vars take precedence over config file", () => {
      const configPath = path.join(tempDir, ".springfieldrc.json");
      fs.writeFileSync(configPath, JSON.stringify({ tokenTtlMs: 10000 }));
      process.env.SPRINGFIELD_TOKEN_TTL_MS = "99000";

      const config = getConfig(tempDir);
      expect(config.tokenTtlMs).toBe(99000);
    });
  });
});

describe("getCachedConfig Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "config-cache-"));
    clearConfigCache();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    clearConfigCache();
  });

  it("returns same object on multiple calls", () => {
    const config1 = getCachedConfig(tempDir);
    const config2 = getCachedConfig(tempDir);
    expect(config1).toBe(config2);
  });

  it("caches the config after first load", () => {
    // First call creates cache
    const config1 = getCachedConfig(tempDir);
    
    // Create config file after cache
    fs.writeFileSync(
      path.join(tempDir, ".springfieldrc.json"),
      JSON.stringify({ tokenTtlMs: 99999 })
    );
    
    // Second call should return cached value
    const config2 = getCachedConfig(tempDir);
    expect(config2.tokenTtlMs).toBe(config1.tokenTtlMs);
    expect(config2.tokenTtlMs).not.toBe(99999);
  });

  it("uses provided cwd on first call", () => {
    fs.writeFileSync(
      path.join(tempDir, ".springfieldrc.json"),
      JSON.stringify({ minContentLength: 777 })
    );

    const config = getCachedConfig(tempDir);
    expect(config.minContentLength).toBe(777);
  });
});

describe("clearConfigCache Function", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "config-clear-"));
    clearConfigCache();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    clearConfigCache();
  });

  it("resets the cache", () => {
    // Create initial cache
    const config1 = getCachedConfig(tempDir);
    
    // Create config file
    fs.writeFileSync(
      path.join(tempDir, ".springfieldrc.json"),
      JSON.stringify({ tokenTtlMs: 88888 })
    );
    
    // Clear cache and reload
    clearConfigCache();
    const config2 = getCachedConfig(tempDir);
    
    expect(config2.tokenTtlMs).toBe(88888);
    expect(config1).not.toBe(config2);
  });

  it("can be called multiple times safely", () => {
    clearConfigCache();
    clearConfigCache();
    clearConfigCache();
    
    const config = getCachedConfig();
    expect(config).toBeDefined();
  });
});

describe("validateConfig Function", () => {
  describe("tokenTtlMs validation", () => {
    it("returns error when less than 1000", () => {
      const errors = validateConfig({ tokenTtlMs: 500 });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("tokenTtlMs");
      expect(errors[0]).toContain("1000");
    });

    it("returns no error when exactly 1000", () => {
      const errors = validateConfig({ tokenTtlMs: 1000 });
      expect(errors).toHaveLength(0);
    });

    it("returns no error when above 1000", () => {
      const errors = validateConfig({ tokenTtlMs: 30000 });
      expect(errors).toHaveLength(0);
    });
  });

  describe("tokenMaxUses validation", () => {
    it("returns error when less than 1", () => {
      const errors = validateConfig({ tokenMaxUses: 0 });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("tokenMaxUses");
    });

    it("returns no error when exactly 1", () => {
      const errors = validateConfig({ tokenMaxUses: 1 });
      expect(errors).toHaveLength(0);
    });
  });

  describe("maxTokensPerMinute validation", () => {
    it("returns error when less than 1", () => {
      const errors = validateConfig({ maxTokensPerMinute: 0 });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("maxTokensPerMinute");
    });

    it("returns no error when exactly 1", () => {
      const errors = validateConfig({ maxTokensPerMinute: 1 });
      expect(errors).toHaveLength(0);
    });
  });

  describe("rateLimitWindowMs validation", () => {
    it("returns error when less than 1000", () => {
      const errors = validateConfig({ rateLimitWindowMs: 999 });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("rateLimitWindowMs");
    });

    it("returns no error when exactly 1000", () => {
      const errors = validateConfig({ rateLimitWindowMs: 1000 });
      expect(errors).toHaveLength(0);
    });
  });

  describe("minContentLength validation", () => {
    it("returns error when negative", () => {
      const errors = validateConfig({ minContentLength: -1 });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("minContentLength");
    });

    it("returns no error when 0", () => {
      const errors = validateConfig({ minContentLength: 0 });
      expect(errors).toHaveLength(0);
    });

    it("returns no error when positive", () => {
      const errors = validateConfig({ minContentLength: 200 });
      expect(errors).toHaveLength(0);
    });
  });

  describe("defaultMaxIterations validation", () => {
    it("returns error when less than 1", () => {
      const errors = validateConfig({ defaultMaxIterations: 0 });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("defaultMaxIterations");
    });

    it("returns no error when exactly 1", () => {
      const errors = validateConfig({ defaultMaxIterations: 1 });
      expect(errors).toHaveLength(0);
    });
  });

  describe("multiple validation errors", () => {
    it("returns all errors when multiple invalid values", () => {
      const errors = validateConfig({
        tokenTtlMs: 100,
        tokenMaxUses: 0,
        minContentLength: -5,
      });
      expect(errors.length).toBe(3);
    });
  });

  describe("empty config validation", () => {
    it("returns no errors for empty config", () => {
      const errors = validateConfig({});
      expect(errors).toHaveLength(0);
    });
  });

  describe("valid complete config", () => {
    it("returns no errors for valid complete config", () => {
      const errors = validateConfig({
        tokenTtlMs: 30000,
        tokenMaxUses: 3,
        maxTokensPerMinute: 15,
        rateLimitWindowMs: 60000,
        minContentLength: 200,
        defaultMaxIterations: 25,
        defaultCompletionPromise: "COMPLETE",
        logLevel: "info",
      });
      expect(errors).toHaveLength(0);
    });
  });
});

describe("SpringfieldConfig Type", () => {
  it("can create a valid config object", () => {
    const config: SpringfieldConfig = {
      tokenTtlMs: 30000,
      tokenMaxUses: 1,
      maxTokensPerMinute: 10,
      rateLimitWindowMs: 60000,
      minContentLength: 200,
      defaultMaxIterations: 20,
      defaultCompletionPromise: "DONE",
      logLevel: "warn",
    };
    expect(config.tokenTtlMs).toBe(30000);
    expect(config.logLevel).toBe("warn");
  });

  it("logLevel accepts all valid values", () => {
    const levels: SpringfieldConfig["logLevel"][] = ["debug", "info", "warn", "error", "silent"];
    for (const level of levels) {
      const config: Partial<SpringfieldConfig> = { logLevel: level };
      expect(config.logLevel).toBe(level);
    }
  });
});
