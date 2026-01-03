/**
 * Date/Time Easter Eggs
 * Calendar-based events that trigger special messages
 *
 * Source: .springfield/delight-moments.md
 *
 * @module utils/easter-eggs
 */

/**
 * Easter egg event definition
 */
export interface EasterEggEvent {
  /** Unique identifier for the event */
  id: string;
  /** Display name */
  name: string;
  /** The greeting/message to show */
  message: string;
  /** Optional: character-specific overrides */
  characterOverrides?: Record<string, string>;
  /** Condition checker function */
  isActive: (date: Date) => boolean;
  /** Priority (higher = checked first, for overlapping events) */
  priority: number;
}

/**
 * Easter egg events registry
 */
const EASTER_EGG_EVENTS: EasterEggEvent[] = [
  // Tuesday 3:15 PM - Stonecutters (narrow window - high priority)
  {
    id: "stonecutters",
    name: "Stonecutters Greeting",
    message: `*The lights flicker mysteriously*

Who controls the British crown?
Who keeps the metric system down?
**We do! We do!**

*A Stonecutters symbol briefly appears in the corner*`,
    isActive: (date) =>
      date.getDay() === 2 && // Tuesday
      date.getHours() === 15 &&
      date.getMinutes() >= 15 &&
      date.getMinutes() < 20, // 3:15-3:19 PM window
    priority: 100, // Highest - very narrow window
  },

  // February 23 - Bart's Birthday
  {
    id: "bart-birthday",
    name: "Bart's Birthday",
    message: `*party horn sounds*

Happy Birthday, Bart Simpson!
Eat my shorts... and this cake!

*confetti falls*`,
    characterOverrides: {
      bart: `*Bart grins*

It's my birthday! February 23rd!
Ay caramba, I'm getting old...
But I'm still the ultimate troublemaker!

*does a skateboard trick*`,
      homer: `*Homer holds a birthday cake*

D'oh! I forgot the candles again...
Happy birthday, boy! Here's hoping you don't
burn down the house this year.

*drops cake*`,
    },
    isActive: (date) => date.getMonth() === 1 && date.getDate() === 23,
    priority: 50,
  },

  // April 1 - April Fools
  {
    id: "april-fools",
    name: "Homer's April Fools",
    message: `*Homer giggles behind a door*

D'oh! I mean... April Fools!

*whoopee cushion sounds*`,
    characterOverrides: {
      homer: `*Homer can barely contain himself*

Hehehehe... April Fools!
I put a rubber snake in Flanders' planning doc!

*runs away laughing*`,
      bart: `*Bart rubs hands together*

April Fools is MY day, man.
Everyone's gonna get pranked.
Even you.

*evil grin*`,
    },
    isActive: (date) => date.getMonth() === 3 && date.getDate() === 1,
    priority: 50,
  },

  // October - Treehouse of Horror (whole month)
  {
    id: "treehouse-of-horror",
    name: "Treehouse of Horror Mode",
    message: `*thunder crashes*

Welcome to... the TREEHOUSE OF HORROR!

*spooky music plays*
*bats fly across the screen*`,
    characterOverrides: {
      homer: `*Zombie Homer shuffles forward*

Braaains... I mean, donuts...
Wait, what were we doing?

*lightning flash*`,
      bart: `*Bart in vampire costume*

Ay caramba... I've become a creature of the night!
But at least I don't have to go to school.

*evil laugh*`,
      lisa: `*Lisa adjusts witch hat*

This is just superstition, but...
*looks around nervously*
...it IS October.`,
    },
    isActive: (date) => date.getMonth() === 9, // October
    priority: 20, // Low - whole month
  },

  // December 20-31 - Holiday Season
  {
    id: "holiday-season",
    name: "Springfield Holiday Celebration",
    message: `*jingle bells ring*

Happy Holidays from Springfield!
Even Mr. Burns is feeling generous...
(not really, but we can dream)

*snow falls gently*`,
    characterOverrides: {
      burns: `*Burns adjusts Santa hat reluctantly*

Bah! Smithers insisted I participate in this...
holiday nonsense.

*sighs*

Excellent Christmas to you, I suppose.`,
      flanders: `*Flanders beams*

Hi-diddly-ho, holiday neighbor!
May your code compile with Christmas cheer!
And remember, Jesus is the reason for the season!

*offers eggnog*`,
      homer: `*Homer in Santa costume*

Woohoo! It's almost Christmas!
That means presents, food, and...
*drools* ...more food!`,
    },
    isActive: (date) => date.getMonth() === 11 && date.getDate() >= 20,
    priority: 25,
  },

  // May 12 - Lisa's Birthday (approximate based on show)
  {
    id: "lisa-birthday",
    name: "Lisa's Birthday",
    message: `*saxophone solo plays*

Happy Birthday, Lisa Simpson!
The smartest kid in Springfield!

*applause*`,
    characterOverrides: {
      lisa: `*Lisa takes a bow*

Thank you! Another year older,
another year closer to changing the world.

*plays triumphant saxophone riff*`,
    },
    isActive: (date) => date.getMonth() === 4 && date.getDate() === 12,
    priority: 50,
  },

  // June 2 - Maggie's Birthday (approximate)
  {
    id: "maggie-birthday",
    name: "Maggie's Birthday",
    message: `*pacifier squeak*

Happy Birthday, Maggie!

*Maggie waves*`,
    characterOverrides: {
      maggie: `*Maggie squeak squeak*

*holds up one finger*

(Translation: I'm this many!)`,
    },
    isActive: (date) => date.getMonth() === 5 && date.getDate() === 2,
    priority: 50,
  },

  // May 10 - Homer's Birthday (approximate)
  {
    id: "homer-birthday",
    name: "Homer's Birthday",
    message: `*celebratory donut appears*

Happy Birthday, Homer Simpson!
D'oh-n't forget to make a wish!

*birthday donuts fall*`,
    characterOverrides: {
      homer: `*Homer grabs donuts*

Woohoo! It's my birthday!
I'm gonna eat SO many donuts!
Best. Day. Ever!

*stuffs face*`,
    },
    isActive: (date) => date.getMonth() === 4 && date.getDate() === 10,
    priority: 50,
  },
];

/**
 * Check if any easter egg events are active
 *
 * @param date - Date to check (defaults to now)
 * @returns Active event or null
 */
export function checkActiveEasterEgg(date: Date = new Date()): EasterEggEvent | null {
  // Sort by priority descending (highest priority first)
  const sorted = [...EASTER_EGG_EVENTS].sort((a, b) => b.priority - a.priority);

  for (const event of sorted) {
    if (event.isActive(date)) {
      return event;
    }
  }
  return null;
}

/**
 * Get the easter egg message for a character
 *
 * @param event - The active easter egg event
 * @param character - The character being summoned (optional)
 * @returns Formatted message
 */
export function getEasterEggMessage(
  event: EasterEggEvent,
  character?: string
): string {
  if (character && event.characterOverrides?.[character]) {
    return event.characterOverrides[character];
  }
  return event.message;
}

/**
 * Format easter egg as response prefix
 *
 * @param event - The easter egg event
 * @param character - The character being summoned (optional)
 * @returns Formatted prefix string
 */
export function formatEasterEggPrefix(
  event: EasterEggEvent,
  character?: string
): string {
  const message = getEasterEggMessage(event, character);

  return `---
*[Special Event: ${event.name}]*

${message}

---

`;
}

/**
 * Get all registered easter egg events
 *
 * @returns Array of all easter egg events
 */
export function getAllEasterEggs(): EasterEggEvent[] {
  return [...EASTER_EGG_EVENTS];
}

/**
 * Get easter egg by ID
 *
 * @param id - Event ID
 * @returns Event or undefined
 */
export function getEasterEggById(id: string): EasterEggEvent | undefined {
  return EASTER_EGG_EVENTS.find((e) => e.id === id);
}
