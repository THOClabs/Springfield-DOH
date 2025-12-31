# Springfield Code

> "I'm helping!" - Ralph Wiggum

A Simpsons-themed vibe coding environment for Claude Code that gamifies development planning through character agents, culminating in Ralph Wiggum persistent iteration loops.

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

2. **Plan with characters** - Each character helps with different aspects:
   ```
   /homer "What are we building?"    # Asks dumb-smart questions
   /lisa "Design the architecture"   # Creates structured plans
   /bart "What could go wrong?"      # Identifies edge cases
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

### Simpson Family (Core Planning)

| Character | Command | Role | Artifact |
|-----------|---------|------|----------|
| Homer | `/homer` | Dumb-smart questions that reveal hidden assumptions | `questions.md` |
| Marge | `/marge` | Organization and structure, motherly oversight | `structure.md` |
| Bart | `/bart` | Chaos engineering, edge cases, breaking things | `edge-cases.md` |
| Lisa | `/lisa` | Architecture, planning, initiates Ralph | `project.md`, `task.md` |
| Maggie | `/maggie` | Silent logging, status codes via *squeak* | `logging.md` |

### Extended Family

| Character | Command | Role | Artifact |
|-----------|---------|------|----------|
| Grampa | `/grampa` | Historical context, rambling stories with wisdom | `history.md` |
| Mr. Burns | `/burns` | Budget constraints, resource allocation | `budget.md` |
| Smithers | `/smithers` | Schedule management, Burns interpreter | `schedule.md` |
| Flanders | `/flanders` | Coding standards, neighborly best practices | `standards.md` |

### Springfield Specialists

| Character | Command | Role | Artifact |
|-----------|---------|------|----------|
| Milhouse | `/milhouse` | Dependency management, gets hurt first | `dependencies.md` |
| Moe | `/moe` | Depressed debugging, stack traces | `debug-notes.md` |
| Chief Wiggum | `/wiggum` | Ironic security review | `security-review.md` |
| Ralph | `/ralph` | The executor (Lisa only) | execution |
| Krusty | `/krusty` | Demo preparation, showmanship | `demo.md` |
| Sideshow Bob | `/bob` | Adversarial analysis, sophisticated testing | `adversarial.md` |
| Skinner | `/skinner` | Timeline management | `timeline.md` |
| Nelson | `/nelson` | Test failures, "Ha-ha!" | `tests.md` |
| Apu | `/apu` | 24/7 utility functions | `utilities.md` |
| Professor Frink | `/frink` | Experimental R&D, "Glavin!" | `experiments.md` |
| Comic Book Guy | `/cbg` | Documentation review, "Worst X ever" | `docs-review.md` |
| Groundskeeper Willie | `/willie` | Infrastructure, DevOps | `infrastructure.md` |

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

Direct `/ralph` invocations are blocked by the ralph-gate hook. When blocked, Ralph responds with confused messages:

> *picks nose*
> Hi Lisa! Where's Lisa? Lisa tells me what to do.

This ensures the planning process is complete before execution begins.

## Commands

| Command | Description |
|---------|-------------|
| `/springfield init` | Initialize Springfield environment |
| `/springfield status` | Check planning status and Ralph readiness |
| `/springfield reset` | Reset and reinitialize |
| `/[character]` | Summon any character for planning |
| `/lisa ralph` | Initiate the Ralph loop (after planning) |

## Project Structure

```
your-project/
├── .springfield/           # Created by /springfield init
│   ├── project.md          # Project definition
│   ├── task.md             # Current task for Ralph
│   ├── completion.md       # Completion criteria
│   ├── iterations.md       # Iteration configuration
│   ├── questions.md        # Homer's questions
│   ├── structure.md        # Marge's organization
│   ├── edge-cases.md       # Bart's chaos
│   └── ...                 # Other character artifacts
```

## Dependencies

- Claude Code CLI
- ralph-wiggum plugin (for persistent iteration loops)

## License

MIT

## Author

THOC-LABS (contact@thoc-labs.ai)
