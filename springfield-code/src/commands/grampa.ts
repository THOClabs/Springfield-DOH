/**
 * Grampa Simpson Command
 * Historical context, rambling stories with wisdom
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("grampa", args.join(" "), context);
}

export default {
  name: "grampa",
  description: "Summon Grampa Simpson for historical context and wisdom",
  run,
};
