/**
 * Edna Krabappel Command
 * Code Review, "Ha!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("edna", args.join(" "), context);
}

export default {
  name: "edna",
  description: "Summon Edna Krabappel for code review",
  run,
};
