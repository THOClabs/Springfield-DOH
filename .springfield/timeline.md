# Principal Skinner's Remediation Timeline

*straightens tie nervously*

ATTENTION! Based on Mrs. Simpson's structural analysis and input from our... colorful cast of reviewers, I've prepared a comprehensive remediation schedule.

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Issues | 44 |
| Critical | 9 |
| High | 12 |
| Medium | 15 |
| Low | 8 |
| Sprints Required | 3 |

---

## Sprint 1: Critical Stabilization

**Theme:** Stop the bleeding. Fix issues that could cause security breaches or data corruption.

### Week 1: Configuration & Validation

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Add NaN validation to `parseValue()` | `config.ts:85-91` | CRITICAL | Small |
| Call `validateConfig()` in `getConfig()` | `config.ts:151-159` | CRITICAL | Small |
| Add logging to config parse failures | `config.ts:113-125` | CRITICAL | Small |
| Add logging to skill registration | `skills/index.ts:153-158` | CRITICAL | Small |

**Deliverable:** Configuration loading is validated and logged

**Verification:**
- [ ] Unit tests for NaN handling
- [ ] Integration test for config loading
- [ ] Log output verification

### Week 2: Security Hardening

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Normalize tool names (underscores) | `ralph-gate.ts:353-356` | HIGH | Small |
| Add logging to agent load failures | `summon.ts:48-57` | CRITICAL | Small |
| Sync PLUGIN_INFO.version with package.json | `index.ts` | HIGH | Trivial |
| Fix logger default comment | `logger.ts:33-34` | HIGH | Trivial |

**Deliverable:** Security bypasses closed, version consistency achieved

**Verification:**
- [ ] Security tests for tool name normalization
- [ ] Manual test of agent loading with broken file
- [ ] Version check in CI

### Week 3: Documentation Sprint

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Update CLAUDE.md Hook Implementation section | `CLAUDE.md` | HIGH | Medium |
| Document v3.0 API changes | `CLAUDE.md` | HIGH | Medium |
| Review and update README | `README.md` | MEDIUM | Medium |

**Deliverable:** Documentation matches code reality

**Verification:**
- [ ] API examples in CLAUDE.md actually work
- [ ] New developer can follow setup without errors

---

## Sprint 2: Error Handling & Testing

**Theme:** Make failures visible and verifiable.

### Week 4: Silent Failure Remediation

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Add stats save failure logging | `utils/stats.ts:122-130` | HIGH | Small |
| Add stats parse failure logging | `utils/stats.ts:88-107` | HIGH | Small |
| Add skill loading error differentiation | `skills/index.ts:119-129` | MEDIUM | Medium |

**Deliverable:** No operation fails silently

### Week 5: Test Gap Closure

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Add production guard tests | `ralph-gate.test.ts` | HIGH | Medium |
| Add race condition tests | `ralph-gate.test.ts` | MEDIUM | Medium |
| Add filesystem error path tests | `artifacts/` | MEDIUM | Medium |
| Add malformed event tests | `ralph-gate.test.ts` | MEDIUM | Small |

**Deliverable:** Critical security paths have test coverage

### Week 6: Type System Improvements

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Create discriminated union for PrerequisiteResult | `types.ts` | MEDIUM | Medium |
| Derive CharacterTier from constants | `types.ts` | LOW | Small |
| Add AbsolutePath branded type | `types.ts` | MEDIUM | Medium |

**Deliverable:** Type system prevents invalid states

---

## Sprint 3: Technical Debt Cleanup

**Theme:** Polish and consolidate.

### Week 7: Code Consolidation

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Consolidate duplicate `validateRequiredFiles` | `constants.ts`, `validation.ts` | MEDIUM | Medium |
| Remove duplicate imports | `generators/index.ts` | MEDIUM | Small |
| Add missing `ralph` to CHARACTER_ARTIFACTS | `constants.ts` | MEDIUM | Trivial |
| Use `hasTemplatePlaceholders()` consistently | `springfield.ts:95` | MEDIUM | Small |

**Deliverable:** Single source of truth for all utilities

### Week 8: Cleanup & Polish

| Task | File | Priority | Est. Effort |
|------|------|----------|-------------|
| Remove orphaned refactoring comments | `lisa-ralph-special.ts:19` | LOW | Trivial |
| Add `@since` version tags | Various | LOW | Medium |
| Consolidate fragmented test files | `tests/` | LOW | Medium |
| Document unused `_agentDef` parameter | Various | LOW | Small |

**Deliverable:** Clean, well-documented codebase

### Week 9: Buffer & Verification

| Task | Est. Effort |
|------|-------------|
| Address any issues found during Sprint 1-2 | Variable |
| Full regression testing | Medium |
| Security audit verification | Medium |
| Documentation final review | Small |

**Deliverable:** Release-ready codebase

---

## Dependency Graph

```
Week 1 ─────────────────────────────┐
│ Config validation                 │
│ NaN checks                        │
└───────────────────────────────────┘
        │
        ▼
Week 2 ─────────────────────────────┐
│ Security hardening                │
│ (depends on validated config)     │
└───────────────────────────────────┘
        │
        ├─────────────────┐
        ▼                 ▼
Week 3 ─────────    Week 4 ─────────
│ Docs update │    │ Error handling│
│ (parallel)  │    │ logging       │
└─────────────┘    └───────────────┘
        │                 │
        └────────┬────────┘
                 ▼
Week 5 ─────────────────────────────┐
│ Test coverage                     │
│ (needs stable code to test)       │
└───────────────────────────────────┘
        │
        ▼
Weeks 6-9: Refinement & Polish
```

---

## Risk Factors

### Risk 1: Scope Creep
**Mitigation:** Stick to the issue list. New issues go to backlog.

### Risk 2: Breaking Changes
**Mitigation:** Run full test suite after each week's changes.

### Risk 3: Documentation Drift
**Mitigation:** Update docs in same PR as code changes.

### Risk 4: Resource Availability
**Mitigation:** Critical issues are small and self-contained.

---

## Success Criteria Per Sprint

### Sprint 1 Complete When:
- [ ] Config loading is validated and logged
- [ ] No NaN values in configuration
- [ ] Tool name bypass is closed
- [ ] CLAUDE.md matches v3.0 API

### Sprint 2 Complete When:
- [ ] No silent failures in stats or skills
- [ ] Production guard has test coverage
- [ ] Type system improvements merged

### Sprint 3 Complete When:
- [ ] No duplicate functions
- [ ] Code review shows no duplicate imports
- [ ] All LOW priority items addressed
- [ ] Full regression passes

---

## Milestones

| Milestone | Target | Criteria |
|-----------|--------|----------|
| M1: Stable | End of Sprint 1 | All CRITICAL issues resolved |
| M2: Auditable | End of Sprint 2 | All HIGH issues resolved, test coverage adequate |
| M3: Release | End of Sprint 3 | All issues resolved, documentation complete |

---

## Skinner's Assessment

*tugs at collar*

This timeline is... ambitious but achievable. The key is discipline:

1. **Don't skip the small fixes** - NaN validation is "small" but CRITICAL
2. **Test before moving on** - Each week's work is verified
3. **Documentation is not optional** - Update CLAUDE.md or it drifts again

Mother would say I'm being too lenient. But I believe in this team!

SKINNER OUT!

*marches off, bumps into door frame*

---

*Generated by Principal Seymour Skinner - Project Management*
*"The schedule is the schedule, Simpson!"*
