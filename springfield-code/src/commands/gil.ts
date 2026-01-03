/**
 * Gil Gunderson Command
 * Error Handling Patterns
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("gil", args.join(" "), context);
}

export default {
  name: "gil",
  description: "Summon Gil Gunderson for error handling patterns",
  run,
};
