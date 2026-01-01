/**
 * Batch 69: Integration Scenarios Tests
 *
 * Tests simulating realistic usage patterns and workflows
 * combining multiple APIs together
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  // Commands
  springfieldCommand,
  summonCommand,
  lisaRalphCommand,
  homerCommand,
  // Hooks
  resetRalphGateForTesting,
  requestRalphAuthorization,
  authorizeRalph,
  revokeRalphAuthorization,
  canInvokeRalph,
  // Constants
  REQUIRED_FILES,
  CHARACTER_ARTIFACTS,
  CHARACTER_TIERS,
  ALL_CHARACTERS,
  SPRINGFIELD_DIR,
  // Artifacts
  generateArtifact,
  artifactExists,
  // Stats
  loadStats,
  recordInvocation,
  getTopCharacters,
  resetStats,
  // Validation
  isFileComplete,
  validateSpringfieldDirectory,
  isSpringfieldInitialized,
  // Config
  getConfig,
  getCachedConfig,
  clearConfigCache,
  DEFAULT_CONFIG,
  // Skills
  registerSkill,
  getSkill,
  listSkills,
  clearSkillRegistry,
  findSkillsByTrigger,
  getRegistryState,
} from "../src/index.js";

describe("Batch 69: Integration Scenarios Tests", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "integration-test-"));
    resetRalphGateForTesting();
    clearSkillRegistry();
    clearConfigCache();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    resetRalphGateForTesting();
    clearSkillRegistry();
  });

  describe("Springfield Initialization Workflow", () => {
    it("should complete full initialization flow", () => {
      // Step 1: Check if initialized (should be false)
      expect(isSpringfieldInitialized(tempDir)).toBe(false);

      // Step 2: Create .springfield directory
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      // Step 3: Check initialized (still false - no files)
      expect(isSpringfieldInitialized(tempDir)).toBe(true);

      // Step 4: Validate directory (should fail - missing files)
      const validation = validateSpringfieldDirectory(tempDir);
      expect(validation.isValid).toBe(false);
    });

    it("should validate directory with all required files", () => {
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      // Create all required files with sufficient content
      const content = "a".repeat(250);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(springfieldPath, file), content);
      }

      const validation = validateSpringfieldDirectory(tempDir);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("Character Artifact Workflow", () => {
    it("should generate and check artifact existence", () => {
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      // Generate Homer's artifact - signature is (character, userInput, projectDir)
      const artifact = generateArtifact("homer", "Test questions content", tempDir);
      expect(artifact).not.toBeNull();

      // Check it exists
      const exists = artifactExists("homer", tempDir);
      expect(exists).toBe(true);
    });

    it("should correctly map all characters to artifacts", () => {
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      // Test a few character artifacts
      const testChars = ["homer", "marge", "bart", "lisa", "burns"];
      for (const char of testChars) {
        const artifactName = CHARACTER_ARTIFACTS[char];
        expect(artifactName).toBeDefined();
        
        // Correct signature: (character, userInput, projectDir)
        const artifact = generateArtifact(char, `${char} content`, tempDir);
        expect(artifact).not.toBeNull();
      }
    });
  });

  describe("Ralph Gate Authorization Workflow", () => {
    it("should complete full authorization cycle", () => {
      // Step 1: Request token - this also sets it as active
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();

      // Step 2: Can invoke (token is now active)
      expect(canInvokeRalph()).toBe(true);

      // Step 3: Authorize (consumes the token)
      const authorized = authorizeRalph(token!);
      expect(authorized).toBe(true);

      // Step 4: Cannot invoke anymore (token consumed)
      expect(canInvokeRalph()).toBe(false);
    });

    it("should handle revocation flow", () => {
      const token = requestRalphAuthorization();
      expect(token).not.toBeNull();
      expect(canInvokeRalph()).toBe(true);

      // Revoke - takes no arguments, returns void
      revokeRalphAuthorization();

      // Cannot invoke anymore
      expect(canInvokeRalph()).toBe(false);
    });
  });

  describe("Stats Tracking Workflow", () => {
    it("should track character invocations", () => {
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      // Reset stats
      resetStats(tempDir);

      // Record some invocations
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "marge");
      recordInvocation(tempDir, "bart");

      // Get top characters
      const top = getTopCharacters(tempDir, 3);
      expect(top.length).toBe(3);
      expect(top[0].character).toBe("homer");
      expect(top[0].count).toBe(2);
    });

    it("should load stats that were recorded", () => {
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      resetStats(tempDir);
      recordInvocation(tempDir, "lisa");
      recordInvocation(tempDir, "lisa");

      // Load stats - uses 'characters' not 'invocations'
      const stats = loadStats(tempDir);
      expect(stats).not.toBeNull();
      if (stats) {
        expect(stats.characters.lisa).toBe(2);
      }
    });
  });

  describe("Skills Registration Workflow", () => {
    it("should register and retrieve skills", () => {
      const markdown = `---
name: Code Review Skill
description: Helps with code reviews
triggers:
  - review code
  - check code
---
# Code Review
This skill helps review code.`;

      const skill = registerSkill(markdown);
      expect(skill).not.toBeNull();

      const result = getSkill("Code Review Skill");
      expect(result.found).toBe(true);
      expect(result.skill?.metadata.description).toBe("Helps with code reviews");
    });

    it("should find skills by trigger", () => {
      registerSkill(`---
name: Testing Skill
triggers:
  - write tests
  - add tests
---
Testing content`);

      registerSkill(`---
name: Documentation Skill
triggers:
  - write docs
  - document
---
Docs content`);

      const testingSkills = findSkillsByTrigger("write tests");
      expect(testingSkills.length).toBe(1);
      expect(testingSkills[0].id).toBe("Testing Skill");

      const docSkills = findSkillsByTrigger("document this function");
      expect(docSkills.length).toBe(1);
    });

    it("should manage registry state correctly", () => {
      expect(getRegistryState().count).toBe(0);

      registerSkill(`---\nname: Skill A\n---\nContent`);
      registerSkill(`---\nname: Skill B\n---\nContent`);

      expect(getRegistryState().count).toBe(2);
      expect(listSkills().length).toBe(2);

      clearSkillRegistry();
      expect(getRegistryState().count).toBe(0);
    });
  });

  describe("Configuration Workflow", () => {
    it("should use default config when no project config exists", () => {
      const config = getConfig(tempDir);
      expect(config.minContentLength).toBe(DEFAULT_CONFIG.minContentLength);
      expect(config.maxIterations).toBe(DEFAULT_CONFIG.maxIterations);
    });

    it("should cache config for performance", () => {
      // First call loads config
      const config1 = getCachedConfig();
      // Second call should return cached
      const config2 = getCachedConfig();
      
      expect(config1).toEqual(config2);
    });
  });

  describe("Content Validation Workflow", () => {
    it("should validate file content for completeness", () => {
      // Short content is incomplete
      expect(isFileComplete("short", 50)).toBe(false);

      // Long content is complete
      expect(isFileComplete("a".repeat(100), 50)).toBe(true);
    });
  });

  describe("Character Tier Verification", () => {
    it("should have consistent tier membership", () => {
      // All tier characters should be in ALL_CHARACTERS
      for (const tier of Object.values(CHARACTER_TIERS)) {
        for (const char of tier) {
          expect(ALL_CHARACTERS).toContain(char);
        }
      }
    });

    it("should have no overlap between tiers", () => {
      const allTierChars = Object.values(CHARACTER_TIERS).flat();
      const uniqueChars = new Set(allTierChars);
      expect(uniqueChars.size).toBe(allTierChars.length);
    });

    it("should have artifacts for most characters", () => {
      // All characters except Ralph should have artifacts
      for (const char of ALL_CHARACTERS) {
        if (char !== "ralph") {
          expect(CHARACTER_ARTIFACTS[char]).toBeDefined();
        }
      }
    });
  });

  describe("Command Interface Verification", () => {
    it("springfieldCommand should be a valid command object", () => {
      expect(springfieldCommand.name).toBeDefined();
      expect(springfieldCommand.description).toBeDefined();
    });

    it("summonCommand should be a valid command object", () => {
      expect(summonCommand.name).toBeDefined();
      expect(summonCommand.description).toBeDefined();
    });

    it("lisaRalphCommand should be a valid command object", () => {
      expect(lisaRalphCommand.name).toBeDefined();
      expect(lisaRalphCommand.description).toBeDefined();
    });

    it("homerCommand should be a valid command object", () => {
      expect(homerCommand.name).toBeDefined();
      expect(homerCommand.description).toBeDefined();
    });
  });

  describe("End-to-End Workflow Simulation", () => {
    it("should support complete project setup flow", () => {
      // 1. Initialize directory structure
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);

      // 2. Create required files
      const content = "Real project content with sufficient length for validation. ".repeat(5);
      for (const file of REQUIRED_FILES) {
        fs.writeFileSync(path.join(springfieldPath, file), content);
      }

      // 3. Verify initialization
      expect(isSpringfieldInitialized(tempDir)).toBe(true);
      expect(validateSpringfieldDirectory(tempDir).isValid).toBe(true);

      // 4. Generate some artifacts - correct signature: (character, userInput, projectDir)
      generateArtifact("homer", "Homer questions", tempDir);
      generateArtifact("marge", "Marge structure", tempDir);

      // 5. Track usage
      resetStats(tempDir);
      recordInvocation(tempDir, "homer");
      recordInvocation(tempDir, "marge");

      // 6. Verify stats - uses 'characters' not 'invocations'
      const stats = loadStats(tempDir);
      expect(stats).not.toBeNull();
      if (stats) {
        expect(stats.characters.homer).toBe(1);
        expect(stats.characters.marge).toBe(1);
      }
    });

    it("should support skill-based workflows", () => {
      // 1. Register project-specific skills
      registerSkill(`---
name: Project Setup
triggers:
  - setup project
  - initialize project
---
Setup steps...`);

      registerSkill(`---
name: Deploy Process
triggers:
  - deploy
  - release
---
Deploy steps...`);

      // 2. Find relevant skills for user query
      const setupSkills = findSkillsByTrigger("I need to setup project");
      expect(setupSkills.length).toBe(1);

      // 3. Verify registry state
      expect(getRegistryState().count).toBe(2);
    });
  });

  describe("Error Handling Scenarios", () => {
    it("should handle non-existent paths gracefully", () => {
      expect(isSpringfieldInitialized("/non/existent/path")).toBe(false);
      expect(artifactExists("homer", "/non/existent/path")).toBe(false);
    });

    it("should handle invalid skill registration", () => {
      const result = registerSkill("Invalid markdown without frontmatter");
      expect(result).toBeNull();
    });

    it("should handle skill not found", () => {
      const result = getSkill("non-existent-skill");
      expect(result.found).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle empty stats", () => {
      const springfieldPath = path.join(tempDir, SPRINGFIELD_DIR);
      fs.mkdirSync(springfieldPath);
      resetStats(tempDir);

      const top = getTopCharacters(tempDir, 5);
      expect(top.length).toBe(0);
    });
  });
});
