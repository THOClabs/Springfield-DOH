/**
 * Lisa Simpson Command
 * Architecture, planning, and Ralph initiation
 */

import { summonCharacter } from "./summon.js";
import { run as lisaRalphRun } from "./lisa-ralph-special.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  // Check if this is the special "ralph" subcommand
  if (args[0]?.toLowerCase() === "ralph") {
    return lisaRalphRun(args.slice(1), context);
  }

  return summonCharacter("lisa", args.join(" "), context);
}

export default {
  name: "lisa",
  description: "Summon Lisa Simpson for architecture and planning (use '/lisa ralph' to initiate Ralph)",
  run,
};
