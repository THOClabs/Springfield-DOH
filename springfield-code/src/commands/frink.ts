/**
 * Professor Frink Command
 * Experimental R&D, "Glavin!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("frink", args.join(" "), context);
}

export default {
  name: "frink",
  description: "Summon Professor Frink for experimental R&D",
  run,
};
