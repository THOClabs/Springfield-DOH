/**
 * Episode Generator
 * Creates customized episodes based on problem classification
 */

import { v4 as uuid } from 'uuid';
import type { 
  ProblemClassification, 
  GeneratedEpisode, 
  CharacterInstance, 
  SceneInstance,
  EpisodeTemplate,
  CharacterId,
  SceneId
} from '../types.js';
import { findBestTemplate, EPISODE_TEMPLATES } from '../patterns/episodes.js';
import { CHARACTERS } from '../patterns/characters.js';
import { SCENES, getPrimarySceneForCharacter } from '../patterns/scenes.js';
import { generateCharacterSequence, getCharacterPurpose, getInterviewFocus } from '../sequencer/character-sequencer.js';

export interface EpisodeGeneratorConfig {
  maxCharacters?: number;
  maxDuration?: number;
  excludeCharacters?: CharacterId[];
  preferredTemplate?: string;
}

/**
 * Generate a complete episode for a problem
 */
export function generateEpisode(
  classification: ProblemClassification,
  config: EpisodeGeneratorConfig = {}
): GeneratedEpisode {
  const { 
    maxCharacters = 6, 
    maxDuration = 60,
    excludeCharacters = [],
    preferredTemplate
  } = config;
  
  // Find best template
  let template: EpisodeTemplate | undefined;
  if (preferredTemplate) {
    template = EPISODE_TEMPLATES.find(t => t.id === preferredTemplate);
  }
  if (!template) {
    template = findBestTemplate([classification.primaryDomain, ...classification.secondaryDomains]);
  }
  if (!template) {
    template = EPISODE_TEMPLATES[0]; // Fallback to first
  }
  
  // Generate character sequence
  const characterIds = generateCharacterSequence(classification, {
    maxCharacters,
    excludeCharacters
  });
  
  // Create character instances with scenes
  const characterInstances: CharacterInstance[] = characterIds.map((characterId, index) => {
    // Determine scene for this character
    let scene: SceneId;
    if (index === characterIds.length - 1) {
      // Last character (Lisa) → playground for handoff
      scene = 'elementary-playground';
    } else {
      // Try to use scene from template, or find primary scene
      const templateScene = template!.sceneSequence[index];
      if (templateScene) {
        scene = templateScene;
      } else {
        const primaryScene = getPrimarySceneForCharacter(characterId);
        scene = primaryScene?.id || 'simpson-living-room';
      }
    }
    
    return {
      character: characterId,
      scene,
      order: index,
      purpose: getCharacterPurpose(characterId, index, characterIds.length, classification),
      interviewFocus: getInterviewFocus(characterId, classification),
      expectedArtifacts: [CHARACTERS[characterId].artifactType],
      transitionTo: index < characterIds.length - 1 
        ? characterIds[index + 1] 
        : 'playground' as const
    };
  });
  
  // Create scene instances
  const uniqueScenes = [...new Set(characterInstances.map(c => c.scene))];
  const sceneInstances: SceneInstance[] = uniqueScenes.map((sceneId, index) => {
    const sceneConfig = SCENES[sceneId];
    const charactersInScene = characterInstances
      .filter(c => c.scene === sceneId)
      .map(c => c.character);
    
    return {
      scene: sceneId,
      order: index,
      characters: charactersInScene,
      narrative: generateSceneNarrative(sceneId, charactersInScene, classification),
      userObjective: generateUserObjective(sceneId, charactersInScene, classification)
    };
  });
  
  // Generate episode title
  const title = generateEpisodeTitle(classification, template);
  
  return {
    id: uuid(),
    title,
    basedOn: template.id,
    problem: classification,
    characterSequence: characterInstances,
    sceneSequence: sceneInstances,
    estimatedDuration: Math.min(maxDuration, classification.suggestedDuration),
    generatedAt: new Date()
  };
}

/**
 * Generate a narrative description for a scene
 */
function generateSceneNarrative(
  sceneId: SceneId,
  characters: CharacterId[],
  classification: ProblemClassification
): string {
  const scene = SCENES[sceneId];
  const characterNames = characters.map(c => CHARACTERS[c].name);
  
  if (sceneId === 'elementary-playground') {
    return `The final scene. Lisa walks you to the playground where Ralph waits. All your design decisions are consolidated into execution instructions.`;
  }
  
  if (sceneId === 'simpson-living-room') {
    return `You arrive at the Simpson home. ${characterNames.join(' and ')} greet you in the living room. Time to discuss ${classification.primaryDomain} requirements.`;
  }
  
  if (sceneId === 'frinks-lab') {
    return `Professor Frink's laboratory. Equations float in the air. Technical constraints and possibilities will be explored here.`;
  }
  
  if (sceneId === 'burns-office') {
    return `The imposing office of C. Montgomery Burns. Business value, ROI, and executive concerns will be addressed.`;
  }
  
  return `${scene.name}: ${scene.description} ${characterNames.join(' and ')} ${characters.length > 1 ? 'are' : 'is'} here to help.`;
}

/**
 * Generate user objective for a scene
 */
function generateUserObjective(
  sceneId: SceneId,
  characters: CharacterId[],
  classification: ProblemClassification
): string {
  if (sceneId === 'elementary-playground') {
    return 'Confirm the design and hand off to Ralph for execution.';
  }
  
  const primaryCharacter = CHARACTERS[characters[0]];
  return `Work with ${primaryCharacter.name} to ${primaryCharacter.role.toLowerCase()}.`;
}

/**
 * Generate an episode title
 */
function generateEpisodeTitle(
  classification: ProblemClassification,
  template: EpisodeTemplate
): string {
  const domainTitles: Record<string, string[]> = {
    architecture: ['The Blueprint', 'Design by Committee', 'Building Blocks'],
    performance: ['The Speed of Homer', 'Faster Than Bart', 'The Latency Games'],
    security: ['Lock and Load', 'The Threat Within', 'Security Theater'],
    data: ['Data Day Afternoon', 'The Query', 'Schema Surprise'],
    integration: ['Bridge Over Troubled APIs', 'The Connection', 'Sync or Swim'],
    'user-experience': ['The User Always Wins', 'Click Bait', 'UX Marks the Spot'],
    infrastructure: ['Cloud Nine', 'The Deployment', 'Ops-a-Daisy'],
    migration: ['Moving Day', 'The Great Migration', 'Legacy of Pain'],
    debugging: ['Bug Hunt', 'The Fix Is In', 'Error of Our Ways'],
    planning: ['The Plan', 'Roadmap to Nowhere', 'Sprint to the Finish'],
    compliance: ['By the Book', 'Audit Day', 'Rules Are Rules']
  };
  
  const titles = domainTitles[classification.primaryDomain] || domainTitles.planning;
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  
  return `${randomTitle}: A Springfield Solution`;
}
