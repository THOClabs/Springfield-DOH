/**
 * Lisa Simpson artifact generator
 * 
 * @module artifacts/generators/lisa
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Lisa's analysis artifact
 */
export function generateLisaArtifact(context: ConversationContext): string {
  return `# Project Definition (Lisa's Analysis)

## Executive Summary
${context.userInput}

## Architectural Vision
[How the pieces fit together]

## Design Principles
1. [Principle 1] - Why this matters
2. [Principle 2] - Supporting reasoning
3. [Principle 3] - Best practices

## Component Harmony
\`\`\`
[Architecture diagram]
\`\`\`

## Long-term Considerations
- Scalability
- Maintainability
- Evolution path

## Risk Analysis
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | Low/Med/High | [Impact] | [Strategy] |

## Lisa's Recommendation
[Clear, well-reasoned conclusion]

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
