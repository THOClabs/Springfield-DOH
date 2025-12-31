/**
 * Marge Simpson Command
 * Organization and structure, motherly oversight
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("marge", args.join(" "), context);
}

export default {
  name: "marge",
  description: "Summon Marge Simpson for organization and structure",
  run,
};
