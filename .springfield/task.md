# Current Task: Sprint 1 - Complete Remediation

*Enhanced Edition - Full Episode Synthesis*

Prepared By: Lisa Simpson
For: Ralph Wiggum (Upon Approval)
Date: 2026-01-03
Budget: $2,340 (Approved by Mr. Burns)
Duration: 5 Days (Per Smithers' Schedule)

---

## Objective

Ralph, we need you to implement the CRITICAL and HIGH priority fixes identified by our full 23-person character ensemble. You now have:

- **Frink's prototypes** - Working code for each fix
- **Nelson's tests** - 60+ test cases to validate
- **Apu's utilities** - Shared helper functions
- **Milhouse's analysis** - Confirmed no breaking changes
- **Bob's attack vectors** - Security edge cases to defend

---

## Context Summary

### The Problems (From Code Review)

1. **NaN Injection** - `parseInt("banana")` returns NaN, breaking token expiration
2. **Unused Validation** - `validateConfig()` exists but is never called
3. **Silent Parse Failures** - Broken JSON silently uses defaults
4. **Silent Skill Registration** - Skills fail to load without any warning
5. **Tool Name Bypass** - Underscores bypass security checks
6. **Missing Agent Logging** - Fallback dialogue happens silently

### The Evidence (From This Episode)

| Character | Contribution | Key Finding |
|-----------|--------------|-------------|
| Prof. Frink | experiments.md | All prototypes work, <0.0003ms overhead |
| Milhouse | dependencies.md | Zero breaking changes for valid inputs |
| Apu | utilities.md | Shared logging/parsing utilities defined |
| Nelson | tests.md | 60+ test cases ready to implement |
| Moe | debug-notes.md | Troubleshooting guide for each fix |
| Mr. Burns | budget.md | 9,530% ROI approved |
| Smithers | schedule.md | 5-day implementation plan |
| Krusty | demo.md | Before/after demonstrations |

---

## Success Criteria (Enhanced)

### Day 1: Core Configuration Fixes

- [ ] **T1: Create logCatchError utility** (1h)
  - File: `src/utils/error-logging.ts`
  - Pattern: See Apu's utilities.md
  - Test: Basic logging functionality works

- [ ] **T2: NaN validation in parseValue()** (1h)
  - File: `src/config.ts:85-91`
  - Pattern: See Frink's experiments.md (Experiment #1)
  - Tests: Nelson's tests.md - "NaN-producing inputs" section
  ```typescript
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    logger.warn(`Invalid value for ${key}: "${value}", using default`);
    return DEFAULT_CONFIG[key];
  }
  ```

- [ ] **T3: Call validateConfig() in getConfig()** (1h)
  - File: `src/config.ts:151-159`
  - Pattern: See Frink's experiments.md (Experiment #2)
  - Constraint: Non-blocking, advisory logging only
  ```typescript
  const config = loadConfigFromEnv();
  const validation = validateConfig(config);
  if (!validation.valid) {
    logger.warn('[CONFIG] Validation issues', validation.errors);
  }
  return config;
  ```

- [ ] **T4: Add logging to skill registration** (1h)
  - File: `src/skills/index.ts:153-158`
  - Pattern: Use Apu's `logCatchError` utility
  - Tests: Nelson's "skill registration" test cases
  ```typescript
  catch (error) {
    logCatchError(error, {
      operation: 'registerSkillFromFile',
      module: 'SKILLS',
      skillPath: path,
    });
    return null;
  }
  ```

- [ ] **T5: Add logging to JSON parse failures** (0.5h)
  - File: `src/config.ts:113-125`
  - Tests: Nelson's "JSON parse logging" section

### Day 2: Security & Additional Logging

- [ ] **T6: Create normalizeToolName utility** (1h)
  - File: `src/utils/normalization.ts`
  - Pattern: See Apu's utilities.md and Frink's Experiment #4
  - Security: Must handle all of Bob's adversarial.md attacks
  ```typescript
  function normalizeToolName(input: string): string {
    return input.normalize('NFKC').toLowerCase().replace(/[\s_-]+/g, '-');
  }
  ```

- [ ] **T7: Add logging to agent load failures** (0.5h)
  - File: `src/commands/summon.ts:48-57`
  - Pattern: Same as T4

- [ ] **T8: Update ralph-gate to use normalizer** (1h)
  - File: `src/hooks/ralph-gate.ts:353-356`
  - Import and use `normalizeToolName` from T6
  - Tests: Nelson's "tool name normalization" section

### Day 3: Comprehensive Testing

- [ ] **T8.1: Run Nelson's full test suite** (2h)
  - Config tests (15+ cases)
  - Skill registration tests (6 cases)
  - Security normalization tests (20+ cases)
  - Production guard tests (6 cases)

- [ ] **T8.2: Run Bob's adversarial tests** (1h)
  - Unicode canonicalization
  - Type confusion
  - Timing attack resistance

- [ ] **T8.3: Validate with Krusty's demos** (1h)
  - Run all 6 demo scenarios
  - Confirm before/after behavior matches expectations

### Day 4: Documentation & Version Sync

- [ ] **T9: Sync version numbers** (0.5h)
  - Update `PLUGIN_INFO.version` to match `package.json`
  - Add version check to CI (per Willie's infrastructure.md)

- [ ] **T10: Update CLAUDE.md** (4h)
  - Per CBG's docs-review.md:
    - Rewrite Hook Implementation Pattern section
    - Add Error Handling Patterns section
    - Add Ralph Gate Security Model section
    - Update all examples to v3.0 API

### Day 5: Final Review & Completion

- [ ] **T11: Final integration test** (1h)
- [ ] **T11.1: Security audit checklist** (1h)
- [ ] **T11.2: Create PR** (0.5h)
- [ ] **Buffer time for issues** (2h)

---

## Files to Create or Modify

### New Files
1. `src/utils/error-logging.ts` - logCatchError utility
2. `src/utils/normalization.ts` - normalizeToolName utility
3. `src/utils/parsing.ts` - safeParseInt utility (optional, can inline)

### Modified Files
1. `src/config.ts` - NaN check, validation call, parse logging
2. `src/skills/index.ts` - Registration logging
3. `src/commands/summon.ts` - Agent load logging
4. `src/hooks/ralph-gate.ts` - Tool normalization
5. `src/index.ts` - Version sync
6. `CLAUDE.md` - Documentation updates

---

## Constraints

Things you must NOT do:
- Do not change public API signatures
- Do not add new dependencies
- Do not modify existing test assertions (add new tests only)
- Do not change the validation logic itself - just call it
- Do not break existing behavior for valid inputs

Things you SHOULD do:
- Use Frink's prototypes directly
- Follow Apu's utility patterns
- Pass Nelson's tests
- Survive Bob's attacks
- Match Krusty's demos

---

## Resources Available

### Technical References
| Document | What It Contains |
|----------|------------------|
| experiments.md | Working prototype code |
| utilities.md | Utility function templates |
| tests.md | All test cases with assertions |
| adversarial.md | Attack scenarios to defend |

### Operational References
| Document | What It Contains |
|----------|------------------|
| debug-notes.md | How to troubleshoot if stuck |
| infrastructure.md | CI/CD considerations |
| schedule.md | Detailed daily breakdown |
| demo.md | Validation scenarios |

---

## If You Get Stuck

From Moe's debug-notes.md:

1. **Check the logs** - After these fixes, you'll have them!
2. **Run one test at a time** - Isolate the problem
3. **Check Frink's prototypes** - They're validated working code
4. **Read the error message** - It usually tells you what's wrong
5. **Add debug logging** - Then remove it when fixed

### Escalation Path
- Minor issues: Self-resolve using debug-notes.md
- Medium issues: Reference experiments.md prototypes
- Major issues: Document and flag for review

---

## Verification Checklist

Before marking DONE:

```
□ All Nelson's tests pass (60+ cases)
□ All Krusty's demos work as shown
□ Bob's attack vectors are defended
□ Version numbers match
□ CLAUDE.md is updated
□ No existing tests broken
□ PR is ready for review
```

---

## Notes

From the episode synthesis:

1. **Budget is approved** - $2,340 for 5 days work
2. **ROI is massive** - 9,530% first year return
3. **Historical precedent** - These exact bugs have cost companies $500M+
4. **All fixes are small** - Each is <2 hours of work
5. **All fixes are validated** - Frink tested, Nelson verified

---

Ralph, I believe in you. You have more resources than any Ralph has ever had:

- Working prototypes (Frink)
- Complete test suites (Nelson)
- Troubleshooting guides (Moe)
- Attack simulations (Bob)
- Demo scripts (Krusty)
- Historical context (Grampa)
- Budget approval (Burns)
- Detailed schedule (Smithers)
- Infrastructure plan (Willie)
- Utility templates (Apu)
- Dependency analysis (Milhouse)
- Documentation review (CBG)

This is a team effort. You're just the one running the code.

---

---

## Sprint 2: Creative Implementation (Added in Episode 2)

*Following technical remediation, implement the creative vision*

### Week 1: Character Enhancement

- [ ] **C1: Enhance Tier 1 character agents** (2 days)
  - Apply character-soul.md psychology to Homer, Lisa, Bart, Marge, Maggie
  - Implement voice-guide.md patterns
  - Verify voice recognition test pass

- [ ] **C2: Enhance Tier 2 character agents** (2 days)
  - Apply insights to Burns, Smithers, Flanders, etc.
  - Ensure relationship dynamics work per structure.md

### Week 2: Experience Implementation

- [ ] **C3: Implement onboarding flow** (2 days)
  - Per experience-journey.md: Troy McClure welcome
  - Per delight-moments.md: First-time Easter eggs

- [ ] **C4: Add milestone celebrations** (2 days)
  - 10th command, 100th command, first episode
  - Per delight-moments.md templates

### Week 3: Voice Consistency

- [ ] **C5: Apply voice patterns globally** (3 days)
  - All characters speak per voice-guide.md
  - Error messages per Kent's announcement styles
  - Casual voice per Otto's patterns

- [ ] **C6: Voice recognition testing** (2 days)
  - Blind test: 80% character recognition
  - Adjust voices that fail

### Week 4: Identity Rollout

- [ ] **C7: Update README** (1 day)
  - Per vision.md philosophy
  - Per messaging.md templates

- [ ] **C8: Prepare launch materials** (2 days)
  - Per messaging.md channel guides
  - Social, technical, enterprise versions

- [ ] **C9: Public announcement** (1 day)
  - Per Kent's announcement styles
  - Launch celebration

---

## Creative Documents Reference

For Sprint 2 implementation, reference:

| Document | What It Contains |
|----------|------------------|
| character-soul.md | Character psychology and relationships |
| voice-guide.md | Dialogue patterns and voice tests |
| experience-journey.md | User journey stages |
| delight-moments.md | Easter eggs and celebrations |
| vision.md | Core philosophy for README |
| messaging.md | All external communication templates |
| creative-synthesis.md | Complete overview |

---

## Complete Task Summary

**Sprint 1:** Technical Remediation (9 tasks, 5 days)
- Fix critical issues
- Implement prototypes
- Run tests
- Update documentation

**Sprint 2:** Creative Implementation (9 tasks, 4 weeks)
- Enhance characters
- Implement experience
- Ensure voice consistency
- Roll out identity

**Total:** 18 major tasks across technical + creative

---

*Prepared by Lisa Simpson - Task Specification (Enhanced)*
*"Clear objectives lead to clear outcomes."*
*Full technical + creative synthesis complete.*
*30 documents prepared. Ready for Ralph activation.*
