/**
 * Principal Skinner Command
 * Timeline management
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("skinner", args.join(" "), context);
}

export default {
  name: "skinner",
  description: "Summon Principal Skinner for timeline management",
  run,
};
