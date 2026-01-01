/**
 * Duffman Command
 * Feature Flags, "Oh yeah!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("duffman", args.join(" "), context);
}

export default {
  name: "duffman",
  description: "Summon Duffman for feature flags",
  run,
};
