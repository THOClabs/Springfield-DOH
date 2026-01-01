/**
 * Cookie Kwan artifact generator
 * 
 * @module artifacts/generators/cookie
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Cookie's database schema artifact
 */
export function generateCookieArtifact(context: ConversationContext): string {
  return `# Cookie Kwan's Database Territory

*Stay off the west side!* 🏠

Topic: ${context.userInput}

## Schema Overview

### My Tables (Stay Off!)
| Table | Rows | Indexes | Cookie Says |
|-------|------|---------|-------------|
| users | 50k | 3 | "MINE!" |
| orders | 200k | 5 | "My territory!" |
| products | 10k | 2 | "West side!" |

## Query Performance

### Fast Queries ✅
- SELECT with indexed columns
- Proper JOINs

### Slow Queries 🐌
1. [ ] [Query] - Missing index
2. [ ] [Query] - Full table scan

## Data Governance

### Territory Rules
- [ ] Primary keys defined
- [ ] Foreign keys enforced
- [ ] Indexes optimized
- [ ] Constraints in place

## Cookie's Territory Map
\`\`\`
users ──────┬──── orders
            │
            └──── addresses
            
products ──────── categories
\`\`\`

## Cookie's Recommendations
- "Add an index on THAT column"
- "This query crosses into MY territory"
- "Normalize! NORMALIZE!"

*This schema is MINE. Stay off the west side!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
