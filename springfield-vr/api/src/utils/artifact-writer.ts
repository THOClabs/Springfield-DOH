/**
 * Artifact Writer
 * Writes character artifacts and session outputs to disk
 * 
 * Creates .springfield/{session-id}/ folders with artifacts
 */

import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from './logger.js';
import type { CharacterId } from '../types.js';

const logger = createLogger('ArtifactWriter');

// Artifact filenames per character
const CHARACTER_ARTIFACTS: Record<string, string> = {
  homer: "questions.md",
  marge: "structure.md",
  bart: "edge-cases.md",
  lisa: "project.md",
  grampa: "history.md",
  burns: "budget.md",
  smithers: "schedule.md",
  flanders: "standards.md",
  milhouse: "dependencies.md",
  moe: "debug-notes.md",
  wiggum: "security-review.md",
  frink: "innovation.md",
  ralph: "implementation.md",
};

export interface ArtifactMetadata {
  sessionId: string;
  character: CharacterId;
  timestamp: Date;
  problem?: string;
}

export interface WriteResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Sanitize user input to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "[removed]")
    // Remove other HTML tags but keep content
    .replace(/<[^>]+>/g, "")
    // Escape backticks to prevent code block injection
    .replace(/`{3,}/g, "\\`\\`\\`")
    // Limit length to prevent buffer issues
    .substring(0, 50000)
    .trim();
}

/**
 * Get the session directory path
 */
export function getSessionDir(baseDir: string, sessionId: string): string {
  return path.join(baseDir, '.springfield', sessionId);
}

/**
 * Ensure the session directory exists
 */
export function ensureSessionDir(baseDir: string, sessionId: string): string {
  const sessionDir = getSessionDir(baseDir, sessionId);
  
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    logger.debug(`Created session directory: ${sessionDir}`);
  }
  
  return sessionDir;
}

/**
 * Write an artifact for a character
 */
export function writeArtifact(
  baseDir: string,
  sessionId: string,
  character: CharacterId,
  content: string,
  metadata?: Partial<ArtifactMetadata>
): WriteResult {
  try {
    const sessionDir = ensureSessionDir(baseDir, sessionId);
    const artifactName = CHARACTER_ARTIFACTS[character] || `${character}.md`;
    const artifactPath = path.join(sessionDir, artifactName);
    
    // Validate path stays within session directory
    const resolvedPath = path.resolve(artifactPath);
    const resolvedSessionDir = path.resolve(sessionDir);
    
    if (!resolvedPath.startsWith(resolvedSessionDir)) {
      logger.warn(`Path traversal attempt blocked: ${artifactPath}`);
      return { success: false, error: 'Invalid path' };
    }
    
    // Build artifact content with header
    const header = buildArtifactHeader(character, metadata);
    const sanitizedContent = sanitizeInput(content);
    const fullContent = `${header}\n\n${sanitizedContent}`;
    
    fs.writeFileSync(artifactPath, fullContent, 'utf-8');
    logger.info(`Artifact written: ${artifactPath}`);
    
    return { success: true, filePath: artifactPath };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to write artifact: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Build artifact header with metadata
 */
function buildArtifactHeader(
  character: CharacterId,
  metadata?: Partial<ArtifactMetadata>
): string {
  const timestamp = metadata?.timestamp ?? new Date();
  const lines = [
    '---',
    `character: ${character}`,
    `generated: ${timestamp.toISOString()}`,
  ];
  
  if (metadata?.sessionId) {
    lines.push(`session: ${metadata.sessionId}`);
  }
  if (metadata?.problem) {
    lines.push(`problem: ${metadata.problem.substring(0, 100)}`);
  }
  
  lines.push('---');
  return lines.join('\n');
}

/**
 * Write session summary
 */
export function writeSessionSummary(
  baseDir: string,
  sessionId: string,
  summary: {
    problem: string;
    charactersConsulted: CharacterId[];
    classification?: string;
    startTime: Date;
    endTime?: Date;
  }
): WriteResult {
  try {
    const sessionDir = ensureSessionDir(baseDir, sessionId);
    const summaryPath = path.join(sessionDir, 'SESSION.md');
    
    const content = `# Session Summary

## Problem Statement
${sanitizeInput(summary.problem)}

## Classification
${summary.classification || 'Not classified'}

## Characters Consulted
${summary.charactersConsulted.map(c => `- ${c}`).join('\n')}

## Timeline
- Started: ${summary.startTime.toISOString()}
${summary.endTime ? `- Ended: ${summary.endTime.toISOString()}` : '- Status: In Progress'}
`;
    
    fs.writeFileSync(summaryPath, content, 'utf-8');
    logger.info(`Session summary written: ${summaryPath}`);
    
    return { success: true, filePath: summaryPath };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to write session summary: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * List all artifacts in a session
 */
export function listSessionArtifacts(
  baseDir: string,
  sessionId: string
): string[] {
  const sessionDir = getSessionDir(baseDir, sessionId);
  
  if (!fs.existsSync(sessionDir)) {
    return [];
  }
  
  return fs.readdirSync(sessionDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(sessionDir, f));
}

/**
 * Read an artifact from a session
 */
export function readArtifact(
  baseDir: string,
  sessionId: string,
  artifactName: string
): string | null {
  const sessionDir = getSessionDir(baseDir, sessionId);
  const artifactPath = path.join(sessionDir, artifactName);
  
  // Validate path stays within session directory
  const resolvedPath = path.resolve(artifactPath);
  const resolvedSessionDir = path.resolve(sessionDir);
  
  if (!resolvedPath.startsWith(resolvedSessionDir)) {
    logger.warn(`Path traversal attempt blocked: ${artifactPath}`);
    return null;
  }
  
  if (!fs.existsSync(artifactPath)) {
    return null;
  }
  
  return fs.readFileSync(artifactPath, 'utf-8');
}

/**
 * Clean up old sessions (older than given days)
 */
export async function cleanupOldSessions(
  baseDir: string,
  daysOld: number = 7
): Promise<number> {
  const springfieldDir = path.join(baseDir, '.springfield');
  
  if (!fs.existsSync(springfieldDir)) {
    return 0;
  }
  
  const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  let cleaned = 0;
  
  const sessions = fs.readdirSync(springfieldDir);
  
  for (const sessionId of sessions) {
    const sessionDir = path.join(springfieldDir, sessionId);
    const stats = fs.statSync(sessionDir);
    
    if (stats.isDirectory() && stats.mtime.getTime() < cutoff) {
      fs.rmSync(sessionDir, { recursive: true });
      cleaned++;
      logger.debug(`Cleaned up old session: ${sessionId}`);
    }
  }
  
  if (cleaned > 0) {
    logger.info(`Cleaned up ${cleaned} old sessions`);
  }
  
  return cleaned;
}
