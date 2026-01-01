/**
 * Fat Tony Command
 * Microservices Architecture
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("fat-tony", args.join(" "), context);
}

export default {
  name: "fat-tony",
  description: "Summon Fat Tony for microservices architecture",
  run,
};
