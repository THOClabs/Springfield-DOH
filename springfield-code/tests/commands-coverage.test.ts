/**
 * Comprehensive Command Coverage Tests
 *
 * This test file tests all character command run() functions to boost
 * function coverage from 75.28% toward 95%+.
 *
 * Uses static imports to avoid Vite dynamic import issues.
 *
 * @since 3.0.1
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CommandContext } from "@anthropic-ai/claude-code";

// Import all command modules directly (static imports for Vite compatibility)
import * as agnesCmd from "../src/commands/agnes.js";
import * as apuCmd from "../src/commands/apu.js";
import * as bartCmd from "../src/commands/bart.js";
import * as bobCmd from "../src/commands/bob.js";
import * as bumblebeeCmd from "../src/commands/bumblebee.js";
import * as burnsCmd from "../src/commands/burns.js";
import * as cbgCmd from "../src/commands/cbg.js";
import * as cookieCmd from "../src/commands/cookie.js";
import * as drNickCmd from "../src/commands/dr-nick.js";
import * as duffmanCmd from "../src/commands/duffman.js";
import * as ednaCmd from "../src/commands/edna.js";
import * as fatTonyCmd from "../src/commands/fat-tony.js";
import * as flandersCmd from "../src/commands/flanders.js";
import * as frinkCmd from "../src/commands/frink.js";
import * as gilCmd from "../src/commands/gil.js";
import * as grampaCmd from "../src/commands/grampa.js";
import * as hansCmd from "../src/commands/hans.js";
import * as helenCmd from "../src/commands/helen.js";
import * as hibbertCmd from "../src/commands/hibbert.js";
import * as homerCmd from "../src/commands/homer.js";
import * as kentCmd from "../src/commands/kent.js";
import * as krustyCmd from "../src/commands/krusty.js";
import * as lennyCmd from "../src/commands/lenny.js";
import * as lionelCmd from "../src/commands/lionel.js";
import * as lisaCmd from "../src/commands/lisa.js";
import * as lovejoyCmd from "../src/commands/lovejoy.js";
import * as maggieCmd from "../src/commands/maggie.js";
import * as margeCmd from "../src/commands/marge.js";
import * as milhouseCmd from "../src/commands/milhouse.js";
import * as moeCmd from "../src/commands/moe.js";
import * as nelsonCmd from "../src/commands/nelson.js";
import * as ottoCmd from "../src/commands/otto.js";
import * as pattyCmd from "../src/commands/patty.js";
import * as seaCaptainCmd from "../src/commands/sea-captain.js";
import * as skinnerCmd from "../src/commands/skinner.js";
import * as smithersCmd from "../src/commands/smithers.js";
import * as snakeCmd from "../src/commands/snake.js";
import * as troyCmd from "../src/commands/troy.js";
import * as wiggumCmd from "../src/commands/wiggum.js";
import * as willieCmd from "../src/commands/willie.js";
import * as ralphCmd from "../src/commands/ralph.js";
import * as statsCmd from "../src/commands/stats.js";

// Mock context for all command tests
const mockContext: CommandContext = {
  abortController: new AbortController(),
  options: { commands: [], tools: [], permissions: {} },
  readFileTimestamps: new Map(),
};

// Define type for command modules
interface CommandModule {
  run: (args: string[], ctx: CommandContext) => Promise<string>;
  default: { name: string; description: string };
}

// Map of character names to their command modules
const commandModules: Record<string, CommandModule> = {
  agnes: agnesCmd as unknown as CommandModule,
  apu: apuCmd as unknown as CommandModule,
  bart: bartCmd as unknown as CommandModule,
  bob: bobCmd as unknown as CommandModule,
  bumblebee: bumblebeeCmd as unknown as CommandModule,
  burns: burnsCmd as unknown as CommandModule,
  cbg: cbgCmd as unknown as CommandModule,
  cookie: cookieCmd as unknown as CommandModule,
  "dr-nick": drNickCmd as unknown as CommandModule,
  duffman: duffmanCmd as unknown as CommandModule,
  edna: ednaCmd as unknown as CommandModule,
  "fat-tony": fatTonyCmd as unknown as CommandModule,
  flanders: flandersCmd as unknown as CommandModule,
  frink: frinkCmd as unknown as CommandModule,
  gil: gilCmd as unknown as CommandModule,
  grampa: grampaCmd as unknown as CommandModule,
  hans: hansCmd as unknown as CommandModule,
  helen: helenCmd as unknown as CommandModule,
  hibbert: hibbertCmd as unknown as CommandModule,
  homer: homerCmd as unknown as CommandModule,
  kent: kentCmd as unknown as CommandModule,
  krusty: krustyCmd as unknown as CommandModule,
  lenny: lennyCmd as unknown as CommandModule,
  lionel: lionelCmd as unknown as CommandModule,
  lisa: lisaCmd as unknown as CommandModule,
  lovejoy: lovejoyCmd as unknown as CommandModule,
  maggie: maggieCmd as unknown as CommandModule,
  marge: margeCmd as unknown as CommandModule,
  milhouse: milhouseCmd as unknown as CommandModule,
  moe: moeCmd as unknown as CommandModule,
  nelson: nelsonCmd as unknown as CommandModule,
  otto: ottoCmd as unknown as CommandModule,
  patty: pattyCmd as unknown as CommandModule,
  "sea-captain": seaCaptainCmd as unknown as CommandModule,
  skinner: skinnerCmd as unknown as CommandModule,
  smithers: smithersCmd as unknown as CommandModule,
  snake: snakeCmd as unknown as CommandModule,
  troy: troyCmd as unknown as CommandModule,
  wiggum: wiggumCmd as unknown as CommandModule,
  willie: willieCmd as unknown as CommandModule,
};

const characterNames = Object.keys(commandModules);

describe("Character Command run() Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Parameterized tests for all standard character commands
  describe.each(characterNames)("%s command", (character) => {
    it("should have a run function that returns content", async () => {
      const cmdModule = commandModules[character];

      expect(cmdModule.run).toBeDefined();
      expect(typeof cmdModule.run).toBe("function");

      // Call the run function with test args
      const result = await cmdModule.run(["test"], mockContext);

      // Result should be a string with content
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should have proper default export", () => {
      const cmdModule = commandModules[character];

      expect(cmdModule.default).toBeDefined();
      expect(cmdModule.default.name).toBeDefined();
      expect(cmdModule.default.description).toBeDefined();
    });
  });
});

describe("Special Command run() Functions", () => {
  describe("ralph command", () => {
    it("should return confused message when called directly", async () => {
      const result = await ralphCmd.run([], mockContext);

      expect(result).toContain("Ralph");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should have proper default export", () => {
      expect(ralphCmd.default.name).toBe("ralph");
      expect(ralphCmd.default.description).toBeDefined();
    });
  });

  describe("stats command", () => {
    it("should return stats report when called without args", async () => {
      const result = await statsCmd.run([], mockContext);

      // Should return some stats content (even if no stats yet)
      expect(typeof result).toBe("string");
    });

    it("should have proper default export", () => {
      expect(statsCmd.default.name).toBe("stats");
      expect(statsCmd.default.description).toBeDefined();
    });
  });
});
