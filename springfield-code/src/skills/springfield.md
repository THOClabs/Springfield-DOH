---
name: springfield
description: Simpsons-themed vibe coding environment that gamifies development planning through character agents
triggers:
  - springfield code
  - simpsons planning
  - vibe coding
  - ralph loop
  - lisa ralph protocol
---

# Springfield Code Skill

A Simpsons-themed development planning environment where each character brings unique expertise to your project planning process.

## Quick Start

1. Initialize: `/springfield init`
2. Plan with characters: `/homer`, `/lisa`, `/bart`, etc.
3. Check status: `/springfield status`
4. Execute: `/lisa ralph` (when ready)

## Character Roster

### Simpson Family (Core Planning)

| Character | Role | Artifact |
|-----------|------|----------|
| Homer | Dumb-smart questions that reveal hidden assumptions | `questions.md` |
| Marge | Organization and structure, motherly oversight | `structure.md` |
| Bart | Chaos engineering, edge cases, "what if we break it?" | `edge-cases.md` |
| Lisa | Architecture, planning, initiates Ralph | `project.md`, `task.md` |
| Maggie | Silent logging, status codes via *squeak* | `logging.md` |

### Extended Family

| Character | Role | Artifact |
|-----------|------|----------|
| Grampa | Historical context, rambling stories with wisdom | `history.md` |
| Burns | Budget constraints, "Excellent..." or "Release the hounds" | `budget.md` |
| Smithers | Burns interpreter, actual schedule management | `schedule.md` |
| Flanders | Coding standards, neighborly best practices | `standards.md` |

### Springfield Specialists

| Character | Role | Artifact |
|-----------|------|----------|
| Milhouse | Dependency management, gets hurt first | `dependencies.md` |
| Moe | Depressed debugging, stack traces | `debug-notes.md` |
| Wiggum | Ironic security review | `security-review.md` |
| Ralph | The executor - "I'm helping!" (Lisa only) | execution |
| Krusty | Demo preparation, showmanship | `demo.md` |
| Sideshow Bob | Adversarial analysis, sophisticated testing | `adversarial.md` |
| Skinner | Timeline management, steamed hams excuses | `timeline.md` |
| Nelson | Test failures, "Ha-ha!" | `tests.md` |
| Apu | 24/7 utility functions, "Thank you come again" | `utilities.md` |
| Frink | Experimental R&D, "Glavin!" | `experiments.md` |
| Comic Book Guy | Documentation review, "Worst X ever" | `docs-review.md` |
| Willie | Infrastructure, DevOps, "the dirty work" | `infrastructure.md` |

## The Lisa-Ralph Protocol

Ralph cannot be invoked directly. Only Lisa can initiate Ralph after verifying all prerequisites:

1. Complete planning with characters to fill `.springfield/` files
2. Run `/lisa ralph` - Lisa verifies prerequisites
3. If ready, Lisa shows summary and asks for confirmation
4. Say "yes" to start Ralph's persistent iteration loop

### Prerequisites for Ralph

Required files in `.springfield/`:
- `project.md` - What you're building
- `task.md` - Current objective
- `completion.md` - Done criteria
- `iterations.md` - Max iterations config

## Commands

- `/springfield init` - Initialize Springfield environment
- `/springfield status` - Check planning status
- `/springfield reset` - Reset and reinitialize
- `/[character]` - Summon any character for planning
- `/lisa ralph` - Initiate the Ralph loop (after planning)

## The Ralph Gate

Direct `/ralph` invocations are blocked by the ralph-gate hook. Ralph only responds to Lisa's initiation, ensuring the planning process is complete before execution begins.

When blocked, Ralph responds with confused messages like:
> *picks nose*
> Hi Lisa! Where's Lisa? Lisa tells me what to do.
