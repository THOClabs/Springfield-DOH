/**
 * Sea Captain artifact generator
 * 
 * @module artifacts/generators/sea-captain
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Sea Captain's K8s artifact
 */
export function generateSeaCaptainArtifact(context: ConversationContext): string {
  return `# Sea Captain's Container Fleet

*Arr! Setting sail through Kubernetes!* ⚓

Topic: ${context.userInput}

## Fleet Status

### Pods at Sea
| Deployment | Replicas | Status | Captain Says |
|------------|----------|--------|--------------|
| api | 3/3 | 🟢 | "Steady as she goes!" |
| worker | 2/5 | 🟡 | "Taking on water!" |
| cache | 0/1 | 🔴 | "Lost at sea!" |

## Resource Allocation

### Container Limits
| Service | CPU | Memory | Captain Says |
|---------|-----|--------|--------------|
| api | 500m | 512Mi | "Arr, plenty!" |
| worker | 1000m | 1Gi | "Heavy cargo" |

## Navigation Charts

### Service Discovery
\`\`\`
┌─────────────┐
│   Ingress   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Service    │
└──────┬──────┘
       │
┌──────▼──────┐
│    Pods     │
└─────────────┘
\`\`\`

## Rough Seas Ahead

### Issues on the Horizon
1. [ ] [Pod] - CrashLoopBackOff
2. [ ] [Service] - Not enough replicas
3. [ ] [PVC] - Storage full

## Captain's Log
- "She'll hold together, arr!"
- "These resource limits be too tight"
- "I've navigated worse container storms"

*Arr! May your pods never sink!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
