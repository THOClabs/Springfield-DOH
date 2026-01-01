/**
 * Milhouse Van Houten artifact generator
 * 
 * @module artifacts/generators/milhouse
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Milhouse's dependency analysis artifact
 */
export function generateMilhouseArtifact(context: ConversationContext): string {
  return `# Milhouse's Dependency Analysis

## Everything's Coming Up... Dependencies!

Topic: ${context.userInput}

### Direct Dependencies
| Package | Version | Health |
|---------|---------|--------|
| [pkg] | [ver] | 🟢/🟡/🔴 |

### Fragile Dependencies
| Dependency | Why It's Fragile |
|------------|------------------|
| [dep] | [reason] |

### Version Conflicts
*sighs*
- Package A wants X version 1
- Package B wants X version 2

## Milhouse's Recommendations
Let me test first, please...

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
