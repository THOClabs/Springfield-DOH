# Springfield Code

[![codecov](https://codecov.io/gh/THOC-LABS/springfield-code/graph/badge.svg)](https://codecov.io/gh/THOC-LABS/springfield-code)
[![npm version](https://badge.fury.io/js/springfield-code.svg)](https://badge.fury.io/js/springfield-code)

> **"Different perspectives for different people. Find the thinking you're missing."**

Springfield Code is a CLI plugin for Claude Code that brings character-driven perspectives to your development workflow. Every character is a lens that sees what others miss.

## Why Springfield Code?

Development tasks require multiple perspectives:
- The **questioner** who asks "why?" (Homer)
- The **organizer** who brings structure (Marge)
- The **challenger** who breaks assumptions (Bart)
- The **synthesizer** who sees patterns (Lisa)

These aren't just roles - they're VOICES. And the most memorable voices come from Springfield.

```
┌─────────────────────────────────────────────────────────────┐
│              SPRINGFIELD CODE: THE CORE IDEA                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Characters aren't decoration - they're METHODOLOGY.         │
│                                                              │
│  • Homer's "stupid" questions find blind spots               │
│  • Lisa's synthesis creates clarity from noise               │
│  • Bart's chaos reveals hidden fragility                     │
│  • Marge's organization prevents entropy                     │
│                                                              │
│  The entertainment is the delivery mechanism.                │
│  The utility is the product.                                 │
└─────────────────────────────────────────────────────────────┘
```

## Installation

```bash
# Clone the repository
git clone https://github.com/THOC-LABS/springfield-code.git

# Install dependencies
cd springfield-code
npm install

# Build the plugin
npm run build
```

## Quick Start

1. **Initialize Springfield** in your project:

   ```
   /springfield init
   ```

   *Troy McClure will welcome you and explain what just happened.*

2. **Get perspectives from characters**:

   ```
   /homer "What are we building?"    # Dumb-smart questions that reveal assumptions
   /lisa "Design the architecture"   # Synthesizes into structured plans
   /bart "What could go wrong?"      # Chaos engineering and edge cases
   /marge "Organize this mess"       # Brings structure and assigns responsibility
   ```

3. **Check your progress**:

   ```
   /springfield status
   ```

4. **Execute with Ralph** (when planning is complete):

   ```
   /lisa ralph
   ```

## Character Roster

### The Simpson Family (Core Thinking Tools)

| Character | Command | Perspective | What They Produce |
|-----------|---------|-------------|-------------------|
| **Homer** | `/homer` | The Innocent - beginner's mind that cuts through complexity | `questions.md` |
| **Lisa** | `/lisa` | The Conductor - synthesis and principled planning | `project.md`, `task.md` |
| **Bart** | `/bart` | The Trickster - chaos that reveals hidden fragility | `edge-cases.md` |
| **Marge** | `/marge` | The Keeper - organization that prevents entropy | `structure.md` |
| **Maggie** | `/maggie` | The Witness - silent observation and logging | `logging.md` |

### Extended Family (Strategic Perspectives)

| Character | Command | Perspective | What They Produce |
|-----------|---------|-------------|-------------------|
| **Grampa** | `/grampa` | The Elder - history and buried wisdom | `history.md` |
| **Burns** | `/burns` | The King - resources and ROI justification | `budget.md` |
| **Smithers** | `/smithers` | The Seneschal - execution and scheduling | `schedule.md` |
| **Flanders** | `/flanders` | The Priest - standards and quality | `standards.md` |

### Springfield Citizens (Specialized Perspectives)

| Character | Command | Perspective | What They Produce |
|-----------|---------|-------------|-------------------|
| Milhouse | `/milhouse` | Dependency management | `dependencies.md` |
| Moe | `/moe` | Debugging and stack traces | `debug-notes.md` |
| Wiggum | `/wiggum` | Security review | `security-review.md` |
| Nelson | `/nelson` | Test failures | `tests.md` |
| Apu | `/apu` | Utility functions | `utilities.md` |
| Frink | `/frink` | Experimental R&D | `experiments.md` |
| CBG | `/cbg` | Documentation review | `docs-review.md` |
| Willie | `/willie` | Infrastructure/DevOps | `infrastructure.md` |
| Krusty | `/krusty` | Demo preparation | `demo.md` |
| Bob | `/bob` | Adversarial analysis | `adversarial.md` |
| Skinner | `/skinner` | Timeline management | `timeline.md` |
| **Ralph** | (Lisa only) | The Executor | execution |

## The Lisa-Ralph Protocol

Ralph Wiggum is the execution engine, but he can't be invoked directly. Only Lisa can initiate Ralph after verifying all prerequisites are met.

### How It Works

1. **Plan with Characters**: Use various characters to fill out your `.springfield/` planning files
2. **Verify Prerequisites**: Run `/lisa ralph` - Lisa checks if everything is ready
3. **Confirmation**: If ready, Lisa shows a summary and asks for confirmation
4. **Execution**: Say "yes" to start Ralph's persistent iteration loop

### Required Files

Before Ralph can execute, these files must be complete in `.springfield/`:

- `project.md` - What you're building
- `task.md` - Current objective for Ralph
- `completion.md` - How Ralph knows when done
- `iterations.md` - Max iterations configuration

### The Ralph Gate

Direct `/ralph` invocations are blocked by the ralph-gate hook. This ensures the planning process is complete before execution begins.

## Milestone Celebrations

Springfield Code celebrates your progress:

- **10 commands** - Chief Wiggum notices
- **50 commands** - You're a regular at Moe's
- **100 commands** - Burns marks you for the loyalty program
- **250 commands** - Lisa plays a triumphant saxophone riff
- **500 commands** - The entire Simpson family gathers
- **1000 commands** - You're declared a citizen of Springfield

## Commands

| Command | Description |
|---------|-------------|
| `/springfield init` | Initialize Springfield (Troy McClure welcomes you) |
| `/springfield status` | Check planning status and Ralph readiness |
| `/springfield reset` | Reset and reinitialize |
| `/[character]` | Summon any character for their perspective |
| `/lisa ralph` | Initiate the Ralph loop (after planning) |
| `/stats` | View your usage statistics |

## Project Structure

```
your-project/
├── .springfield/           # Created by /springfield init
│   ├── project.md          # Project definition
│   ├── task.md             # Current task for Ralph
│   ├── completion.md       # Completion criteria
│   ├── iterations.md       # Iteration configuration
│   ├── stats.json          # Usage statistics
│   └── [character].md      # Character-specific artifacts
```

## The Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│              THE SPRINGFIELD CODE MANIFESTO                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. WORK CAN BE PLAY                                         │
│     Entertainment isn't distraction - it's fuel.             │
│                                                              │
│  2. CHARACTERS ARE PERSPECTIVES                              │
│     Every character sees what others miss.                   │
│                                                              │
│  3. NOSTALGIA IS A FEATURE                                   │
│     35 years of shared memory is powerful.                   │
│                                                              │
│  4. QUALITY COMES FROM JOY                                   │
│     When developers enjoy their tools, work improves.        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Dependencies

- Claude Code CLI
- ralph-wiggum plugin (for persistent iteration loops)

## License

MIT

## Attribution

This is a fan-made tool inspired by The Simpsons. The Simpsons, its characters, and related marks are registered trademarks of 20th Television and The Walt Disney Company. This project is not affiliated with, endorsed by, or sponsored by 20th Television or The Walt Disney Company.

## Author

THOC-LABS (<contact@thoc-labs.ai>)

---

*"The app doesn't do one thing. It does different things for different people. And that's the point."*
*- Homer Simpson, Pacific Coast Highway*
