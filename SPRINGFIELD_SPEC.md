# Springfield Code Technical Specification

> Detailed requirements for each implementation phase

---

## Phase 0: Foundation

### 0.1 - Initialize npm project

**Requirements:**
- Create `package.json` with name "springfield-code"
- Set type to "module" for ES modules
- Add scripts: build, test, lint
- Add dependencies as specified in CLAUDE.md

**Files to Create:**
- `package.json`
- `tsconfig.json`

**Verification:**
```bash
npm install
npm run build  # Should succeed (even if no source yet)
```

### 0.2 - Plugin Manifest

**Requirements:**
- Create `.claude-plugin/plugin.json`
- Include all command names (22 characters + springfield)
- Declare ralph-wiggum dependency
- Declare PreToolUse hook

**File:** `.claude-plugin/plugin.json`

**Verification:**
- JSON validates
- All required fields present

### 0.3 - Directory Structure

**Requirements:**
Create empty directories with `.gitkeep`:
```
src/
├── agents/
│   ├── simpson-family/
│   ├── extended/
│   └── springfield/
├── commands/
├── hooks/
├── skills/
├── templates/
│   └── .springfield/
└── index.ts
tests/
```

**Verification:**
- All directories exist
- `src/index.ts` exports plugin entry point

### 0.4 - Skill Definition

**Requirements:**
- Create `src/skills/springfield.md`
- Include YAML frontmatter with name and description
- Document all characters and their roles
- Explain the Lisa-Ralph protocol

**Verification:**
- Valid YAML frontmatter
- Description mentions key triggers

### 0.5 - Testing Setup

**Requirements:**
- Install vitest as dev dependency
- Create `vitest.config.ts`
- Create placeholder test file

**Verification:**
```bash
npm run test  # Should pass (even if no real tests)
```

### 0.6 - README

**Requirements:**
- Installation instructions
- Quick start guide
- Character roster table
- Lisa-Ralph protocol explanation

**Verification:**
- README renders properly in markdown

### 0.7 - Manual Plugin Load Test

**Requirements:**
- Verify plugin can be loaded in Claude Code
- Document any issues in PROGRESS_LOG.md

**Verification:**
- `/springfield` shows help text (or error we can debug)

---

## Phase 1: Core Commands

### 1.1 - Springfield Init

**Requirements:**
```typescript
// /springfield init
// Creates .springfield/ directory with template files
// Returns ASCII art success message
```

**Behavior:**
1. Check if `.springfield/` exists (error if so)
2. Create directory structure
3. Copy template files
4. Return success message

**Output:**
```
┌─────────────────────────────────────────────────────────────────┐
│               SPRINGFIELD CODE INITIALIZED                       │
├─────────────────────────────────────────────────────────────────┤
│   .springfield/                                                  │
│   ├── project.md      ← Define what you're building              │
│   ...
```

### 1.2 - Springfield Status

**Requirements:**
```typescript
// /springfield status
// Shows current state of .springfield/ directory
// Indicates Ralph readiness
```

**Behavior:**
1. Check if `.springfield/` exists
2. Check each required file (present/missing/incomplete)
3. List planning artifacts
4. Show Ralph status

**Output:**
```
┌─────────────────────────────────────────────┐
│         SPRINGFIELD STATUS                  │
├─────────────────────────────────────────────┤
│ Project Definition    [✓] project.md        │
│ Task Description      [✗] MISSING           │
...
│ RALPH STATUS: NOT READY                     │
```

### 1.3 - Springfield Reset

**Requirements:**
```typescript
// /springfield reset
// Deletes existing .springfield/ and reinitializes
```

**Behavior:**
1. Delete `.springfield/` if exists
2. Call init logic
3. Return success

### 1.4 - Template Files

**Create these in `src/templates/.springfield/`:**

**project.md:**
```markdown
# Project Definition

## What We're Building
[One paragraph description]

## Why It Matters
[The purpose, the value]

## Core Requirements
1. 
2. 
3. 

## Technical Constraints
- 
- 

## Out of Scope
- 

## Success Looks Like
[What does done look like?]
```

**task.md:**
```markdown
# Current Task

## Objective
[What Ralph should accomplish]

## Context
[Everything Ralph needs to know]

## Files to Create or Modify
- 
- 

## Notes for Ralph
[Additional guidance]
```

**completion.md:**
```markdown
# Completion Criteria

## Completion Promise
\`\`\`
DONE
\`\`\`

## Success Conditions
1. [ ] 
2. [ ] 
3. [ ] 

## Verification Steps
1. [How to verify each condition]
```

**iterations.md:**
```markdown
# Iteration Configuration

## Max Iterations
\`\`\`
20
\`\`\`

## Stuck Protocol
After 75% of iterations without completion:
1. Document blocking issues
2. List attempted approaches
3. Suggest alternatives
```

### 1.5 - Command Tests

**Requirements:**
- Test init creates all files
- Test status reports correctly
- Test reset cleans and reinits

### 1.6 - Init Verification

**Manual test:**
```bash
# In a test directory
/springfield init
ls -la .springfield/
cat .springfield/project.md
```

---

## Phase 2: Simpson Family Agents

### 2.1-2.5 - Agent Definitions

Each agent file requires:

| Agent | Role | Voice | Artifact |
|-------|------|-------|----------|
| Homer | Dumb-smart questions | "D'oh!", tangents | questions.md |
| Marge | Organization | Concerned "Hmmmm" | structure.md |
| Bart | Chaos/edge cases | "Eat my shorts!" | edge-cases.md |
| Lisa | Architecture | Articulate, jazz metaphors | project.md, task.md |
| Maggie | Logging | *squeak* (status codes) | logging.md |

**Each file must include:**
1. Personality Core section
2. Voice & Mannerisms section  
3. Behavioral Patterns section
4. Output Artifact section with template
5. Sample Dialogue section
6. Integration Notes section

### 2.6 - Summon Command

**Requirements:**
```typescript
// src/commands/summon.ts
// Central character summoning logic

export async function summonCharacter(
  character: string,
  userInput: string,
  context: any
): Promise<string>;
```

**Behavior:**
1. Validate character name
2. Load agent definition
3. Parse user context
4. Generate character response
5. Optionally create artifact

### 2.7-2.11 - Character Commands

**Pattern for each:**
```typescript
// src/commands/homer.ts
import { command } from "@anthropic-ai/claude-code-sdk";
import { summonCharacter } from "./summon";

export default command({
  name: "homer",
  description: "Summon Homer Simpson for dumb-smart questions",
  
  async run(args: string[], context: any) {
    return summonCharacter("homer", args.join(" "), context);
  }
});
```

### 2.12 - Tests

```typescript
describe("Simpson family commands", () => {
  it("homer responds in character", async () => {
    const response = await summonCharacter("homer", "Why build this?", ctx);
    expect(response).toContain("D'oh");  // Or other Homer markers
  });
});
```

---

## Phase 3-5: Extended Family & Specialists

Follow same pattern as Phase 2 for each character tier.

**Key differentiators:**

| Character | Unique Element |
|-----------|----------------|
| Grampa | Rambling stories that contain context |
| Burns | "Excellent" / "Release the hounds" |
| Smithers | Burns interpreter, actual task manager |
| Flanders | "Hi-diddly-ho", neighborly standards |
| Milhouse | Gets hurt first (dependency failures) |
| Moe | Depressed debugging, stack traces |
| Wiggum | Ironic incompetent security |
| Krusty | "Hey hey!", showmanship |
| Bob | Sophisticated adversarial (Kelsey Grammer voice) |
| Skinner | "SKINNER!", steamed hams excuses |
| Nelson | "Ha-ha!" at test failures |
| Apu | 24/7 utilities, "Thank you come again" |
| Frink | "Glavin!", experimental R&D |
| CBG | "Worst X ever", harsh docs review |
| Willie | Scottish DevOps, "the dirty work" |

---

## Phase 6: Ralph Gate

### 6.1 - Ralph Agent Definition

**Special requirements:**
- Document the "I'm helping!" philosophy
- Include confused responses for blocked state
- Reference the ralph-wiggum plugin integration

### 6.2 - Ralph Gate Hook

```typescript
// src/hooks/ralph-gate.ts

import { hook } from "@anthropic-ai/claude-code-sdk";

let ralphInitiatedByLisa = false;

export function setRalphInitiated(value: boolean): void {
  ralphInitiatedByLisa = value;
}

export default hook({
  name: "ralph-gate",
  event: "PreToolUse",
  
  async handle(event, context) {
    if (event.toolName === "ralph-loop" || event.toolName === "ralph") {
      if (!ralphInitiatedByLisa) {
        return {
          allowed: false,
          message: getConfusedRalphResponse()
        };
      }
      ralphInitiatedByLisa = false;
      return { allowed: true };
    }
    return { allowed: true };
  }
});
```

### 6.3 - Confused Ralph Responses

Array of 5+ responses like:
```
*Ralph looks confused*

Hi Lisa! Where's Lisa? Lisa tells me what to do.

*picks nose*

You should talk to Lisa first.
```

### 6.4-6.5 - Gate Tests

- Verify direct `/ralph` is blocked
- Verify `setRalphInitiated(true)` allows passage
- Verify flag resets after use

---

## Phase 7: Artifact System

### Implementation Pattern

```typescript
interface ArtifactGenerator {
  character: string;
  filename: string;
  generate(context: ConversationContext): string;
}

function generateArtifact(
  character: string,
  conversation: string,
  springfieldDir: string
): void {
  const generator = ARTIFACT_GENERATORS[character];
  const content = generator.generate(conversation);
  const filepath = path.join(springfieldDir, generator.filename);
  fs.writeFileSync(filepath, content);
}
```

### Artifact Templates

Each character's artifact has a specific structure. See CLAUDE.md `CHARACTER_ARTIFACTS` for mapping.

---

## Phase 8: Lisa-Ralph Protocol

### 8.1 - Command Handler

```typescript
// src/commands/lisa-ralph-special.ts

export default command({
  name: "lisa-ralph",
  description: "Lisa's special interaction with Ralph",
  
  async run(args: string[], context: any) {
    const springfieldDir = path.join(context.cwd, ".springfield");
    
    // Check initialization
    if (!fs.existsSync(springfieldDir)) {
      return notInitializedResponse();
    }
    
    // Verify prerequisites
    const verification = verifyPrerequisites(springfieldDir);
    
    if (!verification.ready) {
      return incompleteResponse(verification);
    }
    
    // Check for confirmation
    if (args[0]?.toLowerCase() === "yes") {
      return invokeRalph(springfieldDir);
    }
    
    return readyResponse(verification, springfieldDir);
  }
});
```

### 8.2 - Prerequisites Verification

```typescript
interface VerificationResult {
  ready: boolean;
  missing: string[];
  present: string[];
  context: string[];  // Optional files found
}

function verifyPrerequisites(dir: string): VerificationResult {
  const required = ["project.md", "task.md", "completion.md", "iterations.md"];
  // Check each, verify has content (not just template)
  // ...
}
```

### 8.3 - Incomplete Response

Lisa explains what's missing, in character:
```
*sighs and adjusts saxophone case*

We're not ready for Ralph yet. It's like trying to perform
without knowing the key signature.

Missing:
- completion.md
- iterations.md

Let me help you create these...
```

### 8.4 - Ready Response

Lisa shows summary, asks for confirmation:
```
*eyes light up*

All planning documents are in place!

Ralph will receive:
- Project context (450 words)
- Task specification (280 words)
- 5 context files from planning

Configuration:
- Completion promise: "DONE"
- Max iterations: 20

Say "yes" to confirm...
```

### 8.5 - Prompt Synthesis

```typescript
function synthesizePrompt(springfieldDir: string): string {
  const sections: string[] = [];
  
  // Required files
  sections.push(readSection("project.md", "PROJECT DEFINITION"));
  sections.push(readSection("task.md", "CURRENT TASK"));
  sections.push(readSection("completion.md", "COMPLETION CRITERIA"));
  
  // Optional context files
  for (const file of OPTIONAL_FILES) {
    if (exists(file)) {
      sections.push(readSection(file, labelFor(file)));
    }
  }
  
  return sections.join("\n\n");
}
```

### 8.6-8.7 - Extraction Functions

```typescript
function extractCompletionPromise(dir: string): string {
  // Parse completion.md, find ```promise``` block
  // Default to "DONE"
}

function extractMaxIterations(dir: string): number {
  // Parse iterations.md, find number
  // Default to 20
}
```

### 8.8 - Confirmation Flow

When user says "yes":
1. Set ralph initiation flag
2. Construct `/ralph-loop` command
3. Execute and return status

### 8.9 - Hook Integration

```typescript
import { setRalphInitiated } from "../hooks/ralph-gate";

async function invokeRalph(dir: string): Promise<string> {
  // Set flag so gate allows passage
  setRalphInitiated(true);
  
  // Invoke ralph-loop
  const prompt = synthesizePrompt(dir);
  const promise = extractCompletionPromise(dir);
  const iterations = extractMaxIterations(dir);
  
  // Return invocation command
  return `/ralph-loop "${prompt}" --completion-promise "${promise}" --max-iterations ${iterations}`;
}
```

---

## Phase 9: Ralph Integration

### 9.1 - Dependency Declaration

In `package.json`:
```json
{
  "claudePluginDependencies": ["ralph-wiggum"]
}
```

In `plugin.json`:
```json
{
  "dependencies": ["ralph-wiggum"]
}
```

### 9.2-9.6 - Integration Testing

Full workflow test:
1. `/springfield init`
2. Edit template files with real content
3. `/springfield status` shows READY
4. `/lisa ralph` shows summary
5. Confirm with "yes"
6. Ralph loop begins
7. `/cancel-ralph` works if needed

---

## Phase 10: Polish

### 10.1 - Complete Documentation

- All commands documented
- All characters described
- Troubleshooting section
- Examples and walkthroughs

### 10.2 - Code Documentation

- JSDoc on all public functions
- Inline comments for complex logic
- Type definitions for all interfaces

### 10.3-10.10 - Final Polish

- Error handling edge cases
- Performance review
- Final test pass
- Package for distribution

---

## Verification Commands

```bash
# Phase 0
npm run build
npm run test

# Phase 1
/springfield init
/springfield status
/springfield reset

# Phase 2-5
/homer "test input"
/lisa "test input"
# ... etc

# Phase 6
/ralph  # Should be blocked

# Phase 8
/lisa ralph  # Prerequisites check

# Phase 9
# Full workflow integration test
```
