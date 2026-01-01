/**
 * Agnes Skinner Command
 * CI/CD Pipelines
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("agnes", args.join(" "), context);
}

export default {
  name: "agnes",
  description: "Summon Agnes Skinner for CI/CD pipelines",
  run,
};
