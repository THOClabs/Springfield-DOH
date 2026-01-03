/**
 * Otto Mann artifact generator
 * 
 * @module artifacts/generators/otto
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Otto's migration strategy artifact
 */
export function generateOttoArtifact(context: ConversationContext): string {
  return `# Otto's Migration Strategy

*Radical, dude! All aboard the migration bus!* 🚌

Topic: ${context.userInput}

## The Journey Map

### Current Stop: [Version/State]
### Destination: [Target Version/State]

## Migration Route

### Phase 1: Prepare the Bus
- [ ] Back up everything
- [ ] Test rollback procedures
- [ ] Notify passengers

### Phase 2: Hit the Road
| Step | Action | Risk | Otto Says |
|------|--------|------|-----------|
| 1 | [Task] | Low | "Easy, dude" |
| 2 | [Task] | Med | "Hold on!" |
| 3 | [Task] | High | "Whoa!" |

### Phase 3: Arrive Safely
- [ ] Verify all systems
- [ ] Run smoke tests
- [ ] Party! 🎸

## Roadblocks to Watch For
1. [ ] [Breaking change] - "Detour ahead!"
2. [ ] [Dependency conflict] - "Road closed, man"

## Otto's Advice
- "Take it slow on the curves"
- "Don't forget the backup guitar"
- "If it breaks, just restart the bus"

*Radical! Let's roll!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
