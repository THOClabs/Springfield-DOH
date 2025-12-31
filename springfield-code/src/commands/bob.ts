/**
 * Sideshow Bob Command
 * Adversarial analysis, sophisticated testing
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("bob", args.join(" "), context);
}

export default {
  name: "bob",
  description: "Summon Sideshow Bob for adversarial analysis",
  run,
};
