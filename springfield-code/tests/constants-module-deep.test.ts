/**
 * Constants Module Deep Tests (Batch 78)
 *
 * Deep testing of the constants module exports,
 * including character definitions, paths, and configuration values.
 */

import { describe, it, expect } from "vitest";
import {
  ALL_CHARACTERS,
  CHARACTER_TIERS,
  CHARACTER_ARTIFACTS,
  SPRINGFIELD_DIR,
  REQUIRED_FILES,
  DEFAULT_COMPLETION_PROMISE,
  DEFAULT_MAX_ITERATIONS,
  validateRequiredFiles,
} from "../src/constants.js";
import { DEFAULT_CONFIG } from "../src/config.js";
import { TEMPLATE_PLACEHOLDERS } from "../src/index.js";

describe("SPRINGFIELD_DIR Constant", () => {
  it("is defined", () => {
    expect(SPRINGFIELD_DIR).toBeDefined();
  });

  it("is a string", () => {
    expect(typeof SPRINGFIELD_DIR).toBe("string");
  });

  it("is .springfield", () => {
    expect(SPRINGFIELD_DIR).toBe(".springfield");
  });

  it("is not empty", () => {
    expect(SPRINGFIELD_DIR.length).toBeGreaterThan(0);
  });
});

describe("REQUIRED_FILES Constant", () => {
  it("is defined", () => {
    expect(REQUIRED_FILES).toBeDefined();
  });

  it("is an array", () => {
    expect(Array.isArray(REQUIRED_FILES)).toBe(true);
  });

  it("has exactly 4 required files", () => {
    expect(REQUIRED_FILES.length).toBe(4);
  });

  it("contains project.md", () => {
    expect(REQUIRED_FILES).toContain("project.md");
  });

  it("contains task.md", () => {
    expect(REQUIRED_FILES).toContain("task.md");
  });

  it("contains completion.md", () => {
    expect(REQUIRED_FILES).toContain("completion.md");
  });

  it("contains iterations.md", () => {
    expect(REQUIRED_FILES).toContain("iterations.md");
  });

  it("all files end with .md", () => {
    for (const file of REQUIRED_FILES) {
      expect(file.endsWith(".md")).toBe(true);
    }
  });
});

describe("DEFAULT_COMPLETION_PROMISE Constant", () => {
  it("is defined", () => {
    expect(DEFAULT_COMPLETION_PROMISE).toBeDefined();
  });

  it("is DONE", () => {
    expect(DEFAULT_COMPLETION_PROMISE).toBe("DONE");
  });
});

describe("DEFAULT_MAX_ITERATIONS Constant", () => {
  it("is defined", () => {
    expect(DEFAULT_MAX_ITERATIONS).toBeDefined();
  });

  it("is 20", () => {
    expect(DEFAULT_MAX_ITERATIONS).toBe(20);
  });

  it("is a positive number", () => {
    expect(DEFAULT_MAX_ITERATIONS).toBeGreaterThan(0);
  });
});

describe("TEMPLATE_PLACEHOLDERS Constant", () => {
  it("is defined", () => {
    expect(TEMPLATE_PLACEHOLDERS).toBeDefined();
  });

  it("is an array", () => {
    expect(Array.isArray(TEMPLATE_PLACEHOLDERS)).toBe(true);
  });

  it("contains placeholder patterns", () => {
    expect(TEMPLATE_PLACEHOLDERS.length).toBeGreaterThan(0);
  });

  it("placeholders are strings", () => {
    for (const placeholder of TEMPLATE_PLACEHOLDERS) {
      expect(typeof placeholder).toBe("string");
    }
  });
});

describe("CHARACTER_TIERS Structure", () => {
  it("is defined", () => {
    expect(CHARACTER_TIERS).toBeDefined();
  });

  it("is an object", () => {
    expect(typeof CHARACTER_TIERS).toBe("object");
  });

  it("has simpson_family tier", () => {
    expect(CHARACTER_TIERS.simpson_family).toBeDefined();
    expect(Array.isArray(CHARACTER_TIERS.simpson_family)).toBe(true);
  });

  it("has extended tier", () => {
    expect(CHARACTER_TIERS.extended).toBeDefined();
    expect(Array.isArray(CHARACTER_TIERS.extended)).toBe(true);
  });

  it("has springfield tier", () => {
    expect(CHARACTER_TIERS.springfield).toBeDefined();
    expect(Array.isArray(CHARACTER_TIERS.springfield)).toBe(true);
  });

  it("has specialists tier", () => {
    expect(CHARACTER_TIERS.specialists).toBeDefined();
    expect(Array.isArray(CHARACTER_TIERS.specialists)).toBe(true);
  });

  it("has exactly 4 tiers", () => {
    expect(Object.keys(CHARACTER_TIERS).length).toBe(4);
  });
});

describe("CHARACTER_ARTIFACTS Mappings", () => {
  it("is defined", () => {
    expect(CHARACTER_ARTIFACTS).toBeDefined();
  });

  it("is an object", () => {
    expect(typeof CHARACTER_ARTIFACTS).toBe("object");
  });

  it("maps homer to questions.md", () => {
    expect(CHARACTER_ARTIFACTS.homer).toBe("questions.md");
  });

  it("maps marge to structure.md", () => {
    expect(CHARACTER_ARTIFACTS.marge).toBe("structure.md");
  });

  it("maps bart to edge-cases.md", () => {
    expect(CHARACTER_ARTIFACTS.bart).toBe("edge-cases.md");
  });

  it("maps lisa to project.md", () => {
    expect(CHARACTER_ARTIFACTS.lisa).toBe("project.md");
  });

  it("maps maggie to logging.md", () => {
    expect(CHARACTER_ARTIFACTS.maggie).toBe("logging.md");
  });

  it("maps grampa to history.md", () => {
    expect(CHARACTER_ARTIFACTS.grampa).toBe("history.md");
  });

  it("maps burns to budget.md", () => {
    expect(CHARACTER_ARTIFACTS.burns).toBe("budget.md");
  });

  it("maps smithers to schedule.md", () => {
    expect(CHARACTER_ARTIFACTS.smithers).toBe("schedule.md");
  });

  it("maps flanders to standards.md", () => {
    expect(CHARACTER_ARTIFACTS.flanders).toBe("standards.md");
  });

  it("maps moe to debug-notes.md", () => {
    expect(CHARACTER_ARTIFACTS.moe).toBe("debug-notes.md");
  });

  it("maps wiggum to security-review.md", () => {
    expect(CHARACTER_ARTIFACTS.wiggum).toBe("security-review.md");
  });

  it("maps krusty to demo.md", () => {
    expect(CHARACTER_ARTIFACTS.krusty).toBe("demo.md");
  });

  it("maps nelson to tests.md", () => {
    expect(CHARACTER_ARTIFACTS.nelson).toBe("tests.md");
  });

  it("all artifact values are strings", () => {
    for (const [key, value] of Object.entries(CHARACTER_ARTIFACTS)) {
      expect(typeof value).toBe("string");
    }
  });

  it("all artifact values end with .md", () => {
    for (const [key, value] of Object.entries(CHARACTER_ARTIFACTS)) {
      expect(value.endsWith(".md")).toBe(true);
    }
  });
});

describe("DEFAULT_CONFIG Structure", () => {
  it("is defined", () => {
    expect(DEFAULT_CONFIG).toBeDefined();
  });

  it("is an object", () => {
    expect(typeof DEFAULT_CONFIG).toBe("object");
  });

  it("has tokenTtlMs", () => {
    expect(DEFAULT_CONFIG.tokenTtlMs).toBeDefined();
    expect(typeof DEFAULT_CONFIG.tokenTtlMs).toBe("number");
  });

  it("has tokenMaxUses", () => {
    expect(DEFAULT_CONFIG.tokenMaxUses).toBeDefined();
    expect(typeof DEFAULT_CONFIG.tokenMaxUses).toBe("number");
  });

  it("has maxTokensPerMinute", () => {
    expect(DEFAULT_CONFIG.maxTokensPerMinute).toBeDefined();
    expect(typeof DEFAULT_CONFIG.maxTokensPerMinute).toBe("number");
  });

  it("has rateLimitWindowMs", () => {
    expect(DEFAULT_CONFIG.rateLimitWindowMs).toBeDefined();
    expect(typeof DEFAULT_CONFIG.rateLimitWindowMs).toBe("number");
  });

  it("has minContentLength", () => {
    expect(DEFAULT_CONFIG.minContentLength).toBeDefined();
    expect(typeof DEFAULT_CONFIG.minContentLength).toBe("number");
  });

  it("has defaultMaxIterations", () => {
    expect(DEFAULT_CONFIG.defaultMaxIterations).toBeDefined();
    expect(typeof DEFAULT_CONFIG.defaultMaxIterations).toBe("number");
  });

  it("has defaultCompletionPromise", () => {
    expect(DEFAULT_CONFIG.defaultCompletionPromise).toBeDefined();
    expect(typeof DEFAULT_CONFIG.defaultCompletionPromise).toBe("string");
  });

  it("has logLevel", () => {
    expect(DEFAULT_CONFIG.logLevel).toBeDefined();
    expect(typeof DEFAULT_CONFIG.logLevel).toBe("string");
  });

  it("tokenTtlMs is 30000", () => {
    expect(DEFAULT_CONFIG.tokenTtlMs).toBe(30000);
  });

  it("tokenMaxUses is 1", () => {
    expect(DEFAULT_CONFIG.tokenMaxUses).toBe(1);
  });

  it("defaultMaxIterations is 20", () => {
    expect(DEFAULT_CONFIG.defaultMaxIterations).toBe(20);
  });

  it("minContentLength is 200", () => {
    expect(DEFAULT_CONFIG.minContentLength).toBe(200);
  });

  it("logLevel is warn", () => {
    expect(DEFAULT_CONFIG.logLevel).toBe("warn");
  });
});

describe("ALL_CHARACTERS Count Validation", () => {
  it("has exactly 41 characters", () => {
    expect(ALL_CHARACTERS.length).toBe(41);
  });

  it("equals sum of all tiers", () => {
    const tierSum =
      CHARACTER_TIERS.simpson_family.length +
      CHARACTER_TIERS.extended.length +
      CHARACTER_TIERS.springfield.length +
      CHARACTER_TIERS.specialists.length;
    expect(ALL_CHARACTERS.length).toBe(tierSum);
  });

  it("has no duplicates", () => {
    const unique = new Set(ALL_CHARACTERS);
    expect(unique.size).toBe(ALL_CHARACTERS.length);
  });
});

describe("validateRequiredFiles Function", () => {
  it("is defined", () => {
    expect(validateRequiredFiles).toBeDefined();
  });

  it("is a function", () => {
    expect(typeof validateRequiredFiles).toBe("function");
  });

  it("returns an object", () => {
    const result = validateRequiredFiles("/tmp");
    expect(typeof result).toBe("object");
  });

  it("result has isValid property", () => {
    const result = validateRequiredFiles("/tmp");
    expect(result).toHaveProperty("isValid");
  });

  it("result has missing property", () => {
    const result = validateRequiredFiles("/tmp");
    expect(result).toHaveProperty("missing");
  });

  it("result has present property", () => {
    const result = validateRequiredFiles("/tmp");
    expect(result).toHaveProperty("present");
  });

  it("result has incomplete property", () => {
    const result = validateRequiredFiles("/tmp");
    expect(result).toHaveProperty("incomplete");
  });

  it("result has errors property", () => {
    const result = validateRequiredFiles("/tmp");
    expect(result).toHaveProperty("errors");
  });
});

describe("Character Name Consistency", () => {
  it("all simpson family names are lowercase", () => {
    for (const name of CHARACTER_TIERS.simpson_family) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("all extended family names are lowercase", () => {
    for (const name of CHARACTER_TIERS.extended) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("all springfield names are lowercase", () => {
    for (const name of CHARACTER_TIERS.springfield) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("all specialist names are lowercase", () => {
    for (const name of CHARACTER_TIERS.specialists) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("hyphenated names use single hyphens", () => {
    for (const name of ALL_CHARACTERS) {
      expect(name).not.toMatch(/--/);
    }
  });

  it("no names start or end with hyphens", () => {
    for (const name of ALL_CHARACTERS) {
      expect(name).not.toMatch(/^-|-$/);
    }
  });
});

describe("Required Files Validation Edge Cases", () => {
  it("handles non-existent path gracefully", () => {
    const result = validateRequiredFiles("/nonexistent/path");
    expect(result.isValid).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  it("missing array contains all required files for non-existent dir", () => {
    const result = validateRequiredFiles("/tmp/nonexistent");
    expect(result.missing.length).toBe(REQUIRED_FILES.length);
  });

  it("errors array contains error message for non-existent path", () => {
    const result = validateRequiredFiles("/nonexistent/path");
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
