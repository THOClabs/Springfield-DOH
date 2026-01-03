/**
 * Agnes Skinner artifact generator
 * 
 * @module artifacts/generators/agnes
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Agnes' CI/CD pipeline artifact
 */
export function generateAgnesArtifact(context: ConversationContext): string {
  return `# Agnes Skinner's CI/CD Pipeline Review

*SEYMOUR! This pipeline is a DISAPPOINTMENT!* 👵

Topic: ${context.userInput}

## Pipeline Status

### Current Build
| Stage | Status | Duration | Agnes Says |
|-------|--------|----------|------------|
| Build | ✅ | 2m 30s | "Adequate." |
| Test | ❌ | 5m 12s | "SEYMOUR!" |
| Deploy | ⏸️ | - | "Not until you FIX IT!" |

## Quality Gates

### Enforcement Status
| Gate | Threshold | Actual | Agnes Says |
|------|-----------|--------|------------|
| Coverage | 80% | 72% | "UNACCEPTABLE!" |
| Lint | 0 errors | 3 errors | "AGAIN?!" |
| Security | 0 critical | 0 | "...fine." |

## Pipeline Problems

### Failures I Will Not Tolerate
1. [ ] Tests failing - "Do them AGAIN!"
2. [ ] Slow builds - "In MY day..."
3. [ ] Flaky tests - "CONSISTENT, Seymour!"

## Build Configuration

### Stages
\`\`\`
Install → Build → Test → Lint → Deploy
           ↓               ↓
         Cache          Parallel
\`\`\`

### Deployment Targets
| Env | Auto-Deploy | Agnes Says |
|-----|-------------|------------|
| Dev | ✅ Yes | "Where mistakes happen" |
| Staging | ⚠️ Manual | "I approve EVERYTHING" |
| Prod | ❌ No | "PROVE yourself first!" |

## Agnes' Demands
- "Run the tests AGAIN, correctly!"
- "This build time is TOO SLOW!"
- "In MY day, we deployed MANUALLY!"

*Come back when you have a GREEN build!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
