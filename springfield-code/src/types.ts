/**
 * Shared TypeScript types for Springfield Code Plugin
 * 
 * @module types
 */

/**
 * Common command execution context
 */
export interface CommandContext {
  /** Current working directory */
  cwd?: string;
}

/**
 * Result of prerequisite verification
 */
export interface PrerequisiteResult {
  /** Whether all prerequisites are met */
  ready: boolean;
  /** List of missing or incomplete files */
  missing: string[];
  /** List of present and valid files */
  present: string[];
  /** List of optional context files found */
  context: string[];
  /** Any errors encountered during verification */
  errors: string[];
}

/**
 * Conversation context for artifact generation
 */
export interface ConversationContext {
  /** Character name */
  character: string;
  /** User input/prompt */
  userInput: string;
  /** When the conversation started */
  timestamp: Date;
}

/**
 * Character tier definitions
 */
export type CharacterTier = "simpson_family" | "extended" | "springfield" | "specialists";

/**
 * Artifact generation result
 */
export interface ArtifactResult {
  /** Whether the artifact was successfully created */
  success: boolean;
  /** Path to the created artifact file */
  filePath?: string;
  /** Error message if failed */
  error?: string;
}
