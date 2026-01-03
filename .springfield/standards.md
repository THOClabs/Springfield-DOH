# Flanders' Coding Standards

*adjusts glasses with a warm smile*

Well, hidely-ho, neighborinos! Let's talk about doing things the RIGHT way!

---

## The Golden Rules

### Rule #1: No Silent Failures, Neighborino!

**The Problem We're Fixing:**
Marge found that our code has been... well, fibbing by omission. When things go wrong, we pretend nothing happened. That's not very Christian of us!

**The Standard:**

```typescript
// BAD - Silent failure (like lying by omission!)
try {
  const result = await riskyOperation();
  return result;
} catch {
  return null;  // Okily-dokily, we'll just pretend nothing happened!
}

// GOOD - Honest failure (the Flanders way!)
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error(`[${moduleName}] Operation failed`, {
    operation: 'riskyOperation',
    error: error instanceof Error ? error.message : String(error),
    context: relevantContext
  });
  return null;  // Still return null, but we've confessed our sins!
}
```

**Why This Matters:**
- Debugging becomes possible (praise the Lord!)
- Security audits can see what happened
- Users can report meaningful errors
- We sleep better at night

---

### Rule #2: Validate Early, Validate Often

**The Standard:**

```typescript
// BAD - Trust without verification (like lending money to Homer!)
export function getConfig(): Config {
  return loadConfigFromEnv();  // Could be full of garbage!
}

// GOOD - Trust but verify (the Flanders way!)
export function getConfig(): Config {
  const config = loadConfigFromEnv();
  const validation = validateConfig(config);

  if (!validation.valid) {
    logger.warn('Configuration issues detected', validation.errors);
    // Either throw or use safe defaults - but DON'T ignore!
  }

  return config;
}
```

**Where to Validate:**
- User input (ALWAYS)
- Environment variables (at startup)
- External API responses (on receipt)
- Configuration files (when loading)

---

### Rule #3: Numbers Must Be Numbers

**The Standard:**

```typescript
// BAD - Blind faith in parseInt (what if it's not a number?)
const timeout = parseInt(process.env.TIMEOUT, 10);

// GOOD - Verify your assumptions!
const rawTimeout = parseInt(process.env.TIMEOUT, 10);
const timeout = isNaN(rawTimeout) ? DEFAULT_TIMEOUT : rawTimeout;

// BETTER - With logging!
const rawTimeout = parseInt(process.env.TIMEOUT, 10);
if (isNaN(rawTimeout)) {
  logger.warn(`Invalid TIMEOUT value: "${process.env.TIMEOUT}", using default ${DEFAULT_TIMEOUT}`);
}
const timeout = isNaN(rawTimeout) ? DEFAULT_TIMEOUT : rawTimeout;
```

---

### Rule #4: Normalize Security Inputs

**The Standard:**

```typescript
// BAD - Partial normalization (like only locking the front door!)
const normalized = input.toLowerCase();

// GOOD - Complete normalization (secure the whole house!)
function normalizeToolName(input: string): string {
  return input
    .toLowerCase()           // Handle case variations
    .replace(/[_-]+/g, '-')  // Normalize separators
    .trim()                  // Remove whitespace
    .normalize('NFKC');      // Handle unicode variants
}
```

---

### Rule #5: Version Numbers Must Match

**The Standard:**

There should be ONE source of truth for version numbers. Not two. Not three. ONE.

```typescript
// package.json is the single source of truth
// Read version from package.json, don't hardcode!

import { version } from '../package.json';

export const PLUGIN_INFO = {
  name: 'springfield-code',
  version,  // Comes from package.json - always in sync!
} as const;
```

---

## Error Handling Standards

### The Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;       // e.g., 'CONFIG_INVALID'
    message: string;    // Human-readable message
    details?: unknown;  // Additional context
  };
  timestamp: string;
}
```

### Error Logging Format

```typescript
logger.error(`[${MODULE}] ${operation} failed`, {
  operation: string,
  error: string,
  context: object,
  timestamp: number,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
});
```

### The Three Commandments of Error Handling

1. **Thou Shalt Log** - Every catch block logs before returning
2. **Thou Shalt Not Swallow** - No empty catch blocks
3. **Thou Shalt Provide Context** - Errors include enough info to debug

---

## Type Safety Standards

### Use Discriminated Unions for Results

```typescript
// BAD - Unclear what's missing vs error
interface Result {
  ready: boolean;
  missing?: string[];
  present?: string[];
  errors?: string[];
}

// GOOD - Type tells you exactly what to expect
type Result =
  | { ready: true; present: string[]; context: string[] }
  | { ready: false; missing: string[]; errors: string[] };
```

### Use Branded Types for Special Values

```typescript
// BAD - Any string can sneak in
function processPath(path: string): void { ... }

// GOOD - Only validated paths accepted
type AbsolutePath = string & { readonly __absolutePath: true };

function validatePath(path: string): AbsolutePath {
  if (!isAbsolute(path)) {
    throw new Error(`Path must be absolute: ${path}`);
  }
  return path as AbsolutePath;
}

function processPath(path: AbsolutePath): void { ... }
```

---

## Documentation Standards

### Keep CLAUDE.md Updated

When you change an API, you MUST update CLAUDE.md:

**Current Problem:**
```
CLAUDE.md documents:   setRalphInitiated(value: boolean)
Actual code has:       requestRalphAuthorization(): SecureToken
```

**The Rule:**
1. Make API change
2. Update CLAUDE.md in same PR
3. Reviewer checks documentation matches code

### Comment Standards

```typescript
// BAD - Comment lies about the code
/**
 * Returns 'info' level by default  // <-- WRONG! Returns 'warn'
 */
function getDefaultLogLevel(): LogLevel {
  return 'warn';
}

// GOOD - Comment matches reality
/**
 * Returns 'warn' level by default (more conservative for production)
 */
function getDefaultLogLevel(): LogLevel {
  return 'warn';
}
```

---

## Testing Standards

### Security Tests Are Mandatory

Every security-related function MUST have tests for:
- Happy path (valid input)
- Invalid input
- Edge cases
- Production vs development behavior

```typescript
describe('_resetForTesting', () => {
  it('clears state in development', () => { ... });
  it('does NOT clear state in production', () => { ... });
  it('handles case variations in NODE_ENV', () => { ... });
  it('handles whitespace in NODE_ENV', () => { ... });
});
```

### The Test Checklist

Before marking a feature complete:
- [ ] Unit tests for core logic
- [ ] Error path tests
- [ ] Edge case tests from Bart's list
- [ ] Security tests from Wiggum's list
- [ ] Integration tests where applicable

---

## Code Organization Standards

### No Duplicate Functions

Marge found `validateRequiredFiles` exists in TWO places with DIFFERENT return types!

**The Rule:**
1. Search before creating
2. One function, one location
3. If variants needed, create options parameter

```typescript
// BAD - Two functions doing similar things
// constants.ts: validateRequiredFiles() => RequiredFilesValidation
// utils/validation.ts: validateRequiredFiles() => DirectoryValidationResult

// GOOD - One function with options
interface ValidationOptions {
  returnFormat: 'simple' | 'detailed';
}

function validateRequiredFiles(
  dir: string,
  options: ValidationOptions = { returnFormat: 'simple' }
): RequiredFilesValidation | DirectoryValidationResult {
  // ...
}
```

### No Duplicate Imports

```typescript
// BAD - Importing everything twice
import { generateHomer } from './generators/homer';
import { generateHomer } from './generators/homer';  // Whoopsie-doodle!

// GOOD - One import per module
import { generateHomer } from './generators/homer';
```

---

## The Flanders Checklist

Before committing code, ask yourself:

1. [ ] **Would I be embarrassed if Jesus saw this code?**
2. [ ] **Does every catch block log something?**
3. [ ] **Are all inputs validated?**
4. [ ] **Do the comments match the code?**
5. [ ] **Is there exactly ONE source of truth?**
6. [ ] **Are security functions tested?**
7. [ ] **Would Homer understand the error message?**

---

## Summary

*folds hands in satisfaction*

These standards aren't about being picky, neighborinos. They're about building a codebase that:

- **Tells the truth** (no silent failures)
- **Validates assumptions** (no blind trust)
- **Documents itself** (CLAUDE.md stays current)
- **Tests its boundaries** (security has coverage)
- **Stays organized** (no duplicates)

Follow these standards, and you'll have a codebase that would make the Good Lord smile!

Okily-dokily!

---

*Generated by Ned Flanders - Standards and Best Practices*
*"Love thy neighbor's code as you love your own!"*
