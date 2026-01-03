/**
 * Demo Scenario: The NaN Disaster
 * Lisa prevents a critical calculation bug
 *
 * @module demo/scenarios/nan-disaster
 */

import type { DemoScenario } from "../types.js";

export const nanDisasterScenario: DemoScenario = {
  id: 1,
  slug: "nan-disaster",
  name: "The NaN Disaster",
  summary: "Lisa catches a potential NaN propagation bug before it ships",
  intro: `*Krusty steps up to the microphone*

"Hey hey, kids! Krusty here to show you how Springfield Code
saved Bart's bacon - and by bacon, I mean his entire codebase!

This is the story of how Lisa's methodical analysis caught
a bug that would have made every calculation return NaN.
Not the bread, folks - the OTHER NaN!"`,

  steps: [
    {
      step: 1,
      title: "Developer Writes Calculation Code",
      description: "A developer writes a function to calculate user statistics",
      command: "// user-stats.ts\nfunction calculateAverage(values: number[]) {\n  return values.reduce((a, b) => a + b) / values.length;\n}",
      expected: "Code looks clean, right? But wait...",
      pauseMs: 2000,
    },
    {
      step: 2,
      title: "Summoning Lisa",
      description: "The developer invokes Lisa for structured analysis",
      character: "lisa",
      command: "/lisa Review this calculation function for edge cases",
      expected: "Lisa begins her methodical analysis...",
      pauseMs: 1500,
    },
    {
      step: 3,
      title: "Lisa's Analysis",
      description: "Lisa identifies the critical flaw",
      character: "lisa",
      expected: `*adjusts glasses*

"Statistically speaking, this function has a 100% chance
of catastrophic failure on empty arrays.

When values.length is 0:
- reduce() on empty array throws (no initial value!)
- Even with initial value 0: 0 / 0 = NaN
- NaN propagates to EVERYTHING it touches

I recommend:
1. Guard clause for empty arrays
2. Explicit initial value in reduce
3. Return meaningful default (0, null, or throw)"`,
      pauseMs: 3000,
    },
    {
      step: 4,
      title: "The Fix",
      description: "Developer implements Lisa's recommendations",
      command: "function calculateAverage(values: number[]): number {\n  if (values.length === 0) {\n    return 0; // Or throw, depending on requirements\n  }\n  return values.reduce((a, b) => a + b, 0) / values.length;\n}",
      expected: "Safe, robust, and NaN-free!",
      pauseMs: 2000,
    },
    {
      step: 5,
      title: "Bart's Follow-up",
      description: "Bart adds chaos testing perspective",
      character: "bart",
      command: "/bart What about other edge cases?",
      expected: `*evil grin*

"Ay caramba! You fixed the empty array, but what about:
- Infinity values? Infinity + anything = Infinity
- Negative zero? Yeah, that's a thing
- Arrays with only one element? (No bug, but test it!)
- What if someone passes strings? TypeScript helps, but..."`,
      pauseMs: 2500,
    },
  ],

  liveScript: [
    "Welcome to Demo 1: The NaN Disaster",
    "We'll see how Lisa catches bugs through structured analysis",
    "First, let's look at some innocent-looking code...",
    "[Show the calculation function]",
    "Looks clean, right? Now let's summon Lisa...",
    "[Run /lisa command]",
    "Notice how she methodically identifies the edge case",
    "The empty array case would cause NaN to propagate everywhere",
    "[Show the fix]",
    "And Bart follows up with chaos testing ideas!",
  ],

  faq: [
    {
      question: "Why is NaN propagation so dangerous?",
      answer: "NaN (Not a Number) is contagious - any operation involving NaN returns NaN. One uncaught NaN can corrupt an entire data pipeline, making debugging extremely difficult.",
    },
    {
      question: "Would TypeScript catch this?",
      answer: "Not by default. TypeScript sees number[] -> number as valid. Runtime checks or stricter linting rules (like no-unsafe-return) can help.",
    },
    {
      question: "How does Springfield Code help here?",
      answer: "Lisa's character is designed to think methodically about edge cases. Her prompts encourage systematic analysis that catches these issues before they reach production.",
    },
  ],

  tags: ["bug-prevention", "edge-cases", "lisa", "bart", "calculations"],
  durationMinutes: 5,
};
