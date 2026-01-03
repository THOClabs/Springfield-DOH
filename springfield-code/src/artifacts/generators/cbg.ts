/**
 * Comic Book Guy artifact generator
 * 
 * @module artifacts/generators/cbg
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Comic Book Guy's documentation review artifact
 */
export function generateCBGArtifact(context: ConversationContext): string {
  return `# Comic Book Guy's Documentation Review

*adjusts glasses*

Topic: ${context.userInput}

## Overall Assessment
**Rating:** ⭐⭐ / ⭐⭐⭐⭐⭐
**Verdict:** Needs Work

## What's Wrong
1. **Structure:** Worst organization ever
2. **Content:** Explains nothing
3. **Examples:** Don't work

## What It Should Have
- What this actually does
- How to install it
- A working example
- Where to get help

## Mandatory Improvements
- [ ] Fix critical issues
- [ ] Add missing examples
- [ ] Update outdated sections

## CBG's Verdict
"Worst documentation I've reviewed this hour."

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
