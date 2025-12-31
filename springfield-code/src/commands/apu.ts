/**
 * Apu Nahasapeemapetilon Command
 * 24/7 utility functions
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("apu", args.join(" "), context);
}

export default {
  name: "apu",
  description: "Summon Apu for utility functions",
  run,
};
