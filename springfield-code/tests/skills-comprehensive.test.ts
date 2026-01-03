/**
 * Batch 66: Skills System Comprehensive Tests
 *
 * Tests for all skills API functions:
 * - parseFrontmatter
 * - registerSkill
 * - getSkill
 * - listSkills
 * - unregisterSkill
 * - clearSkillRegistry
 * - loadSkillsFromDirectory
 * - findSkillsByTrigger
 * - registerSkillFromFile
 * - getRegistryState
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  parseFrontmatter,
  registerSkill,
  getSkill,
  listSkills,
  unregisterSkill,
  clearSkillRegistry,
  loadSkillsFromDirectory,
  findSkillsByTrigger,
  registerSkillFromFile,
  getRegistryState,
} from "../src/skills/index.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("Batch 66: Skills Comprehensive Tests", () => {
  beforeEach(() => {
    clearSkillRegistry();
  });

  describe("parseFrontmatter function", () => {
    it("should parse valid frontmatter with name only", () => {
      const markdown = `---
name: Test Skill
---
# Content`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata).not.toBeNull();
      expect(metadata?.name).toBe("Test Skill");
      expect(content).toBe("# Content");
    });

    it("should parse frontmatter with all optional fields", () => {
      const markdown = `---
name: Complete Skill
description: A complete skill
version: 1.0.0
author: Test Author
triggers:
  - trigger one
  - trigger two
dependencies:
  - dep1
  - dep2
---
Content here`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata?.name).toBe("Complete Skill");
      expect(metadata?.description).toBe("A complete skill");
      expect(metadata?.version).toBe("1.0.0");
      expect(metadata?.author).toBe("Test Author");
      expect(metadata?.triggers).toEqual(["trigger one", "trigger two"]);
      expect(metadata?.dependencies).toEqual(["dep1", "dep2"]);
    });

    it("should return null for markdown without frontmatter", () => {
      const markdown = `# Just a heading
No frontmatter here`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata).toBeNull();
      expect(content).toBe(markdown);
    });

    it("should return null for empty string", () => {
      const [metadata, content] = parseFrontmatter("");
      expect(metadata).toBeNull();
      expect(content).toBe("");
    });

    it("should return empty name for frontmatter without name", () => {
      const markdown = `---
description: No name field
---
Content`;
      const [metadata, content] = parseFrontmatter(markdown);
      // parseFrontmatter returns metadata with empty name, doesn't return null
      expect(metadata?.name).toBe("");
    });

    it("should return null for frontmatter with only dashes", () => {
      const markdown = `---
---
Content`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata).toBeNull();
    });

    it("should handle multiline description in frontmatter", () => {
      const markdown = `---
name: Multiline
description: >
  This is a long
  description that spans
  multiple lines
---
Content`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata?.name).toBe("Multiline");
    });

    it("should preserve content formatting after frontmatter", () => {
      const markdown = `---
name: Preserve Format
---

# Heading

- List item 1
- List item 2

\`\`\`code
block
\`\`\``;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(content).toContain("# Heading");
      expect(content).toContain("- List item 1");
      expect(content).toContain("```code");
    });

    it("should handle triggers as array from YAML", () => {
      const markdown = `---
name: With Triggers
triggers:
  - hello
  - world
---
Content`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata?.triggers).toEqual(["hello", "world"]);
    });

    it("should handle dependencies as array from YAML", () => {
      const markdown = `---
name: With Deps
dependencies:
  - skill1
  - skill2
---
Content`;
      const [metadata, content] = parseFrontmatter(markdown);
      expect(metadata?.dependencies).toEqual(["skill1", "skill2"]);
    });
  });

  describe("registerSkill function", () => {
    it("should register a skill from markdown content", () => {
      const markdown = `---
name: Registered Skill
---
Content`;
      const skill = registerSkill(markdown);
      expect(skill).not.toBeNull();
      expect(skill?.metadata.name).toBe("Registered Skill");
    });

    it("should return null for invalid markdown without frontmatter", () => {
      const skill = registerSkill("No frontmatter");
      expect(skill).toBeNull();
    });

    it("should use metadata name as skill ID", () => {
      const markdown = `---
name: My Skill Name
---
Content`;
      const skill = registerSkill(markdown);
      expect(skill?.id).toBe("My Skill Name");
    });

    it("should return null for markdown with empty name", () => {
      const markdown = `---
description: No name
---
Content`;
      const skill = registerSkill(markdown);
      expect(skill).toBeNull();
    });

    it("should set source when provided in options", () => {
      const markdown = `---
name: Source Skill
---
Content`;
      const skill = registerSkill(markdown, { source: "/path/to/skill.md" });
      expect(skill?.source).toBe("/path/to/skill.md");
    });

    it("should store skill in registry by name", () => {
      const markdown = `---
name: Stored Skill
---
Content`;
      registerSkill(markdown);
      const result = getSkill("Stored Skill");
      expect(result.found).toBe(true);
    });

    it("should not overwrite existing skill without override flag", () => {
      const markdown1 = `---
name: Same Name
---
Version 1`;
      const markdown2 = `---
name: Same Name
---
Version 2`;
      registerSkill(markdown1);
      const second = registerSkill(markdown2);
      expect(second).toBeNull();
      const result = getSkill("Same Name");
      expect(result.skill?.content).toBe("Version 1");
    });

    it("should overwrite existing skill with override flag", () => {
      const markdown1 = `---
name: Override Test
---
Version 1`;
      const markdown2 = `---
name: Override Test
---
Version 2`;
      registerSkill(markdown1);
      registerSkill(markdown2, { override: true });
      const result = getSkill("Override Test");
      expect(result.skill?.content).toBe("Version 2");
    });

    it("should handle skill with all metadata", () => {
      const markdown = `---
name: Complete Skill
description: Full description
version: 2.0.0
author: Author Name
triggers:
  - activate
  - start
dependencies:
  - other-skill
---
Full content`;
      const skill = registerSkill(markdown);
      expect(skill?.metadata.description).toBe("Full description");
      expect(skill?.metadata.version).toBe("2.0.0");
      expect(skill?.metadata.author).toBe("Author Name");
      expect(skill?.metadata.triggers).toContain("activate");
      expect(skill?.metadata.dependencies).toContain("other-skill");
    });

    it("should strip frontmatter from content", () => {
      const markdown = `---
name: Strip Test
---
Clean content`;
      const skill = registerSkill(markdown);
      expect(skill?.content).not.toContain("---");
      expect(skill?.content).toBe("Clean content");
    });
  });

  describe("getSkill function", () => {
    it("should return found=true for existing skill", () => {
      const markdown = `---
name: Findable
---
Content`;
      registerSkill(markdown);
      const result = getSkill("Findable");
      expect(result.found).toBe(true);
      expect(result.skill).toBeDefined();
    });

    it("should return found=false for non-existent skill", () => {
      const result = getSkill("non-existent");
      expect(result.found).toBe(false);
      expect(result.skill).toBeUndefined();
    });

    it("should include error message for not found", () => {
      const result = getSkill("missing");
      expect(result.error).toBe("Skill not found: missing");
    });

    it("should return complete skill object", () => {
      const markdown = `---
name: Complete Get
description: Test
---
Content`;
      registerSkill(markdown);
      const result = getSkill("Complete Get");
      expect(result.skill?.id).toBe("Complete Get");
      expect(result.skill?.metadata).toBeDefined();
      expect(result.skill?.content).toBeDefined();
    });

    it("should handle empty string ID", () => {
      const result = getSkill("");
      expect(result.found).toBe(false);
    });
  });

  describe("listSkills function", () => {
    it("should return empty array when no skills registered", () => {
      const skills = listSkills();
      expect(skills).toEqual([]);
    });

    it("should return all registered skills", () => {
      registerSkill(`---\nname: Skill One\n---\nContent`);
      registerSkill(`---\nname: Skill Two\n---\nContent`);
      registerSkill(`---\nname: Skill Three\n---\nContent`);
      const skills = listSkills();
      expect(skills.length).toBe(3);
    });

    it("should return skills with all properties", () => {
      registerSkill(`---\nname: Listed\n---\nContent`);
      const skills = listSkills();
      expect(skills[0].id).toBe("Listed");
      expect(skills[0].metadata).toBeDefined();
    });
  });

  describe("unregisterSkill function", () => {
    it("should return true when skill is removed", () => {
      registerSkill(`---\nname: To Remove\n---\nContent`);
      const result = unregisterSkill("To Remove");
      expect(result).toBe(true);
    });

    it("should return false when skill does not exist", () => {
      const result = unregisterSkill("non-existent");
      expect(result).toBe(false);
    });

    it("should actually remove skill from registry", () => {
      registerSkill(`---\nname: Remove Test\n---\nContent`);
      unregisterSkill("Remove Test");
      const result = getSkill("Remove Test");
      expect(result.found).toBe(false);
    });

    it("should not affect other skills", () => {
      registerSkill(`---\nname: Keep\n---\nContent`);
      registerSkill(`---\nname: Remove\n---\nContent`);
      unregisterSkill("Remove");
      expect(getSkill("Keep").found).toBe(true);
    });
  });

  describe("clearSkillRegistry function", () => {
    it("should remove all skills", () => {
      registerSkill(`---\nname: One\n---\nC`);
      registerSkill(`---\nname: Two\n---\nC`);
      registerSkill(`---\nname: Three\n---\nC`);
      clearSkillRegistry();
      expect(listSkills().length).toBe(0);
    });

    it("should be safe to call on empty registry", () => {
      expect(() => clearSkillRegistry()).not.toThrow();
    });

    it("should allow re-registration after clear", () => {
      registerSkill(`---\nname: Old Name\n---\nOld`);
      clearSkillRegistry();
      registerSkill(`---\nname: New Name\n---\nNew`);
      expect(getSkill("New Name").skill?.metadata.name).toBe("New Name");
    });
  });

  describe("findSkillsByTrigger function", () => {
    beforeEach(() => {
      registerSkill(
        `---
name: Greeting Skill
triggers:
  - hello
  - hi there
---
Greets the user`
      );
      registerSkill(
        `---
name: Farewell Skill
triggers:
  - goodbye
  - bye
---
Says goodbye`
      );
      registerSkill(
        `---
name: No Triggers
---
No triggers defined`
      );
    });

    it("should find skill by exact trigger", () => {
      const matches = findSkillsByTrigger("hello");
      expect(matches.length).toBe(1);
      expect(matches[0].id).toBe("Greeting Skill");
    });

    it("should find skill by trigger in phrase", () => {
      const matches = findSkillsByTrigger("say hello to me");
      expect(matches.length).toBe(1);
    });

    it("should be case insensitive", () => {
      const matches = findSkillsByTrigger("HELLO");
      expect(matches.length).toBe(1);
    });

    it("should return empty for no matches", () => {
      const matches = findSkillsByTrigger("unknown trigger");
      expect(matches.length).toBe(0);
    });

    it("should match multi-word triggers", () => {
      const matches = findSkillsByTrigger("hi there friend");
      expect(matches.length).toBe(1);
      expect(matches[0].id).toBe("Greeting Skill");
    });

    it("should return multiple matches if same trigger in different skills", () => {
      clearSkillRegistry();
      registerSkill(`---
name: Skill A
triggers:
  - common
---
A`);
      registerSkill(`---
name: Skill B
triggers:
  - common
---
B`);
      const matches = findSkillsByTrigger("common");
      expect(matches.length).toBe(2);
    });
  });

  describe("registerSkillFromFile function", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skill-test-"));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should register skill from file", () => {
      const filePath = path.join(tempDir, "test-skill.md");
      fs.writeFileSync(
        filePath,
        `---
name: File Skill
---
From file`
      );
      const skill = registerSkillFromFile(filePath);
      expect(skill).not.toBeNull();
      expect(skill?.metadata.name).toBe("File Skill");
    });

    it("should set source to file path", () => {
      const filePath = path.join(tempDir, "source-test.md");
      fs.writeFileSync(filePath, `---\nname: Source Test\n---\nContent`);
      const skill = registerSkillFromFile(filePath);
      expect(skill?.source).toBe(filePath);
    });

    it("should return null for non-existent file", () => {
      const skill = registerSkillFromFile("/non/existent/path.md");
      expect(skill).toBeNull();
    });

    it("should return null for invalid markdown", () => {
      const filePath = path.join(tempDir, "invalid.md");
      fs.writeFileSync(filePath, "No frontmatter");
      const skill = registerSkillFromFile(filePath);
      expect(skill).toBeNull();
    });

    it("should register skill in registry", () => {
      const filePath = path.join(tempDir, "registry-test.md");
      fs.writeFileSync(filePath, `---\nname: From File\n---\nContent`);
      registerSkillFromFile(filePath);
      const result = getSkill("From File");
      expect(result.found).toBe(true);
    });
  });

  describe("loadSkillsFromDirectory function", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-dir-"));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should load all markdown files from directory", () => {
      fs.writeFileSync(path.join(tempDir, "skill1.md"), `---\nname: Skill One\n---\nC`);
      fs.writeFileSync(path.join(tempDir, "skill2.md"), `---\nname: Skill Two\n---\nC`);
      fs.writeFileSync(path.join(tempDir, "skill3.md"), `---\nname: Skill Three\n---\nC`);
      const count = loadSkillsFromDirectory(tempDir);
      expect(count).toBe(3);
    });

    it("should ignore non-markdown files", () => {
      fs.writeFileSync(path.join(tempDir, "skill.md"), `---\nname: Valid\n---\nC`);
      fs.writeFileSync(path.join(tempDir, "readme.txt"), "Not a skill");
      fs.writeFileSync(path.join(tempDir, "data.json"), "{}");
      const count = loadSkillsFromDirectory(tempDir);
      expect(count).toBe(1);
    });

    it("should return 0 for non-existent directory", () => {
      const count = loadSkillsFromDirectory("/non/existent/dir");
      expect(count).toBe(0);
    });

    it("should return 0 for empty directory", () => {
      const count = loadSkillsFromDirectory(tempDir);
      expect(count).toBe(0);
    });

    it("should skip invalid markdown files", () => {
      fs.writeFileSync(path.join(tempDir, "valid.md"), `---\nname: Valid\n---\nC`);
      fs.writeFileSync(path.join(tempDir, "invalid.md"), "No frontmatter");
      const count = loadSkillsFromDirectory(tempDir);
      expect(count).toBe(1);
    });

    it("should register skills in registry", () => {
      fs.writeFileSync(path.join(tempDir, "reg.md"), `---\nname: Registered\n---\nC`);
      loadSkillsFromDirectory(tempDir);
      const skills = listSkills();
      expect(skills.length).toBe(1);
    });
  });

  describe("getRegistryState function", () => {
    it("should return count of 0 when empty", () => {
      const state = getRegistryState();
      expect(state.count).toBe(0);
    });

    it("should return correct count after registrations", () => {
      registerSkill(`---\nname: One\n---\nC`);
      registerSkill(`---\nname: Two\n---\nC`);
      const state = getRegistryState();
      expect(state.count).toBe(2);
    });

    it("should return skills Map with all skills", () => {
      registerSkill(`---\nname: Alpha\n---\nC`);
      registerSkill(`---\nname: Beta\n---\nC`);
      const state = getRegistryState();
      expect(state.skills).toBeInstanceOf(Map);
      expect(state.skills.has("Alpha")).toBe(true);
      expect(state.skills.has("Beta")).toBe(true);
    });

    it("should reflect changes after unregister", () => {
      registerSkill(`---\nname: Temp\n---\nC`);
      let state = getRegistryState();
      expect(state.count).toBe(1);
      unregisterSkill("Temp");
      state = getRegistryState();
      expect(state.count).toBe(0);
    });

    it("should return independent copy of skills map", () => {
      registerSkill(`---\nname: Original\n---\nC`);
      const state = getRegistryState();
      state.skills.delete("Original");
      // Original should still exist in actual registry
      const result = getSkill("Original");
      expect(result.found).toBe(true);
    });
  });
});
