/**
 * Batch Character Summon Command
 * Summon multiple characters by tier: family, extended, springfield, specialists
 * 
 * @module commands/summon-batch
 */

import { CHARACTER_TIERS } from "../constants.js";
import { summonCharacter } from "./summon.js";
import type { CharacterTier } from "../types.js";

interface CommandContext {
  cwd?: string;
}

/**
 * Valid tier aliases that map to CHARACTER_TIERS keys
 */
const TIER_ALIASES: Record<string, CharacterTier> = {
  family: "simpson_family",
  simpson_family: "simpson_family",
  simpsons: "simpson_family",
  extended: "extended",
  springfield: "springfield",
  town: "springfield",
  specialists: "specialists",
  specialist: "specialists",
  all: "specialists", // Special case handled below
};

/**
 * Get characters for a tier (or all tiers)
 */
function getCharactersForTier(tier: string): readonly string[] {
  if (tier === "all") {
    return [
      ...CHARACTER_TIERS.simpson_family,
      ...CHARACTER_TIERS.extended,
      ...CHARACTER_TIERS.springfield,
      ...CHARACTER_TIERS.specialists,
    ];
  }

  const normalizedTier = TIER_ALIASES[tier.toLowerCase()];
  if (!normalizedTier) {
    return [];
  }

  return CHARACTER_TIERS[normalizedTier];
}

/**
 * Format tier summary for output
 */
function formatTierSummary(tier: string, characters: readonly string[]): string {
  const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1);
  
  return `## ${tierDisplay} Characters (${characters.length})

${characters.map(c => `- \`${c}\``).join("\n")}
`;
}

/**
 * Run batch summon command
 * 
 * @param args - Command arguments: [tier] [optional input]
 * @param context - Command context with cwd
 * @returns Summary of summoned characters
 */
export async function run(args: string[], context: CommandContext): Promise<string> {
  const [tierArg, ...inputParts] = args;
  const userInput = inputParts.join(" ");

  if (!tierArg) {
    return `# Batch Summon

Summon multiple characters by tier.

## Usage
\`/summon-batch <tier> [input]\`

## Available Tiers
- \`family\` / \`simpsons\` - Simpson family (${CHARACTER_TIERS.simpson_family.length} characters)
- \`extended\` - Extended family (${CHARACTER_TIERS.extended.length} characters)
- \`springfield\` - Springfield citizens (${CHARACTER_TIERS.springfield.length} characters)
- \`specialists\` - Technical specialists (${CHARACTER_TIERS.specialists.length} characters)
- \`all\` - All characters (${CHARACTER_TIERS.simpson_family.length + CHARACTER_TIERS.extended.length + CHARACTER_TIERS.springfield.length + CHARACTER_TIERS.specialists.length} total)

## Examples
\`\`\`
/summon-batch family "Review this API design"
/summon-batch specialists "Security audit"
/summon-batch all
\`\`\`
`;
  }

  const characters = getCharactersForTier(tierArg);

  if (characters.length === 0) {
    return `# Error: Unknown Tier

"${tierArg}" is not a valid tier.

Valid tiers: family, extended, springfield, specialists, all
`;
  }

  // If no input, just list the characters
  if (!userInput) {
    return `# Batch Summon: ${tierArg}

${formatTierSummary(tierArg, characters)}

**Tip:** Add input to summon all characters with context:
\`/summon-batch ${tierArg} "your topic here"\`
`;
  }

  // Summon each character
  const results: string[] = [];
  
  results.push(`# Batch Summon: ${tierArg}`);
  results.push(`*Summoning ${characters.length} characters for: "${userInput}"*\n`);

  for (const character of characters) {
    try {
      const response = await summonCharacter(character, userInput, context);
      results.push(`## ${character.charAt(0).toUpperCase() + character.slice(1)}\n`);
      results.push(response);
      results.push("\n---\n");
    } catch (error) /* istanbul ignore next -- @preserve Error handling for failed character summons */ {
      results.push(`## ${character} - Error\n`);
      results.push(`Failed to summon: ${error}\n`);
      results.push("\n---\n");
    }
  }

  results.push(`\n*Batch complete: ${characters.length} characters summoned*`);

  return results.join("\n");
}

export default {
  name: "summon-batch",
  description: "Summon multiple characters by tier (family, extended, springfield, specialists, all)",
  run,
};
