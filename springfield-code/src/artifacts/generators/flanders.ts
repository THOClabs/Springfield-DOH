/**
 * Ned Flanders artifact generator
 * 
 * @module artifacts/generators/flanders
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Flanders' coding standards artifact
 */
export function generateFlandersArtifact(context: ConversationContext): string {
  return `# Flanders' Coding Standards

## Hi-diddly-ho, Developer!

Topic: ${context.userInput}

## Naming Conventions

### Variables (Okily-dokily!)
- Use camelCase: \`myFriendlyVariable\`
- Be descriptive: \`userEmailAddress\` not \`uea\`

## Code Quality Standards

### The Neighborly Checklist
- [ ] All functions have clear names
- [ ] Complex logic has comments
- [ ] No magic numbers

## The Golden Rules
1. Leave the codebase better than you found it
2. Write code for the next person
3. When in doubt, add a test

## Flanders' Blessing
May your builds be green!

*Okily-dokily!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
