/**
 * Constants for Springfield Code Plugin
 */

import * as fs from "fs";
import * as path from "path";
import { getCachedConfig } from "./config.js";

export const REQUIRED_FILES = [
  "project.md",
  "task.md",
  "completion.md",
  "iterations.md",
] as const;

export type RequiredFile = typeof REQUIRED_FILES[number];

export interface RequiredFilesValidation {
  isValid: boolean;
  missing: RequiredFile[];
  present: RequiredFile[];
  incomplete: RequiredFile[];
  errors: string[];
}

/**
 * Validate that all required files exist and have substantive content
 * @param springfieldDir - Path to the .springfield directory
 * @param minContentLength - Minimum content length to consider a file "complete" (uses config default)
 * @returns Validation result with details about missing/incomplete files
 */
export function validateRequiredFiles(
  springfieldDir: string,
  minContentLength?: number
): RequiredFilesValidation {
  const minLength = minContentLength ?? getCachedConfig().minContentLength;
  const result: RequiredFilesValidation = {
    isValid: true,
    missing: [],
    present: [],
    incomplete: [],
    errors: [],
  };

  // Check if directory exists
  if (!fs.existsSync(springfieldDir)) {
    result.isValid = false;
    result.errors.push(`Springfield directory does not exist: ${springfieldDir}`);
    result.missing = [...REQUIRED_FILES];
    return result;
  }

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(springfieldDir, file);
    
    if (!fs.existsSync(filePath)) {
      result.missing.push(file);
      result.isValid = false;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      
      // Check if file has substantive content
      if (content.length < minLength) {
        result.incomplete.push(file);
        result.isValid = false;
      } else if (content.includes("[One paragraph") || content.includes("[What") || content.includes("[Describe")) {
        // Still has template placeholders
        result.incomplete.push(file);
        result.isValid = false;
      } else {
        result.present.push(file);
      }
    } catch (error) /* istanbul ignore next -- @preserve Cannot mock fs.readFileSync in ESM */ {
      result.errors.push(`Failed to read ${file}: ${error}`);
      result.isValid = false;
    }
  }

  return result;
}

export const CHARACTER_ARTIFACTS: Record<string, string> = {
  homer: "questions.md",
  marge: "structure.md",
  bart: "edge-cases.md",
  lisa: "project.md", // Also produces task.md
  maggie: "logging.md",
  grampa: "history.md",
  burns: "budget.md",
  smithers: "schedule.md",
  flanders: "standards.md",
  milhouse: "dependencies.md",
  moe: "debug-notes.md",
  wiggum: "security-review.md",
  krusty: "demo.md",
  bob: "adversarial.md",
  skinner: "timeline.md",
  nelson: "tests.md",
  apu: "utilities.md",
  frink: "experiments.md",
  cbg: "docs-review.md",
  willie: "infrastructure.md",
  // Specialist characters (v2.1.0)
  "dr-nick": "dr-nick-health.md",
  patty: "patty-compliance.md",
  troy: "troy-onboarding.md",
  lionel: "lionel-legal.md",
  hans: "hans-accessibility.md",
  hibbert: "hibbert-performance.md",
  edna: "edna-review.md",
  otto: "otto-migration.md",
  lenny: "lenny-abtesting.md",
  kent: "kent-monitoring.md",
  snake: "snake-auth.md",
  cookie: "cookie-database.md",
  gil: "gil-errors.md",
  bumblebee: "bumblebee-i18n.md",
  duffman: "duffman-flags.md",
  "fat-tony": "fat-tony-microservices.md",
  "sea-captain": "sea-captain-containers.md",
  lovejoy: "lovejoy-events.md",
  helen: "helen-analytics.md",
  agnes: "agnes-cicd.md",
};

export const CHARACTER_TIERS = {
  simpson_family: ["homer", "marge", "bart", "lisa", "maggie"],
  extended: ["grampa", "burns", "smithers", "flanders"],
  springfield: [
    "milhouse",
    "moe",
    "wiggum",
    "ralph",
    "krusty",
    "bob",
    "skinner",
    "nelson",
    "apu",
    "frink",
    "cbg",
    "willie",
  ],
  specialists: [
    "dr-nick",
    "patty",
    "troy",
    "lionel",
    "hans",
    "hibbert",
    "edna",
    "otto",
    "lenny",
    "kent",
    "snake",
    "cookie",
    "gil",
    "bumblebee",
    "duffman",
    "fat-tony",
    "sea-captain",
    "lovejoy",
    "helen",
    "agnes",
  ],
} as const;

export const ALL_CHARACTERS = [
  ...CHARACTER_TIERS.simpson_family,
  ...CHARACTER_TIERS.extended,
  ...CHARACTER_TIERS.springfield,
  ...CHARACTER_TIERS.specialists,
] as const;

export const SPRINGFIELD_DIR = ".springfield";

export const DEFAULT_COMPLETION_PROMISE = "DONE";
export const DEFAULT_MAX_ITERATIONS = 20;
