/**
 * Kent Brockman Command
 * Monitoring & Alerting, "This just in!"
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("kent", args.join(" "), context);
}

export default {
  name: "kent",
  description: "Summon Kent Brockman for monitoring and alerting",
  run,
};
