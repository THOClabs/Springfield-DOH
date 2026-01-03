/**
 * Dr. Nick artifact generator
 * 
 * @module artifacts/generators/dr-nick
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Dr. Nick's API health checks artifact
 */
export function generateDrNickArtifact(context: ConversationContext): string {
  return `# Dr. Nick's API Health Checks

*Hi everybody!* 🏥

Topic: ${context.userInput}

## Vital Signs Dashboard

### Endpoint Status
| Endpoint | Status | Response Time | Dr. Nick Says |
|----------|--------|---------------|---------------|
| /health | 🟢 | 45ms | "Looking good!" |
| /api/v1 | 🟡 | 280ms | "A little slow..." |

## Checkup Results

### API Vitals
- **Heartbeat:** ✅ Responding
- **Blood Pressure:** Response codes mostly 2xx
- **Reflexes:** Timeout threshold OK

### Concerns Found
1. [ ] [Endpoint] - [Symptom]
2. [ ] [Route] - [Issue]

## Dr. Nick's Prescriptions
- [ ] Take two retries and call me in the morning
- [ ] Apply rate limiting as needed
- [ ] Rest with circuit breakers

*Hi everybody, your APIs look... mostly alive!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
