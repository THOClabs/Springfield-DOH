/**
 * Rare Random Events
 * Probability-based events with context triggers
 *
 * Source: .springfield/delight-moments.md
 *
 * @module utils/rare-events
 */

/**
 * Context trigger for rare events
 */
export interface ContextTrigger {
  /** Keyword pattern (case-insensitive) */
  pattern: RegExp;
  /** Probability multiplier when matched (default: 1, >1 = increases probability) */
  multiplier: number;
}

/**
 * Rare event definition
 */
export interface RareEvent {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Base probability (0-1, e.g., 0.01 = 1%) */
  probability: number;
  /** The event content/message */
  content: string;
  /** Context triggers that increase probability */
  contextTriggers?: ContextTrigger[];
  /** If true, only triggers when context matches at least one trigger */
  requiresContext?: boolean;
}

/**
 * Result of checking for rare events
 */
export interface RareEventResult {
  /** Whether an event was triggered */
  triggered: boolean;
  /** The triggered event (if any) */
  event?: RareEvent;
  /** What triggered it (if context-based) */
  triggerContext?: string;
}

/**
 * Rare events registry
 */
const RARE_EVENTS: RareEvent[] = [
  // Steamed Hams - 1% base, triggered by aurora references
  {
    id: "steamed-hams",
    name: "Steamed Hams",
    probability: 0.01,
    content: `*Superintendent Chalmers walks in*

SKINNER! What is happening in here?!

Skinner: "Oh, Superintendent Chalmers! I was just...
         preparing steamed hams. It's a regional dialect."

Chalmers: "Uh-huh. And you call them steamed hams
          despite the fact that they are obviously grilled?"

*an aurora borealis appears in the .springfield directory*

Skinner: "Aurora borealis? At this time of year?
         At this time of day? In this part of the codebase?
         Localized entirely within your terminal?"

Chalmers: "...Yes."

Skinner: "...May I see it?"

Chalmers: "...No."`,
    contextTriggers: [
      {
        pattern: /aurora|northern.?lights|borealis/i,
        multiplier: 100, // 100x = essentially guaranteed
      },
    ],
  },

  // Monorail - 1% on project planning
  {
    id: "monorail",
    name: "Monorail Song",
    probability: 0.01,
    content: `*Lyle Lanley appears with a songbook*

"Well, sir, there's nothing on earth like a genuine,
bona fide, electrified, six-car monorail!"

*The crowd joins in*

"MONORAIL! MONORAIL! MONORAIL!"

*Lisa shakes her head*

Lisa: "But this planning doc is already overscoped...
      and I'm pretty sure we don't need a monorail."

*Lyle Lanley disappears into the night*`,
    contextTriggers: [
      {
        pattern: /plan|project|roadmap|initiative|proposal|scope/i,
        multiplier: 5, // 5x = 5% when planning
      },
    ],
    requiresContext: true, // Only triggers during planning discussions
  },

  // Spider-Pig - 0.1% completely random
  {
    id: "spider-pig",
    name: "Spider-Pig",
    probability: 0.001,
    content: `*Homer appears carrying a pig*

"Spider-Pig, Spider-Pig,
Does whatever a Spider-Pig does.
Can he swing from a web?
No, he can't, he's a pig.
Look ouuuuut, he is a Spider-Pig!"

*The pig oinks and walks across your terminal*

Homer: "I'm gonna name him... Harry Plopper."

*pig leaves tiny hoofprints on your code*`,
    // No context triggers - purely random
  },

  // Frank Grimes - 0.1% on "hard work" mentions
  {
    id: "frank-grimes",
    name: "Frank Grimes",
    probability: 0.001,
    content: `*Frank Grimes appears, visibly frustrated*

"This is a POWER PLANT! Not some amusement park!

You know, I have had to work hard every day
of my life, and what do I have to show for it?

This is MY life! It's MY life!

Homer Simpson has never WORKED a day in his LIFE
and yet here he is, with a beautiful home,
a loving family, and now THIS codebase!"

*grabs blueprints*

"I've had to fight for everything I have!
And all Homer does is... eat donuts!"

*storms off muttering about competitors*`,
    contextTriggers: [
      {
        pattern: /hard.?work|working.?hard|dedication|effort|struggle|grind/i,
        multiplier: 100, // Guaranteed on hard work references
      },
    ],
  },

  // Duffman - 0.5% on beer/celebration mentions
  {
    id: "duffman",
    name: "Duffman",
    probability: 0.005,
    content: `*Duffman bursts through the wall*

"OH YEAH! DUFFMAN says...

YOUR CODE IS READY TO PARTY!

*thrusts*

Duffman can never die! Only the actors who play him!
OH YEAH!"

*throws Duff cans everywhere*

*leaves through the hole in the wall*`,
    contextTriggers: [
      {
        pattern: /beer|celebrate|party|celebration|cheers|toast/i,
        multiplier: 20,
      },
    ],
  },

  // Itchy & Scratchy - 0.1% random violence
  {
    id: "itchy-scratchy",
    name: "Itchy & Scratchy",
    probability: 0.001,
    content: `*TV turns on*

"THE ITCHY & SCRATCHY SHOW!"

*Itchy approaches Scratchy with a keyboard*

Scratchy: "AAAAAAAGH!"

*cartoon violence ensues*
*surprisingly, the code remains unharmed*

Kids: "They fight! And bite!
      They fight and bite and fight!
      Fight fight fight! Bite bite bite!
      The Itchy & Scratchy Show!"

*TV turns off*`,
    // No context - purely random
  },
];

/**
 * Test seed for deterministic testing
 * Set to null for production (uses Math.random)
 */
let testSeed: number | null = null;

/**
 * Set test seed for deterministic random numbers
 * Only works outside production
 *
 * @param seed - Seed value or null to use real random
 */
export function _setTestSeed(seed: number | null): void {
  testSeed = seed;
}

/**
 * Get current test seed (for testing)
 */
export function _getTestSeed(): number | null {
  return testSeed;
}

/**
 * Get a random number, using test seed if set
 */
function getRandom(): number {
  if (testSeed !== null) {
    // Linear congruential generator for deterministic testing
    testSeed = (testSeed * 1664525 + 1013904223) % 4294967296;
    return testSeed / 4294967296;
  }
  return Math.random();
}

/**
 * Calculate effective probability based on context
 */
function calculateProbability(
  event: RareEvent,
  context: string
): { probability: number; matchedTrigger?: ContextTrigger; matchedText?: string } {
  let probability = event.probability;
  let matchedTrigger: ContextTrigger | undefined;
  let matchedText: string | undefined;

  if (event.contextTriggers) {
    for (const trigger of event.contextTriggers) {
      const match = context.match(trigger.pattern);
      if (match) {
        matchedTrigger = trigger;
        matchedText = match[0];
        probability = Math.min(1, probability * trigger.multiplier);
        break; // First match wins
      }
    }
  }

  // If context required but no match, probability is 0
  if (event.requiresContext && !matchedTrigger) {
    probability = 0;
  }

  return { probability, matchedTrigger, matchedText };
}

/**
 * Check if a rare event should trigger
 *
 * @param context - User input / current context
 * @returns Event result with triggered status
 */
export function checkRareEvent(context: string): RareEventResult {
  // Shuffle to avoid bias toward earlier events
  const shuffled = [...RARE_EVENTS].sort(() => getRandom() - 0.5);

  for (const event of shuffled) {
    const { probability, matchedText } = calculateProbability(event, context);

    if (probability > 0 && getRandom() < probability) {
      return {
        triggered: true,
        event,
        triggerContext: matchedText ? `Triggered by: "${matchedText}"` : undefined,
      };
    }
  }

  return { triggered: false };
}

/**
 * Format rare event as response suffix
 *
 * @param event - The rare event
 * @returns Formatted suffix string
 */
export function formatRareEventSuffix(event: RareEvent): string {
  return `

---
*[Rare Event: ${event.name}]*

${event.content}

---`;
}

/**
 * Get all registered rare events
 *
 * @returns Array of all rare events
 */
export function getAllRareEvents(): RareEvent[] {
  return [...RARE_EVENTS];
}

/**
 * Get rare event by ID
 *
 * @param id - Event ID
 * @returns Event or undefined
 */
export function getRareEventById(id: string): RareEvent | undefined {
  return RARE_EVENTS.find((e) => e.id === id);
}
