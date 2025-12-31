/**
 * Ralph Gate Hook
 * Prevents direct Ralph invocation - only Lisa can initiate Ralph
 */

// State flag - only Lisa can set this to true
let ralphInitiatedByLisa = false;

/**
 * Set the Ralph initiation flag (called by Lisa-Ralph protocol)
 */
export function setRalphInitiated(value: boolean): void {
  ralphInitiatedByLisa = value;
}

/**
 * Check if Ralph can be invoked (for testing)
 */
export function canInvokeRalph(): boolean {
  return ralphInitiatedByLisa;
}

/**
 * Get a random confused Ralph response
 */
function getConfusedRalphResponse(): string {
  const responses = [
    `*Ralph looks confused*

Hi Lisa! Where's Lisa? Lisa tells me what to do.

*picks nose*

You should talk to Lisa first.`,

    `*Ralph stares blankly*

I'm helping! ...Am I helping?

*looks around for Lisa*

Lisa knows what I'm supposed to do.`,

    `*Ralph giggles nervously*

My cat's breath smells like cat food!

*waits for instructions*

Lisa tells me the plan first.`,

    `*Ralph scratches head*

I heard a noise... was that me?

*confused expression*

Lisa! Where's Lisa? She has my instructions!`,

    `*Ralph points at nothing*

That's where I saw the leprechaun!

*realizes this isn't about leprechauns*

Oh. You want me to do something? Lisa tells me what to do.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

interface HookEvent {
  toolName: string;
  [key: string]: unknown;
}

interface HookContext {
  [key: string]: unknown;
}

interface HookResult {
  allowed: boolean;
  message?: string;
}

/**
 * PreToolUse hook handler
 */
async function handle(event: HookEvent, context: HookContext): Promise<HookResult> {
  const { toolName } = event;

  // Check if this is a Ralph-related tool
  if (toolName === "ralph-loop" || toolName === "ralph") {
    if (!ralphInitiatedByLisa) {
      return {
        allowed: false,
        message: getConfusedRalphResponse(),
      };
    }

    // Reset flag after allowing - one-time use
    ralphInitiatedByLisa = false;
    return { allowed: true };
  }

  // Allow all other tools
  return { allowed: true };
}

export default {
  name: "ralph-gate",
  event: "PreToolUse",
  handle,
};
