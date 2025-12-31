# Springfield Code Blockers Log

> Document blocking issues here when stuck after 3 attempts on a phase.

---

## Template

When blocked, copy this template and fill in:

```markdown
## BLOCKED: Phase X.X - [Phase Name]

**Date**: [YYYY-MM-DD]
**Iteration**: [Which attempt, e.g., 3 of 3]

### What I Tried

**Attempt 1:**
- Approach: [What you tried]
- Result: [What happened]
- Error: [Error message if any]

**Attempt 2:**
- Approach: [Different approach]
- Result: [What happened]
- Error: [Error message if any]

**Attempt 3:**
- Approach: [Final approach]
- Result: [What happened]
- Error: [Error message if any]

### Why It Failed

[Your analysis of the root cause]

### What Might Work

1. [Alternative approach 1]
2. [Alternative approach 2]
3. [External help needed: specific question]

### Files Affected

- [List of files that were being modified]

### Current State

- [ ] Code is in a stable state
- [ ] Tests still pass (for other phases)
- [ ] Changes committed with "WIP" message

### Human Review Needed

[What specific decision or clarification do you need from a human?]
```

---

## Active Blockers

*No active blockers yet.*

---

## Resolved Blockers

*Blockers that were resolved will be moved here with their solution.*

### Example (for reference):

```markdown
## RESOLVED: Phase 0.2 - Plugin Manifest

**Date**: 2024-01-15
**Resolution Date**: 2024-01-15

### Original Issue
Plugin.json was not being recognized by Claude Code.

### What Worked
Changed the directory from `.claude-plugin` to `.claude-plugin/` (trailing slash issue on Windows).

### Lesson Learned
Always use path.join() for directory paths, never string concatenation.
```
