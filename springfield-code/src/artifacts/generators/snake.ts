/**
 * Snake Jailbird artifact generator
 * 
 * @module artifacts/generators/snake
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Snake's auth audit artifact
 */
export function generateSnakeArtifact(context: ConversationContext): string {
  return `# Snake's Authentication Audit

*Bye-bye, security holes!* 🔓

Topic: ${context.userInput}

## Security Assessment

### Auth Flow Analysis
| Flow | Status | Vulnerability | Snake Says |
|------|--------|---------------|------------|
| Login | 🔴 Weak | Token exposed | "Easy in!" |
| Session | 🟡 Fair | Long expiry | "Patience..." |
| OAuth | 🟢 Strong | None found | "Dude, locked!" |

## Vulnerabilities Found

### Critical (I'm Already In)
1. [ ] [Issue] - [How I got in]

### High (Give Me 5 Minutes)
1. [ ] [Weakness] - [Attack vector]

### Medium (Needs Planning)
1. [ ] [Problem] - [Potential exploit]

## Authentication Checklist
- [ ] JWT tokens properly signed
- [ ] Refresh token rotation enabled
- [ ] Session timeout configured
- [ ] MFA implemented
- [ ] Password policy enforced

## Snake's Break-In Report
- "This session never expires, dude"
- "Your tokens are in localStorage? Amateur"
- "No rate limiting on login? Too easy"

*Bye-bye, weak auth!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
