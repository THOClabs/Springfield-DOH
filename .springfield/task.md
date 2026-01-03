# Current Task: Sprint 1 Week 1 - Configuration Hardening

Prepared By: Lisa Simpson
For: Ralph Wiggum
Date: 2026-01-03

---

## Objective

Ralph, we need you to fix the 4 CRITICAL configuration issues in Week 1 of our remediation plan. These are small, focused fixes that prevent dangerous silent failures.

---

## Context

Ralph, here's what you need to know:

The Springfield-DOH codebase has configuration loading that works... mostly. But there are holes:

1. **NaN Injection:** If someone sets `SPRINGFIELD_TOKEN_TTL_MS=donut`, the token TTL becomes NaN, which breaks everything
2. **Unused Validation:** We have a `validateConfig()` function but never call it
3. **Silent Parse Failures:** If the config JSON is broken, we silently use defaults
4. **Silent Skill Registration:** Skills can fail to register and nobody knows

These are in `springfield-code/src/` directory.

---

## Success Criteria

You'll know you're done when:

1. `config.ts` - The `parseValue()` function returns default when parseInt produces NaN
2. `config.ts` - The `getConfig()` function calls `validateConfig()` and logs warnings
3. `config.ts` - The JSON parse catch block logs the error before returning defaults
4. `skills/index.ts` - The `registerSkillFromFile()` catch block logs before returning null

All existing tests should still pass.

---

## Files to Create or Modify

1. **`springfield-code/src/config.ts`**
   - Line ~85-91: Add `isNaN()` check to `parseValue()`
   - Line ~151-159: Call `validateConfig()` in `getConfig()`
   - Line ~113-125: Add `logger.error()` to JSON parse catch

2. **`springfield-code/src/skills/index.ts`**
   - Line ~153-158: Add `logger.error()` to `registerSkillFromFile()` catch

---

## Constraints

Things you must NOT do:
- Do not change public API signatures
- Do not add new dependencies
- Do not modify the test files
- Do not change the validation logic itself - just call it

---

## Approach Suggestion

I recommend you:

1. First, read the files to understand the current structure
2. Find the `parseValue()` function and add the NaN check:
   ```typescript
   const parsed = parseInt(value, 10);
   if (isNaN(parsed)) {
     logger.warn(`Invalid numeric value for ${key}: "${value}", using default`);
     return DEFAULT_CONFIG[key];
   }
   return parsed;
   ```

3. Find `getConfig()` and add validation call:
   ```typescript
   const config = loadConfigFromEnv();
   const validation = validateConfig(config);
   if (!validation.valid) {
     logger.warn('Configuration validation issues', validation.errors);
   }
   return config;
   ```

4. Find the JSON parse try/catch and add logging:
   ```typescript
   catch (error) {
     logger.error('Failed to parse config file', {
       error: error instanceof Error ? error.message : String(error)
     });
     return defaultConfig;
   }
   ```

5. Do the same for skills/index.ts skill registration

6. Run the tests to verify nothing broke

But use your judgment, Ralph. You're capable!

---

## If You Get Stuck

- If you can't find a file, check if the path is different in the actual codebase
- If tests fail, read the error - it usually tells you exactly what's wrong
- If `logger` isn't imported, add the import at the top
- Remember: we're ADDING logging, not changing behavior

---

## Notes

- These are intentionally small changes
- Each fix is independent - if one is tricky, do the others first
- The goal is visibility, not perfection
- Marge, Wiggum, and Flanders all agreed these are the right first steps

---

Ralph, I believe in you. These are small fixes with big impact. You've got this!

---

*Prepared by Lisa Simpson - Task Specification*
*"Clear objectives lead to clear outcomes."*
