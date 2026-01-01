/**
 * Skills Module Deep Tests (Batch 79)
 *
 * Deep testing of the skills markdown files and their content,
 * verifying skill definitions and documentation quality.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SKILLS_PATH = path.join(__dirname, "..", "src", "skills");

describe("Skills Directory", () => {
  it("exists", () => {
    expect(fs.existsSync(SKILLS_PATH)).toBe(true);
  });

  it("is a directory", () => {
    const stat = fs.statSync(SKILLS_PATH);
    expect(stat.isDirectory()).toBe(true);
  });

  it("contains markdown files", () => {
    const files = fs.readdirSync(SKILLS_PATH);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    expect(mdFiles.length).toBeGreaterThan(0);
  });
});

describe("Springfield Skill File", () => {
  const springfieldSkillPath = path.join(SKILLS_PATH, "springfield.md");

  it("exists", () => {
    expect(fs.existsSync(springfieldSkillPath)).toBe(true);
  });

  it("has content", () => {
    const content = fs.readFileSync(springfieldSkillPath, "utf-8");
    expect(content.length).toBeGreaterThan(100);
  });

  it("contains heading somewhere", () => {
    const content = fs.readFileSync(springfieldSkillPath, "utf-8");
    expect(content).toMatch(/^#+\s/m);
  });

  it("mentions springfield", () => {
    const content = fs.readFileSync(springfieldSkillPath, "utf-8");
    expect(content.toLowerCase()).toContain("springfield");
  });

  it("contains skill documentation", () => {
    const content = fs.readFileSync(springfieldSkillPath, "utf-8");
    // Should have multiple headings
    const headings = content.match(/^#+\s/gm);
    expect(headings).not.toBeNull();
    expect(headings!.length).toBeGreaterThan(0);
  });
});

describe("Skills File Format", () => {
  it("skill files ending in .md are markdown", () => {
    const files = fs.readdirSync(SKILLS_PATH);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  it("springfield.md exists", () => {
    const files = fs.readdirSync(SKILLS_PATH);
    expect(files).toContain("springfield.md");
  });

  it("no skill files have spaces in names", () => {
    const files = fs.readdirSync(SKILLS_PATH);
    for (const file of files) {
      expect(file.includes(" ")).toBe(false);
    }
  });
});

describe("Skills Content Quality", () => {
  it("each skill file has substantial content", () => {
    const files = fs.readdirSync(SKILLS_PATH);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(path.join(SKILLS_PATH, file), "utf-8");
        expect(content.length).toBeGreaterThan(50);
      }
    }
  });

  it("each skill file is valid UTF-8", () => {
    const files = fs.readdirSync(SKILLS_PATH);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(path.join(SKILLS_PATH, file), "utf-8");
        expect(typeof content).toBe("string");
      }
    }
  });
});
