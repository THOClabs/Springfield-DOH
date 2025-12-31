/**
 * Character summoning command
 * Central logic for summoning Simpsons characters for planning
 */

import * as fs from "fs";
import * as path from "path";
import { CHARACTER_ARTIFACTS, SPRINGFIELD_DIR, ALL_CHARACTERS } from "../constants.js";

interface SummonContext {
  cwd?: string;
}

/**
 * Find the agent definition file for a character
 */
function findAgentPath(character: string): string | null {
  const basePath = path.join(__dirname, "..", "agents");

  // Check simpson-family
  let agentPath = path.join(basePath, "simpson-family", `${character}.md`);
  if (fs.existsSync(agentPath)) return agentPath;

  // Check extended
  agentPath = path.join(basePath, "extended", `${character}.md`);
  if (fs.existsSync(agentPath)) return agentPath;

  // Check springfield
  agentPath = path.join(basePath, "springfield", `${character}.md`);
  if (fs.existsSync(agentPath)) return agentPath;

  return null;
}

/**
 * Load agent definition
 */
function loadAgentDefinition(character: string): string | null {
  const agentPath = findAgentPath(character);
  if (!agentPath) return null;

  try {
    return fs.readFileSync(agentPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Generate character response based on personality
 */
function generateCharacterResponse(
  character: string,
  agentDef: string,
  userInput: string
): string {
  // Extract voice patterns from agent definition
  const voiceMatch = agentDef.match(/## Voice & Mannerisms\n([\s\S]*?)(?=\n## |$)/);
  const personalityMatch = agentDef.match(/## Personality Core\n([\s\S]*?)(?=\n## |$)/);

  const voice = voiceMatch ? voiceMatch[1].trim() : "";
  const personality = personalityMatch ? personalityMatch[1].trim() : "";

  // Generate response header with character action
  const characterName = character.charAt(0).toUpperCase() + character.slice(1);

  return `*${characterName} considers the request*

${getCharacterDialogue(character, userInput)}

---
Character: ${characterName}
Context: ${userInput || "(no specific input)"}
Artifact: ${CHARACTER_ARTIFACTS[character] || "none"}
`;
}

/**
 * Get character-specific dialogue
 */
function getCharacterDialogue(character: string, input: string): string {
  const dialogues: Record<string, string> = {
    homer: `D'oh! Let me think about this...

*scratches head*

So you want to know: "${input}"

Here's what I'm wondering:
- Why are we doing this again?
- Is there donuts involved?
- What's the simplest possible way to do this?

Sometimes the dumbest question reveals the smartest answer.`,

    marge: `Hmmmm...

*adjusts hair nervously*

Let me organize this properly for you.

Regarding: "${input}"

Structure I'd suggest:
1. First, we need to understand the core problem
2. Then, break it down into manageable pieces
3. Finally, make sure everyone knows their role

Don't forget to clean up as you go!`,

    bart: `Eat my shorts! This sounds interesting...

*grabs skateboard*

"${input}" - Okay, here's what could go WRONG:

- What if someone uses this in a way you didn't expect?
- What if the inputs are garbage?
- What if everything breaks at once?

Ay caramba, chaos engineering is my specialty!`,

    lisa: `*adjusts saxophone case thoughtfully*

"${input}" - This requires careful analysis.

From an architectural perspective:
- What are the key components?
- How do they interact?
- What patterns should we follow?

Let me help structure this properly...`,

    maggie: `*squeak*

*squeak squeak*

(Status: ACKNOWLEDGED)
(Input received: "${input}")
(Logging initialized)

*squeak*`,
  };

  return dialogues[character] || `*${character} responds in character*\n\n"${input}"`;
}

/**
 * Write artifact file if applicable
 */
function writeArtifact(
  character: string,
  content: string,
  projectDir: string
): string | null {
  const artifactName = CHARACTER_ARTIFACTS[character];
  if (!artifactName) return null;

  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);
  if (!fs.existsSync(springfieldDir)) {
    return null; // Springfield not initialized
  }

  const artifactPath = path.join(springfieldDir, artifactName);
  fs.writeFileSync(artifactPath, content, "utf-8");
  return artifactPath;
}

/**
 * Summon a character for planning
 */
export async function summonCharacter(
  character: string,
  userInput: string,
  context: SummonContext
): Promise<string> {
  const normalizedCharacter = character.toLowerCase();

  // Validate character
  if (!ALL_CHARACTERS.includes(normalizedCharacter as any)) {
    return `Unknown character: ${character}

Available characters:
${ALL_CHARACTERS.map((c) => `  /${c}`).join("\n")}`;
  }

  // Load agent definition
  const agentDef = loadAgentDefinition(normalizedCharacter);

  // Generate response (even without agent file, use defaults)
  const response = agentDef
    ? generateCharacterResponse(normalizedCharacter, agentDef, userInput)
    : generateCharacterResponse(normalizedCharacter, "", userInput);

  return response;
}

export default {
  name: "summon",
  description: "Summon a Simpsons character for planning assistance",

  async run(args: string[], context: SummonContext): Promise<string> {
    const [character, ...inputParts] = args;
    const userInput = inputParts.join(" ");

    if (!character) {
      return `Usage: /summon <character> [input]

Available characters:
${ALL_CHARACTERS.map((c) => `  ${c}`).join("\n")}`;
    }

    return summonCharacter(character, userInput, context);
  },
};
