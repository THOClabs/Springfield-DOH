/**
 * Homer Simpson Command
 * Asks dumb-smart questions that reveal hidden assumptions
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("homer", args.join(" "), context);
}

export default {
  name: "homer",
  description: "Summon Homer Simpson for dumb-smart questions that reveal hidden assumptions",
  run,
};
