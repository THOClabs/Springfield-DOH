/**
 * Demo Renderer
 * Output formatting for demo scenarios
 *
 * @module demo/renderer
 */

import type { DemoScenario, DemoStep, DemoRunOptions, DemoRunResult } from "./types.js";

/**
 * Render scenario intro (Krusty's narration)
 */
export function renderIntro(scenario: DemoScenario, options: DemoRunOptions = {}): string {
  const lines: string[] = [];

  if (options.markdown) {
    lines.push(`# Demo ${scenario.id}: ${scenario.name}`);
    lines.push("");
    lines.push(`> ${scenario.summary}`);
    lines.push("");
    lines.push("## Introduction");
    lines.push("");
    lines.push(scenario.intro);
  } else {
    lines.push("═".repeat(60));
    lines.push(`  DEMO ${scenario.id}: ${scenario.name.toUpperCase()}`);
    lines.push("═".repeat(60));
    lines.push("");
    lines.push(scenario.summary);
    lines.push("");
    lines.push("─".repeat(60));
    lines.push(scenario.intro);
    lines.push("─".repeat(60));
  }

  return lines.join("\n");
}

/**
 * Render a single demo step
 */
export function renderStep(step: DemoStep, options: DemoRunOptions = {}): string {
  const lines: string[] = [];

  if (options.markdown) {
    lines.push(`### Step ${step.step}: ${step.title}`);
    lines.push("");
    lines.push(step.description);
    lines.push("");

    if (step.character) {
      lines.push(`**Character:** ${step.character}`);
      lines.push("");
    }

    if (step.command) {
      lines.push("```");
      lines.push(step.command);
      lines.push("```");
      lines.push("");
    }

    if (step.expected) {
      lines.push("**Result:**");
      lines.push("");
      lines.push(step.expected);
      lines.push("");
    }
  } else {
    lines.push("");
    lines.push(`┌── Step ${step.step}: ${step.title} ${"─".repeat(Math.max(0, 40 - step.title.length))}┐`);
    lines.push("");
    lines.push(`  ${step.description}`);

    if (step.character) {
      lines.push(`  [Character: ${step.character}]`);
    }

    if (step.command) {
      lines.push("");
      lines.push("  Command:");
      for (const cmdLine of step.command.split("\n")) {
        lines.push(`    ${cmdLine}`);
      }
    }

    if (step.expected) {
      lines.push("");
      lines.push("  Result:");
      for (const expLine of step.expected.split("\n")) {
        lines.push(`  ${expLine}`);
      }
    }

    lines.push("");
    lines.push("└" + "─".repeat(58) + "┘");
  }

  return lines.join("\n");
}

/**
 * Render scenario summary/outro
 */
export function renderOutro(scenario: DemoScenario, options: DemoRunOptions = {}): string {
  const lines: string[] = [];

  if (options.markdown) {
    lines.push("## Summary");
    lines.push("");
    lines.push(`Demo **${scenario.name}** demonstrated:`);
    lines.push("");

    for (const step of scenario.steps) {
      lines.push(`- Step ${step.step}: ${step.title}`);
    }

    if (scenario.faq && scenario.faq.length > 0) {
      lines.push("");
      lines.push("## FAQ");
      lines.push("");
      for (const faq of scenario.faq) {
        lines.push(`**Q: ${faq.question}**`);
        lines.push("");
        lines.push(`A: ${faq.answer}`);
        lines.push("");
      }
    }
  } else {
    lines.push("");
    lines.push("═".repeat(60));
    lines.push("  DEMO COMPLETE!");
    lines.push("═".repeat(60));
    lines.push("");
    lines.push(`  ${scenario.name} demonstrated:`);
    lines.push("");

    for (const step of scenario.steps) {
      lines.push(`  • ${step.title}`);
    }

    if (scenario.faq && scenario.faq.length > 0) {
      lines.push("");
      lines.push("─".repeat(60));
      lines.push("  FREQUENTLY ASKED QUESTIONS");
      lines.push("─".repeat(60));
      for (const faq of scenario.faq) {
        lines.push("");
        lines.push(`  Q: ${faq.question}`);
        lines.push(`  A: ${faq.answer}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Render scenario list
 */
export function renderScenarioList(scenarios: DemoScenario[], options: DemoRunOptions = {}): string {
  const lines: string[] = [];

  if (options.markdown) {
    lines.push("# Available Demo Scenarios");
    lines.push("");
    lines.push("| ID | Name | Summary | Duration |");
    lines.push("|---|------|---------|----------|");

    for (const scenario of scenarios) {
      const duration = scenario.durationMinutes ? `~${scenario.durationMinutes} min` : "-";
      lines.push(`| ${scenario.id} | ${scenario.name} | ${scenario.summary} | ${duration} |`);
    }

    lines.push("");
    lines.push("## Usage");
    lines.push("");
    lines.push("```bash");
    lines.push("/springfield demo 1          # Run by ID");
    lines.push("/springfield demo nan        # Run by slug");
    lines.push("/springfield demo all        # Run all demos");
    lines.push("/springfield demo 1 --fast   # Skip pauses");
    lines.push("```");
  } else {
    lines.push("═".repeat(60));
    lines.push("  SPRINGFIELD CODE DEMO SCENARIOS");
    lines.push("═".repeat(60));
    lines.push("");

    for (const scenario of scenarios) {
      const duration = scenario.durationMinutes ? ` (~${scenario.durationMinutes} min)` : "";
      lines.push(`  ${scenario.id}. ${scenario.name}${duration}`);
      lines.push(`     ${scenario.slug}`);
      lines.push(`     ${scenario.summary}`);
      lines.push("");
    }

    lines.push("─".repeat(60));
    lines.push("  Usage:");
    lines.push("    /springfield demo 1          - Run by ID");
    lines.push("    /springfield demo nan        - Run by slug");
    lines.push("    /springfield demo all        - Run all demos");
    lines.push("    /springfield demo 1 --fast   - Skip pauses");
    lines.push("═".repeat(60));
  }

  return lines.join("\n");
}

/**
 * Render demo run result
 */
export function renderResult(result: DemoRunResult, options: DemoRunOptions = {}): string {
  const lines: string[] = [];
  const status = result.success ? "SUCCESS" : "FAILED";

  if (options.markdown) {
    lines.push(`## Result: ${status}`);
    lines.push("");
    lines.push(`- **Scenario:** ${result.scenario.name}`);
    lines.push(`- **Steps Completed:** ${result.stepsCompleted}/${result.totalSteps}`);
    lines.push(`- **Duration:** ${(result.durationMs / 1000).toFixed(1)}s`);

    if (result.error) {
      lines.push(`- **Error:** ${result.error}`);
    }
  } else {
    lines.push("");
    lines.push(`Result: ${status}`);
    lines.push(`Steps: ${result.stepsCompleted}/${result.totalSteps}`);
    lines.push(`Duration: ${(result.durationMs / 1000).toFixed(1)}s`);

    if (result.error) {
      lines.push(`Error: ${result.error}`);
    }
  }

  return lines.join("\n");
}

/**
 * Render live script for presentations
 */
export function renderLiveScript(scenario: DemoScenario): string {
  const lines: string[] = [];

  lines.push("═".repeat(60));
  lines.push(`  LIVE SCRIPT: ${scenario.name}`);
  lines.push("═".repeat(60));
  lines.push("");

  for (let i = 0; i < scenario.liveScript.length; i++) {
    lines.push(`  ${i + 1}. ${scenario.liveScript[i]}`);
  }

  lines.push("");
  lines.push("═".repeat(60));

  return lines.join("\n");
}
