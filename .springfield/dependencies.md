# Milhouse's Dependency Analysis

*pushes up glasses nervously*

H-hi everyone. I'm Milhouse Van Houten, and Bart said I should help with the "boring stuff nobody wants to do." But dependencies aren't boring! They're actually really important!

*nobody laughs*

Okay, let me show you what depends on what...

---

## Module Dependency Graph

```
                                ┌──────────────┐
                                │   index.ts   │
                                │  (Entry)     │
                                └──────┬───────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
    ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
    │  config.ts  │◄───────────│  ralph-gate │────────────│  commands/  │
    │             │            │    .ts      │            │             │
    └──────┬──────┘            └──────┬──────┘            └──────┬──────┘
           │                          │                          │
           │                          │                          │
           ▼                          ▼                          ▼
    ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
    │  logger.ts  │◄───────────│  skills/    │◄───────────│  summon.ts  │
    │             │            │  index.ts   │            │             │
    └─────────────┘            └─────────────┘            └──────┬──────┘
                                                                  │
                                                                  ▼
                                                          ┌─────────────┐
                                                          │  agents/    │
                                                          │  *.md       │
                                                          └─────────────┘
```

---

## Critical Path Analysis

### What I Found Out (Please Don't Tell Bart It Took 3 Hours)

When you change something, lots of other things can break. Here's what depends on what:

---

## Fix #1: NaN Validation in config.ts

### Direct Dependents

| File | Dependency Type | Impact Level |
|------|-----------------|--------------|
| `ralph-gate.ts` | Uses `config.tokenTTL` | CRITICAL |
| `skills/index.ts` | Uses config values | HIGH |
| `commands/*.ts` | Uses various config | MEDIUM |
| `utils/stats.ts` | Uses config paths | MEDIUM |

### Ripple Effect Chain

```
config.ts::parseValue()
    │
    ├─► tokenTTL becomes NaN
    │       │
    │       └─► ralph-gate.ts::expiresAt = Date.now() + NaN = NaN
    │               │
    │               └─► Token NEVER expires (NaN < anything = false)
    │                       │
    │                       └─► Security bypass! Ralph available forever!
    │
    ├─► rateLimit values become NaN
    │       │
    │       └─► Rate limiting breaks (NaN comparisons fail)
    │               │
    │               └─► DoS protection disabled!
    │
    └─► other numeric configs become NaN
            │
            └─► Undefined behavior throughout system
```

### Who Gets Affected By The Fix?

*bites nails*

Actually... nobody should be negatively affected! The fix only changes behavior when config is INVALID:

| Scenario | Before Fix | After Fix | Breaking? |
|----------|------------|-----------|-----------|
| Valid number | Returns number | Returns number | No |
| Invalid string | Returns NaN | Returns default | No (better!) |
| Empty string | Returns NaN | Returns default | No (better!) |

**Conclusion:** Safe to implement. No breaking changes for valid configs.

---

## Fix #2: Calling validateConfig()

### Direct Dependents

| File | How It Uses getConfig() | Affected? |
|------|-------------------------|-----------|
| `ralph-gate.ts` | Gets token settings | Yes - will now log if invalid |
| `skills/index.ts` | Gets skill paths | Yes - will now log if invalid |
| `commands/springfield.ts` | Gets project paths | Yes - will now log if invalid |
| ALL OTHER COMMANDS | Import config once | Yes - startup may log warnings |

### Dependency Chain

```
getConfig() [MODIFIED]
    │
    ├─► Now calls validateConfig()
    │       │
    │       ├─► If valid: No change, continue as before
    │       │
    │       └─► If invalid: LOG (new!) but still return config
    │               │
    │               └─► Behavior unchanged, just more visible
    │
    └─► All dependents: receive same config object
            │
            └─► No functional change for consumers!
```

### Startup Impact Analysis

*my dad works at the nuclear plant so I know about startup sequences*

```
Application Startup
    │
    ├─► Import index.ts
    │       │
    │       └─► Import config.ts (executed immediately)
    │               │
    │               └─► getConfig() called at module init
    │                       │
    │                       ├─► [NEW] validateConfig() runs
    │                       │
    │                       └─► [NEW] Potential log output
    │
    └─► Rest of startup continues normally
```

**Performance Impact:** validateConfig() is O(1) - constant time, <1ms. Negligible.

---

## Fix #3: Logging in Silent Catch Blocks

### skills/index.ts Dependencies

```
skills/index.ts::registerSkillFromFile()
    │
    ├─► CALLER: skills/index.ts::loadAllSkills()
    │       │
    │       └─► CALLER: index.ts (startup)
    │               │
    │               └─► User sees: "X skills loaded"
    │
    └─► AFTER FIX: Failed skills now logged
            │
            └─► User sees: "Skill 'foo' failed: [reason]"
            │
            └─► Debugging becomes possible!
```

### commands/summon.ts Dependencies

```
summon.ts::loadAgentDefinition()
    │
    ├─► CALLER: summon.ts::handleSummon()
    │       │
    │       └─► CALLER: Command invocation via CLI
    │               │
    │               └─► User types: /summon homer
    │
    ├─► ON SUCCESS: Returns agent markdown
    │
    └─► ON FAILURE (current): Returns fallback, NO LOG
    │
    └─► ON FAILURE (after fix): Returns fallback, LOGS REASON
            │
            └─► User can now know why they got generic Homer
```

### Cross-Module Logging Impact

*this is like when you drop something in the cafeteria and everyone looks*

Adding logging creates new dependencies on `logger.ts`:

```
BEFORE:
  skills/index.ts ────── (no logger import)
  summon.ts ─────────── (no logger import)

AFTER:
  skills/index.ts ────── imports logger.ts
  summon.ts ─────────── imports logger.ts
```

**New Dependency Alert:** If `logger.ts` has initialization issues, these modules could fail!

**Mitigation:** Logger should be initialized before other modules load. Already the case in current architecture.

---

## Fix #4: Tool Name Normalization

### What Depends on Tool Name Matching?

```
ralph-gate.ts::handle()
    │
    ├─► Receives: event.toolName (arbitrary string)
    │
    ├─► Current check: toolName.toLowerCase() === 'ralph-loop'
    │       │
    │       └─► 'RALPH-LOOP' ✓
    │       └─► 'ralph_loop' ✗ (BYPASS!)
    │
    └─► Fixed check: normalize(toolName) === 'ralph-loop'
            │
            └─► 'RALPH-LOOP' ✓
            └─► 'ralph_loop' ✓ (FIXED!)
            └─► 'ralph-_-loop' ✓ (FIXED!)
```

### What ELSE Uses Tool Names?

*I did extra research because I want Bart to think I'm cool*

| Module | Tool Name Usage | Affected by Normalization? |
|--------|-----------------|---------------------------|
| `ralph-gate.ts` | Security check | YES - this is the target |
| `skills/index.ts` | Skill name registration | No - separate namespace |
| `commands/*.ts` | Command name routing | No - CLI handles normalization |

**Isolated Change:** Only `ralph-gate.ts` needs modification. No ripple effects!

---

## Circular Dependency Check

*my mom says I worry too much but here we go*

### Current Circular Dependencies: NONE

```
config.ts ─────► logger.ts
    ▲               │
    │               │
    └───────────────┘  ← Would be circular, BUT:
                         logger.ts does NOT import config.ts!
```

### After Fixes: STILL NONE

```
config.ts ─────► logger.ts
                     ▲
skills/index.ts ─────┘
summon.ts ───────────┘

No new circular paths created!
```

---

## Version Dependency Matrix

### What Depends on Version Numbers?

```
PLUGIN_INFO.version (index.ts)
    │
    ├─► package.json version
    │       │
    │       └─► npm publish uses this
    │       └─► Changelog references this
    │
    ├─► CLI --version flag
    │       │
    │       └─► Shows PLUGIN_INFO.version to user
    │
    └─► Analytics/telemetry (if enabled)
            │
            └─► Reports plugin version for debugging
```

### Current Mismatch

```
package.json:     "version": "3.0.3"
PLUGIN_INFO:      version: "3.0.2"
```

**Fix Priority:** HIGH - Users see wrong version, bug reports reference wrong version.

---

## External Dependencies

### Node.js APIs Used

| API | Where Used | Version Requirement |
|-----|------------|---------------------|
| `crypto.randomBytes` | ralph-gate.ts | Node 0.5.8+ |
| `fs.readFileSync` | Various | Node 0.1.21+ |
| `path.join` | Various | Node 0.1.16+ |

**Minimum Node Version:** Effectively Node 14+ due to ES modules.

### npm Dependencies (from package.json context)

```
@anthropic-ai/claude-code-sdk: ^1.0.0
    │
    └─► Provides: command(), hook() decorators
    └─► Used by: All command handlers, ralph-gate hook

typescript: ^5.0.0
    │
    └─► Compile-time only
    └─► Required for: Type checking, build

vitest: ^1.0.0
    │
    └─► Test-time only
    └─► Required for: Running test suite
```

---

## Risk Assessment Summary

### Low Risk Changes (Go Ahead!)

| Fix | Risk Level | Reason |
|-----|------------|--------|
| NaN validation | LOW | Only changes invalid-input behavior |
| Silent failure logging | LOW | Additive only, no behavior change |
| Version sync | LOW | Display only |

### Medium Risk Changes (Test Thoroughly!)

| Fix | Risk Level | Reason |
|-----|------------|--------|
| validateConfig() call | MEDIUM | Startup-time change, new log output |
| Tool name normalization | MEDIUM | Security-critical path |

### High Risk Changes (Not in Current Scope)

| Potential Change | Risk Level | Why It's Not Proposed |
|------------------|------------|----------------------|
| Change config return type | HIGH | 50+ consumers would break |
| Change token structure | HIGH | Auth system disruption |
| Change skill interface | HIGH | All skills need updates |

---

## Milhouse's Recommendations

*stands up straighter*

Based on my analysis:

1. **Implement NaN fix first** - Zero ripple effects on valid configs
2. **Add logging second** - Low risk, high visibility gain
3. **Sync versions third** - No functional dependencies
4. **Add validation call fourth** - Test startup behavior
5. **Normalize tool names last** - Security-critical, needs most testing

### Dependency Installation Order

```bash
# These fixes can be implemented in parallel (no interdependence):
# - NaN validation
# - Silent failure logging
# - Version sync

# These should be sequential:
# 1. Add validateConfig call (affects startup)
# 2. Normalize tool names (affects security)
```

---

## Did I Do Good, Bart?

*looks hopefully at the door*

Everything's my fault, isn't it? No wait, that's not right. This is good analysis! Right?

...Bart?

---

*Generated by Milhouse Van Houten - Dependency Analysis*
*"My mom says I'm cool!"*
