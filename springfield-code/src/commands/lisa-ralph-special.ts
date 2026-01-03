/**
 * Lisa-Ralph Special Protocol
 * Only Lisa can initiate Ralph's execution loop
 */

import * as fs from "fs";
import * as path from "path";
import {
  SPRINGFIELD_DIR,
  REQUIRED_FILES,
  DEFAULT_COMPLETION_PROMISE,
  DEFAULT_MAX_ITERATIONS,
} from "../constants.js";
import { requestRalphAuthorization } from "../hooks/ralph-gate.js";
import { verifyPrerequisites, type PrerequisiteResult } from "../utils/prerequisites.js";
import { lisaRalphLogger as logger } from "../utils/logger.js";
import type { CommandContext } from "../types.js";

// verifyPrerequisites is now imported from ../utils/prerequisites.js

/**
 * Generate response when not initialized
 */
function notInitializedResponse(): string {
  return `*Lisa sighs*

Springfield isn't initialized yet. It's like trying to play
a sonata without tuning your instrument first.

Run \`/springfield init\` to get started.`;
}

/**
 * Generate response when prerequisites are incomplete
 */
function incompleteResponse(verification: PrerequisiteResult): string {
  const missingList = verification.missing.map((m) => `  - ${m}`).join("\n");

  return `*sighs and adjusts saxophone case*

We're not ready for Ralph yet. It's like trying to perform
without knowing the key signature.

**Missing:**
${missingList}

**Present:**
${verification.present.map((p) => `  - ${p}`).join("\n") || "  (none)"}

Let me help you complete these. Try:
- \`/homer\` to ask clarifying questions
- \`/marge\` to organize the structure
- \`/bart\` to identify edge cases

Or just edit the files directly in \`.springfield/\``;
}

/**
 * Synthesize prompt from all Springfield files
 */
function synthesizePrompt(springfieldDir: string): string {
  const sections: string[] = [];

  // Add required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(springfieldDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const label = file.replace(".md", "").toUpperCase().replace("-", " ");
      sections.push(`## ${label}\n\n${content}`);
    }
  }

  // Add optional context files
  const allFiles = fs.readdirSync(springfieldDir);
  const requiredFileSet = new Set<string>(REQUIRED_FILES);
  for (const file of allFiles) {
    if (
      file.endsWith(".md") &&
      !requiredFileSet.has(file)
    ) {
      const filePath = path.join(springfieldDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const label = file.replace(".md", "").toUpperCase().replace("-", " ");
      sections.push(`## ${label} (Context)\n\n${content}`);
    }
  }

  return sections.join("\n\n---\n\n");
}

/**
 * Extract completion promise from completion.md
 */
function extractCompletionPromise(springfieldDir: string): string {
  const filePath = path.join(springfieldDir, "completion.md");
  /* istanbul ignore if -- @preserve Defense-in-depth: file is required, verified before this call */
  if (!fs.existsSync(filePath)) return DEFAULT_COMPLETION_PROMISE;

  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/```\n([^`]+)\n```/);
  return match ? match[1].trim() : DEFAULT_COMPLETION_PROMISE;
}

/**
 * Extract max iterations from iterations.md
 * @param springfieldDir - Path to the .springfield directory
 * @returns Number of iterations, bounded between 1 and 1000
 */
function extractMaxIterations(springfieldDir: string): number {
  const MIN_ITERATIONS = 1;
  const MAX_ITERATIONS = 1000;
  
  const filePath = path.join(springfieldDir, "iterations.md");
  /* istanbul ignore if -- @preserve Defense-in-depth: file is required, verified before this call */
  if (!fs.existsSync(filePath)) return DEFAULT_MAX_ITERATIONS;

  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/```\n(\d+)\n```/);
  
  if (!match) return DEFAULT_MAX_ITERATIONS;
  
  const parsed = parseInt(match[1], 10);
  
  // Bounds validation: ensure iterations is a valid number within range
  if (isNaN(parsed) || parsed < MIN_ITERATIONS) {
    logger.warn(`Invalid iterations value, using minimum: ${MIN_ITERATIONS}`);
    return MIN_ITERATIONS;
  }
  
  if (parsed > MAX_ITERATIONS) {
    logger.warn(`Iterations exceeds maximum, capping at: ${MAX_ITERATIONS}`);
    return MAX_ITERATIONS;
  }
  
  return parsed;
}

/**
 * Generate ready response with summary
 */
function readyResponse(
  verification: PrerequisiteResult,
  springfieldDir: string
): string {
  const prompt = synthesizePrompt(springfieldDir);
  const wordCount = prompt.split(/\s+/).length;
  const promise = extractCompletionPromise(springfieldDir);
  const iterations = extractMaxIterations(springfieldDir);

  return `*eyes light up*

All planning documents are in place!

**Ralph will receive:**
- Project context (${wordCount} words synthesized)
- ${verification.present.length} required files
- ${verification.context.length} context files from planning

**Configuration:**
- Completion promise: "${promise}"
- Max iterations: ${iterations}

**Files included:**
${verification.present.map((f) => `  ✓ ${f}`).join("\n")}
${verification.context.map((f) => `  + ${f}`).join("\n")}

Say \`yes\` to confirm and start Ralph's execution loop.

*adjusts saxophone nervously*

Remember: Ralph will keep iterating until he outputs "${promise}"
or reaches ${iterations} iterations.`;
}

/**
 * Invoke Ralph with synthesized context
 */
async function invokeRalph(springfieldDir: string): Promise<string> {
  // Request a cryptographically secure authorization token
  // Token is valid for 30 seconds and single-use only
  // The token is stored internally in ralph-gate; we just need to trigger the request
  requestRalphAuthorization();

  // Synthesize prompt
  const prompt = synthesizePrompt(springfieldDir);
  const promise = extractCompletionPromise(springfieldDir);
  const iterations = extractMaxIterations(springfieldDir);

  // Return invocation command
  return `*Lisa nods confidently*

Initiating Ralph...

\`\`\`
/ralph-loop "${prompt.substring(0, 100)}..." --completion-promise "${promise}" --max-iterations ${iterations}
\`\`\`

*whispers to Ralph*

"You can do this, Ralph. I believe in you."

---

**Ralph Loop Initiated**
- Completion Promise: ${promise}
- Max Iterations: ${iterations}
- Context Size: ${prompt.length} characters

Ralph is now running. Use \`/cancel-ralph\` if needed.`;
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
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);

  // Check if initialized
  if (!fs.existsSync(springfieldDir)) {
    return notInitializedResponse();
  }

  // Verify prerequisites
  const verification = verifyPrerequisites(springfieldDir);

  if (!verification.ready) {
    return incompleteResponse(verification);
  }

  // Check for confirmation
  if (args[0]?.toLowerCase() === "yes") {
    return invokeRalph(springfieldDir);
  }

  // Show ready response and ask for confirmation
  return readyResponse(verification, springfieldDir);
}

export default {
  name: "lisa-ralph",
  description: "Lisa's special protocol to initiate Ralph's execution loop",
  run,
};
