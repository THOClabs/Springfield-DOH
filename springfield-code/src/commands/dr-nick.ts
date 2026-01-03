/**
 * Dr. Nick Command
 * API Health Checks, "Hi everybody!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("dr-nick", args.join(" "), context);
}

export default {
  name: "dr-nick",
  description: "Summon Dr. Nick for API health checks",
  run,
};
