/**
 * Edna Krabappel artifact generator
 * 
 * @module artifacts/generators/edna
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Edna's code review artifact
 */
export function generateEdnaArtifact(context: ConversationContext): string {
  return `# Edna Krabappel's Code Review

*Ha!* 📝

Topic: ${context.userInput}

## Review Summary

### Overall Grade: B-
*Shows potential, but needs work...*

## Comments

### What's Good
- [ ] [File:Line] - Decent structure here
- [ ] [Pattern] - At least you tried

### Needs Improvement
| File | Line | Issue | Edna Says |
|------|------|-------|-----------|
| [file] | 42 | Magic number | "Ha!" |
| [file] | 108 | No tests | "*sigh*" |

### Failing
1. [ ] [Code smell] - "I've seen better"
2. [ ] [Anti-pattern] - "Again with this?"

## Teaching Moments
- "Have you considered... reading the docs?"
- "This worked, but do you know WHY?"
- "Copy-pasting isn't learning"

## Final Notes
- Must show work
- See me after class
- Extra credit: Add tests

*Class dismissed. Ha!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
