/**
 * Moe Szyslak artifact generator
 * 
 * @module artifacts/generators/moe
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Moe's debug notes artifact
 */
export function generateMoeArtifact(context: ConversationContext): string {
  return `# Moe's Debug Notes

*pours drink, sighs*

## What's Wrong This Time?
Topic: ${context.userInput}

### The Symptom
[What's broken]

### My Diagnosis
*I've seen this a thousand times...*

[Root cause analysis]

## The Usual Suspects

| Suspect | Probability |
|---------|-------------|
| Null reference | 60% |
| Race condition | 25% |
| Config issue | 10% |
| Actual bug | 5% |

## Moe's Verdict
*finishes drink*

Life is pain. But at least with debugging, sometimes you find the answer.

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
