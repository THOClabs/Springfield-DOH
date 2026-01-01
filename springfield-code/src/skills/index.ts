/**
 * Springfield Skill System
 *
 * Registry and utilities for skill composition.
 * Skills allow characters to share common capabilities.
 *
 * @module skills
 * @since v3.0.0
 */

import * as fs from "fs";
import * as path from "path";
import type {
  Skill,
  SkillMetadata,
  RegisterSkillOptions,
  SkillLookupResult,
  SkillRegistryState,
} from "./types.js";

// Re-export types
export type {
  Skill,
  SkillMetadata,
  RegisterSkillOptions,
  SkillLookupResult,
  SkillRegistryState,
} from "./types.js";

/**
 * Global skill registry
 */
const skillRegistry: Map<string, Skill> = new Map();

/**
 * Parse YAML frontmatter from markdown content
 *
 * @param content - Raw markdown content with optional frontmatter
 * @returns Tuple of [metadata, remaining content]
 */
export function parseFrontmatter(content: string): [SkillMetadata | null, string] {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return [null, content];
  }

  const yamlContent = match[1];
  const markdownContent = match[2];

  // Simple YAML parser for skill metadata - use index signature compatible object
  const metadataObj: Record<string, string | string[] | undefined> = {
    name: "",
    description: "",
  };

  const lines = yamlContent.split("\n");
  let currentKey: string | null = null;
  let currentArray: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Handle array items
    if (trimmed.startsWith("- ") && currentKey) {
      currentArray.push(trimmed.slice(2).trim());
      continue;
    }

    // If we were building an array, save it
    if (currentKey && currentArray.length > 0) {
      metadataObj[currentKey] = currentArray;
      currentArray = [];
    }

    // Handle key-value pairs
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex > 0) {
      currentKey = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();

      if (value) {
        metadataObj[currentKey] = value;
        currentKey = null;
      }
    }
  }

  // Save any remaining array
  if (currentKey && currentArray.length > 0) {
    metadataObj[currentKey] = currentArray;
  }

  // Cast to SkillMetadata
  // Note: name/description are initialized to "" so ?? is unnecessary, kept for type safety
  const metadata: SkillMetadata = {
    name: String(metadataObj.name || ""),
    description: String(metadataObj.description || ""),
    triggers: Array.isArray(metadataObj.triggers) ? metadataObj.triggers : undefined,
    dependencies: Array.isArray(metadataObj.dependencies) ? metadataObj.dependencies : undefined,
    version: typeof metadataObj.version === "string" ? metadataObj.version : undefined,
    author: typeof metadataObj.author === "string" ? metadataObj.author : undefined,
  };

  return [metadata, markdownContent];
}

/**
 * Register a skill in the global registry
 *
 * @param markdown - Skill definition as markdown with frontmatter
 * @param options - Registration options
 * @returns The registered skill or null if registration failed
 */
export function registerSkill(
  markdown: string,
  options: RegisterSkillOptions = {}
): Skill | null {
  const [metadata, content] = parseFrontmatter(markdown);

  if (!metadata || !metadata.name) {
    return null;
  }

  // Check if skill already exists
  if (skillRegistry.has(metadata.name) && !options.override) {
    return null;
  }

  const skill: Skill = {
    id: metadata.name,
    metadata,
    content: content.trim(),
    source: options.source,
  };

  skillRegistry.set(skill.id, skill);
  return skill;
}

/**
 * Register a skill from a file
 *
 * @param filePath - Path to the skill markdown file
 * @param options - Registration options
 * @returns The registered skill or null if registration failed
 */
export function registerSkillFromFile(
  filePath: string,
  options: RegisterSkillOptions = {}
): Skill | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return registerSkill(content, { ...options, source: filePath });
  } catch {
    return null;
  }
}

/**
 * Get a skill by ID
 *
 * @param id - Skill identifier
 * @returns Skill lookup result
 */
export function getSkill(id: string): SkillLookupResult {
  const skill = skillRegistry.get(id);

  if (skill) {
    return { found: true, skill };
  }

  return { found: false, error: `Skill not found: ${id}` };
}

/**
 * List all registered skills
 *
 * @returns Array of all registered skills
 */
export function listSkills(): Skill[] {
  return Array.from(skillRegistry.values());
}

/**
 * Get skill registry state
 *
 * @returns Current registry state
 */
export function getRegistryState(): SkillRegistryState {
  return {
    skills: new Map(skillRegistry),
    count: skillRegistry.size,
  };
}

/**
 * Unregister a skill by ID
 *
 * @param id - Skill identifier to remove
 * @returns True if skill was removed, false if not found
 */
export function unregisterSkill(id: string): boolean {
  return skillRegistry.delete(id);
}

/**
 * Clear all registered skills
 *
 * Primarily useful for testing
 */
export function clearSkillRegistry(): void {
  skillRegistry.clear();
}

/**
 * Load all skills from a directory
 *
 * @param dirPath - Path to directory containing skill markdown files
 * @param options - Registration options applied to all skills
 * @returns Number of skills loaded successfully
 */
export function loadSkillsFromDirectory(
  dirPath: string,
  options: RegisterSkillOptions = {}
): number {
  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  let loaded = 0;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(dirPath, file);
    const skill = registerSkillFromFile(filePath, options);

    if (skill) {
      loaded++;
    }
  }

  return loaded;
}

/**
 * Find skills by trigger phrase
 *
 * @param phrase - Trigger phrase to search for
 * @returns Array of matching skills
 */
export function findSkillsByTrigger(phrase: string): Skill[] {
  const normalizedPhrase = phrase.toLowerCase();
  const matches: Skill[] = [];

  for (const skill of skillRegistry.values()) {
    const triggers = skill.metadata.triggers ?? [];

    for (const trigger of triggers) {
      if (normalizedPhrase.includes(trigger.toLowerCase())) {
        matches.push(skill);
        break;
      }
    }
  }

  return matches;
}
