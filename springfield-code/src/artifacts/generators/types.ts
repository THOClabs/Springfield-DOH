/**
 * Types for artifact generators
 * 
 * @module artifacts/generators/types
 */

import type { ConversationContext } from "../../types.js";

/**
 * Function signature for all character artifact generators
 */
export type ArtifactGenerator = (context: ConversationContext) => string;

// Re-export for convenience
export type { ConversationContext };
