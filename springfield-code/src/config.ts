/**
 * Springfield Code Configuration System
 *
 * Supports both environment variables and .springfieldrc.json config file.
 * Environment variables take precedence over config file values.
 *
 * @module config
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("CONFIG");

/**
 * Configuration options for Springfield Code
 */
export interface SpringfieldConfig {
  // Ralph Gate settings
  /** Token time-to-live in milliseconds (default: 30000) */
  tokenTtlMs: number;
  /** Maximum uses per token (default: 1) */
  tokenMaxUses: number;
  /** Maximum tokens per minute for rate limiting (default: 10) */
  maxTokensPerMinute: number;
  /** Rate limit window in milliseconds (default: 60000) */
  rateLimitWindowMs: number;

  // Validation settings
  /** Minimum content length to consider a file complete (default: 200) */
  minContentLength: number;

  // Ralph Loop settings
  /** Maximum iterations for Ralph loop (default: 20) */
  defaultMaxIterations: number;
  /** Completion promise string (default: "DONE") */
  defaultCompletionPromise: string;

  // Logging
  /** Log level: debug, info, warn, error, silent (default: warn) */
  logLevel: "debug" | "info" | "warn" | "error" | "silent";
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Readonly<SpringfieldConfig> = {
  // Ralph Gate
  tokenTtlMs: 30_000,
  tokenMaxUses: 1,
  maxTokensPerMinute: 10,
  rateLimitWindowMs: 60_000,

  // Validation
  minContentLength: 200,

  // Ralph Loop
  defaultMaxIterations: 20,
  defaultCompletionPromise: "DONE",

  // Logging
  logLevel: "warn",
};

/**
 * Environment variable to config key mapping
 */
const ENV_VAR_MAP: Record<string, keyof SpringfieldConfig> = {
  SPRINGFIELD_TOKEN_TTL_MS: "tokenTtlMs",
  SPRINGFIELD_TOKEN_MAX_USES: "tokenMaxUses",
  SPRINGFIELD_RATE_LIMIT: "maxTokensPerMinute",
  SPRINGFIELD_RATE_WINDOW_MS: "rateLimitWindowMs",
  SPRINGFIELD_MIN_CONTENT_LENGTH: "minContentLength",
  SPRINGFIELD_MAX_ITERATIONS: "defaultMaxIterations",
  SPRINGFIELD_COMPLETION_PROMISE: "defaultCompletionPromise",
  SPRINGFIELD_LOG_LEVEL: "logLevel",
};

/**
 * Parse a value to the appropriate type based on the config key
 */
function parseValue(
  key: keyof SpringfieldConfig,
  value: string
): SpringfieldConfig[keyof SpringfieldConfig] {
  switch (key) {
    case "tokenTtlMs":
    case "tokenMaxUses":
    case "maxTokensPerMinute":
    case "rateLimitWindowMs":
    case "minContentLength":
    case "defaultMaxIterations": {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        logger.warn(`Invalid numeric value for ${key}`, {
          received: value,
          usingDefault: DEFAULT_CONFIG[key],
        });
        return DEFAULT_CONFIG[key];
      }
      return parsed;
    }
    case "logLevel":
      if (["debug", "info", "warn", "error", "silent"].includes(value)) {
        return value as SpringfieldConfig["logLevel"];
      }
      return DEFAULT_CONFIG.logLevel;
    case "defaultCompletionPromise":
    default:
      return value;
  }
}

/**
 * Load configuration from .springfieldrc.json file
 */
function loadConfigFile(cwd: string = process.cwd()): Partial<SpringfieldConfig> {
  const configPaths = [
    join(cwd, ".springfieldrc.json"),
    join(cwd, ".springfieldrc"),
    join(cwd, "springfield.config.json"),
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, "utf-8");
        return JSON.parse(content) as Partial<SpringfieldConfig>;
      } catch (error) {
        logger.error("Failed to parse config file", {
          configPath,
          error: error instanceof Error ? error.message : String(error),
        });
        continue;
      }
    }
  }

  return {};
}

/**
 * Load configuration from environment variables
 */
function loadEnvConfig(): Partial<SpringfieldConfig> {
  const config: Partial<SpringfieldConfig> = {};

  for (const [envVar, configKey] of Object.entries(ENV_VAR_MAP)) {
    const value = process.env[envVar];
    if (value !== undefined) {
      (config as Record<string, unknown>)[configKey] = parseValue(configKey, value);
    }
  }

  return config;
}

/**
 * Get the merged configuration.
 * Priority: Environment variables > Config file > Defaults
 *
 * @param cwd - Working directory to search for config file
 * @returns Complete configuration object
 */
export function getConfig(cwd: string = process.cwd()): SpringfieldConfig {
  const fileConfig = loadConfigFile(cwd);
  const envConfig = loadEnvConfig();

  const config = {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    ...envConfig,
  };

  // Validate configuration (advisory, not blocking)
  const validationErrors = validateConfig(config);
  if (validationErrors.length > 0) {
    logger.warn("Configuration validation issues", {
      errors: validationErrors,
    });
  }

  return config;
}

/**
 * Cached configuration instance
 */
let cachedConfig: SpringfieldConfig | null = null;

/**
 * Get or create cached configuration.
 * Use this for performance when config doesn't need to be reloaded.
 *
 * @param cwd - Working directory to search for config file
 * @returns Cached configuration object
 */
export function getCachedConfig(cwd?: string): SpringfieldConfig {
  if (!cachedConfig) {
    cachedConfig = getConfig(cwd);
  }
  return cachedConfig;
}

/**
 * Clear the configuration cache.
 * Useful for testing or when config files change.
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}

/**
 * Validate a configuration object
 *
 * @param config - Partial configuration to validate
 * @returns Array of validation error messages
 */
export function validateConfig(config: Partial<SpringfieldConfig>): string[] {
  const errors: string[] = [];

  if (config.tokenTtlMs !== undefined && config.tokenTtlMs < 1000) {
    errors.push("tokenTtlMs must be at least 1000ms (1 second)");
  }

  if (config.tokenMaxUses !== undefined && config.tokenMaxUses < 1) {
    errors.push("tokenMaxUses must be at least 1");
  }

  if (config.maxTokensPerMinute !== undefined && config.maxTokensPerMinute < 1) {
    errors.push("maxTokensPerMinute must be at least 1");
  }

  if (config.rateLimitWindowMs !== undefined && config.rateLimitWindowMs < 1000) {
    errors.push("rateLimitWindowMs must be at least 1000ms (1 second)");
  }

  if (config.minContentLength !== undefined && config.minContentLength < 0) {
    errors.push("minContentLength cannot be negative");
  }

  if (config.defaultMaxIterations !== undefined && config.defaultMaxIterations < 1) {
    errors.push("defaultMaxIterations must be at least 1");
  }

  return errors;
}
