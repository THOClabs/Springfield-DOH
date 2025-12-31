/**
 * Constants for Springfield Code Plugin
 */

export const REQUIRED_FILES = [
  "project.md",
  "task.md",
  "completion.md",
  "iterations.md",
] as const;

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
} as const;

export const ALL_CHARACTERS = [
  ...CHARACTER_TIERS.simpson_family,
  ...CHARACTER_TIERS.extended,
  ...CHARACTER_TIERS.springfield,
] as const;

export const SPRINGFIELD_DIR = ".springfield";

export const DEFAULT_COMPLETION_PROMISE = "DONE";
export const DEFAULT_MAX_ITERATIONS = 20;
