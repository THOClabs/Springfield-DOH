/**
 * Reverend Lovejoy Command
 * Event-Driven Architecture
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("lovejoy", args.join(" "), context);
}

export default {
  name: "lovejoy",
  description: "Summon Reverend Lovejoy for event-driven architecture",
  run,
};
