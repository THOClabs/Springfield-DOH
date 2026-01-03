/**
 * Demo Kit
 * Main entry point for Springfield Code demos
 *
 * @module demo
 */

// Types
export type {
  DemoScenario,
  DemoStep,
  DemoFAQ,
  DemoRunOptions,
  DemoRunResult,
} from "./types.js";

// Scenarios
export {
  DEMO_SCENARIOS,
  getAllScenarios,
  getScenarioById,
  getScenarioBySlug,
  getScenariosByTag,
  TOTAL_SCENARIOS,
  nanDisasterScenario,
  securityBypassScenario,
  fullExperienceScenario,
} from "./scenarios/index.js";

// Renderer
export {
  renderIntro,
  renderStep,
  renderOutro,
  renderScenarioList,
  renderResult,
  renderLiveScript,
} from "./renderer.js";

import type { DemoScenario, DemoRunOptions, DemoRunResult } from "./types.js";
import { getAllScenarios, getScenarioById, getScenarioBySlug } from "./scenarios/index.js";
import {
  renderIntro,
  renderStep,
  renderOutro,
  renderScenarioList,
  renderResult,
} from "./renderer.js";

/**
 * Sleep utility for demo pacing
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run a single demo scenario
 * @param scenario - Scenario to run
 * @param options - Run options
 * @returns Run result
 */
export async function runScenario(
  scenario: DemoScenario,
  options: DemoRunOptions = {}
): Promise<{ output: string; result: DemoRunResult }> {
  const startTime = Date.now();
  const output: string[] = [];
  let stepsCompleted = 0;

  try {
    // Render intro
    output.push(renderIntro(scenario, options));

    // Run each step
    for (const step of scenario.steps) {
      output.push(renderStep(step, options));
      stepsCompleted++;

      // Pause between steps (unless fast mode)
      if (!options.fast && step.pauseMs) {
        await sleep(step.pauseMs);
      }
    }

    // Render outro
    output.push(renderOutro(scenario, options));

    const result: DemoRunResult = {
      scenario,
      success: true,
      stepsCompleted,
      totalSteps: scenario.steps.length,
      durationMs: Date.now() - startTime,
    };

    output.push(renderResult(result, options));

    return { output: output.join("\n\n"), result };
  } catch (error) {
    const result: DemoRunResult = {
      scenario,
      success: false,
      stepsCompleted,
      totalSteps: scenario.steps.length,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };

    output.push(renderResult(result, options));

    return { output: output.join("\n\n"), result };
  }
}

/**
 * Run multiple demo scenarios
 * @param scenarios - Scenarios to run
 * @param options - Run options
 * @returns Combined output and results
 */
export async function runMultipleScenarios(
  scenarios: DemoScenario[],
  options: DemoRunOptions = {}
): Promise<{ output: string; results: DemoRunResult[] }> {
  const allOutput: string[] = [];
  const results: DemoRunResult[] = [];

  for (const scenario of scenarios) {
    const { output, result } = await runScenario(scenario, options);
    allOutput.push(output);
    results.push(result);

    // Add separator between scenarios
    if (scenarios.indexOf(scenario) < scenarios.length - 1) {
      allOutput.push("\n" + "=".repeat(60) + "\n");
    }
  }

  return { output: allOutput.join("\n"), results };
}

/**
 * List all available scenarios
 * @param options - Display options
 * @returns Formatted list
 */
export function listScenarios(options: DemoRunOptions = {}): string {
  return renderScenarioList(getAllScenarios(), options);
}

/**
 * Find scenario by ID or slug
 * @param identifier - Numeric ID or slug string
 * @returns Scenario or undefined
 */
export function findScenario(identifier: string | number): DemoScenario | undefined {
  // If numeric, search by ID
  const numId = typeof identifier === "number" ? identifier : parseInt(identifier, 10);
  if (!isNaN(numId)) {
    return getScenarioById(numId);
  }

  // Otherwise search by slug
  return getScenarioBySlug(String(identifier));
}

/**
 * Parse demo command arguments
 * @param args - Command arguments
 * @returns Parsed options and identifiers
 */
export function parseDemoArgs(args: string[]): {
  identifiers: string[];
  options: DemoRunOptions;
} {
  const identifiers: string[] = [];
  const options: DemoRunOptions = {};

  for (const arg of args) {
    if (arg === "--fast" || arg === "-f") {
      options.fast = true;
    } else if (arg === "--markdown" || arg === "-m") {
      options.markdown = true;
    } else if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--non-interactive" || arg === "-n") {
      options.nonInteractive = true;
    } else if (!arg.startsWith("-")) {
      identifiers.push(arg);
    }
  }

  return { identifiers, options };
}

/**
 * Get demo help text
 */
export function getDemoHelp(): string {
  return `
Springfield Code Demo Kit

USAGE:
  /springfield demo [command] [options]

COMMANDS:
  list              List all available demos
  <id>              Run demo by numeric ID (1, 2, 3...)
  <slug>            Run demo by slug (nan-disaster, security-bypass...)
  all               Run all demos in sequence

OPTIONS:
  --fast, -f        Skip pauses between steps
  --markdown, -m    Output in markdown format
  --verbose, -v     Show additional details
  --help, -h        Show this help message

EXAMPLES:
  /springfield demo list
  /springfield demo 1
  /springfield demo nan-disaster
  /springfield demo all --fast
  /springfield demo 1 --markdown
`;
}
