/**
 * Groundskeeper Willie Command
 * Infrastructure, DevOps
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("willie", args.join(" "), context);
}

export default {
  name: "willie",
  description: "Summon Groundskeeper Willie for infrastructure and DevOps",
  run,
};
