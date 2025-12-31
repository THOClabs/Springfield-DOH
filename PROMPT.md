# SPRINGFIELD-DOH: Ralph Wiggum Loop Driver

> "I'm helping!" - Ralph Wiggum

You are building **Springfield Code**, a Claude Code plugin that gamifies development planning through Simpsons character agents, culminating in Ralph Wiggum persistent iteration loops.

**MODE: FULLY AUTONOMOUS** - Run through all phases without stopping. Only output completion signal when ALL 90 phases are done.

---

## YOUR MISSION (LOOP UNTIL DONE)

1. **Find first unchecked `[ ]` phase** in `IMPLEMENTATION_PLAN.md`
2. **Read spec** for that phase in `SPRINGFIELD_SPEC.md`
3. **Build & Verify** - Create files, run verification
4. **Mark `[x]` complete** and **immediately continue to next phase**
5. **Repeat until all phases complete**

Do NOT stop between phases. Do NOT wait for human review. Keep building.

---

## PHASE EXECUTION PROTOCOL

### Step 1: Identify Current Phase
```bash
grep -n "^\- \[ \]" IMPLEMENTATION_PLAN.md | head -1
```

### Step 2: Read Phase Requirements
- Check `SPRINGFIELD_SPEC.md` section for that phase
- Check `CLAUDE.md` for implementation patterns
- Review any related files already created

### Step 3: Implement
- Write tests first when applicable
- Create/modify files as specified
- Follow the locked stack and patterns

### Step 4: Verify
Run the verification command for that phase. Each phase has specific verification criteria.

### Step 5: Update & Continue

**If PASS:**
```markdown
- [x] Phase X.X - Description ✓
```
Then **immediately proceed to next phase**. No stopping.

**If FAIL:**
- Try a different approach (up to 3 attempts per phase)
- If still failing after 3 attempts, document in `BLOCKERS.md` and **continue to next phase anyway**
- Do not stop the loop for blockers

### Step 6: Commit Periodically
Every 5 phases or when convenient:
```bash
git add -A && git commit -m "Progress: Phases X.X through Y.Y"
```

---

## COMPLETION SIGNAL

**Only one signal matters:**

```
<promise>SPRINGFIELD_V1.0_COMPLETE</promise>
```

Output this ONLY when all 90 phases in IMPLEMENTATION_PLAN.md are marked `[x]`.

Do not output phase-by-phase signals. Just keep working until done.

---

## PROJECT STRUCTURE (What You're Building)

```
springfield-code/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── src/
│   ├── agents/
│   │   ├── simpson-family/   # Core family agents
│   │   ├── extended/         # Extended family
│   │   └── springfield/      # Town specialists
│   ├── commands/
│   │   ├── springfield.ts    # Main commands
│   │   ├── summon.ts         # Character summoning
│   │   └── lisa-ralph-special.ts # The Ralph protocol
│   ├── hooks/
│   │   └── ralph-gate.ts     # Prevents direct Ralph
│   ├── skills/
│   │   └── springfield.md    # Skill definition
│   └── templates/
│       └── .springfield/     # Init templates
├── tests/
│   └── *.test.ts             # Test files
├── package.json
└── tsconfig.json
```

---

## LOCKED STACK (Do Not Change)

| Component | Technology |
|-----------|------------|
| Language | TypeScript |
| Runtime | Node.js 20+ |
| Testing | Vitest |
| Plugin SDK | @anthropic-ai/claude-code-sdk |
| Dependency | ralph-wiggum plugin |

---

## GUARDRAILS

1. **Sequential phases** - Complete each before moving to next
2. **Verify before marking** - Run verification for each phase
3. **Keep moving** - Don't stop for blockers, document and continue
4. **Commit regularly** - Preserve progress every ~5 phases
5. **Read before coding** - Spec has exact requirements

---

## CONTEXT MANAGEMENT

If context is filling up and you can't complete all 90 phases in one session:
1. Commit all current work
2. Update IMPLEMENTATION_PLAN.md with current progress
3. The next session will pick up where you left off

But aim to complete as many phases as possible per session. Don't stop voluntarily.

---

## BEGIN

1. Read IMPLEMENTATION_PLAN.md
2. Find first unchecked phase
3. Execute that phase
4. Mark complete
5. **Immediately continue to next phase**
6. Repeat until all 90 phases are done

**"Don't aim for perfect on first try. Let the loop refine the work."**

**Do not stop. Keep building until `<promise>SPRINGFIELD_V1.0_COMPLETE</promise>`**
