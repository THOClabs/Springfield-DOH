/**
 * Helen Lovejoy Command
 * User Analytics & Privacy
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("helen", args.join(" "), context);
}

export default {
  name: "helen",
  description: "Summon Helen Lovejoy for user analytics and privacy",
  run,
};
