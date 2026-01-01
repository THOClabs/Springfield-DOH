/**
 * Cancel Ralph Command
 * Revokes any active Ralph authorization tokens
 * 
 * @module commands/cancel-ralph
 */

import { revokeRalphAuthorization, canInvokeRalph } from "../hooks/ralph-gate.js";

interface CommandContext {
  cwd?: string;
}

/**
 * Run cancel-ralph command
 */
export async function run(_args: string[], _context: CommandContext): Promise<string> {
  // Check if Ralph is currently authorized
  const wasAuthorized = canInvokeRalph();
  
  // Revoke any active authorization
  revokeRalphAuthorization();

  if (wasAuthorized) {
    return `# Ralph Execution Cancelled

🛑 **Authorization Revoked**

Any active Ralph execution token has been invalidated.

*Ralph has been stopped. "I'm learnding!"*

## What Happened
- Active authorization token was revoked
- Ralph cannot be invoked until Lisa re-authorizes
- No ongoing work was lost (only prevented future iterations)

## To Resume
Use \`/lisa ralph\` to start a new Ralph session with fresh authorization.
`;
  } else {
    return `# No Active Ralph Session

Ralph was not currently authorized.

## To Start a Ralph Session
Use \`/lisa ralph\` to initiate the Lisa-Ralph protocol.

*"Me fail English? That's unpossible!"*
`;
  }
}

export default {
  name: "cancel-ralph",
  description: "Cancel any active Ralph execution and revoke authorization tokens",
  run,
};
