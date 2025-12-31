/**
 * Bart Simpson Command
 * Chaos engineering, edge cases, breaking things
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("bart", args.join(" "), context);
}

export default {
  name: "bart",
  description: "Summon Bart Simpson for chaos engineering and edge cases",
  run,
};
