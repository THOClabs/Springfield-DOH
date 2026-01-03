/**
 * Sideshow Bob artifact generator
 * 
 * @module artifacts/generators/bob
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Sideshow Bob's adversarial analysis artifact
 */
export function generateBobArtifact(context: ConversationContext): string {
  return `# Sideshow Bob's Adversarial Analysis

*Ah, security. How delightfully breakable.*

## The Target
Topic: ${context.userInput}

## Attack Scenarios

### The Obvious Approach
[Simple attack vector]

### The Elegant Approach
1. Reconnaissance
2. Initial compromise
3. Privilege escalation
4. Data exfiltration

### The Chain Attack
- [Vuln A] + [Vuln B] + [Vuln C] = Catastrophe

## Threat Actor Profiles
| Actor | Skill | Motivation |
|-------|-------|------------|
| Script Kiddie | Low | Boredom |
| Criminal | Medium | Money |
| Advanced | High | Targeted |

## Bob's Assessment
*adjusts bow tie*

The game is afoot.

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
