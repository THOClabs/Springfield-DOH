/**
 * Scene Configuration Library
 * Maps Springfield locations to VR environments
 */

import type { SceneConfig, SceneId } from '../types.js';

export const SCENES: Record<SceneId, SceneConfig> = {
  'simpson-living-room': {
    id: 'simpson-living-room',
    name: 'Simpson Living Room',
    description: 'The iconic couch scene. TV playing, family photos on walls. Comfortable, familiar, casual.',
    ambiance: 'casual',
    typicalCharacters: ['homer', 'marge', 'bart', 'lisa', 'maggie'],
    suitableFor: ['planning', 'user-experience'],
    environmentAssets: ['couch', 'tv', 'lamp', 'family-photos', 'carpet'],
    lighting: 'cozy'
  },

  'simpson-kitchen': {
    id: 'simpson-kitchen',
    name: 'Simpson Kitchen',
    description: 'Where plans come together over breakfast. Table discussions, practical decisions.',
    ambiance: 'casual',
    typicalCharacters: ['marge', 'homer', 'lisa', 'bart'],
    suitableFor: ['planning', 'integration'],
    environmentAssets: ['table', 'fridge', 'stove', 'window', 'cereal-boxes'],
    lighting: 'day'
  },

  'simpson-garage': {
    id: 'simpson-garage',
    name: 'Simpson Garage',
    description: 'Workshop space. Building, tinkering, prototyping. Where Homer\'s projects happen.',
    ambiance: 'casual',
    typicalCharacters: ['homer', 'bart'],
    suitableFor: ['infrastructure', 'debugging'],
    environmentAssets: ['workbench', 'car', 'tools', 'boxes', 'lawn-equipment'],
    lighting: 'day'
  },

  'simpson-backyard': {
    id: 'simpson-backyard',
    name: 'Simpson Backyard',
    description: 'Open sky, treehouse visible. Good for big-picture thinking and neighbor interactions.',
    ambiance: 'casual',
    typicalCharacters: ['homer', 'bart', 'flanders', 'lisa'],
    suitableFor: ['architecture', 'planning'],
    environmentAssets: ['treehouse', 'fence', 'grill', 'hammock', 'lawn'],
    lighting: 'day'
  },

  'moes-tavern': {
    id: 'moes-tavern',
    name: "Moe's Tavern",
    description: 'Dark, smoky bar. Where problems are discussed informally. Honest, unfiltered feedback.',
    ambiance: 'casual',
    typicalCharacters: ['moe', 'homer', 'barney', 'apu'],
    suitableFor: ['debugging', 'migration'],
    environmentAssets: ['bar-counter', 'stools', 'pickled-eggs', 'phone', 'bottles'],
    lighting: 'night'
  },

  'kwik-e-mart': {
    id: 'kwik-e-mart',
    name: 'Kwik-E-Mart',
    description: '24/7 convenience store. Reliability, operations, always-on services.',
    ambiance: 'casual',
    typicalCharacters: ['apu', 'homer', 'bart'],
    suitableFor: ['infrastructure', 'performance'],
    environmentAssets: ['counter', 'squishee-machine', 'shelves', 'magazines', 'hotdogs'],
    lighting: 'day'
  },

  'nuclear-plant': {
    id: 'nuclear-plant',
    name: 'Springfield Nuclear Plant',
    description: 'Industrial setting. High stakes, safety critical, performance under pressure.',
    ambiance: 'professional',
    typicalCharacters: ['homer', 'burns', 'smithers'],
    suitableFor: ['performance', 'security', 'compliance'],
    environmentAssets: ['control-panel', 'cooling-towers', 'reactor', 'warning-signs'],
    lighting: 'dramatic'
  },

  'burns-office': {
    id: 'burns-office',
    name: "Mr. Burns' Office",
    description: 'Executive suite. Power, money, strategy. Where big decisions get made.',
    ambiance: 'formal',
    typicalCharacters: ['burns', 'smithers'],
    suitableFor: ['planning', 'compliance'],
    environmentAssets: ['desk', 'hounds-painting', 'globe', 'intercom', 'curtains'],
    lighting: 'dramatic'
  },

  'springfield-elementary': {
    id: 'springfield-elementary',
    name: 'Springfield Elementary School',
    description: 'Classroom setting. Learning, structure, rules, process.',
    ambiance: 'educational',
    typicalCharacters: ['skinner', 'bart', 'lisa', 'milhouse', 'nelson', 'ralph'],
    suitableFor: ['planning', 'compliance', 'user-experience'],
    environmentAssets: ['desks', 'chalkboard', 'globe', 'flag', 'clock'],
    lighting: 'day'
  },

  'elementary-playground': {
    id: 'elementary-playground',
    name: 'Elementary Playground',
    description: 'Where Ralph lives. The handoff point. Sandbox for building.',
    ambiance: 'casual',
    typicalCharacters: ['ralph', 'lisa', 'bart', 'milhouse', 'nelson'],
    suitableFor: [],
    environmentAssets: ['sandbox', 'swings', 'slide', 'monkey-bars', 'fence'],
    lighting: 'day'
  },

  'frinks-lab': {
    id: 'frinks-lab',
    name: "Professor Frink's Laboratory",
    description: 'High-tech research lab. Experiments, algorithms, cutting-edge tech.',
    ambiance: 'professional',
    typicalCharacters: ['frink', 'lisa'],
    suitableFor: ['architecture', 'performance', 'data'],
    environmentAssets: ['computers', 'beakers', 'equations', 'machines', 'whiteboards'],
    lighting: 'day'
  },

  'springfield-library': {
    id: 'springfield-library',
    name: 'Springfield Library',
    description: 'Quiet research space. Documentation, knowledge, deep thinking.',
    ambiance: 'educational',
    typicalCharacters: ['lisa', 'grampa'],
    suitableFor: ['architecture', 'data', 'migration'],
    environmentAssets: ['bookshelves', 'study-tables', 'computers', 'globe', 'quiet-signs'],
    lighting: 'day'
  },

  'android-dungeon': {
    id: 'android-dungeon',
    name: "The Android's Dungeon & Baseball Card Shop",
    description: 'Nerd haven. Code review, technical debates, standards arguments.',
    ambiance: 'casual',
    typicalCharacters: ['cbg', 'bart', 'milhouse'],
    suitableFor: ['architecture', 'compliance'],
    environmentAssets: ['comics', 'figurines', 'counter', 'posters', 'card-displays'],
    lighting: 'day'
  },

  'town-hall': {
    id: 'town-hall',
    name: 'Springfield Town Hall',
    description: 'Government building. Policy, governance, public accountability.',
    ambiance: 'formal',
    typicalCharacters: ['wiggum', 'skinner'],
    suitableFor: ['compliance', 'planning'],
    environmentAssets: ['podium', 'seats', 'flags', 'portraits', 'microphones'],
    lighting: 'day'
  },

  'police-station': {
    id: 'police-station',
    name: 'Springfield Police Station',
    description: 'Security headquarters. Enforcement, investigation, protection.',
    ambiance: 'professional',
    typicalCharacters: ['wiggum', 'ralph', 'snake'],
    suitableFor: ['security', 'compliance'],
    environmentAssets: ['desks', 'cells', 'donuts', 'bulletin-board', 'badges'],
    lighting: 'day'
  },

  'springfield-general': {
    id: 'springfield-general',
    name: 'Springfield General Hospital',
    description: 'Medical facility. Diagnostics, health checks, critical care.',
    ambiance: 'professional',
    typicalCharacters: ['hibbert', 'nick'],
    suitableFor: ['debugging', 'performance'],
    environmentAssets: ['beds', 'monitors', 'curtains', 'equipment', 'charts'],
    lighting: 'day'
  },

  'krustylu-studios': {
    id: 'krustylu-studios',
    name: 'Krustylu Studios',
    description: 'TV production studio. Demos, presentations, show business.',
    ambiance: 'chaotic',
    typicalCharacters: ['krusty', 'bob', 'troy'],
    suitableFor: ['user-experience'],
    environmentAssets: ['cameras', 'stage', 'lights', 'props', 'makeup'],
    lighting: 'dramatic'
  },

  'channel-6': {
    id: 'channel-6',
    name: 'Channel 6 News',
    description: 'News studio. Reporting, communication, public-facing announcements.',
    ambiance: 'professional',
    typicalCharacters: ['kent', 'troy'],
    suitableFor: ['planning'],
    environmentAssets: ['desk', 'screens', 'cameras', 'teleprompter', 'globe'],
    lighting: 'dramatic'
  }
};

/**
 * Get scenes suitable for a specific domain
 */
export function getScenesForDomain(domain: string): SceneConfig[] {
  return Object.values(SCENES).filter(s => 
    s.suitableFor.includes(domain as any)
  );
}

/**
 * Get scenes by ambiance
 */
export function getScenesByAmbiance(ambiance: string): SceneConfig[] {
  return Object.values(SCENES).filter(s => s.ambiance === ambiance);
}

/**
 * Find the best scene for a character
 */
export function getPrimarySceneForCharacter(characterId: string): SceneConfig | undefined {
  return Object.values(SCENES).find(s => 
    s.typicalCharacters.includes(characterId as any)
  );
}
