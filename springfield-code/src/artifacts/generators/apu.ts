/**
 * Apu Nahasapeemapetilon artifact generator
 * 
 * @module artifacts/generators/apu
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Apu's utility store artifact
 */
export function generateApuArtifact(context: ConversationContext): string {
  return `# Apu's Utility Store

*Welcome to the Kwik-E-Code! Open 24/7*

Topic: ${context.userInput}

## Store Layout

### Aisle 1: String Utilities
| Function | Purpose |
|----------|---------|
| \`capitalize(str)\` | First letter upper |
| \`slugify(str)\` | URL-safe string |

### Aisle 2: Date Utilities
| Function | Purpose |
|----------|---------|
| \`formatDate(d)\` | Format dates |
| \`timeAgo(d)\` | Relative time |

## Store Policies
1. One function, one job
2. No side effects
3. Well documented

Thank you, come again!

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
