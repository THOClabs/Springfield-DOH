/**
 * Springfield main command
 * Handles init, status, and reset subcommands
 */

import * as fs from "fs";
import * as path from "path";
import { SPRINGFIELD_DIR, REQUIRED_FILES } from "../constants.js";
import { getCachedConfig } from "../config.js";
import { run as veteransLoungeRun } from "./veterans-lounge.js";
import {
  enablePrivateMode,
  disablePrivateMode,
  getPrivateModeStatus,
  formatPrivateModeStatus,
} from "../utils/private-mode.js";
import { handleDemo } from "./demo.js";

interface CommandContext {
  cwd?: string;
}

/**
 * Draw an ASCII box around content
 */
function drawBox(title: string, content: string[]): string {
  const width = 60;
  const top = `┌${"─".repeat(width)}┐`;
  const bottom = `└${"─".repeat(width)}┘`;
  const titleLine = `│ ${title.padEnd(width - 1)}│`;
  const separator = `├${"─".repeat(width)}┤`;

  const lines = content.map((line) => {
    const truncated = line.substring(0, width - 2);
    return `│ ${truncated.padEnd(width - 1)}│`;
  });

  return [top, titleLine, separator, ...lines, bottom].join("\n");
}

/**
 * Troy McClure onboarding messages
 */
function getTroyMcClureWelcome(): string {
  return `*adjusts hair, checks teeth in mirror*

Hi! I'm Troy McClure! You may remember me from such CLI tools as "Git But Fun" and "Your First Terraform Apply."

Welcome to Springfield Code! Let me show you what just happened:`;
}

/**
 * Initialize Springfield environment
 */
async function handleInit(projectDir: string): Promise<string> {
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);

  if (fs.existsSync(springfieldDir)) {
    return `Springfield already initialized at ${springfieldDir}\n\nUse /springfield reset to reinitialize.`;
  }

  // Create directory
  fs.mkdirSync(springfieldDir, { recursive: true });

  // Create default template files
  const templateFiles = [
    { name: "project.md", content: getProjectTemplate() },
    { name: "task.md", content: getTaskTemplate() },
    { name: "completion.md", content: getCompletionTemplate() },
    { name: "iterations.md", content: getIterationsTemplate() },
  ];

  for (const file of templateFiles) {
    const filePath = path.join(springfieldDir, file.name);
    fs.writeFileSync(filePath, file.content, "utf-8");
  }

  // Troy McClure onboarding per experience-journey.md
  const troyWelcome = getTroyMcClureWelcome();

  const content = [
    "",
    "Created .springfield/",
    "├── project.md     ← Define what you're building",
    "├── task.md        ← Track current work",
    "├── completion.md  ← Know when you're done",
    "└── iterations.md  ← Prevent scope creep",
    "",
    "Next, try:",
    "• /homer \"What is [your project]?\"",
    "  Get questions you forgot to ask",
    "",
    "• /marge - See your project's organization",
    "",
    "• /lisa - Begin comprehensive planning",
    "",
    "The citizens of Springfield are ready to help!",
  ];

  const boxContent = drawBox("SPRINGFIELD CODE INITIALIZED", content);

  return `${troyWelcome}\n\n${boxContent}`;
}

/**
 * Show Springfield status
 */
async function handleStatus(projectDir: string): Promise<string> {
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);

  if (!fs.existsSync(springfieldDir)) {
    return "Springfield not initialized.\n\nRun /springfield init to get started.";
  }

  const status: string[] = [""];

  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(springfieldDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const minLength = getCachedConfig().minContentLength;
      const isComplete = content.length > minLength && !content.includes("[");
      status.push(`${isComplete ? "[✓]" : "[~]"} ${file}`);
    } else {
      status.push(`[✗] ${file} MISSING`);
    }
  }

  // Check optional artifacts
  status.push("");
  status.push("Planning Artifacts:");

  const allFiles = fs.readdirSync(springfieldDir);
  const requiredFileSet = new Set<string>(REQUIRED_FILES);
  const optionalFiles = allFiles.filter(
    (f) => f.endsWith(".md") && !requiredFileSet.has(f)
  );

  if (optionalFiles.length === 0) {
    status.push("  (none yet - use character commands to plan)");
  } else {
    for (const file of optionalFiles) {
      status.push(`  ├── ${file}`);
    }
  }

  // Ralph status
  status.push("");
  const minLengthCheck = getCachedConfig().minContentLength;
  const allReady = REQUIRED_FILES.every((file) => {
    const filePath = path.join(springfieldDir, file);
    /* istanbul ignore if -- @preserve Status shows missing files, this branch rarely hit */
    if (!fs.existsSync(filePath)) return false;
    const content = fs.readFileSync(filePath, "utf-8");
    return content.length > minLengthCheck && !content.includes("[");
  });

  status.push(`RALPH STATUS: ${allReady ? "READY" : "NOT READY"}`);

  return drawBox("SPRINGFIELD STATUS", status);
}

/**
 * Reset Springfield environment
 */
async function handleReset(projectDir: string): Promise<string> {
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);

  if (fs.existsSync(springfieldDir)) {
    fs.rmSync(springfieldDir, { recursive: true, force: true });
  }

  return await handleInit(projectDir);
}

/**
 * Handle private mode toggle
 */
async function handlePrivateMode(
  projectDir: string,
  args: string[]
): Promise<string> {
  const [action] = args;

  switch (action?.toLowerCase()) {
    case "on":
    case "enable": {
      const state = enablePrivateMode(projectDir);
      return formatPrivateModeStatus(state);
    }

    case "off":
    case "disable": {
      const state = disablePrivateMode(projectDir);
      return formatPrivateModeStatus(state);
    }

    case "status":
    default: {
      const state = getPrivateModeStatus(projectDir);
      return formatPrivateModeStatus(state);
    }
  }
}

/**
 * Get help text
 */
function getHelpText(): string {
  return `
Springfield Code - Simpsons-themed vibe coding environment

Commands:
  /springfield init           Initialize Springfield in current directory
  /springfield status         Show current planning status
  /springfield reset          Delete and reinitialize Springfield
  /springfield private-mode   Toggle private mode (no stats tracking)
  /springfield veterans-lounge  Power user features (unlocks at 100 commands)
  /springfield demo           Run demo scenarios

Usage:
  1. Run /springfield init to create .springfield/ directory
  2. Use character commands (/homer, /lisa, etc.) for planning
  3. Check /springfield status for Ralph readiness
  4. When ready, use /lisa ralph to start execution
`.trim();
}

// Template content functions
function getProjectTemplate(): string {
  return `# Project Definition

## What We're Building
[One paragraph description]

## Why It Matters
[The purpose, the value]

## Core Requirements
1.
2.
3.

## Technical Constraints
-
-

## Out of Scope
-

## Success Looks Like
[What does done look like?]
`;
}

function getTaskTemplate(): string {
  return `# Current Task

## Objective
[What Ralph should accomplish]

## Context
[Everything Ralph needs to know]

## Files to Create or Modify
-
-

## Notes for Ralph
[Additional guidance]
`;
}

function getCompletionTemplate(): string {
  return `# Completion Criteria

## Completion Promise
\`\`\`
DONE
\`\`\`

## Success Conditions
1. [ ]
2. [ ]
3. [ ]

## Verification Steps
1. [How to verify each condition]
`;
}

function getIterationsTemplate(): string {
  return `# Iteration Configuration

## Max Iterations
\`\`\`
20
\`\`\`

## Stuck Protocol
After 75% of iterations without completion:
1. Document blocking issues
2. List attempted approaches
3. Suggest alternatives
`;
}

/**
 * Main command handler
 */
export async function run(
  args: string[],
  context: CommandContext
): Promise<string> {
  /* istanbul ignore next -- @preserve process.cwd() fallback for CLI usage */
  const projectDir = context.cwd || process.cwd();
  const subcommand = args[0]?.toLowerCase();

  switch (subcommand) {
    case "init":
      return await handleInit(projectDir);
    case "status":
      return await handleStatus(projectDir);
    case "reset":
      return await handleReset(projectDir);
    case "private-mode":
    case "private":
      return await handlePrivateMode(projectDir, args.slice(1));
    case "veterans-lounge":
    case "veterans":
      return await veteransLoungeRun(args.slice(1), context);
    case "demo":
      return await handleDemo(args.slice(1));
    default:
      return getHelpText();
  }
}

export default {
  name: "springfield",
  description:
    "Initialize and manage Springfield Code environment for vibe coding",
  run,
};
