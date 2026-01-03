/**
 * Patty Bouvier Command
 * Compliance & Approval Gates
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("patty", args.join(" "), context);
}

export default {
  name: "patty",
  description: "Summon Patty for compliance and approval gates",
  run,
};
