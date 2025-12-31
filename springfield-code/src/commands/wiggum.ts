/**
 * Chief Wiggum Command
 * Ironic security review
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("wiggum", args.join(" "), context);
}

export default {
  name: "wiggum",
  description: "Summon Chief Wiggum for security review",
  run,
};
