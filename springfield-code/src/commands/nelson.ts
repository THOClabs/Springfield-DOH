/**
 * Nelson Muntz Command
 * Test failures, "Ha-ha!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("nelson", args.join(" "), context);
}

export default {
  name: "nelson",
  description: "Summon Nelson for test failures",
  run,
};
