/**
 * Homer Simpson artifact generator
 * 
 * @module artifacts/generators/homer
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Homer's "obvious questions" artifact
 */
export function generateHomerArtifact(context: ConversationContext): string {
  return `# Homer's Questions

## The Obvious Ones (That Aren't)
1. Why are we doing this again?
2. What's the simplest possible way?
3. Can we just... not do that part?

## The "Why" Chain
Starting from: ${context.userInput}
- Why do we need this?
  - Because...
    - But why?
      - [Keep asking until root cause]

## Food-Based Understanding
[Metaphor explaining the system in simple terms]

## Things That Made My Brain Hurt
- [Concept 1] - This is too complicated
- [Concept 2] - Can we simplify this?

## Homer's Verdict
D'oh! Let me think about this more...

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
