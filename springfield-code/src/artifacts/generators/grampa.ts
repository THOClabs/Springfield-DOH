/**
 * Grampa Simpson artifact generator
 * 
 * @module artifacts/generators/grampa
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Grampa's historical records artifact
 */
export function generateGrampaArtifact(context: ConversationContext): string {
  return `# Grampa's Historical Records

## Back in My Day...

### Project Origins
[Rambling story about how this started]

### Legacy Decisions
| Decision | When | Why |
|----------|------|-----|
| [Decision] | [Date] | "We did it because..." |

## Wars I've Fought (Past Technical Battles)
*falls asleep briefly*

Topic: ${context.userInput}

This reminds me of the time...

## Warnings From the Past
1. "We tried [X] and it was a disaster"
2. "Never trust [Y] when [Z] is happening"

## Grampa's Wisdom
*wakes up*

The important thing is [key lesson]

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
