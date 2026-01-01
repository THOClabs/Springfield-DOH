/**
 * Troy McClure artifact generator
 * 
 * @module artifacts/generators/troy
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Troy's onboarding artifact
 */
export function generateTroyArtifact(context: ConversationContext): string {
  return `# Troy McClure's Onboarding Guide

*Hi, I'm Troy McClure! You may remember me from such onboarding guides as...* 🎬

Topic: ${context.userInput}

## Welcome to the Project!

### You May Remember Me From...
- "Getting Started: A Developer's Journey"
- "Why Tests Matter: A Cautionary Tale"
- "The README That Saved Christmas"

## Your Onboarding Checklist

### Day 1: The Basics
- [ ] Clone the repository
- [ ] Install dependencies
- [ ] Run the test suite
- [ ] Read the README

### Week 1: Getting Comfortable
- [ ] Make your first contribution
- [ ] Review the architecture docs
- [ ] Meet the team

## Key Concepts Explained
| Concept | What Is It? | Troy Says |
|---------|-------------|-----------|
| [Concept] | [Explanation] | "It's like..." |

## Troy's Tips
1. Don't be afraid to ask questions!
2. Start with small contributions
3. Read the docs (yes, really!)

*And remember, there's no business like code business!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
