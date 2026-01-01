/**
 * Stats Command
 * Display local usage statistics
 * 
 * @module commands/stats
 */

import { formatStatsReport, resetStats } from "../utils/stats.js";

interface CommandContext {
  cwd?: string;
}

/**
 * Run stats command
 */
export async function run(args: string[], context: CommandContext): Promise<string> {
  const projectDir = context.cwd || process.cwd();
  const [subcommand] = args;

  if (subcommand === "reset") {
    const success = resetStats(projectDir);
    if (success) {
      return "# Stats Reset\n\n*All usage statistics have been cleared.*";
    } else {
      return "# Error\n\n*Could not reset stats. Is Springfield initialized?*";
    }
  }

  return formatStatsReport(projectDir);
}

export default {
  name: "stats",
  description: "View local usage statistics for character invocations",
  run,
};
