/**
 * Gil Gunderson artifact generator
 * 
 * @module artifacts/generators/gil
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Gil's error handling artifact
 */
export function generateGilArtifact(context: ConversationContext): string {
  return `# Gil's Error Handling Patterns

*Ol' Gil really needs this to not crash...* 😰

Topic: ${context.userInput}

## Error Inventory

### Current Error Handling
| Location | Type | Handled? | Gil Says |
|----------|------|----------|----------|
| [file:line] | Network | ❌ | "Please, no..." |
| [file:line] | Validation | ⚠️ | "Almost!" |
| [file:line] | Database | ✅ | "Gil did it!" |

## Unhandled Cases

### Gil Has Seen These Fail Before
1. [ ] [Scenario] - No catch block
2. [ ] [Edge case] - Silent failure
3. [ ] [Timeout] - No retry logic

## Recovery Strategies

### Retry Pattern
\`\`\`
Attempt 1 → Fail
Attempt 2 → Fail (Gil's usual luck)
Attempt 3 → Maybe? Please?
\`\`\`

### Fallback Chain
1. Primary → [Action]
2. Secondary → [Fallback]
3. Last Resort → [Graceful degradation]

## Gil's Sad Experience
- "I've seen this timeout before..."
- "That null check saved my job once"
- "Please, just add a try-catch"

## Recommendations
- [ ] Add global error boundary
- [ ] Implement circuit breaker
- [ ] Add retry with backoff
- [ ] Log ALL errors (Gil begs you)

*Ol' Gil's handled worse... but barely.*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
