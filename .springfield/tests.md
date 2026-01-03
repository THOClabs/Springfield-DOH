# Nelson's Test Cases

*cracks knuckles*

HA-HA! Time to break stuff and prove it's broken!

Look, I used to just laugh at people when their code failed. But Lisa said testing is "constructive destruction." I can get behind that.

---

## Test Suite Overview

### What We're Testing

From the code-review.md and task.md:

| Fix | What to Test | Priority |
|-----|--------------|----------|
| NaN Validation | `parseValue()` with garbage input | CRITICAL |
| validateConfig() Call | Config loading behavior | CRITICAL |
| JSON Parse Logging | Error visibility | CRITICAL |
| Skill Registration Logging | Failure visibility | CRITICAL |
| Tool Name Normalization | Security bypass prevention | HIGH |

---

## Test File #1: config.test.ts

### Testing NaN Validation

```typescript
// tests/config.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseValue, getConfig, DEFAULT_CONFIG } from '../src/config';
import { logger } from '../src/utils/logger';

// Mock the logger
vi.mock('../src/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('parseValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('valid numeric inputs', () => {
    it('parses valid integers correctly', () => {
      // HA-HA! This better work!
      expect(parseValue('30000', 'TOKEN_TTL_MS')).toBe(30000);
      expect(parseValue('0', 'TOKEN_TTL_MS')).toBe(0);
      expect(parseValue('999999', 'RATE_LIMIT_WINDOW')).toBe(999999);
    });

    it('parses integers with leading zeros', () => {
      // Edge case - leading zeros
      expect(parseValue('007', 'TOKEN_TTL_MS')).toBe(7);
    });

    it('parses negative numbers', () => {
      // May or may not be allowed - depends on validation
      expect(parseValue('-100', 'TOKEN_TTL_MS')).toBe(-100);
    });
  });

  describe('NaN-producing inputs (THE MAIN EVENT)', () => {
    it('returns default for non-numeric string', () => {
      // HA-HA! "donut" isn't a number!
      const result = parseValue('donut', 'TOKEN_TTL_MS');
      expect(result).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
      expect(logger.warn).toHaveBeenCalled();
    });

    it('returns default for empty string', () => {
      const result = parseValue('', 'TOKEN_TTL_MS');
      expect(result).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
      expect(logger.warn).toHaveBeenCalled();
    });

    it('returns default for whitespace-only string', () => {
      const result = parseValue('   ', 'TOKEN_TTL_MS');
      expect(result).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
    });

    it('returns default for "NaN" literal', () => {
      // Someone might literally type "NaN"
      const result = parseValue('NaN', 'TOKEN_TTL_MS');
      expect(result).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
    });

    it('returns default for "Infinity"', () => {
      const result = parseValue('Infinity', 'TOKEN_TTL_MS');
      expect(result).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
    });

    it('returns default for undefined-ish strings', () => {
      expect(parseValue('undefined', 'TOKEN_TTL_MS')).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
      expect(parseValue('null', 'TOKEN_TTL_MS')).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
    });
  });

  describe('edge cases that parseInt handles weirdly', () => {
    it('parses "123abc" as 123 (parseInt behavior)', () => {
      // parseInt stops at first non-digit
      // This might be acceptable or not - document the decision!
      const result = parseValue('123abc', 'TOKEN_TTL_MS');
      expect(result).toBe(123); // Current behavior
    });

    it('parses "1e10" as 1 (not 10 billion)', () => {
      // HA-HA! parseInt doesn't do scientific notation!
      const result = parseValue('1e10', 'TOKEN_TTL_MS');
      expect(result).toBe(1);
    });

    it('parses "3.14159" as 3 (truncates decimals)', () => {
      const result = parseValue('3.14159', 'TOKEN_TTL_MS');
      expect(result).toBe(3);
    });
  });

  describe('logging behavior', () => {
    it('logs warning with context when falling back to default', () => {
      parseValue('garbage', 'TOKEN_TTL_MS');

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('TOKEN_TTL_MS'),
        expect.objectContaining({
          received: 'garbage',
        })
      );
    });

    it('does not log for valid values', () => {
      parseValue('30000', 'TOKEN_TTL_MS');
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
```

### Testing validateConfig() Call

```typescript
describe('getConfig', () => {
  describe('validation integration', () => {
    it('calls validateConfig on loaded config', () => {
      // We need to verify validateConfig is actually called
      const validateConfigSpy = vi.spyOn(configModule, 'validateConfig');

      getConfig();

      expect(validateConfigSpy).toHaveBeenCalled();
    });

    it('logs warning when validation fails', () => {
      process.env.SPRINGFIELD_TOKEN_TTL_MS = '100'; // Too short - should warn

      getConfig();

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('validation'),
        expect.anything()
      );
    });

    it('still returns config even when validation fails', () => {
      // Validation is advisory, not blocking
      process.env.SPRINGFIELD_TOKEN_TTL_MS = '100';

      const config = getConfig();

      expect(config).toBeDefined();
      expect(config.tokenTTL).toBe(100);
    });
  });
});
```

---

## Test File #2: JSON Parse Logging

```typescript
// tests/config-file-loading.test.ts
import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import { loadConfigFromFile, DEFAULT_CONFIG } from '../src/config';
import { logger } from '../src/utils/logger';

vi.mock('fs');
vi.mock('../src/utils/logger');

describe('loadConfigFromFile', () => {
  describe('malformed JSON handling', () => {
    it('logs error for invalid JSON', () => {
      // HA-HA! This JSON is busted!
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('{broken json');

      const config = loadConfigFromFile('/path/to/config.json');

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('parse'),
        expect.objectContaining({
          error: expect.any(String),
        })
      );
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('logs error with file path for context', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('{"invalid":}');

      loadConfigFromFile('/path/to/broken.json');

      expect(logger.error).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          filePath: '/path/to/broken.json',
        })
      );
    });

    it('returns defaults for empty file', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('');

      const config = loadConfigFromFile('/path/to/empty.json');

      expect(config).toEqual(DEFAULT_CONFIG);
      expect(logger.error).toHaveBeenCalled();
    });

    it('handles null in JSON', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('null');

      const config = loadConfigFromFile('/path/to/null.json');

      // Behavior TBD - should it use defaults?
      expect(config).toBeDefined();
    });
  });

  describe('file system errors', () => {
    it('logs error when file read fails', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const config = loadConfigFromFile('/path/to/secret.json');

      expect(logger.error).toHaveBeenCalled();
      expect(config).toEqual(DEFAULT_CONFIG);
    });
  });
});
```

---

## Test File #3: Skill Registration Logging

```typescript
// tests/skills-registration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerSkillFromFile } from '../src/skills';
import { logger } from '../src/utils/logger';

vi.mock('../src/utils/logger');

describe('registerSkillFromFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('failure logging', () => {
    it('logs error when skill file is missing', async () => {
      // HA-HA! File doesn't exist!
      const result = await registerSkillFromFile('/nonexistent/skill.ts');

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('skill'),
        expect.objectContaining({
          skillPath: '/nonexistent/skill.ts',
        })
      );
    });

    it('logs error when skill has invalid export', async () => {
      // Mock a file that exists but has no default export
      vi.doMock('/bad-skill.ts', () => ({}), { virtual: true });

      const result = await registerSkillFromFile('/bad-skill.ts');

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalled();
    });

    it('logs error when skill throws during registration', async () => {
      // Mock a skill that throws
      vi.doMock('/exploding-skill.ts', () => ({
        default: () => { throw new Error('BOOM!'); }
      }), { virtual: true });

      const result = await registerSkillFromFile('/exploding-skill.ts');

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          error: expect.stringContaining('BOOM'),
        })
      );
    });

    it('includes skill path in error context', async () => {
      const result = await registerSkillFromFile('/path/to/broken-skill.ts');

      expect(logger.error).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          skillPath: '/path/to/broken-skill.ts',
        })
      );
    });
  });

  describe('success cases (for comparison)', () => {
    it('does not log error for successful registration', async () => {
      vi.doMock('/good-skill.ts', () => ({
        default: {
          name: 'test-skill',
          run: vi.fn(),
        }
      }), { virtual: true });

      const result = await registerSkillFromFile('/good-skill.ts');

      expect(result).not.toBeNull();
      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});
```

---

## Test File #4: Tool Name Normalization

```typescript
// tests/ralph-gate-normalization.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeToolName, isRalphTool } from '../src/utils/normalization';

describe('normalizeToolName', () => {
  describe('case normalization', () => {
    it('converts uppercase to lowercase', () => {
      expect(normalizeToolName('RALPH-LOOP')).toBe('ralph-loop');
      expect(normalizeToolName('Ralph-Loop')).toBe('ralph-loop');
      expect(normalizeToolName('RALPH')).toBe('ralph');
    });
  });

  describe('separator normalization (BART\'S BYPASS TESTS)', () => {
    it('converts underscores to hyphens', () => {
      // HA-HA! No more bypasses!
      expect(normalizeToolName('ralph_loop')).toBe('ralph-loop');
      expect(normalizeToolName('ralph_wiggum')).toBe('ralph-wiggum');
    });

    it('handles double underscores', () => {
      expect(normalizeToolName('ralph__loop')).toBe('ralph-loop');
    });

    it('handles mixed separators', () => {
      expect(normalizeToolName('ralph-_-loop')).toBe('ralph-loop');
      expect(normalizeToolName('ralph_-_loop')).toBe('ralph-loop');
    });

    it('handles spaces', () => {
      expect(normalizeToolName('ralph loop')).toBe('ralph-loop');
      expect(normalizeToolName('ralph  loop')).toBe('ralph-loop');
    });
  });

  describe('unicode normalization (WIGGUM\'S CONCERNS)', () => {
    it('normalizes Cyrillic lookalikes', () => {
      // Cyrillic 'а' (U+0430) looks like Latin 'a'
      expect(normalizeToolName('rаlph-loop')).toBe('ralph-loop'); // Cyrillic а
    });

    it('normalizes other homoglyphs', () => {
      // These should all become 'ralph-loop'
      expect(normalizeToolName('rаlph-loop')).toBe('ralph-loop'); // Cyrillic а
      expect(normalizeToolName('rаlрh-loop')).toBe('ralph-loop'); // Cyrillic а and р
    });
  });

  describe('whitespace handling', () => {
    it('trims leading and trailing whitespace', () => {
      expect(normalizeToolName('  ralph-loop  ')).toBe('ralph-loop');
      expect(normalizeToolName('\tralph-loop\n')).toBe('ralph-loop');
    });
  });

  describe('special characters', () => {
    it('removes non-alphanumeric characters', () => {
      expect(normalizeToolName('ralph@loop')).toBe('ralphloop');
      expect(normalizeToolName('ralph!loop')).toBe('ralphloop');
      expect(normalizeToolName('ralph#loop')).toBe('ralphloop');
    });

    it('handles null bytes', () => {
      expect(normalizeToolName('ralph\x00loop')).toBe('ralphloop');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(normalizeToolName('')).toBe('');
    });

    it('returns empty string for null/undefined', () => {
      expect(normalizeToolName(null as any)).toBe('');
      expect(normalizeToolName(undefined as any)).toBe('');
    });

    it('handles only separators', () => {
      expect(normalizeToolName('---')).toBe('');
      expect(normalizeToolName('___')).toBe('');
    });
  });
});

describe('isRalphTool', () => {
  describe('should return true for Ralph tools', () => {
    it('matches standard names', () => {
      expect(isRalphTool('ralph-loop')).toBe(true);
      expect(isRalphTool('ralph')).toBe(true);
      expect(isRalphTool('ralph-wiggum')).toBe(true);
    });

    it('matches with case variations', () => {
      expect(isRalphTool('RALPH-LOOP')).toBe(true);
      expect(isRalphTool('Ralph-Loop')).toBe(true);
    });

    it('matches with underscore bypass attempts', () => {
      // HA-HA! Nice try, Bart!
      expect(isRalphTool('ralph_loop')).toBe(true);
      expect(isRalphTool('ralph_wiggum')).toBe(true);
    });
  });

  describe('should return false for non-Ralph tools', () => {
    it('rejects unrelated tools', () => {
      expect(isRalphTool('homer')).toBe(false);
      expect(isRalphTool('lisa')).toBe(false);
      expect(isRalphTool('summon')).toBe(false);
    });

    it('rejects partial matches', () => {
      expect(isRalphTool('ral')).toBe(false);
      expect(isRalphTool('alph')).toBe(false);
    });
  });
});
```

---

## Test File #5: Production Guard Tests

```typescript
// tests/ralph-gate-production.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  _resetForTesting,
  requestRalphAuthorization,
  canInvokeRalph
} from '../src/hooks/ralph-gate';

describe('_resetForTesting production guard', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('clears state in development', () => {
    process.env.NODE_ENV = 'development';

    // Get a token first
    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);

    // Reset should work
    _resetForTesting();
    expect(canInvokeRalph()).toBe(false);
  });

  it('clears state in test', () => {
    process.env.NODE_ENV = 'test';

    requestRalphAuthorization();
    _resetForTesting();

    expect(canInvokeRalph()).toBe(false);
  });

  it('does NOT clear state in production', () => {
    // HA-HA! Can't break production!
    process.env.NODE_ENV = 'production';

    requestRalphAuthorization();
    expect(canInvokeRalph()).toBe(true);

    _resetForTesting();

    // Should STILL be true - reset blocked in prod!
    expect(canInvokeRalph()).toBe(true);
  });

  describe('NODE_ENV edge cases', () => {
    it('treats uppercase PRODUCTION as production', () => {
      process.env.NODE_ENV = 'PRODUCTION';

      requestRalphAuthorization();
      _resetForTesting();

      expect(canInvokeRalph()).toBe(true); // Reset blocked
    });

    it('trims whitespace from NODE_ENV', () => {
      process.env.NODE_ENV = '  production  ';

      requestRalphAuthorization();
      _resetForTesting();

      expect(canInvokeRalph()).toBe(true); // Reset blocked
    });

    it('treats "prod" as NOT production (exact match required)', () => {
      process.env.NODE_ENV = 'prod';

      requestRalphAuthorization();
      _resetForTesting();

      expect(canInvokeRalph()).toBe(false); // Reset allowed
    });
  });
});
```

---

## Test File #6: Race Condition Tests

```typescript
// tests/ralph-gate-race.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  requestRalphAuthorization,
  authorizeRalph,
  _resetForTesting
} from '../src/hooks/ralph-gate';

describe('token race conditions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetForTesting();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects token that expires during authorization', async () => {
    // Get token with 30s TTL
    const token = requestRalphAuthorization();
    expect(token).not.toBeNull();

    // Advance time to 29.9 seconds (just before expiry)
    vi.advanceTimersByTime(29900);

    // Token should still be valid at this moment
    expect(authorizeRalph(token!)).toBe(true);

    // But if we try again after expiry...
    _resetForTesting();
    const token2 = requestRalphAuthorization();
    vi.advanceTimersByTime(30100); // Past TTL

    // This should fail - token expired!
    expect(authorizeRalph(token2!)).toBe(false);
  });

  it('handles concurrent token requests', () => {
    // Two requests at the "same" time
    const token1 = requestRalphAuthorization();
    const token2 = requestRalphAuthorization();

    // Both should get tokens (implementation dependent)
    // Or only first gets token (single-slot implementation)
    // Document whichever behavior we choose!

    // Current expectation: second request overwrites first
    expect(token2).not.toBeNull();
    expect(authorizeRalph(token2!)).toBe(true);
  });
});
```

---

## Mock Scenarios Summary

### Scenario 1: Config Poisoning

```typescript
describe('config poisoning scenario', () => {
  it('survives complete config garbage', () => {
    // Bart's attack: garbage everything
    process.env.SPRINGFIELD_TOKEN_TTL_MS = 'eat_my_shorts';
    process.env.SPRINGFIELD_RATE_LIMIT = 'aycaramba';
    process.env.SPRINGFIELD_LOG_LEVEL = '💀';

    const config = getConfig();

    // Should get defaults, not NaN or crashes
    expect(config.tokenTTL).toBe(DEFAULT_CONFIG.TOKEN_TTL_MS);
    expect(isNaN(config.tokenTTL)).toBe(false);

    // Should have logged warnings
    expect(logger.warn).toHaveBeenCalled();
  });
});
```

### Scenario 2: Security Bypass Attempt

```typescript
describe('bypass attempt scenario', () => {
  it('blocks all Ralph bypass variations', async () => {
    const bypassAttempts = [
      'ralph_loop',
      'RALPH_LOOP',
      'ralph__loop',
      'ralph-_-loop',
      'ralph loop',
      'rаlph-loop', // Cyrillic
    ];

    for (const attempt of bypassAttempts) {
      const event = { toolName: attempt };
      const result = await ralphGateHook.handle(event, {});

      // Without Lisa's authorization, all should be blocked
      expect(result.allowed).toBe(false);
    }
  });
});
```

---

## Nelson's Test Checklist

*punches locker for emphasis*

| Test Category | Count | Status |
|---------------|-------|--------|
| NaN Validation | 15+ | HA-HA! |
| validateConfig Call | 5 | HA-HA! |
| JSON Parse Logging | 6 | HA-HA! |
| Skill Registration | 6 | HA-HA! |
| Tool Normalization | 20+ | HA-HA! |
| Production Guards | 6 | HA-HA! |
| Race Conditions | 3 | HA-HA! |
| **TOTAL** | **60+** | **HA-HA!** |

---

## Final Word

*crosses arms*

You want your code to not suck? Run these tests. All of them. Every time.

If any of these fail, that means YOUR CODE fails. And when code fails...

**HA-HA!**

---

*Generated by Nelson Muntz - Test Case Development*
*"Smell ya later!"*
