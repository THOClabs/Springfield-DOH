/**
 * Fat Tony artifact generator
 * 
 * @module artifacts/generators/fat-tony
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Fat Tony's microservices artifact
 */
export function generateFatTonyArtifact(context: ConversationContext): string {
  return `# Fat Tony's Microservices Organization

*Each service handles its own business.* 🤵

Topic: ${context.userInput}

## The Family Structure

### Service Boundaries
| Service | Territory | Status | Tony Says |
|---------|-----------|--------|-----------|
| auth | Identity | 🟢 | "Respects boundaries" |
| orders | Commerce | 🟡 | "Slight encroachment" |
| users | Profiles | 🔴 | "Disrespecting the family" |

## Communication Channels

### Sync (Direct Line)
- REST APIs between services
- gRPC for internal calls

### Async (Message System)
| Queue | Publisher | Subscriber |
|-------|-----------|------------|
| orders.created | orders | notifications, inventory |
| user.updated | users | orders, billing |

## Contract Violations

### Who's Disrespecting Who?
1. [ ] [service A] → [service B]: Breaking change
2. [ ] [service] → shared DB: Direct access

## Distributed Transactions

### Saga Pattern
\`\`\`
Start → Reserve → Charge → Confirm → Complete
         ↓
      Compensate ← Rollback
\`\`\`

## Tony's Rules
- "You break the contract, you disrespect the family"
- "Each service has its own database. Period."
- "Loose coupling. Tight loyalty."

*In this organization, we handle our own business.*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
