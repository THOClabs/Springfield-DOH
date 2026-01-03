/**
 * Character Sequencer
 * Determines optimal character order based on problem classification
 */

import type { ProblemClassification, CharacterId, CharacterConfig } from '../types.js';
import { CHARACTERS, getCharactersForDomain } from '../patterns/characters.js';

/**
 * Character sequence rules based on development flow
 */
const SEQUENCE_RULES = {
  // Start with questioners for requirements
  requirementsPhase: ['homer', 'marge'] as CharacterId[],
  
  // Technical deep-dive characters
  technicalPhase: ['frink', 'lisa', 'cbg'] as CharacterId[],
  
  // Testing and breaking characters
  testingPhase: ['bart', 'nelson', 'bob', 'snake'] as CharacterId[],
  
  // Business and compliance
  businessPhase: ['burns', 'smithers', 'flanders'] as CharacterId[],
  
  // Operations and infrastructure
  opsPhase: ['apu', 'willie', 'otto'] as CharacterId[],
  
  // Communication and documentation
  docsPhase: ['kent', 'troy', 'skinner'] as CharacterId[],
  
  // Always ends with Ralph at playground
  executionPhase: ['lisa', 'ralph'] as CharacterId[]
};

/**
 * Domain to phase mapping
 */
const DOMAIN_PHASES: Record<string, (keyof typeof SEQUENCE_RULES)[]> = {
  architecture: ['requirementsPhase', 'technicalPhase', 'businessPhase', 'executionPhase'],
  performance: ['requirementsPhase', 'technicalPhase', 'opsPhase', 'testingPhase', 'executionPhase'],
  security: ['requirementsPhase', 'testingPhase', 'technicalPhase', 'businessPhase', 'executionPhase'],
  data: ['requirementsPhase', 'technicalPhase', 'businessPhase', 'executionPhase'],
  integration: ['requirementsPhase', 'technicalPhase', 'opsPhase', 'executionPhase'],
  'user-experience': ['requirementsPhase', 'businessPhase', 'technicalPhase', 'docsPhase', 'executionPhase'],
  infrastructure: ['requirementsPhase', 'opsPhase', 'technicalPhase', 'executionPhase'],
  migration: ['requirementsPhase', 'technicalPhase', 'testingPhase', 'opsPhase', 'executionPhase'],
  debugging: ['requirementsPhase', 'technicalPhase', 'testingPhase', 'executionPhase'],
  planning: ['requirementsPhase', 'businessPhase', 'docsPhase', 'executionPhase'],
  compliance: ['requirementsPhase', 'businessPhase', 'technicalPhase', 'docsPhase', 'executionPhase']
};

export interface CharacterSequenceConfig {
  maxCharacters?: number;
  excludeCharacters?: CharacterId[];
  requireCharacters?: CharacterId[];
}

/**
 * Generate optimal character sequence for a problem
 */
export function generateCharacterSequence(
  classification: ProblemClassification,
  config: CharacterSequenceConfig = {}
): CharacterId[] {
  const { 
    maxCharacters = 6, 
    excludeCharacters = [], 
    requireCharacters = [] 
  } = config;
  
  const sequence: CharacterId[] = [];
  const usedCharacters = new Set<CharacterId>();
  
  // Helper to add character if not excluded and not already used
  const addCharacter = (id: CharacterId): boolean => {
    if (excludeCharacters.includes(id)) return false;
    if (usedCharacters.has(id)) return false;
    if (sequence.length >= maxCharacters - 1) return false; // Save room for Lisa at end
    
    sequence.push(id);
    usedCharacters.add(id);
    return true;
  };
  
  // Add required characters first
  for (const id of requireCharacters) {
    addCharacter(id);
  }
  
  // Get phases for primary domain
  const phases = DOMAIN_PHASES[classification.primaryDomain] || DOMAIN_PHASES.planning;
  
  // Add characters from each phase
  for (const phase of phases) {
    if (phase === 'executionPhase') continue; // Handle at end
    
    const candidates = SEQUENCE_RULES[phase];
    
    // Pick first available from phase
    for (const candidate of candidates) {
      if (addCharacter(candidate)) break;
    }
    
    // Stop if we have enough
    if (sequence.length >= maxCharacters - 1) break;
  }
  
  // Add domain experts not yet included
  const allDomains = [classification.primaryDomain, ...classification.secondaryDomains];
  for (const domain of allDomains) {
    if (sequence.length >= maxCharacters - 1) break;
    
    const domainExperts = getCharactersForDomain(domain);
    for (const expert of domainExperts) {
      if (addCharacter(expert.id)) break;
    }
  }
  
  // Always end with Lisa (to brief Ralph)
  if (!usedCharacters.has('lisa')) {
    sequence.push('lisa');
  }
  
  return sequence;
}

/**
 * Get character purpose for a specific position in sequence
 */
export function getCharacterPurpose(
  characterId: CharacterId,
  position: number,
  totalCharacters: number,
  classification: ProblemClassification
): string {
  const character = CHARACTERS[characterId];
  
  // Position-based purposes
  if (position === 0) {
    return `Open the episode by gathering initial requirements. ${character.role}.`;
  }
  
  if (position === totalCharacters - 1) {
    return 'Consolidate all artifacts and prepare handoff to Ralph for execution.';
  }
  
  // Domain-based purposes
  if (character.expertise.includes(classification.primaryDomain)) {
    return `Provide expertise on ${classification.primaryDomain}. ${character.role}.`;
  }
  
  // Default purpose
  return `${character.role} - contribute to solution design.`;
}

/**
 * Determine interview focus areas for a character
 */
export function getInterviewFocus(
  characterId: CharacterId,
  classification: ProblemClassification
): string[] {
  const character = CHARACTERS[characterId];
  const focus: string[] = [];
  
  // Add expertise-based focus
  for (const expertise of character.expertise) {
    if (classification.primaryDomain === expertise) {
      focus.push(`Deep dive into ${expertise} requirements`);
    } else if (classification.secondaryDomains.includes(expertise)) {
      focus.push(`Consider ${expertise} implications`);
    }
  }
  
  // Add role-based focus
  switch (character.questionStyle) {
    case 'direct':
      focus.push('Clarify assumptions');
      break;
    case 'socratic':
      focus.push('Explore trade-offs through questioning');
      break;
    case 'challenging':
      focus.push('Stress-test proposed solutions');
      break;
    case 'supportive':
      focus.push('Identify coordination needs');
      break;
    case 'chaotic':
      focus.push('Find unexpected edge cases');
      break;
  }
  
  // Add character-specific focus
  switch (characterId) {
    case 'homer':
      focus.push("Ask 'why' until the real problem is clear");
      break;
    case 'lisa':
      focus.push('Create structured architectural documentation');
      break;
    case 'bart':
      focus.push('Identify ways the system could break');
      break;
    case 'burns':
      focus.push('Evaluate business value and ROI');
      break;
    case 'frink':
      focus.push('Analyze technical constraints and possibilities');
      break;
  }
  
  return focus;
}
