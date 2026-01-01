/**
 * Sea Captain Command
 * Container Orchestration & Kubernetes
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("sea-captain", args.join(" "), context);
}

export default {
  name: "sea-captain",
  description: "Summon Sea Captain for container orchestration",
  run,
};
