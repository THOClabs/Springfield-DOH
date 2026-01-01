/**
 * Chief Wiggum artifact generator
 * 
 * @module artifacts/generators/wiggum
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Chief Wiggum's security review artifact
 */
export function generateWiggumArtifact(context: ConversationContext): string {
  return `# Chief Wiggum's Security Review

*munches donut*

## Official Assessment
Topic: ${context.userInput}

"Looks good to me!"

*But here's what I didn't check:*

### Authentication
- [ ] Password hashing?
- [ ] Session management?
- [ ] Brute force protection?

### Input Validation
- [ ] SQL injection?
- [ ] XSS?
- [ ] Path traversal?

## OWASP Top 10
| Vulnerability | Wiggum Says |
|--------------|-------------|
| Injection | "Inject what now?" |
| Broken Auth | "Auth works, I tried" |

## Chief's Verdict
⚠️ "CASE CLOSED... maybe keep looking though"

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
