/**
 * Demo Scenarios Registry
 * Central registry of all available demo scenarios
 *
 * @module demo/scenarios
 */

import type { DemoScenario } from "../types.js";
import { nanDisasterScenario } from "./nan-disaster.js";
import { securityBypassScenario } from "./security-bypass.js";
import { fullExperienceScenario } from "./full-experience.js";

/**
 * All available demo scenarios
 */
export const DEMO_SCENARIOS: DemoScenario[] = [
  nanDisasterScenario,
  securityBypassScenario,
  fullExperienceScenario,
];

/**
 * Get all demo scenarios
 * @returns Copy of scenarios array
 */
export function getAllScenarios(): DemoScenario[] {
  return [...DEMO_SCENARIOS];
}

/**
 * Get scenario by numeric ID
 * @param id - Scenario ID
 * @returns Scenario or undefined
 */
export function getScenarioById(id: number): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}

/**
 * Get scenario by slug
 * @param slug - URL-friendly slug
 * @returns Scenario or undefined
 */
export function getScenarioBySlug(slug: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.slug === slug);
}

/**
 * Get scenarios by tag
 * @param tag - Tag to filter by
 * @returns Matching scenarios
 */
export function getScenariosByTag(tag: string): DemoScenario[] {
  return DEMO_SCENARIOS.filter((s) => s.tags?.includes(tag));
}

/**
 * Total number of scenarios
 */
export const TOTAL_SCENARIOS = DEMO_SCENARIOS.length;

// Re-export individual scenarios for direct import
export { nanDisasterScenario } from "./nan-disaster.js";
export { securityBypassScenario } from "./security-bypass.js";
export { fullExperienceScenario } from "./full-experience.js";
