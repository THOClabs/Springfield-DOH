/**
 * Maggie Simpson Command
 * Silent logging, status codes via *squeak*
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("maggie", args.join(" "), context);
}

export default {
  name: "maggie",
  description: "Summon Maggie Simpson for logging and status codes",
  run,
};
