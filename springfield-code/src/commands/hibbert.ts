/**
 * Dr. Hibbert Command
 * Performance Profiling, "A-hee-hee-hee!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("hibbert", args.join(" "), context);
}

export default {
  name: "hibbert",
  description: "Summon Dr. Hibbert for performance profiling",
  run,
};
