# SPRINGFIELD-DOH: Ralph Wiggum Build Setup

> "The technique is deterministically bad in an undeterministic world. Better to fail predictably than succeed unpredictably." — Geoffrey Huntley

A complete autonomous development setup for building **Springfield Code**, a Claude Code plugin that gamifies development planning through Simpsons character agents, using the Ralph Wiggum iterative loop technique.

---

## What Is Ralph Wiggum?

Ralph Wiggum is an AI development methodology where Claude Code iterates on a prompt until completion. Each iteration sees modified files and git history from previous runs. Failures become data that refine the approach. Success depends on writing good prompts, not just having a good model.

Named after The Simpsons character, it embodies **persistent iteration despite setbacks**.

**"I'm helping!"** — And Ralph is. Through iteration.

---

## What We're Building

**Springfield Code** is a Claude Code plugin where Simpsons characters serve as specialized planning agents. Each character has a development domain (Homer asks dumb-smart questions, Lisa architects, Bart breaks things, Nelson tests aggressively). Planning conversations generate artifacts in `.springfield/`. When prerequisites are complete, Lisa initiates Ralph into his persistent build loop.

The meta-beauty: we're using the Ralph Wiggum method to build a tool that uses the Ralph Wiggum method.

---

## Files Included

```
springfield-doh/
├── PROMPT.md               # Loop driver - re-feed until complete
├── IMPLEMENTATION_PLAN.md  # 90 checkboxes with verification criteria
├── CLAUDE.md               # Implementation patterns and guardrails
├── SPRINGFIELD_SPEC.md     # Detailed technical specification
├── TROUBLESHOOTING.md      # Common issues and fixes
├── BLOCKERS.md             # Document blocking issues here
├── PROGRESS_LOG.md         # Track progress across sessions
├── .gitignore              # Git ignore patterns
└── README.md               # This file
```

| File | Purpose | When to Read |
|------|---------|--------------|
| **PROMPT.md** | Main instruction loop | Every session start |
| **IMPLEMENTATION_PLAN.md** | Progress tracker with phases | To find next task |
| **CLAUDE.md** | Code patterns & conventions | Before writing code |
| **SPRINGFIELD_SPEC.md** | Technical details per phase | For each phase |
| **TROUBLESHOOTING.md** | Fix problems | When stuck |
| **BLOCKERS.md** | Document blockers | After 3 failed attempts |
| **PROGRESS_LOG.md** | Session history | Start/end of sessions |

---

## Quick Start

### Option A: Claude Code CLI with Ralph Plugin

```bash
# 1. Install Ralph Wiggum plugin
/plugin install ralph-wiggum@anthropics

# 2. Start the loop
/ralph-loop "Read PROMPT.md and execute" --max-iterations 50

# 3. Let it run!
```

### Option B: Manual Session Loop

```bash
# 1. Clone this repository
git clone https://github.com/THOClabs/springfield-doh.git
cd springfield-doh

# 2. Start Claude Code
claude

# 3. Paste PROMPT.md contents (or tell Claude to read it)

# 4. Let it work on ONE phase at a time

# 5. When context fills or session ends, start new session and re-feed PROMPT.md
```

---

## How It Works

```
┌─────────────────┐
│  PROMPT.md      │  ← Re-feed this prompt each session
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Find first [ ]  │  ← IMPLEMENTATION_PLAN.md
│ unchecked phase │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Read spec for   │  ← SPRINGFIELD_SPEC.md
│ that phase      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Build & Verify  │  ← TDD pattern
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 [PASS]    [FAIL]
    │         │
    ▼         ▼
 Mark [x]   Debug/Fix
    │         │
    ▼         │
<promise>     └──► 3 fails? → <promise>BLOCKED</promise>
PHASE_X.X_
COMPLETE
</promise>
```

---

## Completion Signals

| Signal | Meaning | What Happens Next |
|--------|---------|-------------------|
| `<promise>PHASE_X.X_COMPLETE</promise>` | Phase done | Continue to next phase |
| `<promise>BLOCKED_PHASE_X.X</promise>` | Stuck after 3 tries | Human reviews BLOCKERS.md |
| `<promise>CONTEXT_CHECKPOINT</promise>` | Context running low | Human starts new session |
| `<promise>SPRINGFIELD_V1.0_COMPLETE</promise>` | All 90 phases done! | 🎉 Human does final polish |

---

## The Target: Springfield Code Plugin

What we're building has this structure:

```
springfield-code/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── agents/
│   ├── simpson-family/       # Homer, Marge, Bart, Lisa, Maggie
│   ├── extended/             # Grampa, Burns, Smithers, Flanders
│   └── springfield/          # 12 town specialists + Ralph
├── commands/
│   ├── springfield.ts        # init/status/reset
│   ├── summon.ts             # Character summoning
│   └── lisa-ralph-special.ts # The Ralph protocol
├── hooks/
│   └── ralph-gate.ts         # Blocks direct Ralph access
├── skills/
│   └── springfield.md        # Skill definition
└── templates/
    └── .springfield/         # Template files for init
```

---

## The Stack (LOCKED)

| Layer | Technology | Why |
|-------|------------|-----|
| Language | TypeScript | Claude Code SDK requirement |
| Runtime | Node.js 20+ | Claude Code requirement |
| Testing | Vitest | Fast, TypeScript-native |
| Plugin SDK | @anthropic-ai/claude-code-sdk | Official SDK |
| Dependency | ralph-wiggum plugin | Core loop functionality |

**Do not change this stack.** The spec is written for exactly these technologies.

---

## Estimated Effort

| Metric | Estimate |
|--------|----------|
| Phases | 90 |
| Time per phase | 5-20 min |
| Total runtime | 15-30 hours |
| API cost (loop) | $30-100 |
| Human review | 3-5 hours |

---

## Best Practices

### Do ✅

- **Set high max-iterations** (50-100) to allow completion in one run
- **Commit regularly** - Ralph commits every ~5 phases automatically
- **Let blockers pass** - Document and continue, don't stop the loop
- **Read the spec before coding** - SPRINGFIELD_SPEC.md has exact requirements
- **Trust the process** - Ralph will iterate through failures

### Don't ❌

- Skip phases or work on multiple simultaneously
- Mark complete without running verification
- Stop the loop for human review (unless truly catastrophic)
- Deviate from the locked stack
- Micromanage the process

---

## Autonomous Operation

This setup is designed for **fully autonomous execution**. Ralph will:

1. Work through all 90 phases sequentially
2. Mark each complete and immediately continue
3. Document blockers but keep moving
4. Only stop when all phases are done or max iterations hit

**Recommended invocation:**
```bash
/ralph-loop "Read PROMPT.md and execute" --max-iterations 100
```

Let it run. Check results when it outputs `<promise>SPRINGFIELD_V1.0_COMPLETE</promise>` or hits the iteration limit.

---

## Philosophy

The key insight: **Success depends on writing good prompts, not just having a good model.** LLMs are mirrors of operator skill.

Springfield Code itself embodies this philosophy. The planning characters (Homer, Lisa, Bart, etc.) exist to generate better context for Ralph. The quality of Ralph's output depends entirely on the quality of context from the planning phase.

We're building a tool that enforces thoughtful preparation before execution. And we're using that same philosophy to build the tool.

**"Don't aim for perfect on first try. Let the loop refine the work."**

---

## Resources

- [Official Ralph Plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-wiggum)
- [Geoffrey Huntley's Ralph](https://ghuntley.com/ralph/)
- [Claude Code Plugin Docs](https://docs.claude.com)

---

*Built with the Ralph Wiggum method - persistent iteration despite setbacks.*

**"I'm helping!"** 🚀
