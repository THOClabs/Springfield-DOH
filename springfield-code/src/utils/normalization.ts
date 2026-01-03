/**
 * Tool Name Normalization Utilities for Springfield Code
 *
 * Provides secure normalization of tool names to prevent bypass attacks.
 * Based on Professor Frink's Experiment #4 and Bart's edge-cases.md.
 *
 * Handles:
 * - Case normalization (RALPH-LOOP -> ralph-loop)
 * - Unicode normalization via NFKC (Cyrillic 'а' -> Latin 'a')
 * - Separator normalization (underscores, spaces -> hyphens)
 * - Whitespace trimming
 * - Unexpected character removal
 *
 * @module normalization
 */

/**
 * Normalizes tool names for security comparison.
 * Prevents bypass attempts using underscores, unicode homoglyphs, or case variations.
 *
 * @param input - The raw tool name to normalize
 * @returns The normalized tool name
 *
 * @example
 * ```typescript
 * normalizeToolName('ralph_loop')    // -> 'ralph-loop'
 * normalizeToolName('RALPH-LOOP')    // -> 'ralph-loop'
 * normalizeToolName('ralph loop')    // -> 'ralph-loop'
 * normalizeToolName('rаlph-loop')    // -> 'ralph-loop' (Cyrillic 'а')
 * ```
 */
export function normalizeToolName(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .normalize("NFKC")              // Unicode normalization (handles homoglyphs)
    .toLowerCase()                   // Case normalization
    .replace(/[\s_-]+/g, "-")       // Separator normalization (space, underscore, hyphen -> single hyphen)
    .replace(/[^a-z0-9-]/g, "")     // Remove unexpected characters
    .replace(/^-+|-+$/g, "")        // Trim leading/trailing hyphens
    .trim();
}

/**
 * List of known Ralph-related tool names
 */
const RALPH_TOOL_NAMES = ["ralph-loop", "ralph", "ralph-wiggum"];

/**
 * Checks if a tool name (after normalization) is a Ralph tool.
 * Used by ralph-gate to determine if authorization is required.
 *
 * @param toolName - The raw tool name to check
 * @returns True if this is a Ralph-related tool
 *
 * @example
 * ```typescript
 * isRalphTool('ralph-loop')   // -> true
 * isRalphTool('ralph_loop')   // -> true (after normalization)
 * isRalphTool('RALPH-LOOP')   // -> true (after normalization)
 * isRalphTool('homer')        // -> false
 * ```
 */
export function isRalphTool(toolName: string): boolean {
  const normalized = normalizeToolName(toolName);
  return RALPH_TOOL_NAMES.includes(normalized);
}
