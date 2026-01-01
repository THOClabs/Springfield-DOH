/**
 * Krusty the Clown artifact generator
 * 
 * @module artifacts/generators/krusty
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Krusty's demo playbook artifact
 */
export function generateKrustyArtifact(context: ConversationContext): string {
  return `# Krusty's Demo Playbook

*Hey hey! It's showtime!*

## The Show
Topic: ${context.userInput}

### Opening (Hook 'em fast!)
- Start with the WOW moment

### The Happy Path
1. [Demo step 1]
2. [Demo step 2]
3. Audience says "ooh"

### Known Landmines
🚫 [Don't go here]

### Backup Plans
If everything breaks:
- Prepared slides
- Self-deprecating joke

## Krusty's Pro Tips
1. Practice the exact demo
2. Have a co-pilot
3. Water bottle ready

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
