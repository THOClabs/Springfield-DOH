/**
 * Moe Szyslak Command
 * Depressed debugging, stack traces
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("moe", args.join(" "), context);
}

export default {
  name: "moe",
  description: "Summon Moe for depressed debugging and stack traces",
  run,
};
