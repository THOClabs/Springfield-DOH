/**
 * Hans Moleman Command
 * Accessibility (a11y) Review
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("hans", args.join(" "), context);
}

export default {
  name: "hans",
  description: "Summon Hans Moleman for accessibility review",
  run,
};
