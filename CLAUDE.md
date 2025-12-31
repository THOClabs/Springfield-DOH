# CLAUDE.md - Implementation Patterns for Springfield Code

> This file contains coding patterns, conventions, and guardrails for building the Springfield Code plugin.

---

## Plugin Architecture

### Claude Code Plugin Structure

Claude Code plugins follow a specific structure. Springfield Code uses:

```
springfield-code/
├── .claude-plugin/
│   └── plugin.json       # Manifest (required)
├── agents/               # Agent personality definitions
├── commands/             # Slash command handlers
├── hooks/                # Event hooks (PreToolUse, etc.)
├── skills/               # Skill definitions
├── templates/            # Template files for init
├── tests/                # Test files
├── package.json          # Node dependencies
└── tsconfig.json         # TypeScript config
```

### Plugin Manifest Format

```json
{
  "name": "springfield-code",
  "description": "Simpsons-themed vibe coding environment...",
  "version": "1.0.0",
  "author": {
    "name": "THOC-LABS",
    "email": "contact@thoc-labs.ai"
  },
  "category": "development",
  "dependencies": ["ralph-wiggum"],
  "commands": ["springfield", "homer", "marge", ...],
  "hooks": ["PreToolUse"],
  "agents": ["homer", "marge", "bart", ...]
}
```

---

## Command Implementation Pattern

### Basic Command Structure

```typescript
// commands/example.ts
import { command } from "@anthropic-ai/claude-code-sdk";

export default command({
  name: "example",
  description: "What this command does",
  
  async run(args: string[], context: any) {
    const projectDir = context.cwd || process.cwd();
    const subcommand = args[0]?.toLowerCase();
    
    switch (subcommand) {
      case "sub1":
        return await handleSub1(projectDir);
      case "sub2":
        return await handleSub2(projectDir);
      default:
        return getHelpText();
    }
  }
});
```

### Character Command Pattern

Character commands should:
1. Load the agent definition from `agents/`
2. Parse user input for context
3. Generate character-appropriate response
4. Optionally create artifact files

```typescript
// commands/summon.ts
import { command } from "@anthropic-ai/claude-code-sdk";
import * as fs from "fs";
import * as path from "path";

async function summonCharacter(
  character: string, 
  userInput: string, 
  context: any
): Promise<string> {
  // Load agent definition
  const agentPath = findAgentPath(character);
  const agentDef = fs.readFileSync(agentPath, "utf-8");
  
  // Generate response based on agent personality
  // (In practice, this uses the agent definition to guide response)
  
  return generateCharacterResponse(agentDef, userInput);
}
```

---

## Hook Implementation Pattern

### PreToolUse Hook (Ralph Gate)

```typescript
// hooks/ralph-gate.ts
import { hook } from "@anthropic-ai/claude-code-sdk";

// State flag
let ralphInitiatedByLisa = false;

export function setRalphInitiated(value: boolean): void {
  ralphInitiatedByLisa = value;
}

export default hook({
  name: "ralph-gate",
  event: "PreToolUse",
  
  async handle(event: any, context: any) {
    const { toolName } = event;
    
    if (toolName === "ralph-loop" || toolName === "ralph") {
      if (ralphInitiatedByLisa) {
        ralphInitiatedByLisa = false; // Reset for next time
        return { allowed: true };
      }
      
      return {
        allowed: false,
        message: getBlockedResponse(),
      };
    }
    
    return { allowed: true };
  }
});
```

---

## Agent Definition Format

### Agent Markdown Structure

Each agent file follows this structure:

```markdown
# [Character Name] Agent

## Personality Core
[Who they are, their role in Springfield Code]

## Voice & Mannerisms
- [Catchphrase]
- [Speech pattern]
- [Behavioral quirk]

## Behavioral Patterns
**[Pattern Name]**
[Description of how this manifests in code review/planning]

## Output Artifact
[Character] produces `.springfield/[artifact].md`:

\`\`\`markdown
# [Artifact Title]
[Template structure]
\`\`\`

## Sample Dialogue
[Example interaction showing character voice]

## Integration Notes
[When to invoke, what it produces, dependencies]
```

---

## File Operations

### Reading Files Safely

```typescript
function readFileSafe(filePath: string): string | null {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}
```

### Writing Artifacts

```typescript
function writeArtifact(
  springfieldDir: string,
  filename: string,
  content: string
): void {
  const filePath = path.join(springfieldDir, filename);
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  // Write file
  fs.writeFileSync(filePath, content, "utf-8");
}
```

### Checking Prerequisites

```typescript
interface PrerequisiteCheck {
  ready: boolean;
  missing: string[];
  present: string[];
}

function checkPrerequisites(springfieldDir: string): PrerequisiteCheck {
  const required = ["project.md", "task.md", "completion.md", "iterations.md"];
  const result: PrerequisiteCheck = {
    ready: true,
    missing: [],
    present: [],
  };
  
  for (const file of required) {
    const filePath = path.join(springfieldDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      // Check if file has substantive content
      if (content.length > 200 && !content.includes("[placeholder")) {
        result.present.push(file);
      } else {
        result.missing.push(`${file} (incomplete)`);
        result.ready = false;
      }
    } else {
      result.missing.push(file);
      result.ready = false;
    }
  }
  
  return result;
}
```

---

## Response Formatting

### ASCII Box Drawing

```typescript
function drawBox(title: string, content: string[]): string {
  const width = 50;
  const top = `┌${"─".repeat(width)}┐`;
  const bottom = `└${"─".repeat(width)}┘`;
  const titleLine = `│ ${title.padEnd(width - 1)}│`;
  const separator = `├${"─".repeat(width)}┤`;
  
  const lines = content.map(line => 
    `│ ${line.substring(0, width - 2).padEnd(width - 1)}│`
  );
  
  return [top, titleLine, separator, ...lines, bottom].join("\n");
}
```

### Character Response Wrapper

```typescript
function wrapCharacterResponse(
  character: string,
  action: string,
  dialogue: string
): string {
  return `*${action}*

${dialogue}`;
}

// Usage:
wrapCharacterResponse(
  "Homer",
  "scratches head",
  "D'oh! Why didn't I think of that?"
);
```

---

## Testing Patterns

### Command Test Structure

```typescript
// tests/springfield.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("springfield command", () => {
  const testDir = "/tmp/springfield-test";
  
  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true });
  });
  
  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });
  
  it("init creates .springfield directory", async () => {
    // Simulate command execution
    const result = await springfieldInit(testDir);
    
    expect(fs.existsSync(path.join(testDir, ".springfield"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".springfield/project.md"))).toBe(true);
  });
});
```

### Hook Test Structure

```typescript
// tests/ralph-gate.test.ts
import { describe, it, expect } from "vitest";
import { setRalphInitiated, canInvokeRalph } from "../hooks/ralph-gate";

describe("ralph-gate hook", () => {
  it("blocks ralph without Lisa initiation", () => {
    setRalphInitiated(false);
    expect(canInvokeRalph()).toBe(false);
  });
  
  it("allows ralph after Lisa initiation", () => {
    setRalphInitiated(true);
    expect(canInvokeRalph()).toBe(true);
  });
});
```

---

## Error Handling

### Standard Error Response

```typescript
function createErrorResponse(
  errorType: string,
  message: string,
  suggestion?: string
): string {
  let response = `
⚠️ **${errorType}**

${message}
`.trim();

  if (suggestion) {
    response += `\n\n💡 **Suggestion**: ${suggestion}`;
  }
  
  return response;
}
```

### Common Error Cases

1. **Springfield not initialized**: Suggest `/springfield init`
2. **Missing prerequisites**: List what's missing, suggest which character to invoke
3. **Invalid character**: List valid characters
4. **File write failure**: Check permissions, suggest location

---

## Constants

```typescript
// constants.ts

export const REQUIRED_FILES = [
  "project.md",
  "task.md", 
  "completion.md",
  "iterations.md"
];

export const CHARACTER_ARTIFACTS: Record<string, string> = {
  homer: "questions.md",
  marge: "structure.md",
  bart: "edge-cases.md",
  lisa: "project.md", // Also task.md
  maggie: "logging.md",
  grampa: "history.md",
  burns: "budget.md",
  smithers: "schedule.md",
  flanders: "standards.md",
  milhouse: "dependencies.md",
  moe: "debug-notes.md",
  wiggum: "security-review.md",
  krusty: "demo.md",
  bob: "adversarial.md",
  skinner: "timeline.md",
  nelson: "tests.md",
  apu: "utilities.md",
  frink: "experiments.md",
  cbg: "docs-review.md",
  willie: "infrastructure.md",
};

export const CHARACTER_TIERS = {
  simpson_family: ["homer", "marge", "bart", "lisa", "maggie"],
  extended: ["grampa", "burns", "smithers", "flanders"],
  springfield: [
    "milhouse", "moe", "wiggum", "ralph", "krusty", "bob",
    "skinner", "nelson", "apu", "frink", "cbg", "willie"
  ],
};
```

---

## Git Conventions

### Commit Messages

```
Phase X.X: [Brief description]

- What was implemented
- What was tested
- Any notes for next phase
```

### After Each Phase

```bash
git add -A
git commit -m "Phase X.X: [description]"
```

---

## Dependencies

### package.json Template

```json
{
  "name": "springfield-code",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "@anthropic-ai/claude-code-sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0"
  }
}
```

### tsconfig.json Template

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## Remember

1. **Read the spec first** - SPRINGFIELD_SPEC.md has exact requirements
2. **One phase at a time** - Sequential execution
3. **Test before marking complete** - Verification is required
4. **Document blockers** - Be specific about what failed and why
5. **Commit after phases** - Preserve progress
