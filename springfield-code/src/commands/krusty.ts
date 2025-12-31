/**
 * Krusty the Clown Command
 * Demo preparation, showmanship
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("krusty", args.join(" "), context);
}

export default {
  name: "krusty",
  description: "Summon Krusty the Clown for demo preparation",
  run,
};
