/**
 * Skill System Type Definitions
 *
 * Type definitions for the Springfield skill composition system.
 * Skills allow characters to share common capabilities.
 *
 * @module skills/types
 * @since v3.0.0
 */

/**
 * Skill metadata from YAML frontmatter
 */
export interface SkillMetadata {
  /** Unique skill identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** Trigger phrases that activate this skill */
  triggers?: string[];
  /** Other skills this skill depends on */
  dependencies?: string[];
  /** Skill version */
  version?: string;
  /** Skill author */
  author?: string;
}

/**
 * A registered skill with parsed content
 */
export interface Skill {
  /** Skill identifier (from metadata.name) */
  id: string;
  /** Parsed frontmatter metadata */
  metadata: SkillMetadata;
  /** Raw markdown content (after frontmatter) */
  content: string;
  /** Source file path (if loaded from file) */
  source?: string;
}

/**
 * Options for registering a skill
 */
export interface RegisterSkillOptions {
  /** Override existing skill with same ID */
  override?: boolean;
  /** Source file path */
  source?: string;
}

/**
 * Result of skill lookup operations
 */
export interface SkillLookupResult {
  found: boolean;
  skill?: Skill;
  error?: string;
}

/**
 * Skill registry state
 */
export interface SkillRegistryState {
  /** Map of skill ID to skill object */
  skills: Map<string, Skill>;
  /** Total number of registered skills */
  count: number;
}
