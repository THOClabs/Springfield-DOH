/**
 * Marge Simpson artifact generator
 * 
 * @module artifacts/generators/marge
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Marge's organization plan artifact
 */
export function generateMargeArtifact(context: ConversationContext): string {
  return `# Marge's Organization Plan

## Project Structure
\`\`\`
[Directory/component tree to be filled]
\`\`\`

## Responsibilities
| Area | Owner | Notes |
|------|-------|-------|
| [Component] | [Person/Role] | [Concerns] |

## Things That Worry Me
*Hmmmm...*
- [ ] [Concern 1] - We should address this
- [ ] [Concern 2] - This could get messy

## Cleanup Checklist
- [ ] [Task] before we move on
- [ ] [Task] to keep things tidy

## Organization Rules
1. Keep related code together
2. Clean as you go
3. Everyone knows their role

## Marge's Assessment
Topic: ${context.userInput}

Let me organize this properly...

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
