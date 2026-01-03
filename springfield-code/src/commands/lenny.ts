/**
 * Lenny Leonard Command
 * A/B Testing
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("lenny", args.join(" "), context);
}

export default {
  name: "lenny",
  description: "Summon Lenny Leonard for A/B testing",
  run,
};
