/**
 * File Validation Utilities
 *
 * Consolidated validation logic for Springfield file system checks.
 * Used for checking required files, content completeness, and directory state.
 *
 * @module utils/validation
 * @since v3.0.0
 */

import * as fs from "fs";
import * as path from "path";
import { getCachedConfig } from "../config.js";
import { REQUIRED_FILES, SPRINGFIELD_DIR, type RequiredFile } from "../constants.js";

/**
 * Result of file completeness validation
 */
export interface FileValidationResult {
  isComplete: boolean;
  length: number;
  hasPlaceholders: boolean;
  errors: string[];
}

/**
 * Result of Springfield directory validation
 */
export interface DirectoryValidationResult {
  exists: boolean;
  isValid: boolean;
  missingFiles: RequiredFile[];
  incompleteFiles: RequiredFile[];
  presentFiles: RequiredFile[];
  optionalFiles: string[];
  errors: string[];
}

/**
 * Template placeholder patterns that indicate incomplete files
 */
export const TEMPLATE_PLACEHOLDERS = [
  "[One paragraph",
  "[What",
  "[Describe",
  "[TODO",
  "[PLACEHOLDER",
] as const;

/**
 * Check if content contains template placeholders
 *
 * @param content - File content to check
 * @returns True if content contains any template placeholder patterns
 */
export function hasTemplatePlaceholders(content: string): boolean {
  return TEMPLATE_PLACEHOLDERS.some((placeholder) =>
    content.includes(placeholder)
  );
}

/**
 * Check if a file is complete (has sufficient content without placeholders)
 *
 * @param content - File content to validate
 * @param minContentLength - Minimum content length (uses config default if not provided)
 * @returns True if file content is complete
 */
export function isFileComplete(
  content: string,
  minContentLength?: number
): boolean {
  const minLength = minContentLength ?? getCachedConfig().minContentLength;
  return content.length >= minLength && !hasTemplatePlaceholders(content);
}

/**
 * Validate a single file's content
 *
 * @param content - File content to validate
 * @param minContentLength - Minimum content length (uses config default if not provided)
 * @returns Detailed validation result
 */
export function validateFileContent(
  content: string,
  minContentLength?: number
): FileValidationResult {
  const minLength = minContentLength ?? getCachedConfig().minContentLength;

  return {
    isComplete: content.length >= minLength && !hasTemplatePlaceholders(content),
    length: content.length,
    hasPlaceholders: hasTemplatePlaceholders(content),
    errors: [],
  };
}

/**
 * Validate that all required files exist and have substantive content
 *
 * @param springfieldDir - Path to the .springfield directory
 * @param minContentLength - Minimum content length (uses config default if not provided)
 * @returns Detailed validation result for all required files
 */
export function validateRequiredFiles(
  springfieldDir: string,
  minContentLength?: number
): DirectoryValidationResult {
  const minLength = minContentLength ?? getCachedConfig().minContentLength;

  const result: DirectoryValidationResult = {
    exists: false,
    isValid: true,
    missingFiles: [],
    incompleteFiles: [],
    presentFiles: [],
    optionalFiles: [],
    errors: [],
  };

  // Check if directory exists
  if (!fs.existsSync(springfieldDir)) {
    result.isValid = false;
    result.errors.push(`Springfield directory does not exist: ${springfieldDir}`);
    result.missingFiles = [...REQUIRED_FILES];
    return result;
  }

  result.exists = true;

  // Check each required file
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(springfieldDir, file);

    if (!fs.existsSync(filePath)) {
      result.missingFiles.push(file);
      result.isValid = false;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");

      // Check if file has substantive content
      if (content.length < minLength) {
        result.incompleteFiles.push(file);
        result.isValid = false;
      } else if (hasTemplatePlaceholders(content)) {
        result.incompleteFiles.push(file);
        result.isValid = false;
      } else {
        result.presentFiles.push(file);
      }
    } catch (error) /* istanbul ignore next -- @preserve Cannot mock fs.readFileSync in ESM */ {
      result.errors.push(`Failed to read ${file}: ${error}`);
      result.isValid = false;
    }
  }

  // Find optional files
  try {
    const allFiles = fs.readdirSync(springfieldDir);
    for (const file of allFiles) {
      if (
        file.endsWith(".md") &&
        !REQUIRED_FILES.includes(file as RequiredFile)
      ) {
        result.optionalFiles.push(file);
      }
    }
  } catch (error) /* istanbul ignore next -- @preserve Cannot mock fs.readdirSync in ESM */ {
    result.errors.push(`Failed to list directory: ${error}`);
  }

  return result;
}

/**
 * Validate Springfield directory exists and is properly initialized
 *
 * @param cwd - Current working directory
 * @param dirName - Name of the Springfield directory (default: .springfield)
 * @returns Validation result for the Springfield directory
 */
export function validateSpringfieldDirectory(
  cwd: string,
  dirName: string = SPRINGFIELD_DIR
): DirectoryValidationResult {
  const springfieldDir = path.join(cwd, dirName);
  return validateRequiredFiles(springfieldDir);
}

/**
 * Check if Springfield is initialized (directory exists)
 *
 * @param cwd - Current working directory
 * @param dirName - Name of the Springfield directory (default: .springfield)
 * @returns True if Springfield directory exists
 */
export function isSpringfieldInitialized(
  cwd: string,
  dirName: string = SPRINGFIELD_DIR
): boolean {
  const springfieldDir = path.join(cwd, dirName);
  return fs.existsSync(springfieldDir);
}

/**
 * Quick check if all required files are ready
 *
 * @param cwd - Current working directory
 * @param dirName - Name of the Springfield directory (default: .springfield)
 * @returns True if all required files exist and are complete
 */
export function isSpringfieldReady(
  cwd: string,
  dirName: string = SPRINGFIELD_DIR
): boolean {
  const result = validateSpringfieldDirectory(cwd, dirName);
  return result.isValid && result.exists;
}
