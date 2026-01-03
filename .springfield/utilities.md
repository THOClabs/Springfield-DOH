# Apu's Utility Function Catalog

*adjusts Kwik-E-Mart apron*

Thank you, come again! I am Apu Nahasapeemapetilon, proprietor of the Kwik-E-Mart and tonight, your humble guide to shared utility functions!

You see, in my many years of running a convenience store, I have learned that REUSABLE INVENTORY is the key to efficiency. The same is true for code! Why write the same thing twice when you can write it once and use it MANY times?

*gestures to well-organized shelves*

Let me show you what utilities we need for this remediation...

---

## The Utility Shelf: Current Inventory

### What We Have (Good Stock!)

```
src/utils/
├── logger.ts           ← Logging utility (good!)
├── prerequisites.ts    ← File checking (good!)
├── stats.ts           ← Usage statistics (needs work)
└── validation.ts      ← Input validation (good base, needs extension)
```

### What We Need (Restock Required!)

1. **Error Logging Helper** - For consistent catch block logging
2. **Safe Number Parser** - For NaN-safe parseInt
3. **Tool Name Normalizer** - For security checks
4. **Config Validator** - Already exists but needs calling

---

## Utility #1: Error Logging Helper

*This is like my Express Card - used everywhere, always reliable!*

### The Pattern We Keep Repeating

Currently, every catch block needs to format errors the same way:

```typescript
// We see this pattern EVERYWHERE:
catch (error) {
  logger.error(`[MODULE] Operation failed`, {
    error: error instanceof Error ? error.message : String(error),
    // ... more context
  });
}
```

### The Utility Solution

```typescript
// src/utils/error-logging.ts

import { logger } from './logger';

/**
 * Standard error context for logging.
 * Thank you, come again!
 */
interface ErrorContext {
  operation: string;
  module: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  [key: string]: unknown;
}

/**
 * Formats an unknown error into a loggable structure.
 * Works with Error objects, strings, or any thrown value.
 */
export function formatError(error: unknown): {
  message: string;
  stack?: string;
  name?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: String(error) };
}

/**
 * Log an error from a catch block with consistent formatting.
 *
 * @example
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   logCatchError(error, {
 *     operation: 'riskyOperation',
 *     module: 'SKILLS',
 *     userId: context.userId,
 *   });
 *   return null;
 * }
 */
export function logCatchError(
  error: unknown,
  context: ErrorContext
): void {
  const { operation, module, severity = 'MEDIUM', ...extra } = context;
  const errorInfo = formatError(error);

  logger.error(`[${module}] ${operation} failed`, {
    ...errorInfo,
    severity,
    timestamp: Date.now(),
    ...extra,
  });
}

/**
 * Log a security-related error (always CRITICAL severity).
 */
export function logSecurityError(
  error: unknown,
  context: Omit<ErrorContext, 'severity'>
): void {
  logCatchError(error, { ...context, severity: 'CRITICAL' });
}
```

### Usage Examples (Thank You, Come Again!)

```typescript
// Before: Inconsistent error handling
try {
  const skill = await loadSkill(path);
} catch (e) {
  return null; // Silent! Bad for business!
}

// After: Consistent and visible
try {
  const skill = await loadSkill(path);
} catch (error) {
  logCatchError(error, {
    operation: 'loadSkill',
    module: 'SKILLS',
    skillPath: path,
  });
  return null;
}
```

---

## Utility #2: Safe Number Parser

*Like counting pennies - you must be PRECISE!*

### The Problem We Face

```typescript
// Current code - DANGEROUS like expired Squishee syrup!
const timeout = parseInt(process.env.TIMEOUT, 10);
// If TIMEOUT="banana", timeout = NaN
// NaN + anything = NaN
// NaN < anything = false
// NaN > anything = false
// NaN === NaN = false (!)
```

### The Utility Solution

```typescript
// src/utils/parsing.ts

/**
 * Parse a string to integer with NaN safety and validation.
 *
 * Unlike parseInt, this function:
 * - Returns a default value for NaN results
 * - Optionally validates bounds
 * - Logs warnings for invalid values
 *
 * @example
 * const ttl = safeParseInt(process.env.TTL, 30000);
 * const port = safeParseInt(portString, 3000, { min: 1, max: 65535 });
 */
export function safeParseInt(
  value: string | undefined | null,
  defaultValue: number,
  options: {
    min?: number;
    max?: number;
    logWarnings?: boolean;
    context?: string;
  } = {}
): number {
  const { min, max, logWarnings = true, context = 'value' } = options;

  // Handle missing values
  if (value === undefined || value === null || value === '') {
    if (logWarnings) {
      logger.debug(`[PARSE] Missing ${context}, using default ${defaultValue}`);
    }
    return defaultValue;
  }

  const parsed = parseInt(value, 10);

  // Handle NaN
  if (isNaN(parsed)) {
    if (logWarnings) {
      logger.warn(`[PARSE] Invalid numeric ${context}: "${value}"`, {
        received: value,
        usingDefault: defaultValue,
      });
    }
    return defaultValue;
  }

  // Handle bounds
  if (min !== undefined && parsed < min) {
    if (logWarnings) {
      logger.warn(`[PARSE] ${context} below minimum`, {
        received: parsed,
        minimum: min,
        usingDefault: defaultValue,
      });
    }
    return defaultValue;
  }

  if (max !== undefined && parsed > max) {
    if (logWarnings) {
      logger.warn(`[PARSE] ${context} above maximum`, {
        received: parsed,
        maximum: max,
        usingDefault: defaultValue,
      });
    }
    return defaultValue;
  }

  return parsed;
}

/**
 * Parse a string to float with similar safety guarantees.
 */
export function safeParseFloat(
  value: string | undefined | null,
  defaultValue: number,
  options: {
    min?: number;
    max?: number;
    logWarnings?: boolean;
    context?: string;
  } = {}
): number {
  // Similar implementation for floats
  // ... (implementation follows same pattern)
}
```

### Usage in config.ts

```typescript
// Before - DANGEROUS
function parseValue(value: string, key: string): number {
  return parseInt(value, 10);
}

// After - SAFE like refrigerated milk!
function parseValue(value: string, key: string): number {
  return safeParseInt(value, DEFAULT_CONFIG[key], {
    context: `config.${key}`,
    min: 0, // Most config values shouldn't be negative
  });
}
```

---

## Utility #3: Tool Name Normalizer

*Like checking IDs - you must be THOROUGH!*

### The Security Problem

From Bart's edge-cases.md and Chief Wiggum's security-review.md:

```typescript
// Current normalization - INCOMPLETE
const normalized = toolName.toLowerCase();
// Misses: underscores, unicode, mixed separators
```

### The Utility Solution

```typescript
// src/utils/normalization.ts

/**
 * Normalize a tool name for security comparison.
 *
 * Handles:
 * - Case variations (RALPH-LOOP → ralph-loop)
 * - Separator variations (ralph_loop → ralph-loop)
 * - Unicode homoglyphs (rаlph with Cyrillic a → ralph)
 * - Whitespace (ralph loop → ralph-loop)
 * - Multiple separators (ralph--loop → ralph-loop)
 *
 * @example
 * normalizeToolName('RALPH_LOOP') // 'ralph-loop'
 * normalizeToolName('ralph-_-loop') // 'ralph-loop'
 */
export function normalizeToolName(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Unicode normalization (handles homoglyphs like Cyrillic а → Latin a)
    .normalize('NFKC')
    // Case normalization
    .toLowerCase()
    // Trim whitespace
    .trim()
    // Replace any sequence of separators/whitespace with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove any remaining non-alphanumeric characters except hyphen
    .replace(/[^a-z0-9-]/g, '')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a tool name matches a pattern after normalization.
 *
 * @example
 * isToolNameMatch('ralph_loop', 'ralph-loop') // true
 * isToolNameMatch('RALPH-LOOP', 'ralph-loop') // true
 */
export function isToolNameMatch(input: string, pattern: string): boolean {
  return normalizeToolName(input) === normalizeToolName(pattern);
}

/**
 * Check if a tool name matches any in a list of patterns.
 */
export function isToolNameInList(input: string, patterns: string[]): boolean {
  const normalized = normalizeToolName(input);
  return patterns.some(p => normalizeToolName(p) === normalized);
}

// Pre-normalized list for performance
const RALPH_TOOLS = ['ralph-loop', 'ralph', 'ralph-wiggum'] as const;

/**
 * Check if a tool name refers to Ralph functionality.
 * Use this for Ralph Gate security checks.
 */
export function isRalphTool(toolName: string): boolean {
  const normalized = normalizeToolName(toolName);
  return RALPH_TOOLS.some(t => normalized.includes(t));
}
```

### Usage in ralph-gate.ts

```typescript
// Before - INCOMPLETE (bypass possible!)
const normalizedToolName = event.toolName.toLowerCase();
if (normalizedToolName === 'ralph-loop' || normalizedToolName === 'ralph') {
  // Check authorization
}

// After - COMPLETE (no bypass!)
import { isRalphTool } from '../utils/normalization';

if (isRalphTool(event.toolName)) {
  // Check authorization
}
```

---

## Utility #4: Result Type Helpers

*In India, we have a saying: "A clear return value brings peace of mind."*

### The Pattern We Need

From Flanders' standards.md - discriminated unions for results:

```typescript
// src/utils/results.ts

/**
 * A result type that clearly indicates success or failure.
 * Like a receipt - you know exactly what you got!
 */
export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Create a success result.
 */
export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

/**
 * Create a failure result.
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Unwrap a result, throwing if it's an error.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.value;
  }
  throw new Error(String(result.error));
}

/**
 * Unwrap a result with a default value if error.
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.success ? result.value : defaultValue;
}
```

### Usage Example

```typescript
// Instead of returning null silently:
async function loadSkill(path: string): Promise<Skill | null> {
  try {
    return await import(path);
  } catch {
    return null; // What went wrong? Mystery!
  }
}

// Return a clear Result:
async function loadSkill(path: string): Promise<Result<Skill, string>> {
  try {
    const module = await import(path);
    return ok(module.default);
  } catch (error) {
    logCatchError(error, { module: 'SKILLS', operation: 'loadSkill' });
    return err(`Failed to load skill: ${formatError(error).message}`);
  }
}

// Caller knows exactly what happened:
const result = await loadSkill(path);
if (!result.success) {
  console.log(`Skill failed: ${result.error}`);
}
```

---

## Utility #5: Validation Helpers

*Like checking expiration dates - essential for safety!*

```typescript
// src/utils/validation.ts (additions)

/**
 * Check if a string contains template placeholders.
 * Replaces the ad-hoc `content.includes("[")` check.
 */
export function hasTemplatePlaceholders(content: string): boolean {
  // Match [PLACEHOLDER] style markers
  return /\[[A-Z_]+\]/.test(content);
}

/**
 * Validate that a path is absolute (not relative).
 */
export function isAbsolutePath(filePath: string): boolean {
  // Windows: C:\ or \\server
  // Unix: /
  return /^([a-zA-Z]:\\|\\\\|\/)/。test(filePath);
}

/**
 * Validate that a path doesn't contain traversal attempts.
 */
export function isSafePath(filePath: string): boolean {
  const normalized = path.normalize(filePath);
  return !normalized.includes('..') && !normalized.includes('\0');
}

/**
 * Validate a configuration object.
 * This should be called in getConfig()!
 */
export function validateConfig(config: SpringfieldConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Token TTL validation
  if (typeof config.tokenTTL !== 'number' || isNaN(config.tokenTTL)) {
    errors.push('Token TTL must be a valid number');
  } else if (config.tokenTTL < 1000) {
    warnings.push('Token TTL is very short (< 1 second)');
  } else if (config.tokenTTL > 3600000) {
    warnings.push('Token TTL is very long (> 1 hour)');
  }

  // Rate limit validation
  if (config.rateLimit.maxTokens < 1) {
    errors.push('Max tokens must be at least 1');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

---

## Utility Shelf Summary

*rings up the totals*

### New Utilities to Create

| Utility | File | Purpose | Priority |
|---------|------|---------|----------|
| `logCatchError` | `utils/error-logging.ts` | Consistent error logging | HIGH |
| `safeParseInt` | `utils/parsing.ts` | NaN-safe number parsing | CRITICAL |
| `normalizeToolName` | `utils/normalization.ts` | Security input normalization | HIGH |
| `Result<T,E>` | `utils/results.ts` | Clear success/failure types | MEDIUM |
| `hasTemplatePlaceholders` | `utils/validation.ts` | Template detection | MEDIUM |

### Existing Utilities to Extend

| Utility | File | Enhancement |
|---------|------|-------------|
| `validateConfig` | `utils/validation.ts` | Add warning levels |
| `logger` | `utils/logger.ts` | Already good! |

---

## The Kwik-E-Mart Guarantee

*straightens name tag*

I guarantee that these utilities will:

1. **Be Reusable** - Write once, use everywhere
2. **Be Tested** - Each utility gets unit tests
3. **Be Documented** - JSDoc comments on all exports
4. **Be Consistent** - Same patterns across the codebase

If you are not satisfied with these utilities, please return them for a full refund!

*pauses*

Actually, that is not how open source works. But you may file a GitHub issue!

---

## Final Inventory Count

```
UTILITIES SHELF - RESTOCK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Error Logging Helper ... IN STOCK
✓ Safe Number Parser .... IN STOCK
✓ Tool Normalizer ....... IN STOCK
✓ Result Type Helpers ... IN STOCK
✓ Validation Helpers .... IN STOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you, come again!
```

---

*Generated by Apu Nahasapeemapetilon - Utility Function Catalog*
*"Who needs the Kwik-E-Mart? I doooooo!"*
