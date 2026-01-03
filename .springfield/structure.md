# Marge's Organization Plan

*Hmmmm... Let me organize this properly.*

## Project Structure

```
springfield-code/
├── src/
│   ├── commands/        ← 47 character commands (GOOD - well organized)
│   ├── hooks/           ← Security layer (NEEDS ATTENTION - 3 critical issues)
│   ├── artifacts/       ← Generation system (MINOR CLEANUP - duplicate imports)
│   ├── skills/          ← Skill registry (NEEDS WORK - silent failures)
│   ├── utils/           ← Shared utilities (NEEDS WORK - error handling)
│   ├── config.ts        ← Configuration (CRITICAL - validation missing)
│   ├── constants.ts     ← Character data (MINOR - duplicate function)
│   ├── types.ts         ← Type definitions (MODERATE - needs refinement)
│   └── index.ts         ← Entry point (MINOR - version mismatch)
├── tests/               ← 100+ test files (EXCELLENT coverage)
├── .springfield/        ← Project artifacts
└── docs/                ← Character manuals
```

## Responsibilities

| Area | Owner | Status | Notes |
|------|-------|--------|-------|
| Security (ralph-gate) | Security Team | CRITICAL | 3 issues need immediate attention |
| Configuration | Core Team | CRITICAL | Validation not being called |
| Error Handling | All Developers | HIGH | Silent failures throughout |
| Type Safety | TypeScript Lead | MEDIUM | Inconsistent patterns |
| Documentation | Tech Writer | MEDIUM | CLAUDE.md outdated |
| Test Coverage | QA Team | LOW | Minor gaps only |

## Things That Worry Me

*Hmmmm...*

### CRITICAL - Fix This Week
- [ ] **NaN Validation Missing** (`config.ts:85-91`) - Invalid env vars cause crashes. This could break production!
- [ ] **Config Validation Not Called** (`config.ts:151-159`) - Users get bad configs silently
- [ ] **Silent Skill Registration** (`skills/index.ts:153-158`) - Skills fail without any warning
- [ ] **Silent Config Parse Failure** (`config.ts:113-125`) - Broken JSON goes unnoticed
- [ ] **Silent Agent Load Failure** (`commands/summon.ts:48-57`) - Characters use fallback dialogue

### HIGH - Fix This Sprint
- [ ] **Tool Name Bypass Potential** (`ralph-gate.ts:353-356`) - Security hole with underscores
- [ ] **Stats Save Failure Silent** (`utils/stats.ts:122-130`) - User data could be lost
- [ ] **Stats Parse Discards Data** (`utils/stats.ts:88-107`) - Corrupted file = lost history
- [ ] **CLAUDE.md Outdated** - Documents deprecated v2.x API, not v3.0.0
- [ ] **Logger Comment Wrong** (`utils/logger.ts:33-34`) - Says "info" but returns "warn"
- [ ] **Version Mismatch** (`index.ts`) - PLUGIN_INFO says 3.0.2, package.json says 3.0.3
- [ ] **Production Guard Tests Missing** - `_resetForTesting()` untested in prod mode

### MEDIUM - Schedule for Next Sprint
- [ ] **Duplicate validateRequiredFiles** - Two functions, different return types
- [ ] **Duplicate Imports** (`artifacts/generators/index.ts`) - All generators imported twice
- [ ] **Inconsistent Placeholder Check** (`springfield.ts:95`) - Uses `includes("[")` not shared util
- [ ] **Missing Ralph Artifact Entry** - `ralph` in tiers but not in `CHARACTER_ARTIFACTS`
- [ ] **Unbounded Prompt Size** (`lisa-ralph-special.ts:61-90`) - Could cause memory issues
- [ ] **PrerequisiteResult Not Discriminated** - Type could be safer
- [ ] **Orphaned Refactoring Comment** (`lisa-ralph-special.ts:19`) - Clean up

### LOW - Technical Debt Backlog
- [ ] Add `@since` version tags consistently
- [ ] Consolidate fragmented test files
- [ ] Document unused `_agentDef` parameter
- [ ] Derive CharacterTier from constants
- [ ] Add AbsolutePath branded type
- [ ] Make UsageStats immutable

## Cleanup Checklist

*Before we move on, let's tidy up:*

### Immediate Actions (Today)
- [ ] Add `isNaN()` check to `parseValue()` in config.ts
- [ ] Call `validateConfig()` in `getConfig()`
- [ ] Add `logger.error()` to catch blocks in skills/index.ts

### This Week
- [ ] Update CLAUDE.md Hook Implementation Pattern section
- [ ] Fix logger default comment
- [ ] Sync PLUGIN_INFO.version with package.json
- [ ] Add production environment tests

### Before Next Release
- [ ] Consolidate duplicate functions
- [ ] Refactor duplicate imports
- [ ] Add missing test coverage
- [ ] Review all silent error handlers

## Organization Rules

*Marge's rules for keeping things tidy:*

1. **No Silent Failures** - Every `catch` block must log before returning null/false
2. **Single Source of Truth** - Types should derive from constants, not duplicate them
3. **Validate Early** - Call validators at system boundaries, not deep inside
4. **Document Versions** - Update CLAUDE.md when APIs change
5. **Test the Guards** - Security guards need tests, even if "unreachable"

## Marge's Assessment

*adjusts hair thoughtfully*

The Springfield-DOH codebase is like our house - mostly well-organized, but there are a few closets that need cleaning out. The security work is excellent (Homer would never think of cryptographic tokens!), but we've let some error handling get sloppy.

**My recommendation:** Start with the CRITICAL items this week. They're the "broken smoke detector" issues - small fixes that prevent big problems. Then work through HIGH items over the sprint.

The codebase scores:
- **Organization**: 8/10 (good module structure)
- **Tidiness**: 6/10 (silent failures are messy)
- **Safety**: 9/10 (security is excellent)
- **Documentation**: 7/10 (needs updates)

*Hmmmm... With a little cleanup, this will be just perfect.*

---

## Dependencies Between Fixes

```
config.ts validation ──┬── Enables safe config loading
                       └── Required before: all config-dependent fixes

skills/index.ts logging ──── Standalone fix, no dependencies

CLAUDE.md update ──── Should wait until: all v3.0 API changes stable

Test additions ──┬── Depends on: source fixes complete
                 └── Can parallel: with documentation updates
```

## Sprint Planning Suggestion

**Sprint 1 (Current):**
- All CRITICAL issues (5 items)
- Version mismatch fix
- CLAUDE.md update

**Sprint 2:**
- Remaining HIGH issues (5 items)
- Start MEDIUM items

**Sprint 3:**
- Complete MEDIUM items
- Address LOW priority technical debt

---

---

## Character Relationship Architecture

*Added during Lisa's Creative Vision Episode*

### The Emotional Web

Characters don't exist in isolation. Their power comes from relationships:

```
                        LISA (Conductor)
                       /    |    \
                      /     |     \
               MARGE      HOMER      BART
             (Organizer) (Questioner) (Chaos)
                  \        |        /
                   \       |       /
                    MAGGIE (Observer)
                        |
            +-----------+-----------+
            |           |           |
         BURNS      FRINK       WIGGUM
        (Resources) (Science)  (Security)
            |           |           |
        SMITHERS    NELSON      KRUSTY
        (Execute)   (Test)    (Entertain)
```

### Character Pairing Dynamics

| Pair | Dynamic | When to Use Together |
|------|---------|---------------------|
| Lisa + Homer | Conductor + Questioner | Breaking complex problems down |
| Marge + Bart | Order + Chaos | Finding structure in edge cases |
| Burns + Smithers | Vision + Execution | Resource planning and scheduling |
| Frink + Nelson | Innovation + Validation | Technical prototypes + tests |
| Wiggum + Bob | Defense + Offense | Security review + adversarial testing |

### Emotional Invocation Guide

| When You Feel... | Summon... | They Provide... |
|------------------|-----------|-----------------|
| Overwhelmed | Marge | Organization and priority |
| Stuck | Homer | The obvious question you missed |
| Too safe | Bart | Assumption-breaking chaos |
| Lost | Lisa | Synthesis and direction |
| Underfunded | Burns | ROI justification |
| Behind schedule | Smithers | Realistic timeline |
| Uncertain | Flanders | Ethical grounding |

### The Developer Journey (Character Flow)

```
1. HOMER (Question) - "What are we even doing?"
        ↓
2. LISA (Plan) - "Here's how we'll approach it"
        ↓
3. MARGE (Organize) - "Let me structure this properly"
        ↓
4. BART (Challenge) - "But what if I do THIS?"
        ↓
5. MAGGIE (Observe) - *logs everything quietly*
        ↓
6. WIGGUM (Secure) - "Let's make sure this is safe"
        ↓
7. NELSON (Test) - "Ha-ha! This edge case fails!"
        ↓
8. LISA (Synthesize) - "Here's what we learned"
        ↓
9. RALPH (Execute) - "I'm helping!"
```

---

*Generated by Marge Simpson - Organization and Structure*
*Enhanced by Lisa Simpson - Creative Vision Episode*
*"A tidy codebase is a happy codebase!"*
*"And characters with relationships feel REAL."*
