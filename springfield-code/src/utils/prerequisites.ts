/**
 * Shared prerequisite verification utilities
 * Used by lisa-ralph-special and other commands that need to check Springfield state
 */

import * as fs from "fs";
import * as path from "path";
import { REQUIRED_FILES, type RequiredFile } from "../constants.js";
import { getCachedConfig } from "../config.js";
import { type PrerequisiteResult } from "../types.js";
import { prerequisiteLogger as logger } from "./logger.js";

// Re-export the type for consumers
export type { PrerequisiteResult } from "../types.js";

/**
 * Template placeholder patterns that indicate incomplete files
 */
const TEMPLATE_PLACEHOLDERS = [
  "[One paragraph",
  "[What",
  "[Describe",
  "[TODO",
  "[PLACEHOLDER",
];

/**
 * Check if content contains template placeholders
 */
function hasTemplatePlaceholders(content: string): boolean {
  return TEMPLATE_PLACEHOLDERS.some((placeholder) =>
    content.includes(placeholder)
  );
}

/**
 * Verify all prerequisites are met for Ralph execution
 * @param springfieldDir - Path to the .springfield directory
 * @returns Verification result with details about missing/incomplete files
 */
export function verifyPrerequisites(springfieldDir: string): PrerequisiteResult {
  logger.debug(`Verifying prerequisites in: ${springfieldDir}`);
  
  const result: PrerequisiteResult = {
    ready: true,
    missing: [],
    present: [],
    context: [],
    errors: [],
  };

  // Check if directory exists
  if (!fs.existsSync(springfieldDir)) {
    result.ready = false;
    result.errors.push(`Springfield directory does not exist: ${springfieldDir}`);
    result.missing = [...REQUIRED_FILES];
    logger.warn("Springfield directory not found");
    return result;
  }

  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(springfieldDir, file);

    if (!fs.existsSync(filePath)) {
      result.missing.push(file);
      result.ready = false;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");

      // Check if file has substantive content
      const minLength = getCachedConfig().minContentLength;
      if (content.length < minLength) {
        result.missing.push(`${file} (incomplete - too short)`);
        result.ready = false;
      } else if (hasTemplatePlaceholders(content)) {
        result.missing.push(`${file} (incomplete - still has template placeholders)`);
        result.ready = false;
      } else {
        result.present.push(file);
      }
    } catch (error) /* istanbul ignore next -- @preserve Cannot mock fs.readFileSync in ESM */ {
      result.errors.push(`Failed to read ${file}: ${error}`);
      result.ready = false;
    }
  }

  // Find optional context files
  try {
    const allFiles = fs.readdirSync(springfieldDir);
    for (const file of allFiles) {
      if (
        file.endsWith(".md") &&
        !REQUIRED_FILES.includes(file as RequiredFile)
      ) {
        result.context.push(file);
      }
    }
  } catch (error) /* istanbul ignore next -- @preserve Cannot mock fs.readdirSync in ESM */ {
    result.errors.push(`Failed to read directory: ${error}`);
  }

  return result;
}

/**
 * Check if Springfield is initialized (directory exists)
 */
export function isSpringfieldInitialized(cwd: string, springfieldDirName: string): boolean {
  const springfieldDir = path.join(cwd, springfieldDirName);
  return fs.existsSync(springfieldDir);
}
