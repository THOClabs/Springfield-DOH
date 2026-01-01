/**
 * Character artifact generators index
 * 
 * This module exports all individual character artifact generators
 * and provides a unified template dispatcher.
 * 
 * @module artifacts/generators
 */

import type { ArtifactGenerator, ConversationContext } from "./types.js";

// Simpson Family
export { generateHomerArtifact } from "./homer.js";
export { generateMargeArtifact } from "./marge.js";
export { generateBartArtifact } from "./bart.js";
export { generateLisaArtifact } from "./lisa.js";
export { generateMaggieArtifact } from "./maggie.js";

// Extended Family
export { generateGrampaArtifact } from "./grampa.js";
export { generateBurnsArtifact } from "./burns.js";
export { generateSmithersArtifact } from "./smithers.js";
export { generateFlandersArtifact } from "./flanders.js";

// Springfield Citizens
export { generateMilhouseArtifact } from "./milhouse.js";
export { generateMoeArtifact } from "./moe.js";
export { generateWiggumArtifact } from "./wiggum.js";
export { generateKrustyArtifact } from "./krusty.js";
export { generateBobArtifact } from "./bob.js";
export { generateSkinnerArtifact } from "./skinner.js";
export { generateNelsonArtifact } from "./nelson.js";
export { generateApuArtifact } from "./apu.js";
export { generateFrinkArtifact } from "./frink.js";
export { generateCBGArtifact } from "./cbg.js";
export { generateWillieArtifact } from "./willie.js";

// Specialists
export { generateDrNickArtifact } from "./dr-nick.js";
export { generatePattyArtifact } from "./patty.js";
export { generateTroyArtifact } from "./troy.js";
export { generateLionelArtifact } from "./lionel.js";
export { generateHansArtifact } from "./hans.js";
export { generateHibbertArtifact } from "./hibbert.js";
export { generateEdnaArtifact } from "./edna.js";
export { generateOttoArtifact } from "./otto.js";
export { generateLennyArtifact } from "./lenny.js";
export { generateKentArtifact } from "./kent.js";
export { generateSnakeArtifact } from "./snake.js";
export { generateCookieArtifact } from "./cookie.js";
export { generateGilArtifact } from "./gil.js";
export { generateBumblebeeArtifact } from "./bumblebee.js";
export { generateDuffmanArtifact } from "./duffman.js";
export { generateFatTonyArtifact } from "./fat-tony.js";
export { generateSeaCaptainArtifact } from "./sea-captain.js";
export { generateLovejoyArtifact } from "./lovejoy.js";
export { generateHelenArtifact } from "./helen.js";
export { generateAgnesArtifact } from "./agnes.js";

// Import all generators for the dispatcher
import { generateHomerArtifact } from "./homer.js";
import { generateMargeArtifact } from "./marge.js";
import { generateBartArtifact } from "./bart.js";
import { generateLisaArtifact } from "./lisa.js";
import { generateMaggieArtifact } from "./maggie.js";
import { generateGrampaArtifact } from "./grampa.js";
import { generateBurnsArtifact } from "./burns.js";
import { generateSmithersArtifact } from "./smithers.js";
import { generateFlandersArtifact } from "./flanders.js";
import { generateMilhouseArtifact } from "./milhouse.js";
import { generateMoeArtifact } from "./moe.js";
import { generateWiggumArtifact } from "./wiggum.js";
import { generateKrustyArtifact } from "./krusty.js";
import { generateBobArtifact } from "./bob.js";
import { generateSkinnerArtifact } from "./skinner.js";
import { generateNelsonArtifact } from "./nelson.js";
import { generateApuArtifact } from "./apu.js";
import { generateFrinkArtifact } from "./frink.js";
import { generateCBGArtifact } from "./cbg.js";
import { generateWillieArtifact } from "./willie.js";
import { generateDrNickArtifact } from "./dr-nick.js";
import { generatePattyArtifact } from "./patty.js";
import { generateTroyArtifact } from "./troy.js";
import { generateLionelArtifact } from "./lionel.js";
import { generateHansArtifact } from "./hans.js";
import { generateHibbertArtifact } from "./hibbert.js";
import { generateEdnaArtifact } from "./edna.js";
import { generateOttoArtifact } from "./otto.js";
import { generateLennyArtifact } from "./lenny.js";
import { generateKentArtifact } from "./kent.js";
import { generateSnakeArtifact } from "./snake.js";
import { generateCookieArtifact } from "./cookie.js";
import { generateGilArtifact } from "./gil.js";
import { generateBumblebeeArtifact } from "./bumblebee.js";
import { generateDuffmanArtifact } from "./duffman.js";
import { generateFatTonyArtifact } from "./fat-tony.js";
import { generateSeaCaptainArtifact } from "./sea-captain.js";
import { generateLovejoyArtifact } from "./lovejoy.js";
import { generateHelenArtifact } from "./helen.js";
import { generateAgnesArtifact } from "./agnes.js";

/**
 * Map of character names to their artifact generators
 */
export const characterGenerators: Record<string, ArtifactGenerator> = {
  homer: generateHomerArtifact,
  marge: generateMargeArtifact,
  bart: generateBartArtifact,
  lisa: generateLisaArtifact,
  maggie: generateMaggieArtifact,
  grampa: generateGrampaArtifact,
  burns: generateBurnsArtifact,
  smithers: generateSmithersArtifact,
  flanders: generateFlandersArtifact,
  milhouse: generateMilhouseArtifact,
  moe: generateMoeArtifact,
  wiggum: generateWiggumArtifact,
  krusty: generateKrustyArtifact,
  bob: generateBobArtifact,
  skinner: generateSkinnerArtifact,
  nelson: generateNelsonArtifact,
  apu: generateApuArtifact,
  frink: generateFrinkArtifact,
  cbg: generateCBGArtifact,
  willie: generateWillieArtifact,
  "dr-nick": generateDrNickArtifact,
  patty: generatePattyArtifact,
  troy: generateTroyArtifact,
  lionel: generateLionelArtifact,
  hans: generateHansArtifact,
  hibbert: generateHibbertArtifact,
  edna: generateEdnaArtifact,
  otto: generateOttoArtifact,
  lenny: generateLennyArtifact,
  kent: generateKentArtifact,
  snake: generateSnakeArtifact,
  cookie: generateCookieArtifact,
  gil: generateGilArtifact,
  bumblebee: generateBumblebeeArtifact,
  duffman: generateDuffmanArtifact,
  "fat-tony": generateFatTonyArtifact,
  "sea-captain": generateSeaCaptainArtifact,
  lovejoy: generateLovejoyArtifact,
  helen: generateHelenArtifact,
  agnes: generateAgnesArtifact,
};

/**
 * Get the artifact template for a specific character.
 * Falls back to a generic template if character is unknown.
 * 
 * @param character - The character name
 * @param context - Conversation context with user input and timestamp
 * @returns The generated artifact content
 */
export function getArtifactTemplate(character: string, context: ConversationContext): string {
  const generator = characterGenerators[character];
  if (!generator) {
    // Fallback for unknown characters
    return `# ${character.charAt(0).toUpperCase() + character.slice(1)}'s Notes\n\n${context.userInput}`;
  }
  return generator(context);
}

// Re-export types
export type { ArtifactGenerator, ConversationContext };
