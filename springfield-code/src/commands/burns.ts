/**
 * Mr. Burns Command
 * Budget constraints, resource allocation
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("burns", args.join(" "), context);
}

export default {
  name: "burns",
  description: "Summon Mr. Burns for budget constraints and resource allocation",
  run,
};
