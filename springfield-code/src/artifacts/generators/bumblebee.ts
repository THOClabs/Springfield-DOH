/**
 * Bumblebee Man artifact generator
 * 
 * @module artifacts/generators/bumblebee
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Bumblebee Man's i18n artifact
 */
export function generateBumblebeeArtifact(context: ConversationContext): string {
  return `# Bumblebee Man's i18n Report

*¡Ay, ay, ay!* 🐝

Topic: ${context.userInput}

## Translation Coverage

### Language Status
| Language | Coverage | Status | Bumblebee Says |
|----------|----------|--------|----------------|
| English | 100% | ✅ | "Good!" |
| Spanish | 75% | ⚠️ | "¡No es bueno!" |
| German | 50% | ❌ | "¡Ay caramba!" |

## Issues Found

### Hardcoded Strings ❌
1. [ ] [file:line] - "[string]"
2. [ ] [file:line] - "[string]"

### Missing Translations ⚠️
| Key | en | es | de |
|-----|----|----|-----|
| [key] | ✅ | ❌ | ❌ |

## Locale Handling

### Format Issues
- [ ] Date format not localized
- [ ] Number format hardcoded
- [ ] Currency symbols wrong

### RTL Support
- Status: ⚠️ Not tested
- "¡Mi layout is backwards!"

## Bumblebee's Comedy of Errors
- "¡This button says 'Submit' in ALL languages!"
- "¡No me gusta this hardcoded 'Hello'!"
- "¡The date is muy confusing!"

## Recommendations
- [ ] Extract all strings to i18n files
- [ ] Add locale detection
- [ ] Test RTL layouts
- [ ] Implement pluralization

*¡Ay, ay, ay! Much work to do!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
