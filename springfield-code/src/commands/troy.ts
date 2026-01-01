/**
 * Troy McClure Command
 * Onboarding & Tutorials, "You may remember me from..."
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("troy", args.join(" "), context);
}

export default {
  name: "troy",
  description: "Summon Troy McClure for onboarding and tutorials",
  run,
};
