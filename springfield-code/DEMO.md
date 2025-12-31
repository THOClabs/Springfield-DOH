# Springfield Code Demo Script

> A walkthrough of Springfield Code's features

## Setup

```bash
# In a new project directory
/springfield init
```

Expected output: ASCII art confirmation with file structure.

---

## Act 1: The Planning Characters

### Scene 1: Homer's Questions

```
/homer "We're building a user authentication system"
```

Homer asks deceptively simple questions:
- "Why do we need passwords?"
- "Can't they just... tell us who they are?"
- "What if the user is as dumb as me?"

**Creates:** `.springfield/questions.md`

### Scene 2: Marge's Organization

```
/marge "Let's organize the auth system"
```

Marge structures the project:
- Directory organization
- Responsibilities assignment
- Cleanup checklists

**Creates:** `.springfield/structure.md`

### Scene 3: Bart's Chaos

```
/bart "What could break in our auth system?"
```

Bart identifies edge cases:
- Empty passwords
- SQL injection attempts
- Session hijacking

**Creates:** `.springfield/edge-cases.md`

### Scene 4: Lisa's Architecture

```
/lisa "Design the authentication architecture"
```

Lisa provides thoughtful analysis:
- Component design
- Design principles
- Risk analysis

**Creates:** `.springfield/project.md`

---

## Act 2: Extended Planning

### The Security Review

```
/wiggum "Review our security"
```

Wiggum's "review" reveals what to actually check:
- Authentication gaps
- Input validation needs
- OWASP concerns

### The Budget Meeting

```
/burns "What will this cost?"
```

Burns demands ROI:
- Cost breakdown
- Resource allocation
- "Excellent..." or "Release the hounds!"

### The Timeline

```
/skinner "Create project timeline"
```

Skinner manages expectations:
- Milestone tracking
- Stakeholder updates
- "Steamed hams" excuses (if needed)

---

## Act 3: The Ralph Protocol

### Check Status

```
/springfield status
```

Shows:
- Required files (present/missing)
- Planning artifacts
- Ralph readiness

### Initiate Ralph

```
/lisa ralph
```

Lisa verifies prerequisites:
- All required files complete
- Shows summary
- Asks for confirmation

### Confirm Execution

```
yes
```

Ralph begins:
- "I'm helping!"
- Persistent iteration
- Completion promise checking

---

## Sample Flow

```
# 1. Initialize
/springfield init

# 2. Core Planning
/homer "Build a todo app"
/marge "Organize the project"
/bart "What could break?"
/lisa "Design the architecture"

# 3. Define Task
# Edit .springfield/task.md with specific objectives
# Edit .springfield/completion.md with "DONE" criteria
# Edit .springfield/iterations.md with max iterations

# 4. Additional Planning
/flanders "Review our coding standards"
/nelson "What tests do we need?"
/bob "How would you attack this?"

# 5. Check Readiness
/springfield status

# 6. Execute
/lisa ralph
yes
```

---

## Key Points for Demo

1. **Show the .springfield/ directory** - All planning happens here
2. **Demonstrate character voices** - Each character has unique personality
3. **Highlight the Ralph Gate** - Try `/ralph` directly (blocked)
4. **Show artifact generation** - Files created by characters
5. **Complete the loop** - `/lisa ralph` → execution

---

## Troubleshooting

**"Springfield not initialized"**
→ Run `/springfield init`

**"Not ready for Ralph"**
→ Complete all required files in `.springfield/`
→ Check `/springfield status` for missing files

**"/ralph is blocked"**
→ This is intentional! Use `/lisa ralph` instead

---

## Character Quick Reference

| Character | Use For | Creates |
|-----------|---------|---------|
| Homer | Questions | questions.md |
| Marge | Structure | structure.md |
| Bart | Edge cases | edge-cases.md |
| Lisa | Architecture | project.md |
| Maggie | Logging | logging.md |
| Flanders | Standards | standards.md |
| Nelson | Tests | tests.md |
| Bob | Security | adversarial.md |
| Willie | DevOps | infrastructure.md |

---

*"I'm helping!" - Ralph Wiggum*
