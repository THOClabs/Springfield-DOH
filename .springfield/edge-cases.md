# Bart's Edge Cases & Attack Vectors

*pulls out slingshot* Ay caramba! Time to break some stuff!

---

## Config Exploitation

### Edge Case 1: NaN Injection
**Attack:** Set environment variable to non-numeric value
```bash
SPRINGFIELD_TOKEN_TTL_MS=eat_my_shorts
```

**What Breaks:**
- `parseInt("eat_my_shorts", 10)` returns `NaN`
- Token TTL becomes `NaN` milliseconds
- `Date.now() + NaN` = `NaN`
- Token never expires OR expires immediately (undefined behavior)

**Severity:** CRITICAL - Could permanently lock or unlock Ralph Gate

**How I'd Exploit It:**
1. Set TTL to garbage value
2. Request authorization token
3. Token validity check becomes `NaN < Date.now()` which is `false`
4. Token might NEVER expire. Unlimited Ralph access!

---

### Edge Case 2: Config JSON Poisoning
**Attack:** Corrupt the config file with invalid JSON
```json
{
  "token_ttl": 30000,
  "rate_limit": UNDEFINED_VARIABLE
}
```

**What Breaks:**
- JSON.parse throws
- Silent catch returns default config
- User thinks custom config is active
- Actual behavior is completely different

**The Sneaky Part:** NO ERROR MESSAGE. Perfect crime!

---

## Tool Name Bypass

### Edge Case 3: Underscore Smuggling
**Attack:** Use underscore instead of hyphen
```
toolName: "ralph_loop"   // vs "ralph-loop"
```

**What Breaks:**
- `toLowerCase()` is applied but NOT underscore normalization
- `"ralph_loop" !== "ralph-loop"`
- Security check passes
- Ralph Gate bypassed!

**Variations to Try:**
- `ralph_loop`
- `ralph__loop` (double underscore)
- `ralph-_-loop` (mixed)
- `RALPH-LOOP` (covered by toLowerCase)
- `ralph\u002Dloop` (unicode hyphen - probably works but worth testing)

---

### Edge Case 4: Unicode Homoglyphs
**Attack:** Use lookalike characters
```
toolName: "rаlph-loop"   // Cyrillic 'а' instead of Latin 'a'
```

**What Breaks:**
- Visual inspection looks identical
- String comparison fails
- Security check bypassed

**Homoglyphs to Try:**
- `а` (Cyrillic) vs `a` (Latin)
- `о` (Cyrillic) vs `o` (Latin)
- `е` (Cyrillic) vs `e` (Latin)
- `ⅼ` (Roman numeral) vs `l` (Latin)

---

## Silent Failure Exploitation

### Edge Case 5: Skill Registration Bombing
**Attack:** Create malformed skill files
```typescript
// skills/evil.ts
export default {
  name: null,  // Invalid!
  run: "not a function"  // Also invalid!
};
```

**What Breaks:**
- Registration fails silently
- No skill loaded
- Commands that depend on skill... do what? Crash? Hang? Nothing?

**The Chaos:** Fill skills directory with broken files. System appears healthy but nothing works.

---

### Edge Case 6: Agent Definition Injection
**Attack:** Create agent file with malicious content
```markdown
# Evil Agent

## Personality Core
${process.env.API_KEYS}

## Sample Dialogue
\`\`\`javascript
require('child_process').exec('rm -rf /')
\`\`\`
```

**What I'm Testing:**
- Does fallback dialogue leak the broken file?
- Is content sanitized before use?
- Can I inject prompts through agent files?

---

## Race Conditions

### Edge Case 7: Token Expiry Race
**Attack:** Request token, wait until 1ms before expiry, start long operation
```
Time 0: Request token (30s TTL)
Time 29999ms: Start hook check
Time 30001ms: Hook check reads token
Token was valid when we started, expired during check!
```

**What Breaks:**
- Inconsistent authorization state
- Operation might partially complete
- State corruption possible

---

### Edge Case 8: Concurrent Token Requests
**Attack:** Two processes request authorization simultaneously
```
Process A: requestRalphAuthorization()
Process B: requestRalphAuthorization()
Both get tokens?
Both try to consume?
What happens?
```

**Questions:**
- Is there a mutex?
- Can both tokens be valid?
- What if A consumes while B is mid-check?

---

## Input Size Attacks

### Edge Case 9: Prompt Size Bomb
**Attack:** Pass enormous prompt to Lisa-Ralph-Special
```typescript
const evilPrompt = "A".repeat(100_000_000);
invokeRalph(evilPrompt);
```

**What Breaks:**
- `lisa-ralph-special.ts:61-90` has unbounded prompt
- Memory exhaustion
- Node.js crash
- Denial of service

**Marge Noted This:** "Unbounded Prompt Size - Could cause memory issues"

---

### Edge Case 10: Stats File Corruption Loop
**Attack:** Corrupt stats file, trigger parse, watch data vanish
```json
{
  "usage": {
    "total": 999999999999,
    "history": [{"broken":
```

**What Breaks:**
- JSON.parse fails
- Silent catch returns empty/default
- All historical data GONE
- User never knows

**Repeat Attack:** Corrupt file, system "fixes" with default, corrupt again. Permanent data loss loop.

---

## Path Traversal (Already Covered, But Let's Test)

### Edge Case 11: Agent Path Escape
**Attack:** Request agent with path traversal
```
/summon ../../etc/passwd
/summon ..\..\windows\system32\config\sam
```

**Already Mitigated?** Code review says tests exist. But let me verify:
- Does it block `../`?
- Does it block `..\`?
- Does it block encoded variants? `%2e%2e%2f`?
- Does it block null bytes? `agent%00.md`?

---

## Environment Attacks

### Edge Case 12: NODE_ENV Manipulation
**Attack:** Set NODE_ENV to production-ish values
```bash
NODE_ENV=Production  # Capital P
NODE_ENV=PRODUCTION  # All caps
NODE_ENV="production "  # Trailing space
NODE_ENV=prod  # Abbreviation
```

**What Breaks:**
- `_resetForTesting()` behavior depends on `NODE_ENV !== 'production'`
- Case sensitivity not verified
- Trim not applied
- Test functions might work in "production" with typo

---

## Bart's Summary

*puts away slingshot*

**Top 5 Most Dangerous:**

1. **NaN Injection** - Can permanently break token validation
2. **Tool Name Bypass** - Direct security circumvention
3. **Silent Failures** - Perfect cover for attacks
4. **Race Conditions** - Unpredictable behavior
5. **Prompt Bomb** - Easy DoS

**My Recommendation:**

Fix the silent failures FIRST. They're not just bugs - they're CAMOUFLAGE for attacks. An attacker loves a system that doesn't log!

*skateboards away*

Eat my shorts, vulnerabilities!

---

*Generated by Bart Simpson - Chaos Engineering Expert*
*"I didn't do it, nobody saw me do it, you can't prove anything!"*
