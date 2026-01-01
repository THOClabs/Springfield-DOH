/**
 * Otto Mann Command
 * Migration Strategy, "Radical, dude!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("otto", args.join(" "), context);
}

export default {
  name: "otto",
  description: "Summon Otto Mann for migration strategy",
  run,
};
