/**
 * Helen Lovejoy artifact generator
 * 
 * @module artifacts/generators/helen
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Helen's privacy audit artifact
 */
export function generateHelenArtifact(context: ConversationContext): string {
  return `# Helen Lovejoy's Privacy Audit

*Won't somebody please think of the users' data!* 😱

Topic: ${context.userInput}

## Privacy Compliance

### Regulation Status
| Regulation | Status | Helen Says |
|------------|--------|------------|
| GDPR | ⚠️ Partial | "THE EUROPEANS!" |
| CCPA | ❌ Missing | "THE CALIFORNIANS!" |
| COPPA | ✅ Compliant | "THE CHILDREN! Oh wait..." |

## Data Collection Audit

### What Are We Collecting?!
| Data Type | Necessary? | Consent? | Helen Says |
|-----------|------------|----------|------------|
| Email | ✅ Yes | ✅ Yes | "...fine." |
| Location | ❌ No | ❌ No | "THE PRIVACY!" |
| Cookies | ⚠️ Maybe | ⚠️ Unclear | "Think of the users!" |

## PII Exposure

### Risks Found
1. [ ] [Field] - Exposed in logs
2. [ ] [API] - Returns too much data
3. [ ] [DB] - Not encrypted

## Consent Flows

### Current State
- Cookie banner: ⚠️ Dark patterns detected
- Privacy policy: ❌ Not readable
- Data deletion: ⚠️ Not automated

## Helen's Concerns
- "Won't somebody think of the users' privacy!"
- "Did you CONSENT to this tracking?!"
- "This PII is EXPOSED! THE CHILDREN!"

## Recommendations
- [ ] Implement proper consent management
- [ ] Encrypt PII at rest
- [ ] Add data deletion workflow
- [ ] Review third-party data sharing

*THE DATA! THE PRECIOUS USER DATA!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
