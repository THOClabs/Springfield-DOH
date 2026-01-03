/**
 * Tests for src/demo/* - Demo Kit
 */

import { describe, it, expect } from "vitest";

// Types
import type { DemoScenario, DemoRunOptions } from "../src/demo/types.js";

// Scenarios
import {
  DEMO_SCENARIOS,
  getAllScenarios,
  getScenarioById,
  getScenarioBySlug,
  getScenariosByTag,
  TOTAL_SCENARIOS,
  nanDisasterScenario,
  securityBypassScenario,
  fullExperienceScenario,
} from "../src/demo/scenarios/index.js";

// Renderer
import {
  renderIntro,
  renderStep,
  renderOutro,
  renderScenarioList,
  renderResult,
  renderLiveScript,
} from "../src/demo/renderer.js";

// Main functions
import {
  runScenario,
  runMultipleScenarios,
  listScenarios,
  findScenario,
  parseDemoArgs,
  getDemoHelp,
} from "../src/demo/index.js";

// Command
import { handleDemo } from "../src/commands/demo.js";

describe("Demo Kit", () => {
  describe("scenarios", () => {
    describe("DEMO_SCENARIOS", () => {
      it("has expected number of scenarios", () => {
        expect(DEMO_SCENARIOS.length).toBe(TOTAL_SCENARIOS);
        expect(DEMO_SCENARIOS.length).toBeGreaterThanOrEqual(3);
      });

      it("all scenarios have required properties", () => {
        for (const scenario of DEMO_SCENARIOS) {
          expect(scenario.id).toBeGreaterThan(0);
          expect(scenario.slug).toBeTruthy();
          expect(scenario.name).toBeTruthy();
          expect(scenario.summary).toBeTruthy();
          expect(scenario.intro).toBeTruthy();
          expect(scenario.steps.length).toBeGreaterThan(0);
          expect(scenario.liveScript.length).toBeGreaterThan(0);
        }
      });

      it("has unique IDs", () => {
        const ids = DEMO_SCENARIOS.map((s) => s.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });

      it("has unique slugs", () => {
        const slugs = DEMO_SCENARIOS.map((s) => s.slug);
        const uniqueSlugs = new Set(slugs);
        expect(uniqueSlugs.size).toBe(slugs.length);
      });
    });

    describe("getAllScenarios", () => {
      it("returns copy of scenarios", () => {
        const s1 = getAllScenarios();
        const s2 = getAllScenarios();
        expect(s1).not.toBe(s2);
        expect(s1).toEqual(s2);
      });
    });

    describe("getScenarioById", () => {
      it("returns scenario by ID", () => {
        const scenario = getScenarioById(1);
        expect(scenario).toBeDefined();
        expect(scenario?.id).toBe(1);
      });

      it("returns undefined for unknown ID", () => {
        expect(getScenarioById(999)).toBeUndefined();
      });
    });

    describe("getScenarioBySlug", () => {
      it("returns scenario by slug", () => {
        const scenario = getScenarioBySlug("nan-disaster");
        expect(scenario).toBeDefined();
        expect(scenario?.slug).toBe("nan-disaster");
      });

      it("returns undefined for unknown slug", () => {
        expect(getScenarioBySlug("nonexistent")).toBeUndefined();
      });
    });

    describe("getScenariosByTag", () => {
      it("filters by tag", () => {
        const scenarios = getScenariosByTag("security");
        expect(scenarios.length).toBeGreaterThan(0);
        expect(scenarios.every((s) => s.tags?.includes("security"))).toBe(true);
      });

      it("returns empty for unknown tag", () => {
        expect(getScenariosByTag("nonexistent-tag")).toEqual([]);
      });
    });

    describe("individual scenarios", () => {
      it("nanDisasterScenario is valid", () => {
        expect(nanDisasterScenario.id).toBe(1);
        expect(nanDisasterScenario.slug).toBe("nan-disaster");
        expect(nanDisasterScenario.steps.length).toBeGreaterThan(0);
      });

      it("securityBypassScenario is valid", () => {
        expect(securityBypassScenario.id).toBe(2);
        expect(securityBypassScenario.slug).toBe("security-bypass");
        expect(securityBypassScenario.steps.length).toBeGreaterThan(0);
      });

      it("fullExperienceScenario is valid", () => {
        expect(fullExperienceScenario.id).toBe(3);
        expect(fullExperienceScenario.slug).toBe("full-experience");
        expect(fullExperienceScenario.steps.length).toBeGreaterThan(5);
      });
    });
  });

  describe("renderer", () => {
    const mockScenario: DemoScenario = {
      id: 99,
      slug: "test-scenario",
      name: "Test Scenario",
      summary: "A test scenario",
      intro: "Test intro text",
      steps: [
        {
          step: 1,
          title: "Step One",
          description: "First step",
          command: "test command",
          expected: "expected result",
          pauseMs: 1000,
        },
        {
          step: 2,
          title: "Step Two",
          description: "Second step",
          character: "homer",
        },
      ],
      liveScript: ["Line 1", "Line 2"],
      faq: [{ question: "Q?", answer: "A" }],
      tags: ["test"],
      durationMinutes: 5,
    };

    describe("renderIntro", () => {
      it("renders intro in plain text", () => {
        const output = renderIntro(mockScenario);
        expect(output).toContain("DEMO 99");
        expect(output).toContain("TEST SCENARIO");
        expect(output).toContain("Test intro text");
      });

      it("renders intro in markdown", () => {
        const output = renderIntro(mockScenario, { markdown: true });
        expect(output).toContain("# Demo 99");
        expect(output).toContain("> A test scenario");
      });
    });

    describe("renderStep", () => {
      it("renders step in plain text", () => {
        const output = renderStep(mockScenario.steps[0]);
        expect(output).toContain("Step 1");
        expect(output).toContain("Step One");
        expect(output).toContain("test command");
      });

      it("renders step with character", () => {
        const output = renderStep(mockScenario.steps[1]);
        expect(output).toContain("homer");
      });

      it("renders step in markdown", () => {
        const output = renderStep(mockScenario.steps[0], { markdown: true });
        expect(output).toContain("### Step 1");
        expect(output).toContain("```");
      });
    });

    describe("renderOutro", () => {
      it("renders outro in plain text", () => {
        const output = renderOutro(mockScenario);
        expect(output).toContain("DEMO COMPLETE");
        expect(output).toContain("Q?");
        expect(output).toContain("A");
      });

      it("renders outro in markdown", () => {
        const output = renderOutro(mockScenario, { markdown: true });
        expect(output).toContain("## Summary");
        expect(output).toContain("## FAQ");
      });
    });

    describe("renderScenarioList", () => {
      it("renders list in plain text", () => {
        const output = renderScenarioList(getAllScenarios());
        expect(output).toContain("SPRINGFIELD CODE DEMO SCENARIOS");
        expect(output).toContain("nan-disaster");
      });

      it("renders list in markdown", () => {
        const output = renderScenarioList(getAllScenarios(), { markdown: true });
        expect(output).toContain("# Available Demo Scenarios");
        expect(output).toContain("|");
      });
    });

    describe("renderResult", () => {
      it("renders success result", () => {
        const result = {
          scenario: mockScenario,
          success: true,
          stepsCompleted: 2,
          totalSteps: 2,
          durationMs: 1500,
        };
        const output = renderResult(result);
        expect(output).toContain("SUCCESS");
        expect(output).toContain("2/2");
      });

      it("renders failed result", () => {
        const result = {
          scenario: mockScenario,
          success: false,
          stepsCompleted: 1,
          totalSteps: 2,
          durationMs: 1000,
          error: "Test error",
        };
        const output = renderResult(result);
        expect(output).toContain("FAILED");
        expect(output).toContain("Test error");
      });
    });

    describe("renderLiveScript", () => {
      it("renders live script", () => {
        const output = renderLiveScript(mockScenario);
        expect(output).toContain("LIVE SCRIPT");
        expect(output).toContain("Line 1");
        expect(output).toContain("Line 2");
      });
    });
  });

  describe("main functions", () => {
    describe("runScenario", () => {
      it("runs a scenario successfully", async () => {
        const scenario = getScenarioById(1)!;
        const { output, result } = await runScenario(scenario, { fast: true });

        expect(output).toContain(scenario.name);
        expect(result.success).toBe(true);
        expect(result.stepsCompleted).toBe(result.totalSteps);
      });

      it("respects markdown option", async () => {
        const scenario = getScenarioById(1)!;
        const { output } = await runScenario(scenario, { fast: true, markdown: true });

        expect(output).toContain("# Demo");
        expect(output).toContain("###");
      });
    });

    describe("runMultipleScenarios", () => {
      it("runs multiple scenarios", async () => {
        const scenarios = getAllScenarios().slice(0, 2);
        const { output, results } = await runMultipleScenarios(scenarios, { fast: true });

        expect(results.length).toBe(2);
        expect(results.every((r) => r.success)).toBe(true);
        expect(output).toContain(scenarios[0].name);
        expect(output).toContain(scenarios[1].name);
      });
    });

    describe("listScenarios", () => {
      it("lists all scenarios", () => {
        const output = listScenarios();
        expect(output).toContain("DEMO SCENARIOS");
      });
    });

    describe("findScenario", () => {
      it("finds by numeric ID", () => {
        expect(findScenario(1)?.id).toBe(1);
        expect(findScenario("1")?.id).toBe(1);
      });

      it("finds by slug", () => {
        expect(findScenario("nan-disaster")?.slug).toBe("nan-disaster");
      });

      it("returns undefined for unknown", () => {
        expect(findScenario("xyz")).toBeUndefined();
        expect(findScenario(999)).toBeUndefined();
      });
    });

    describe("parseDemoArgs", () => {
      it("parses identifiers", () => {
        const { identifiers } = parseDemoArgs(["1", "2"]);
        expect(identifiers).toEqual(["1", "2"]);
      });

      it("parses fast option", () => {
        const { options } = parseDemoArgs(["--fast"]);
        expect(options.fast).toBe(true);
      });

      it("parses short options", () => {
        const { options } = parseDemoArgs(["-f", "-m"]);
        expect(options.fast).toBe(true);
        expect(options.markdown).toBe(true);
      });

      it("handles mixed args", () => {
        const { identifiers, options } = parseDemoArgs(["1", "--fast", "all"]);
        expect(identifiers).toEqual(["1", "all"]);
        expect(options.fast).toBe(true);
      });
    });

    describe("getDemoHelp", () => {
      it("returns help text", () => {
        const help = getDemoHelp();
        expect(help).toContain("Demo Kit");
        expect(help).toContain("USAGE");
        expect(help).toContain("COMMANDS");
      });
    });
  });

  describe("command", () => {
    describe("handleDemo", () => {
      it("shows help with no args", async () => {
        const output = await handleDemo([]);
        expect(output).toContain("USAGE");
      });

      it("shows help with help command", async () => {
        const output = await handleDemo(["help"]);
        expect(output).toContain("USAGE");
      });

      it("lists scenarios with list command", async () => {
        const output = await handleDemo(["list"]);
        expect(output).toContain("DEMO SCENARIOS");
      });

      it("runs scenario by ID", async () => {
        const output = await handleDemo(["1", "--fast"]);
        expect(output).toContain("The NaN Disaster");
      });

      it("runs scenario by slug", async () => {
        const output = await handleDemo(["nan-disaster", "--fast"]);
        expect(output).toContain("The NaN Disaster");
      });

      it("shows error for unknown scenario", async () => {
        const output = await handleDemo(["xyz"]);
        expect(output).toContain("not found");
        expect(output).toContain("Available scenarios");
      });

      it("runs all scenarios", async () => {
        const output = await handleDemo(["all", "--fast"]);
        expect(output).toContain("SUMMARY");
        expect(output).toContain("PASSED");
      });
    });
  });
});
