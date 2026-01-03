/**
 * Hans Moleman artifact generator
 * 
 * @module artifacts/generators/hans
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Hans' accessibility audit artifact
 */
export function generateHansArtifact(context: ConversationContext): string {
  return `# Hans Moleman's Accessibility Audit

*I can barely see this button...* 👓

Topic: ${context.userInput}

## Accessibility Score

### WCAG Compliance
| Criterion | Level | Status | Hans Says |
|-----------|-------|--------|-----------|
| Color Contrast | AA | ❌ | "Too dim..." |
| Keyboard Nav | A | ⚠️ | "Can't find it" |
| Screen Reader | AAA | ✅ | "I can hear it!" |

## Issues Found

### Critical (Can't Access At All)
1. [ ] [Element] - [Issue description]

### Major (Difficult to Use)
1. [ ] [Component] - [Problem]

### Minor (Inconvenient)
1. [ ] [Feature] - [Improvement needed]

## Hans' Experience Report
- "The font is too small"
- "I clicked the wrong thing"
- "This needs audio descriptions"

## Recommendations
- [ ] Increase minimum font size to 16px
- [ ] Add focus indicators
- [ ] Improve color contrast ratios
- [ ] Add ARIA labels

*Everything is too small and confusing...*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
