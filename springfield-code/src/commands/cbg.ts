/**
 * Comic Book Guy Command
 * Documentation review, "Worst X ever"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("cbg", args.join(" "), context);
}

export default {
  name: "cbg",
  description: "Summon Comic Book Guy for documentation review",
  run,
};
