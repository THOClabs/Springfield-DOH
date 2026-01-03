/**
 * Pattern Library Exports
 */

export { CHARACTERS, getCharactersForDomain, getCharactersByTier, getCharacterRelationships } from './characters.js';
export { SCENES, getScenesForDomain, getScenesByAmbiance, getPrimarySceneForCharacter } from './scenes.js';
export { EPISODE_TEMPLATES, getTemplatesForDomain, getTemplatesByPattern, findBestTemplate, getTemplateById } from './episodes.js';
export { 
  CHARACTER_PROMPTS, 
  getExtendedPrompt, 
  buildCharacterSystemPrompt, 
  getArtifactInstructions,
  type ExtendedCharacterPrompt 
} from './character-prompts.js';
