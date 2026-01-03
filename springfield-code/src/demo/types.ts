/**
 * Demo Kit Types
 * Type definitions for Springfield Code demos
 *
 * @module demo/types
 */

/**
 * A single step in a demo scenario
 */
export interface DemoStep {
  /** Step number (1-based) */
  step: number;
  /** Title for this step */
  title: string;
  /** Description of what happens */
  description: string;
  /** Character involved (if any) */
  character?: string;
  /** Command to run (if any) */
  command?: string;
  /** Expected output/result */
  expected?: string;
  /** Time to wait before next step (ms) - for pacing */
  pauseMs?: number;
}

/**
 * FAQ entry for a demo
 */
export interface DemoFAQ {
  /** Question */
  question: string;
  /** Answer */
  answer: string;
}

/**
 * Complete demo scenario
 */
export interface DemoScenario {
  /** Numeric ID for quick reference */
  id: number;
  /** URL-friendly slug */
  slug: string;
  /** Display name */
  name: string;
  /** One-line summary */
  summary: string;
  /** Krusty's intro narration */
  intro: string;
  /** Detailed steps */
  steps: DemoStep[];
  /** Script for live presentations */
  liveScript: string[];
  /** Common questions and answers */
  faq?: DemoFAQ[];
  /** Tags for filtering */
  tags?: string[];
  /** Estimated duration in minutes */
  durationMinutes?: number;
}

/**
 * Options for running a demo
 */
export interface DemoRunOptions {
  /** Fast mode - skip pauses */
  fast?: boolean;
  /** Output as markdown */
  markdown?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Run without interactive prompts */
  nonInteractive?: boolean;
}

/**
 * Result of running a demo
 */
export interface DemoRunResult {
  /** Scenario that was run */
  scenario: DemoScenario;
  /** Whether completed successfully */
  success: boolean;
  /** Steps completed */
  stepsCompleted: number;
  /** Total steps */
  totalSteps: number;
  /** Duration in ms */
  durationMs: number;
  /** Any error message */
  error?: string;
}
