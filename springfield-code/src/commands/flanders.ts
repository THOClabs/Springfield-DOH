/**
 * Ned Flanders Command
 * Coding standards, neighborly best practices
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("flanders", args.join(" "), context);
}

export default {
  name: "flanders",
  description: "Summon Ned Flanders for coding standards and best practices",
  run,
};
