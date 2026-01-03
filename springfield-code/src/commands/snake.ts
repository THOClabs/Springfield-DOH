/**
 * Snake Jailbird Command
 * Authentication & Authorization
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("snake", args.join(" "), context);
}

export default {
  name: "snake",
  description: "Summon Snake Jailbird for authentication and authorization",
  run,
};
