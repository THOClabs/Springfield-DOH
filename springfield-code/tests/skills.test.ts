/**
 * Tests for the skills system
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  registerSkill,
  getSkill,
  listSkills,
  unregisterSkill,
  clearSkillRegistry,
  findSkillsByTrigger,
  parseFrontmatter,
  getRegistryState,
} from "../src/skills/index.js";

describe("Skills System", () => {
  beforeEach(() => {
    clearSkillRegistry();
  });

  describe("parseFrontmatter", () => {
    it("parses valid frontmatter", () => {
      const content = `---
name: test-skill
description: A test skill
---
# Content here`;

      const [metadata, remaining] = parseFrontmatter(content);
      
      expect(metadata).not.toBeNull();
      expect(metadata?.name).toBe("test-skill");
      expect(metadata?.description).toBe("A test skill");
      expect(remaining.trim()).toBe("# Content here");
    });

    it("parses frontmatter with arrays", () => {
      const content = `---
name: array-skill
description: Skill with arrays
triggers:
  - trigger one
  - trigger two
dependencies:
  - dep-a
  - dep-b
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.triggers).toEqual(["trigger one", "trigger two"]);
      expect(metadata?.dependencies).toEqual(["dep-a", "dep-b"]);
    });

    it("returns null metadata for content without frontmatter", () => {
      const content = "# Just markdown\nNo frontmatter here";
      
      const [metadata, remaining] = parseFrontmatter(content);
      
      expect(metadata).toBeNull();
      expect(remaining).toBe(content);
    });

    it("handles optional fields", () => {
      const content = `---
name: minimal
description: Minimal skill
version: 1.0.0
author: Test Author
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.version).toBe("1.0.0");
      expect(metadata?.author).toBe("Test Author");
    });

    it("returns undefined for triggers when value is not an array", () => {
      const content = `---
name: non-array-triggers
description: Triggers is a string
triggers: not-an-array
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("non-array-triggers");
      expect(metadata?.triggers).toBeUndefined();
    });

    it("returns undefined for dependencies when value is not an array", () => {
      const content = `---
name: non-array-deps
description: Dependencies is a string
dependencies: not-an-array
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("non-array-deps");
      expect(metadata?.dependencies).toBeUndefined();
    });

    it("saves trailing array when frontmatter ends with array items", () => {
      // This tests the "save any remaining array" logic at end of parsing
      // The array is the LAST thing before --- with no scalar after it
      const content = `---
name: trailing-array-skill
description: Skill with trailing array
triggers:
  - final-trigger-one
  - final-trigger-two
---
Content after frontmatter`;

      const [metadata, remaining] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("trailing-array-skill");
      expect(metadata?.triggers).toEqual(["final-trigger-one", "final-trigger-two"]);
      expect(remaining.trim()).toBe("Content after frontmatter");
    });

    it("saves trailing dependencies array at end of frontmatter", () => {
      // Another test for trailing array - dependencies this time
      const content = `---
name: deps-at-end
description: Dependencies are last
version: 1.0.0
dependencies:
  - dep-alpha
  - dep-beta
  - dep-gamma
---
# Main content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("deps-at-end");
      expect(metadata?.version).toBe("1.0.0");
      expect(metadata?.dependencies).toEqual(["dep-alpha", "dep-beta", "dep-gamma"]);
    });

    it("uses empty string fallback when name is missing", () => {
      const content = `---
description: Only description, no name
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("");
      expect(metadata?.description).toBe("Only description, no name");
    });

    it("uses empty string fallback when description is missing", () => {
      const content = `---
name: only-name
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("only-name");
      expect(metadata?.description).toBe("");
    });

    it("uses empty string fallback when both name and description are missing", () => {
      const content = `---
version: 1.0.0
author: Anonymous
---
Content`;

      const [metadata] = parseFrontmatter(content);
      
      expect(metadata?.name).toBe("");
      expect(metadata?.description).toBe("");
      expect(metadata?.version).toBe("1.0.0");
      expect(metadata?.author).toBe("Anonymous");
    });
  });

  describe("registerSkill", () => {
    it("registers a skill from markdown", () => {
      const markdown = `---
name: my-skill
description: My skill description
---
# Skill Content`;

      const skill = registerSkill(markdown);
      
      expect(skill).not.toBeNull();
      expect(skill?.id).toBe("my-skill");
      expect(skill?.metadata.description).toBe("My skill description");
      expect(skill?.content).toBe("# Skill Content");
    });

    it("returns null for invalid markdown (no name)", () => {
      const markdown = `---
description: No name here
---
Content`;

      const skill = registerSkill(markdown);
      expect(skill).toBeNull();
    });

    it("returns null for markdown without frontmatter", () => {
      const markdown = "# Just content, no frontmatter";
      
      const skill = registerSkill(markdown);
      expect(skill).toBeNull();
    });

    it("does not override existing skill without flag", () => {
      const markdown1 = `---
name: duplicate
description: First version
---
First`;

      const markdown2 = `---
name: duplicate
description: Second version
---
Second`;

      registerSkill(markdown1);
      const second = registerSkill(markdown2);
      
      expect(second).toBeNull();
      
      const result = getSkill("duplicate");
      expect(result.skill?.metadata.description).toBe("First version");
    });

    it("overrides existing skill with override flag", () => {
      const markdown1 = `---
name: duplicate
description: First version
---
First`;

      const markdown2 = `---
name: duplicate
description: Second version
---
Second`;

      registerSkill(markdown1);
      registerSkill(markdown2, { override: true });
      
      const result = getSkill("duplicate");
      expect(result.skill?.metadata.description).toBe("Second version");
    });

    it("stores source path when provided", () => {
      const markdown = `---
name: sourced
description: Has source
---
Content`;

      const skill = registerSkill(markdown, { source: "/path/to/skill.md" });
      expect(skill?.source).toBe("/path/to/skill.md");
    });
  });

  describe("getSkill", () => {
    it("returns skill when found", () => {
      registerSkill(`---
name: findme
description: Find this skill
---
Content`);

      const result = getSkill("findme");
      
      expect(result.found).toBe(true);
      expect(result.skill?.id).toBe("findme");
      expect(result.error).toBeUndefined();
    });

    it("returns error when not found", () => {
      const result = getSkill("nonexistent");
      
      expect(result.found).toBe(false);
      expect(result.skill).toBeUndefined();
      expect(result.error).toBe("Skill not found: nonexistent");
    });
  });

  describe("listSkills", () => {
    it("returns empty array when no skills registered", () => {
      expect(listSkills()).toEqual([]);
    });

    it("returns all registered skills", () => {
      registerSkill(`---
name: skill-a
description: Skill A
---
A`);
      registerSkill(`---
name: skill-b
description: Skill B
---
B`);

      const skills = listSkills();
      
      expect(skills).toHaveLength(2);
      expect(skills.map(s => s.id).sort()).toEqual(["skill-a", "skill-b"]);
    });
  });

  describe("unregisterSkill", () => {
    it("removes an existing skill", () => {
      registerSkill(`---
name: removeme
description: To be removed
---
Content`);

      expect(unregisterSkill("removeme")).toBe(true);
      expect(getSkill("removeme").found).toBe(false);
    });

    it("returns false for nonexistent skill", () => {
      expect(unregisterSkill("nonexistent")).toBe(false);
    });
  });

  describe("getRegistryState", () => {
    it("returns current registry state", () => {
      registerSkill(`---
name: state-test
description: Test state
---
Content`);

      const state = getRegistryState();
      
      expect(state.count).toBe(1);
      expect(state.skills.size).toBe(1);
      expect(state.skills.has("state-test")).toBe(true);
    });
  });

  describe("findSkillsByTrigger", () => {
    beforeEach(() => {
      registerSkill(`---
name: coding-skill
description: Coding helper
triggers:
  - help me code
  - write code
---
Coding content`);

      registerSkill(`---
name: review-skill
description: Code review
triggers:
  - review my code
  - code review
---
Review content`);

      registerSkill(`---
name: no-triggers
description: No triggers defined
---
No trigger content`);
    });

    it("finds skills by matching trigger phrase", () => {
      const matches = findSkillsByTrigger("I need help me code please");
      
      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe("coding-skill");
    });

    it("finds multiple matching skills", () => {
      const matches = findSkillsByTrigger("write code and code review");
      
      expect(matches).toHaveLength(2);
    });

    it("returns empty array when no matches", () => {
      const matches = findSkillsByTrigger("something completely different");
      
      expect(matches).toHaveLength(0);
    });

    it("is case-insensitive", () => {
      const matches = findSkillsByTrigger("HELP ME CODE");
      
      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe("coding-skill");
    });
  });

  describe("clearSkillRegistry", () => {
    it("removes all skills", () => {
      registerSkill(`---
name: skill-1
description: One
---
1`);
      registerSkill(`---
name: skill-2
description: Two
---
2`);

      expect(listSkills()).toHaveLength(2);
      
      clearSkillRegistry();
      
      expect(listSkills()).toHaveLength(0);
    });
  });

  describe("registerSkillFromFile", () => {
    it("registers skill from valid file", async () => {
      // Use dynamic import to get fs and path
      const fs = await import("fs");
      const path = await import("path");
      const os = await import("os");
      
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skill-file-test-"));
      const skillPath = path.join(tempDir, "test-skill.md");
      
      fs.writeFileSync(skillPath, `---
name: file-skill
description: Loaded from file
---
File content`);

      const { registerSkillFromFile: regFromFile } = await import("../src/skills/index.js");
      const skill = regFromFile(skillPath);
      
      expect(skill).not.toBeNull();
      expect(skill?.id).toBe("file-skill");
      expect(skill?.source).toBe(skillPath);
      
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("returns null for non-existent file", async () => {
      const { registerSkillFromFile: regFromFile } = await import("../src/skills/index.js");
      const skill = regFromFile("/nonexistent/path/skill.md");
      
      expect(skill).toBeNull();
    });
  });

  describe("loadSkillsFromDirectory", () => {
    it("loads skills from directory", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const os = await import("os");
      
      clearSkillRegistry();
      
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-dir-test-"));
      
      // Create skill files
      fs.writeFileSync(path.join(tempDir, "skill-a.md"), `---
name: dir-skill-a
description: Skill A from dir
---
Content A`);
      
      fs.writeFileSync(path.join(tempDir, "skill-b.md"), `---
name: dir-skill-b
description: Skill B from dir
---
Content B`);

      // Non-skill file should be ignored
      fs.writeFileSync(path.join(tempDir, "readme.txt"), "Not a skill");

      const { loadSkillsFromDirectory: loadFromDir } = await import("../src/skills/index.js");
      const loaded = loadFromDir(tempDir);
      
      expect(loaded).toBe(2);
      expect(getSkill("dir-skill-a").found).toBe(true);
      expect(getSkill("dir-skill-b").found).toBe(true);
      
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("returns 0 for non-existent directory", async () => {
      const { loadSkillsFromDirectory: loadFromDir } = await import("../src/skills/index.js");
      const loaded = loadFromDir("/nonexistent/directory");
      
      expect(loaded).toBe(0);
    });
  });
});
