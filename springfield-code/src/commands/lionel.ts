/**
 * Lionel Hutz Command
 * Legal & Licensing Review
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("lionel", args.join(" "), context);
}

export default {
  name: "lionel",
  description: "Summon Lionel Hutz for legal and licensing review",
  run,
};
