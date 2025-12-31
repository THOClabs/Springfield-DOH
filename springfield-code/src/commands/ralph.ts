/**
 * Ralph Wiggum Command
 * The executor - but only via Lisa
 */

interface CommandContext {
  cwd?: string;
}

export async function run(_args: string[], _context: CommandContext): Promise<string> {
  // Direct Ralph invocation is always blocked by ralph-gate hook
  // This message should never be seen if the hook is working
  return `*Ralph looks confused*

Hi Lisa! Where's Lisa? Lisa tells me what to do.

*picks nose*

You should use \`/lisa ralph\` instead. Lisa knows the plan!`;
}

export default {
  name: "ralph",
  description: "Ralph Wiggum - The executor (only accessible via /lisa ralph)",
  run,
};
