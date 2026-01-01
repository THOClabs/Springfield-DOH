/**
 * Groundskeeper Willie artifact generator
 * 
 * @module artifacts/generators/willie
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Groundskeeper Willie's infrastructure artifact
 */
export function generateWillieArtifact(context: ConversationContext): string {
  return `# Groundskeeper Willie's Infrastructure

*Ach! Let's talk about the REAL work!*

Topic: ${context.userInput}

## Deployment Procedures

### The Right Way
\`\`\`bash
npm test        # Test first!
npm run build   # Build it
./deploy.sh     # Deploy proper
\`\`\`

### The Wrong Way
🚫 Direct pushes to production
🚫 Deploying without testing
🚫 "It works on my machine"

## Server Maintenance

### Daily Tasks
- [ ] Check disk space
- [ ] Review error logs
- [ ] Verify backups

## Willie's Laws
1. Everything is code
2. Everything is logged
3. Everything is monitored
4. Everything is backed up

*Ach! Now let me work!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
