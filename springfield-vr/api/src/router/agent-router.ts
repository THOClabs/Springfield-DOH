/**
 * Agent Router
 * Routes VR character interactions to Claude Code agents
 */

import type { CharacterId, CharacterInteractionRequest, CharacterInteractionResponse, Artifact, VRSession, CharacterInstance } from '../types.js';
import { CHARACTERS } from '../patterns/characters.js';
import { v4 as uuid } from 'uuid';

/**
 * Interview protocol templates for each question style
 */
const INTERVIEW_PROTOCOLS: Record<string, string> = {
  direct: `Ask clear, straightforward questions. Get to the point. 
Challenge vague answers with "What exactly do you mean by...?"
Focus on concrete specifics, not abstractions.`,

  socratic: `Guide through questioning, not telling. 
Ask "What would happen if...?" and "Have you considered...?"
Lead the user to discover answers themselves.
Never give the answer directly.`,

  challenging: `Push back on every assumption. 
Ask "Why not just...?" and "What's stopping you from...?"
Point out flaws and weaknesses in proposed solutions.
Be skeptical but constructive.`,

  supportive: `Encourage and validate while gathering information.
Ask "How can I help you with...?" and "What support do you need for...?"
Focus on coordination, dependencies, and teamwork.`,

  chaotic: `Ask unexpected, tangential questions.
"What if a user does something completely stupid?"
"What breaks if I just randomly delete this?"
Find edge cases through creative destruction.`
};

/**
 * Generate the agent prompt for a character interaction
 */
export function generateAgentPrompt(
  characterId: CharacterId,
  session: VRSession,
  userMessage: string
): string {
  const character = CHARACTERS[characterId];
  const currentStep = session.episode.characterSequence.find((c: CharacterInstance) => c.character === characterId);
  const existingArtifacts = session.artifacts
    .map((a: Artifact) => `- ${a.type}: ${a.title}`)
    .join('\n');
  
  return `You are ${character.name} from The Simpsons.

ROLE: ${character.role}
EXPERTISE: ${character.expertise.join(', ')}
CATCHPHRASES: ${character.catchphrases.join(' / ')}

INTERVIEW PROTOCOL:
${INTERVIEW_PROTOCOLS[character.questionStyle]}

CURRENT PROBLEM:
${session.episode.problem.statement}

PROBLEM DOMAIN: ${session.episode.problem.primaryDomain}
COMPLEXITY: ${session.episode.problem.complexity}

YOUR PURPOSE IN THIS SCENE:
${currentStep?.purpose || 'Help with solution design'}

INTERVIEW FOCUS AREAS:
${currentStep?.interviewFocus?.map(f => `- ${f}`).join('\n') || '- General discussion'}

EXISTING ARTIFACTS FROM EARLIER IN EPISODE:
${existingArtifacts || 'None yet'}

EXPECTED OUTPUT:
Generate a ${character.artifactType} artifact when you have enough information.

USER'S MESSAGE:
${userMessage}

---

Respond as ${character.name}. Stay in character. Use catchphrases naturally. 
Ask questions according to your interview protocol.
When you have enough information, generate the artifact.
Signal when ready to transition to next character.`;
}

/**
 * Parse an agent response to extract artifacts and status
 */
export function parseAgentResponse(
  response: string,
  characterId: CharacterId,
  sessionId: string
): { 
  message: string; 
  artifacts: Artifact[]; 
  isComplete: boolean 
} {
  const character = CHARACTERS[characterId];
  const artifacts: Artifact[] = [];
  let isComplete = false;
  
  // Check for artifact markers
  const artifactMarkers = [
    '```artifact',
    '## Artifact:',
    '### Generated:',
    '---BEGIN ARTIFACT---'
  ];
  
  for (const marker of artifactMarkers) {
    if (response.includes(marker)) {
      // Extract artifact content
      const artifactContent = extractArtifactContent(response, marker);
      if (artifactContent) {
        artifacts.push({
          id: uuid(),
          sessionId,
          character: characterId,
          scene: 'simpson-living-room', // Will be updated by caller
          type: character.artifactType,
          title: `${character.name}'s ${character.artifactType}`,
          content: artifactContent,
          createdAt: new Date()
        });
      }
    }
  }
  
  // Check for completion signals
  const completionSignals = [
    'ready for the next',
    'hand off to',
    'should talk to',
    'time to move on',
    "let's go see",
    'transition to',
    "I've done my part"
  ];
  
  for (const signal of completionSignals) {
    if (response.toLowerCase().includes(signal)) {
      isComplete = true;
      break;
    }
  }
  
  // Clean response for user display
  let message = response;
  for (const marker of artifactMarkers) {
    const idx = message.indexOf(marker);
    if (idx !== -1) {
      // Remove artifact block from message
      const endIdx = message.indexOf('---END ARTIFACT---', idx);
      if (endIdx !== -1) {
        message = message.slice(0, idx) + message.slice(endIdx + 18);
      }
    }
  }
  
  return { message: message.trim(), artifacts, isComplete };
}

/**
 * Extract artifact content from response
 */
function extractArtifactContent(response: string, marker: string): string | null {
  const startIdx = response.indexOf(marker);
  if (startIdx === -1) return null;
  
  const afterMarker = response.slice(startIdx + marker.length);
  
  // Try to find end marker
  const endMarkers = ['---END ARTIFACT---', '```', '\n---\n'];
  let endIdx = afterMarker.length;
  
  for (const end of endMarkers) {
    const idx = afterMarker.indexOf(end);
    if (idx !== -1 && idx < endIdx) {
      endIdx = idx;
    }
  }
  
  return afterMarker.slice(0, endIdx).trim();
}

/**
 * Handle a character interaction
 */
export async function handleInteraction(
  request: CharacterInteractionRequest,
  session: VRSession,
  claudeClient: any // TODO: Type properly
): Promise<CharacterInteractionResponse> {
  const { characterId, userMessage } = request;
  
  // Generate the agent prompt
  const prompt = generateAgentPrompt(characterId, session, userMessage);
  
  // Call Claude (placeholder - implement with actual SDK)
  // const response = await claudeClient.messages.create({
  //   model: 'claude-sonnet-4-20250514',
  //   max_tokens: 2000,
  //   messages: [{ role: 'user', content: prompt }]
  // });
  
  // For now, return a mock response
  const mockResponse = generateMockResponse(characterId, userMessage);
  
  // Parse the response
  const { message, artifacts, isComplete } = parseAgentResponse(
    mockResponse,
    characterId,
    session.id
  );
  
  // Determine next character if complete
  const characterSequence = session.episode.characterSequence;
  const currentIdx = characterSequence.findIndex((c: CharacterInstance) => c.character === characterId);
  const nextCharacter = isComplete && currentIdx < characterSequence.length - 1
    ? characterSequence[currentIdx + 1].character
    : undefined;
  const nextScene = nextCharacter
    ? characterSequence[currentIdx + 1].scene
    : undefined;
  
  return {
    characterMessage: message,
    artifacts: artifacts.length > 0 ? artifacts : undefined,
    isComplete,
    nextCharacter,
    nextScene
  };
}

/**
 * Generate a mock response for testing
 */
function generateMockResponse(characterId: CharacterId, userMessage: string): string {
  const character = CHARACTERS[characterId];
  const catchphrase = character.catchphrases[0];
  
  return `${catchphrase}

Ah, so you're working on something interesting! Let me ask you a few questions...

Based on what you've told me, I'm thinking about ${character.role.toLowerCase()}.

Tell me more about your requirements. What's the most important thing this needs to do?

${character.catchphrases[1] || ''}`;
}
