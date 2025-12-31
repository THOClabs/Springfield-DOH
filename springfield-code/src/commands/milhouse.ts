/**
 * Milhouse Command
 * Dependency management, gets hurt first
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("milhouse", args.join(" "), context);
}

export default {
  name: "milhouse",
  description: "Summon Milhouse for dependency management",
  run,
};
