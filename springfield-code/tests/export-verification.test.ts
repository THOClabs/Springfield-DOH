/**
 * Batch 68: Export Verification Tests
 *
 * Comprehensive verification of all public exports from the main index.ts
 * ensuring that the API surface is stable and properly documented.
 */

import { describe, it, expect } from "vitest";
import * as springfield from "../src/index.js";

describe("Batch 68: Export Verification Tests", () => {
  describe("Core Commands", () => {
    it("should export springfieldCommand", () => {
      expect(springfield.springfieldCommand).toBeDefined();
    });

    it("should export summonCommand", () => {
      expect(springfield.summonCommand).toBeDefined();
    });

    it("should export lisaRalphCommand", () => {
      expect(springfield.lisaRalphCommand).toBeDefined();
    });
  });

  describe("Simpson Family Commands", () => {
    it("should export homerCommand", () => {
      expect(springfield.homerCommand).toBeDefined();
    });

    it("should export margeCommand", () => {
      expect(springfield.margeCommand).toBeDefined();
    });

    it("should export bartCommand", () => {
      expect(springfield.bartCommand).toBeDefined();
    });

    it("should export lisaCommand", () => {
      expect(springfield.lisaCommand).toBeDefined();
    });

    it("should export maggieCommand", () => {
      expect(springfield.maggieCommand).toBeDefined();
    });
  });

  describe("Extended Family Commands", () => {
    it("should export grampaCommand", () => {
      expect(springfield.grampaCommand).toBeDefined();
    });

    it("should export burnsCommand", () => {
      expect(springfield.burnsCommand).toBeDefined();
    });

    it("should export smithersCommand", () => {
      expect(springfield.smithersCommand).toBeDefined();
    });

    it("should export flandersCommand", () => {
      expect(springfield.flandersCommand).toBeDefined();
    });
  });

  describe("Springfield Tier Commands", () => {
    it("should export milhouseCommand", () => {
      expect(springfield.milhouseCommand).toBeDefined();
    });

    it("should export moeCommand", () => {
      expect(springfield.moeCommand).toBeDefined();
    });

    it("should export wiggumCommand", () => {
      expect(springfield.wiggumCommand).toBeDefined();
    });

    it("should export ralphCommand", () => {
      expect(springfield.ralphCommand).toBeDefined();
    });

    it("should export krustyCommand", () => {
      expect(springfield.krustyCommand).toBeDefined();
    });

    it("should export bobCommand", () => {
      expect(springfield.bobCommand).toBeDefined();
    });

    it("should export skinnerCommand", () => {
      expect(springfield.skinnerCommand).toBeDefined();
    });

    it("should export nelsonCommand", () => {
      expect(springfield.nelsonCommand).toBeDefined();
    });

    it("should export apuCommand", () => {
      expect(springfield.apuCommand).toBeDefined();
    });

    it("should export frinkCommand", () => {
      expect(springfield.frinkCommand).toBeDefined();
    });

    it("should export cbgCommand", () => {
      expect(springfield.cbgCommand).toBeDefined();
    });

    it("should export willieCommand", () => {
      expect(springfield.willieCommand).toBeDefined();
    });
  });

  describe("Specialist Commands (v2.1.0)", () => {
    it("should export drNickCommand", () => {
      expect(springfield.drNickCommand).toBeDefined();
    });

    it("should export pattyCommand", () => {
      expect(springfield.pattyCommand).toBeDefined();
    });

    it("should export troyCommand", () => {
      expect(springfield.troyCommand).toBeDefined();
    });

    it("should export lionelCommand", () => {
      expect(springfield.lionelCommand).toBeDefined();
    });

    it("should export hansCommand", () => {
      expect(springfield.hansCommand).toBeDefined();
    });

    it("should export hibbertCommand", () => {
      expect(springfield.hibbertCommand).toBeDefined();
    });

    it("should export ednaCommand", () => {
      expect(springfield.ednaCommand).toBeDefined();
    });

    it("should export ottoCommand", () => {
      expect(springfield.ottoCommand).toBeDefined();
    });

    it("should export lennyCommand", () => {
      expect(springfield.lennyCommand).toBeDefined();
    });

    it("should export kentCommand", () => {
      expect(springfield.kentCommand).toBeDefined();
    });

    it("should export snakeCommand", () => {
      expect(springfield.snakeCommand).toBeDefined();
    });

    it("should export cookieCommand", () => {
      expect(springfield.cookieCommand).toBeDefined();
    });

    it("should export gilCommand", () => {
      expect(springfield.gilCommand).toBeDefined();
    });

    it("should export bumblebeeCommand", () => {
      expect(springfield.bumblebeeCommand).toBeDefined();
    });

    it("should export duffmanCommand", () => {
      expect(springfield.duffmanCommand).toBeDefined();
    });

    it("should export fatTonyCommand", () => {
      expect(springfield.fatTonyCommand).toBeDefined();
    });

    it("should export seaCaptainCommand", () => {
      expect(springfield.seaCaptainCommand).toBeDefined();
    });

    it("should export lovejoyCommand", () => {
      expect(springfield.lovejoyCommand).toBeDefined();
    });

    it("should export helenCommand", () => {
      expect(springfield.helenCommand).toBeDefined();
    });

    it("should export agnesCommand", () => {
      expect(springfield.agnesCommand).toBeDefined();
    });
  });

  describe("Utility Commands (v2.2.0)", () => {
    it("should export summonBatchCommand", () => {
      expect(springfield.summonBatchCommand).toBeDefined();
    });

    it("should export statsCommand", () => {
      expect(springfield.statsCommand).toBeDefined();
    });

    it("should export cancelRalphCommand", () => {
      expect(springfield.cancelRalphCommand).toBeDefined();
    });
  });

  describe("Ralph Gate Hook Exports", () => {
    it("should export ralphGateHook", () => {
      expect(springfield.ralphGateHook).toBeDefined();
    });

    it("should export requestRalphAuthorization", () => {
      expect(springfield.requestRalphAuthorization).toBeDefined();
      expect(typeof springfield.requestRalphAuthorization).toBe("function");
    });

    it("should export authorizeRalph", () => {
      expect(springfield.authorizeRalph).toBeDefined();
      expect(typeof springfield.authorizeRalph).toBe("function");
    });

    it("should export revokeRalphAuthorization", () => {
      expect(springfield.revokeRalphAuthorization).toBeDefined();
      expect(typeof springfield.revokeRalphAuthorization).toBe("function");
    });

    it("should export canInvokeRalph", () => {
      expect(springfield.canInvokeRalph).toBeDefined();
      expect(typeof springfield.canInvokeRalph).toBe("function");
    });

    it("should export resetRalphGateForTesting", () => {
      expect(springfield.resetRalphGateForTesting).toBeDefined();
      expect(typeof springfield.resetRalphGateForTesting).toBe("function");
    });
  });

  describe("Constants Exports", () => {
    it("should export REQUIRED_FILES", () => {
      expect(springfield.REQUIRED_FILES).toBeDefined();
      expect(Array.isArray(springfield.REQUIRED_FILES)).toBe(true);
    });

    it("should export CHARACTER_ARTIFACTS", () => {
      expect(springfield.CHARACTER_ARTIFACTS).toBeDefined();
      expect(typeof springfield.CHARACTER_ARTIFACTS).toBe("object");
    });

    it("should export CHARACTER_TIERS", () => {
      expect(springfield.CHARACTER_TIERS).toBeDefined();
    });

    it("should export ALL_CHARACTERS", () => {
      expect(springfield.ALL_CHARACTERS).toBeDefined();
      expect(Array.isArray(springfield.ALL_CHARACTERS)).toBe(true);
    });

    it("should export SPRINGFIELD_DIR", () => {
      expect(springfield.SPRINGFIELD_DIR).toBe(".springfield");
    });

    it("should export DEFAULT_COMPLETION_PROMISE", () => {
      expect(springfield.DEFAULT_COMPLETION_PROMISE).toBeDefined();
    });

    it("should export DEFAULT_MAX_ITERATIONS", () => {
      expect(springfield.DEFAULT_MAX_ITERATIONS).toBeDefined();
    });
  });

  describe("Artifact Exports", () => {
    it("should export generateArtifact", () => {
      expect(springfield.generateArtifact).toBeDefined();
      expect(typeof springfield.generateArtifact).toBe("function");
    });

    it("should export artifactExists", () => {
      expect(springfield.artifactExists).toBeDefined();
      expect(typeof springfield.artifactExists).toBe("function");
    });
  });

  describe("Stats Exports (v2.2.0)", () => {
    it("should export loadStats", () => {
      expect(springfield.loadStats).toBeDefined();
      expect(typeof springfield.loadStats).toBe("function");
    });

    it("should export saveStats", () => {
      expect(springfield.saveStats).toBeDefined();
      expect(typeof springfield.saveStats).toBe("function");
    });

    it("should export recordInvocation", () => {
      expect(springfield.recordInvocation).toBeDefined();
      expect(typeof springfield.recordInvocation).toBe("function");
    });

    it("should export getTopCharacters", () => {
      expect(springfield.getTopCharacters).toBeDefined();
      expect(typeof springfield.getTopCharacters).toBe("function");
    });

    it("should export formatStatsReport", () => {
      expect(springfield.formatStatsReport).toBeDefined();
      expect(typeof springfield.formatStatsReport).toBe("function");
    });

    it("should export resetStats", () => {
      expect(springfield.resetStats).toBeDefined();
      expect(typeof springfield.resetStats).toBe("function");
    });
  });

  describe("Validation Exports (v3.0.0)", () => {
    it("should export isFileComplete", () => {
      expect(springfield.isFileComplete).toBeDefined();
      expect(typeof springfield.isFileComplete).toBe("function");
    });

    it("should export hasTemplatePlaceholders", () => {
      expect(springfield.hasTemplatePlaceholders).toBeDefined();
      expect(typeof springfield.hasTemplatePlaceholders).toBe("function");
    });

    it("should export validateFileContent", () => {
      expect(springfield.validateFileContent).toBeDefined();
      expect(typeof springfield.validateFileContent).toBe("function");
    });

    it("should export validateRequiredFiles", () => {
      expect(springfield.validateRequiredFiles).toBeDefined();
      expect(typeof springfield.validateRequiredFiles).toBe("function");
    });

    it("should export validateSpringfieldDirectory", () => {
      expect(springfield.validateSpringfieldDirectory).toBeDefined();
      expect(typeof springfield.validateSpringfieldDirectory).toBe("function");
    });

    it("should export isSpringfieldInitialized", () => {
      expect(springfield.isSpringfieldInitialized).toBeDefined();
      expect(typeof springfield.isSpringfieldInitialized).toBe("function");
    });

    it("should export isSpringfieldReady", () => {
      expect(springfield.isSpringfieldReady).toBeDefined();
      expect(typeof springfield.isSpringfieldReady).toBe("function");
    });

    it("should export TEMPLATE_PLACEHOLDERS", () => {
      expect(springfield.TEMPLATE_PLACEHOLDERS).toBeDefined();
      expect(Array.isArray(springfield.TEMPLATE_PLACEHOLDERS)).toBe(true);
    });
  });

  describe("Configuration Exports (v2.3.0)", () => {
    it("should export getConfig", () => {
      expect(springfield.getConfig).toBeDefined();
      expect(typeof springfield.getConfig).toBe("function");
    });

    it("should export getCachedConfig", () => {
      expect(springfield.getCachedConfig).toBeDefined();
      expect(typeof springfield.getCachedConfig).toBe("function");
    });

    it("should export clearConfigCache", () => {
      expect(springfield.clearConfigCache).toBeDefined();
      expect(typeof springfield.clearConfigCache).toBe("function");
    });

    it("should export validateConfig", () => {
      expect(springfield.validateConfig).toBeDefined();
      expect(typeof springfield.validateConfig).toBe("function");
    });

    it("should export DEFAULT_CONFIG", () => {
      expect(springfield.DEFAULT_CONFIG).toBeDefined();
      expect(typeof springfield.DEFAULT_CONFIG).toBe("object");
    });
  });

  describe("Skills System Exports (v3.0.0)", () => {
    it("should export registerSkill", () => {
      expect(springfield.registerSkill).toBeDefined();
      expect(typeof springfield.registerSkill).toBe("function");
    });

    it("should export registerSkillFromFile", () => {
      expect(springfield.registerSkillFromFile).toBeDefined();
      expect(typeof springfield.registerSkillFromFile).toBe("function");
    });

    it("should export getSkill", () => {
      expect(springfield.getSkill).toBeDefined();
      expect(typeof springfield.getSkill).toBe("function");
    });

    it("should export listSkills", () => {
      expect(springfield.listSkills).toBeDefined();
      expect(typeof springfield.listSkills).toBe("function");
    });

    it("should export getRegistryState", () => {
      expect(springfield.getRegistryState).toBeDefined();
      expect(typeof springfield.getRegistryState).toBe("function");
    });

    it("should export unregisterSkill", () => {
      expect(springfield.unregisterSkill).toBeDefined();
      expect(typeof springfield.unregisterSkill).toBe("function");
    });

    it("should export clearSkillRegistry", () => {
      expect(springfield.clearSkillRegistry).toBeDefined();
      expect(typeof springfield.clearSkillRegistry).toBe("function");
    });

    it("should export loadSkillsFromDirectory", () => {
      expect(springfield.loadSkillsFromDirectory).toBeDefined();
      expect(typeof springfield.loadSkillsFromDirectory).toBe("function");
    });

    it("should export findSkillsByTrigger", () => {
      expect(springfield.findSkillsByTrigger).toBeDefined();
      expect(typeof springfield.findSkillsByTrigger).toBe("function");
    });

    it("should export parseFrontmatter", () => {
      expect(springfield.parseFrontmatter).toBeDefined();
      expect(typeof springfield.parseFrontmatter).toBe("function");
    });
  });

  describe("Plugin Info Export", () => {
    it("should export PLUGIN_INFO", () => {
      expect(springfield.PLUGIN_INFO).toBeDefined();
    });

    it("PLUGIN_INFO should have name", () => {
      expect(springfield.PLUGIN_INFO.name).toBe("springfield-code");
    });

    it("PLUGIN_INFO should have version", () => {
      expect(springfield.PLUGIN_INFO.version).toBeDefined();
      expect(typeof springfield.PLUGIN_INFO.version).toBe("string");
    });

    it("PLUGIN_INFO should have description", () => {
      expect(springfield.PLUGIN_INFO.description).toBeDefined();
    });
  });

  describe("Export Count Verification", () => {
    it("should have all expected command exports", () => {
      const commandExports = Object.keys(springfield).filter(k => k.endsWith("Command"));
      // 3 core + 5 simpson + 4 extended + 12 springfield + 20 specialists + 3 utility = 47
      expect(commandExports.length).toBeGreaterThanOrEqual(47);
    });

    it("should have all Simpson family commands", () => {
      const familyCommands = [
        "homerCommand",
        "margeCommand",
        "bartCommand",
        "lisaCommand",
        "maggieCommand",
      ];
      for (const cmd of familyCommands) {
        expect(springfield).toHaveProperty(cmd);
      }
    });

    it("should have all specialist commands", () => {
      const specialistCommands = [
        "drNickCommand",
        "pattyCommand",
        "troyCommand",
        "lionelCommand",
        "hansCommand",
        "hibbertCommand",
        "ednaCommand",
        "ottoCommand",
        "lennyCommand",
        "kentCommand",
        "snakeCommand",
        "cookieCommand",
        "gilCommand",
        "bumblebeeCommand",
        "duffmanCommand",
        "fatTonyCommand",
        "seaCaptainCommand",
        "lovejoyCommand",
        "helenCommand",
        "agnesCommand",
      ];
      for (const cmd of specialistCommands) {
        expect(springfield).toHaveProperty(cmd);
      }
    });
  });
});
