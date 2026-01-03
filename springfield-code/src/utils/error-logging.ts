/**
 * Error Logging Utilities for Springfield Code
 *
 * Provides standardized error logging for catch blocks across all modules.
 * Based on Professor Frink's Experiment #3 - Silent Failure Elimination.
 *
 * @module error-logging
 */

import { createLogger } from "./logger.js";

/**
 * Context for error logging
 */
export interface ErrorContext {
  /** The operation that failed */
  operation: string;
  /** The module where the error occurred */
  module: string;
  /** Additional context-specific data */
  [key: string]: unknown;
}

/**
 * Standard error logging wrapper for catch blocks.
 * Use this to ensure consistent error reporting across all modules.
 *
 * @param error - The caught error
 * @param context - Context about where the error occurred
 *
 * @example
 * ```typescript
 * try {
 *   await loadSkill(path);
 * } catch (error) {
 *   logCatchError(error, {
 *     operation: 'loadSkill',
 *     module: 'SKILLS',
 *     skillPath: path,
 *   });
 *   return null;
 * }
 * ```
 */
export function logCatchError(
  error: unknown,
  context: ErrorContext
): void {
  const logger = createLogger(context.module);
  const { operation, module: _module, ...additionalContext } = context;

  logger.error(`${operation} failed`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...additionalContext,
    timestamp: Date.now(),
  });
}

/**
 * Create a module-specific error logger
 * Returns a function pre-configured with the module name
 *
 * @param moduleName - The module name for the logger prefix
 * @returns A logCatchError function with module pre-set
 *
 * @example
 * ```typescript
 * const logError = createModuleErrorLogger('CONFIG');
 *
 * try {
 *   parseConfig();
 * } catch (error) {
 *   logError(error, { operation: 'parseConfig', filePath });
 * }
 * ```
 */
export function createModuleErrorLogger(moduleName: string) {
  return (error: unknown, context: Omit<ErrorContext, "module">) => {
    logCatchError(error, { ...context, module: moduleName });
  };
}
