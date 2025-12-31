/**
 * Smithers Command
 * Schedule management, Burns interpreter
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("smithers", args.join(" "), context);
}

export default {
  name: "smithers",
  description: "Summon Smithers for schedule management",
  run,
};
