/**
 * Demo Kit Command
 * /springfield demo - Run Springfield Code demonstrations
 *
 * @module commands/demo
 */

import {
  listScenarios,
  findScenario,
  runScenario,
  runMultipleScenarios,
  parseDemoArgs,
  getDemoHelp,
  getAllScenarios,
  type DemoRunOptions,
} from "../demo/index.js";

/**
 * Handle the demo command
 * @param args - Command arguments
 * @returns Command output
 */
export async function handleDemo(args: string[]): Promise<string> {
  // Parse arguments
  const { identifiers, options } = parseDemoArgs(args);

  // No arguments or help - show help
  if (identifiers.length === 0 || identifiers[0] === "help") {
    return getDemoHelp();
  }

  const subcommand = identifiers[0].toLowerCase();

  // List command
  if (subcommand === "list") {
    return listScenarios(options);
  }

  // All command
  if (subcommand === "all") {
    const scenarios = getAllScenarios();
    const { output, results } = await runMultipleScenarios(scenarios, options);

    const summary = results
      .map((r) => `${r.scenario.name}: ${r.success ? "PASSED" : "FAILED"}`)
      .join("\n");

    return output + "\n\n=== SUMMARY ===\n" + summary;
  }

  // Single scenario by ID or slug
  const scenario = findScenario(subcommand);
  if (!scenario) {
    const available = getAllScenarios()
      .map((s) => `  ${s.id}. ${s.slug} - ${s.name}`)
      .join("\n");

    return `Demo scenario not found: "${subcommand}"

Available scenarios:
${available}

Use /springfield demo list for more details.`;
  }

  // Run the scenario
  const { output } = await runScenario(scenario, options);
  return output;
}

export default {
  name: "demo",
  description: "Run Springfield Code demonstrations",
  run: handleDemo,
};
