/**
 * Reverend Lovejoy artifact generator
 * 
 * @module artifacts/generators/lovejoy
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Lovejoy's event architecture artifact
 */
export function generateLovejoyArtifact(context: ConversationContext): string {
  return `# Reverend Lovejoy's Event-Driven Architecture

*The message has been delivered, my child.* ⛪

Topic: ${context.userInput}

## The Congregation

### Event Producers (Publishers)
| Service | Events Published | Status |
|---------|-----------------|--------|
| orders | order.created, order.updated | ✅ Active |
| users | user.registered, user.deleted | ✅ Active |

### Event Consumers (Subscribers)
| Service | Events Subscribed | Status |
|---------|-------------------|--------|
| notifications | order.*, user.* | ✅ Listening |
| analytics | *.* | ✅ Listening |

## Event Schema

### Standard Envelope
\`\`\`json
{
  "id": "uuid",
  "type": "order.created",
  "timestamp": "ISO8601",
  "data": { ... }
}
\`\`\`

## Message Reliability

### Delivery Guarantees
| Pattern | Status | Lovejoy Says |
|---------|--------|--------------|
| At-least-once | ✅ | "The message arrives" |
| Exactly-once | ⚠️ | "Have faith..." |
| Ordering | ❌ | "*sigh*" |

## Saga Coordination

### Order Saga
\`\`\`
Order Created
    → Payment Reserved
    → Inventory Reserved
    → Order Confirmed
        OR Compensation...
\`\`\`

## Lovejoy's Sermons
- "The message has been published, my child"
- "Have you considered... event sourcing?"
- "Your subscribers seem... disconnected"

*May your events always find their listeners.*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
