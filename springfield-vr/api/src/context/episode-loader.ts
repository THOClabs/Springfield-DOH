/**
 * Episode Context Loader
 * Loads and caches episode guides from episode_guides/ folder
 * Provides relevant episode patterns as context for Claude during episode generation
 */

import { readdir, readFile } from 'fs/promises';
import { join, basename } from 'path';
import type { ProblemDomain, CharacterId } from '../types.js';

// Cache for loaded episodes
const episodeCache: Map<string, ParsedEpisode> = new Map();
let cacheLoaded = false;

export interface ParsedEpisode {
  id: string;
  title: string;
  season: number;
  episode: number;
  synopsis: string;
  mainCharacters: string[];
  themes: string[];
  narrativePattern: string;
  conflictType: string;
  resolution: string;
  fullContent: string;
}

/**
 * Domain to theme mapping for episode search
 */
const DOMAIN_THEMES: Record<ProblemDomain, string[]> = {
  architecture: ['planning', 'building', 'design', 'structure', 'organization'],
  performance: ['competition', 'speed', 'challenge', 'pressure', 'deadline'],
  security: ['secret', 'trust', 'protection', 'crime', 'detective', 'investigation'],
  data: ['information', 'research', 'analysis', 'knowledge', 'discovery'],
  integration: ['teamwork', 'cooperation', 'collaboration', 'together', 'family'],
  'user-experience': ['customer', 'service', 'satisfaction', 'experience', 'journey'],
  infrastructure: ['maintenance', 'repair', 'building', 'construction', 'foundation'],
  migration: ['change', 'transition', 'moving', 'adaptation', 'transformation'],
  debugging: ['mystery', 'investigation', 'problem', 'solve', 'detective'],
  planning: ['strategy', 'plan', 'prepare', 'organize', 'future'],
  compliance: ['rules', 'authority', 'standards', 'ethics', 'regulation']
};

/**
 * Character name variations for matching
 */
const CHARACTER_ALIASES: Record<string, CharacterId[]> = {
  'homer': ['homer'],
  'marge': ['marge'],
  'bart': ['bart'],
  'lisa': ['lisa'],
  'maggie': ['maggie'],
  'burns': ['burns'],
  'mr. burns': ['burns'],
  'smithers': ['smithers'],
  'flanders': ['flanders'],
  'ned': ['flanders'],
  'moe': ['moe'],
  'barney': ['barney'],
  'krusty': ['krusty'],
  'ralph': ['ralph'],
  'wiggum': ['wiggum'],
  'chief wiggum': ['wiggum'],
  'skinner': ['skinner'],
  'principal skinner': ['skinner'],
  'frink': ['frink'],
  'professor frink': ['frink'],
  'apu': ['apu'],
  'milhouse': ['milhouse'],
  'nelson': ['nelson'],
  'grampa': ['grampa'],
  'grandpa': ['grampa'],
  'abe': ['grampa']
};

/**
 * Parse episode ID from filename
 */
function parseEpisodeId(filename: string): { season: number; episode: number } | null {
  const match = filename.match(/S(\d+)E(\d+)/);
  if (!match) return null;
  return {
    season: parseInt(match[1], 10),
    episode: parseInt(match[2], 10)
  };
}

/**
 * Extract synopsis from episode content
 */
function extractSynopsis(content: string): string {
  const synopsisMatch = content.match(/## Synopsis\s*\n+([\s\S]*?)(?=\n##|$)/);
  if (synopsisMatch) {
    return synopsisMatch[1].trim().substring(0, 500);
  }
  return '';
}

/**
 * Extract main characters from episode content
 */
function extractCharacters(content: string): string[] {
  const characters: string[] = [];
  const charSection = content.match(/### Main Cast\s*\n+([\s\S]*?)(?=\n###|$)/);
  
  if (charSection) {
    const lines = charSection[1].split('\n');
    for (const line of lines) {
      const match = line.match(/\*\*([^*]+)\*\*/);
      if (match) {
        characters.push(match[1].toLowerCase().trim());
      }
    }
  }
  
  return characters;
}

/**
 * Extract title from episode content
 */
function extractTitle(content: string): string {
  const titleMatch = content.match(/# S\d+E\d+ - (.+)/);
  return titleMatch ? titleMatch[1].trim() : 'Unknown Episode';
}

/**
 * Detect narrative pattern from content
 */
function detectNarrativePattern(content: string, synopsis: string): string {
  const text = (content + ' ' + synopsis).toLowerCase();
  
  if (text.includes('mystery') || text.includes('investigate') || text.includes('discover')) {
    return 'mystery-reveal';
  }
  if (text.includes('competition') || text.includes('contest') || text.includes('win')) {
    return 'competition-arc';
  }
  if (text.includes('family') || text.includes('together') || text.includes('teamwork')) {
    return 'family-unity';
  }
  if (text.includes('chaos') || text.includes('disaster') || text.includes('wrong')) {
    return 'escalating-chaos';
  }
  if (text.includes('learn') || text.includes('lesson') || text.includes('realize')) {
    return 'lesson-learned';
  }
  if (text.includes('hero') || text.includes('save') || text.includes('rescue')) {
    return 'hero-journey';
  }
  
  return 'ensemble-solve';
}

/**
 * Detect conflict type from content
 */
function detectConflictType(content: string, synopsis: string): string {
  const text = (content + ' ' + synopsis).toLowerCase();
  
  if (text.includes('money') || text.includes('job') || text.includes('work') || text.includes('pay')) {
    return 'financial';
  }
  if (text.includes('family') || text.includes('relationship') || text.includes('love')) {
    return 'relational';
  }
  if (text.includes('school') || text.includes('test') || text.includes('grade')) {
    return 'academic';
  }
  if (text.includes('boss') || text.includes('authority') || text.includes('rule')) {
    return 'authority';
  }
  if (text.includes('moral') || text.includes('right') || text.includes('wrong') || text.includes('ethical')) {
    return 'ethical';
  }
  
  return 'situational';
}

/**
 * Extract themes from content
 */
function extractThemes(content: string, synopsis: string): string[] {
  const themes: string[] = [];
  const text = (content + ' ' + synopsis).toLowerCase();
  
  const themeKeywords: Record<string, string[]> = {
    'family': ['family', 'parent', 'child', 'sibling', 'son', 'daughter'],
    'work': ['job', 'work', 'career', 'boss', 'employee', 'plant'],
    'money': ['money', 'pay', 'cost', 'afford', 'rich', 'poor'],
    'school': ['school', 'student', 'teacher', 'class', 'learn'],
    'friendship': ['friend', 'buddy', 'pal', 'companion'],
    'competition': ['compete', 'win', 'lose', 'contest', 'race'],
    'adventure': ['adventure', 'journey', 'explore', 'discover'],
    'ethics': ['right', 'wrong', 'moral', 'lesson', 'ethical']
  };
  
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      themes.push(theme);
    }
  }
  
  return themes;
}

/**
 * Parse a single episode file
 */
async function parseEpisodeFile(filePath: string): Promise<ParsedEpisode | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const filename = basename(filePath);
    const episodeInfo = parseEpisodeId(filename);
    
    if (!episodeInfo) return null;
    
    const synopsis = extractSynopsis(content);
    const title = extractTitle(content);
    
    return {
      id: filename.replace('.md', ''),
      title,
      season: episodeInfo.season,
      episode: episodeInfo.episode,
      synopsis,
      mainCharacters: extractCharacters(content),
      themes: extractThemes(content, synopsis),
      narrativePattern: detectNarrativePattern(content, synopsis),
      conflictType: detectConflictType(content, synopsis),
      resolution: 'positive', // Most Simpsons episodes resolve positively
      fullContent: content
    };
  } catch (error) {
    console.error(`Failed to parse episode: ${filePath}`, error);
    return null;
  }
}

/**
 * Load all episodes into cache
 */
export async function loadAllEpisodes(episodesDir?: string): Promise<void> {
  if (cacheLoaded) return;
  
  const dir = episodesDir || join(process.cwd(), '..', '..', 'episode_guides');
  
  try {
    const files = await readdir(dir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    for (const file of mdFiles) {
      const parsed = await parseEpisodeFile(join(dir, file));
      if (parsed) {
        episodeCache.set(parsed.id, parsed);
      }
    }
    
    cacheLoaded = true;
    console.log(`Loaded ${episodeCache.size} episodes into cache`);
  } catch (error) {
    console.error('Failed to load episodes:', error);
  }
}

/**
 * Get episodes relevant to a domain
 */
export async function getEpisodesForDomain(
  domain: ProblemDomain, 
  limit: number = 3
): Promise<ParsedEpisode[]> {
  if (!cacheLoaded) {
    await loadAllEpisodes();
  }
  
  const themes = DOMAIN_THEMES[domain] || [];
  const scored: Array<{ episode: ParsedEpisode; score: number }> = [];
  
  for (const episode of episodeCache.values()) {
    let score = 0;
    
    // Score based on theme overlap
    for (const theme of themes) {
      if (episode.themes.some(t => t.includes(theme) || theme.includes(t))) {
        score += 2;
      }
      if (episode.synopsis.toLowerCase().includes(theme)) {
        score += 1;
      }
    }
    
    if (score > 0) {
      scored.push({ episode, score });
    }
  }
  
  // Sort by score and return top results
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.episode);
}

/**
 * Get episodes featuring specific characters
 */
export async function getEpisodesForCharacters(
  characters: CharacterId[],
  limit: number = 3
): Promise<ParsedEpisode[]> {
  if (!cacheLoaded) {
    await loadAllEpisodes();
  }
  
  const scored: Array<{ episode: ParsedEpisode; score: number }> = [];
  
  for (const episode of episodeCache.values()) {
    let score = 0;
    
    for (const character of characters) {
      // Check if character appears in main cast
      for (const [alias, ids] of Object.entries(CHARACTER_ALIASES)) {
        if (ids.includes(character)) {
          if (episode.mainCharacters.some(c => c.includes(alias))) {
            score += 3;
          }
        }
      }
      
      // Check if character mentioned in synopsis
      if (episode.synopsis.toLowerCase().includes(character)) {
        score += 1;
      }
    }
    
    if (score > 0) {
      scored.push({ episode, score });
    }
  }
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.episode);
}

/**
 * Get episodes by narrative pattern
 */
export async function getEpisodesByPattern(
  pattern: string,
  limit: number = 3
): Promise<ParsedEpisode[]> {
  if (!cacheLoaded) {
    await loadAllEpisodes();
  }
  
  const matches: ParsedEpisode[] = [];
  
  for (const episode of episodeCache.values()) {
    if (episode.narrativePattern === pattern) {
      matches.push(episode);
    }
  }
  
  return matches.slice(0, limit);
}

/**
 * Build context string for Claude from relevant episodes
 */
export async function buildEpisodeContext(
  domain: ProblemDomain,
  characters: CharacterId[]
): Promise<string> {
  const domainEpisodes = await getEpisodesForDomain(domain, 2);
  const charEpisodes = await getEpisodesForCharacters(characters, 2);
  
  // Combine and dedupe
  const seen = new Set<string>();
  const episodes: ParsedEpisode[] = [];
  
  for (const ep of [...domainEpisodes, ...charEpisodes]) {
    if (!seen.has(ep.id)) {
      seen.add(ep.id);
      episodes.push(ep);
    }
  }
  
  if (episodes.length === 0) {
    return '';
  }
  
  let context = `## RELEVANT SIMPSONS EPISODE PATTERNS\n\n`;
  context += `Use these classic episode patterns as inspiration for structuring the interview:\n\n`;
  
  for (const ep of episodes.slice(0, 4)) {
    context += `### ${ep.title} (S${ep.season}E${ep.episode})\n`;
    context += `**Synopsis:** ${ep.synopsis.substring(0, 300)}...\n`;
    context += `**Narrative Pattern:** ${ep.narrativePattern}\n`;
    context += `**Conflict Type:** ${ep.conflictType}\n`;
    context += `**Themes:** ${ep.themes.join(', ')}\n\n`;
  }
  
  return context;
}

/**
 * Get a random episode for inspiration
 */
export async function getRandomEpisode(): Promise<ParsedEpisode | null> {
  if (!cacheLoaded) {
    await loadAllEpisodes();
  }
  
  const episodes = Array.from(episodeCache.values());
  if (episodes.length === 0) return null;
  
  return episodes[Math.floor(Math.random() * episodes.length)];
}

/**
 * Get episode count
 */
export function getEpisodeCount(): number {
  return episodeCache.size;
}

/**
 * Clear cache (for testing)
 */
export function clearCache(): void {
  episodeCache.clear();
  cacheLoaded = false;
}
