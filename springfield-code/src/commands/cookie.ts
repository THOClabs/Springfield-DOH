/**
 * Cookie Kwan Command
 * Database & Data Modeling
 */

import { summonCharacter } from "./summon.js";

interface CommandContext {
  cwd?: string;
}

export async function run(args: string[], context: CommandContext): Promise<string> {
  return summonCharacter("cookie", args.join(" "), context);
}

export default {
  name: "cookie",
  description: "Summon Cookie Kwan for database and data modeling",
  run,
};
