/**
 * Response Enhancer
 * Decorates character responses with easter eggs and rare events
 *
 * This module provides the integration point for delight moments
 * into the character response flow.
 *
 * @module utils/response-enhancer
 */

import { checkActiveEasterEgg, formatEasterEggPrefix } from "./easter-eggs.js";
import { checkRareEvent, formatRareEventSuffix } from "./rare-events.js";

/**
 * Configuration flags for enhancement features
 */
export interface EnhancementConfig {
  /** Enable date/time easter eggs (default: true) */
  easterEggsEnabled: boolean;
  /** Enable rare random events (default: true) */
  rareEventsEnabled: boolean;
}

/**
 * Default enhancement configuration
 */
export const DEFAULT_ENHANCEMENT_CONFIG: EnhancementConfig = {
  easterEggsEnabled: true,
  rareEventsEnabled: true,
};

/**
 * Result of enhancement calculation
 */
export interface EnhancementResult {
  /** Text to prepend to response (easter eggs) */
  prefix: string;
  /** Text to append to response (rare events) */
  suffix: string;
  /** Metadata about what triggered */
  metadata: {
    /** ID of active easter egg (if any) */
    easterEggId?: string;
    /** ID of triggered rare event (if any) */
    rareEventId?: string;
    /** Context that triggered the rare event */
    rareEventTrigger?: string;
  };
}

/**
 * Calculate response enhancements based on current context
 *
 * @param character - Character being summoned
 * @param userInput - User's input text
 * @param config - Enhancement configuration (optional)
 * @returns Enhancement result with prefix, suffix, and metadata
 */
export function calculateEnhancements(
  character: string,
  userInput: string,
  config: EnhancementConfig = DEFAULT_ENHANCEMENT_CONFIG
): EnhancementResult {
  const result: EnhancementResult = {
    prefix: "",
    suffix: "",
    metadata: {},
  };

  // Check easter eggs (if enabled)
  if (config.easterEggsEnabled) {
    const easterEgg = checkActiveEasterEgg();
    if (easterEgg) {
      result.prefix = formatEasterEggPrefix(easterEgg, character);
      result.metadata.easterEggId = easterEgg.id;
    }
  }

  // Check rare events (if enabled)
  if (config.rareEventsEnabled) {
    const rareEvent = checkRareEvent(userInput);
    if (rareEvent.triggered && rareEvent.event) {
      result.suffix = formatRareEventSuffix(rareEvent.event);
      result.metadata.rareEventId = rareEvent.event.id;
      result.metadata.rareEventTrigger = rareEvent.triggerContext;
    }
  }

  return result;
}

/**
 * Apply enhancements to a character response
 *
 * @param originalResponse - The base character response
 * @param enhancements - Calculated enhancements
 * @returns Enhanced response string
 */
export function applyEnhancements(
  originalResponse: string,
  enhancements: EnhancementResult
): string {
  return `${enhancements.prefix}${originalResponse}${enhancements.suffix}`;
}

/**
 * Convenience function to enhance a response in one call
 *
 * @param character - Character being summoned
 * @param userInput - User's input text
 * @param originalResponse - The base character response
 * @param config - Enhancement configuration (optional)
 * @returns Enhanced response and metadata
 */
export function enhanceResponse(
  character: string,
  userInput: string,
  originalResponse: string,
  config: EnhancementConfig = DEFAULT_ENHANCEMENT_CONFIG
): { response: string; metadata: EnhancementResult["metadata"] } {
  const enhancements = calculateEnhancements(character, userInput, config);
  const response = applyEnhancements(originalResponse, enhancements);

  return {
    response,
    metadata: enhancements.metadata,
  };
}

/**
 * Check if any enhancements are currently active
 *
 * This is a lightweight check that doesn't calculate the full enhancements,
 * useful for quick status checks.
 *
 * @param config - Enhancement configuration (optional)
 * @returns true if any enhancement could be active
 */
export function hasActiveEnhancements(
  config: EnhancementConfig = DEFAULT_ENHANCEMENT_CONFIG
): boolean {
  if (config.easterEggsEnabled) {
    const easterEgg = checkActiveEasterEgg();
    if (easterEgg) return true;
  }

  // Note: Can't check rare events without context
  // They're probability-based anyway

  return false;
}

/**
 * Get a summary of currently active special events
 *
 * @param config - Enhancement configuration (optional)
 * @returns Summary string
 */
export function getEnhancementStatus(
  config: EnhancementConfig = DEFAULT_ENHANCEMENT_CONFIG
): string {
  const lines: string[] = ["## Delight Features Status", ""];

  lines.push(
    `- Easter Eggs: ${config.easterEggsEnabled ? "ENABLED" : "DISABLED"}`
  );
  lines.push(
    `- Rare Events: ${config.rareEventsEnabled ? "ENABLED" : "DISABLED"}`
  );

  if (config.easterEggsEnabled) {
    const easterEgg = checkActiveEasterEgg();
    if (easterEgg) {
      lines.push("");
      lines.push(`**Active Event:** ${easterEgg.name}`);
    } else {
      lines.push("");
      lines.push("*No special date/time event currently active*");
    }
  }

  if (config.rareEventsEnabled) {
    lines.push("");
    lines.push("*Rare events trigger randomly based on context*");
  }

  return lines.join("\n");
}
