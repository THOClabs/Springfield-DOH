# Skills Directory

> **Status:** Implemented in v3.0.0

This directory contains skill definitions that allow characters to share common capabilities.

## Features

- **Skill Composition:** Characters can inherit skills from shared definitions
- **Skill Registry:** Global registry for managing skills
- **YAML Frontmatter:** Skills are defined in markdown with YAML metadata
- **Trigger Matching:** Find skills by trigger phrases

## Usage

```typescript
import {
  registerSkill,
  registerSkillFromFile,
  getSkill,
  listSkills,
  findSkillsByTrigger,
} from "springfield-code";

// Register a skill from markdown
const skill = registerSkill(`---
name: my-skill
description: My custom skill
triggers:
  - custom analysis
  - my skill
---
# My Skill Content
...
`);

// Register from file
registerSkillFromFile("./skills/custom.md");

// Find skills
const result = getSkill("my-skill");
if (result.found) {
  console.log(result.skill.content);
}

// List all skills
const skills = listSkills();

// Find by trigger
const matches = findSkillsByTrigger("I need custom analysis");
```

## Current Contents

- `index.ts` - Skill registry and utilities
- `types.ts` - TypeScript type definitions
- `springfield.md` - Base Springfield skill set (reference implementation)

## Skill Format

Skills are markdown files with YAML frontmatter:

```markdown
---
name: skill-name
description: What this skill does
triggers:
  - phrase one
  - phrase two
dependencies:
  - other-skill
version: "1.0.0"
---

# Skill Content

The markdown content describes the skill capabilities...
```

## API Reference

| Function | Description |
|----------|-------------|
| `registerSkill(markdown, options?)` | Register skill from markdown string |
| `registerSkillFromFile(path, options?)` | Register skill from file |
| `getSkill(id)` | Get skill by ID |
| `listSkills()` | List all registered skills |
| `unregisterSkill(id)` | Remove a skill |
| `clearSkillRegistry()` | Clear all skills |
| `loadSkillsFromDirectory(path)` | Load all skills from directory |
| `findSkillsByTrigger(phrase)` | Find skills by trigger phrase |
| `parseFrontmatter(content)` | Parse YAML frontmatter |
