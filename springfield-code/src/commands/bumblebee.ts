/**
 * Bumblebee Man Command
 * Internationalization (i18n)
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("bumblebee", args.join(" "), context);
}

export default {
  name: "bumblebee",
  description: "Summon Bumblebee Man for internationalization",
  run,
};
