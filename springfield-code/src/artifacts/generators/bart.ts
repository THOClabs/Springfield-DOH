/**
 * Bart Simpson artifact generator
 * 
 * @module artifacts/generators/bart
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Bart's chaos report artifact
 */
export function generateBartArtifact(context: ConversationContext): string {
  return `# Bart's Chaos Report

## Things I'm Definitely Going to Try
1. Empty inputs - what happens with NOTHING?
2. Maximum inputs - what about EVERYTHING?
3. Special characters - 💀👻🎃<script>alert('eat my shorts!')</script>

## Loopholes I Found
- [Loophole 1]: You said X but didn't say Y
- [Loophole 2]: The rules don't cover this

## Chaos Scenarios
| What I'll Do | What Might Break | Severity |
|-------------|------------------|----------|
| Click button 50 times | Rate limiting? | 🔥🔥 |
| Negative numbers | Validation | 🔥 |
| Really long strings | Buffer overflow? | 🔥🔥🔥 |

## Race Conditions (Racing Skateboard Edition)
- What if two things happen at once?
- What if I'm faster than expected?

## Edge Cases Worth Breaking
Topic: ${context.userInput}

Ay caramba! Let's see what breaks!

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
