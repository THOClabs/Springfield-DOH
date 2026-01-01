/**
 * Artifact Generation System
 * Creates character-specific planning artifacts in .springfield/
 * 
 * This module provides the main API for generating and managing
 * character artifacts. Individual character templates are in the
 * generators/ subdirectory.
 * 
 * @module artifacts/generator
 */

import * as fs from "fs";
import * as path from "path";
import { CHARACTER_ARTIFACTS, SPRINGFIELD_DIR, ALL_CHARACTERS } from "../constants.js";
import { getArtifactTemplate } from "./generators/index.js";
import type { ConversationContext } from "../types.js";
import { artifactLogger as logger } from "../utils/logger.js";

/**
 * Sanitize user input to prevent injection attacks and path traversal
 * - Removes HTML/script tags
 * - Escapes special markdown characters that could cause issues
 * - Limits length to prevent buffer issues
 */
function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "[removed]")
    // Remove other HTML tags but keep content
    .replace(/<[^>]+>/g, "")
    // Escape backticks to prevent code block injection
    .replace(/`{3,}/g, "\\`\\`\\`")
    // Limit length to prevent buffer issues
    .substring(0, 10000)
    .trim();
}

/**
 * Validate character name to prevent path traversal
 */
function isValidCharacter(character: string): boolean {
  if (!character || typeof character !== "string") {
    return false;
  }
  // Only allow known characters - prevents path traversal
  return ALL_CHARACTERS.includes(character as typeof ALL_CHARACTERS[number]);
}

/**
 * Generate and save an artifact for a character
 * 
 * @param character - The character name
 * @param userInput - User's input/context
 * @param projectDir - Project directory path
 * @returns The path to the generated artifact, or null if failed
 */
export function generateArtifact(
  character: string,
  userInput: string,
  projectDir: string
): string | null {
  // Validate character to prevent path traversal
  if (!isValidCharacter(character)) {
    logger.warn(`Invalid character: ${character}`);
    return null;
  }

  const artifactName = CHARACTER_ARTIFACTS[character];
  if (!artifactName) return null;

  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);
  if (!fs.existsSync(springfieldDir)) {
    return null;
  }

  // Validate that artifact path stays within springfield directory
  // (Defense-in-depth - isValidCharacter already filters, but this protects against future changes)
  const artifactPath = path.join(springfieldDir, artifactName);
  const resolvedPath = path.resolve(artifactPath);
  const resolvedSpringfieldDir = path.resolve(springfieldDir);
  
  /* istanbul ignore if -- @preserve Defense-in-depth check unreachable with current character validation */
  if (!resolvedPath.startsWith(resolvedSpringfieldDir)) {
    logger.warn(`Path traversal attempt blocked: ${artifactPath}`);
    return null;
  }

  // Sanitize user input before using in templates
  const sanitizedInput = sanitizeInput(userInput);

  const context: ConversationContext = {
    character,
    userInput: sanitizedInput,
    timestamp: new Date(),
  };

  const content = getArtifactTemplate(character, context);

  try {
    fs.writeFileSync(artifactPath, content, "utf-8");
    logger.debug(`Artifact generated: ${artifactPath}`);
  } catch (error) /* istanbul ignore next -- @preserve Cannot mock fs.writeFileSync in ESM */ {
    logger.error(`Failed to write artifact: ${error}`);
    return null;
  }

  return artifactPath;
}

/**
 * Check if an artifact exists for a character
 * 
 * @param character - The character name
 * @param projectDir - Project directory path
 * @returns true if the artifact exists
 */
export function artifactExists(character: string, projectDir: string): boolean {
  const artifactName = CHARACTER_ARTIFACTS[character];
  if (!artifactName) return false;

  const artifactPath = path.join(projectDir, SPRINGFIELD_DIR, artifactName);
  return fs.existsSync(artifactPath);
}

// Re-export the template function for direct access
export { getArtifactTemplate };

// Re-export types
export type { ConversationContext };
