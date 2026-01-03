/**
 * Character Agent
 * Spawns Claude Code per character interview for rich interactions
 * Manages conversation state and artifact generation
 */

import { spawn, type ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import { buildCharacterSystemPrompt, getArtifactInstructions } from '../patterns/character-prompts.js';
import { CHARACTERS } from '../patterns/characters.js';
import type { CharacterId, Artifact, VRSession } from '../types.js';

export interface CharacterAgentConfig {
  characterId: CharacterId;
  sessionId: string;
  problemStatement: string;
  previousArtifacts?: Artifact[];
  workingDirectory?: string;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AgentResult {
  success: boolean;
  messages: AgentMessage[];
  artifacts: Artifact[];
  sceneComplete: boolean;
  error?: string;
}

/**
 * Character Agent manages Claude Code interactions for a single character
 */
export class CharacterAgent extends EventEmitter {
  private config: CharacterAgentConfig;
  private process: ChildProcess | null = null;
  private messages: AgentMessage[] = [];
  private artifacts: Artifact[] = [];
  private isRunning = false;
  private outputBuffer = '';

  constructor(config: CharacterAgentConfig) {
    super();
    this.config = config;
  }

  /**
   * Get character configuration
   */
  private getCharacter() {
    return CHARACTERS[this.config.characterId];
  }

  /**
   * Build the initial prompt for Claude Code
   */
  private buildInitialPrompt(): string {
    const character = this.getCharacter();
    const systemPrompt = buildCharacterSystemPrompt(this.config.characterId);
    const artifactInstructions = getArtifactInstructions(this.config.characterId);
    
    // Build context from previous artifacts
    let contextSection = '';
    if (this.config.previousArtifacts && this.config.previousArtifacts.length > 0) {
      contextSection = `\n\n## PREVIOUS CHARACTER INSIGHTS\n`;
      for (const artifact of this.config.previousArtifacts) {
        contextSection += `\n### From ${artifact.character} (${artifact.type}):\n${artifact.content.substring(0, 500)}...\n`;
      }
    }

    return `${systemPrompt}
${contextSection}

## CURRENT PROBLEM
"${this.config.problemStatement}"

## YOUR TASK
You are ${character.name}. Interview the user about this problem using your unique perspective.
Ask questions, provide insights, and when you have enough information, generate your artifact.

${artifactInstructions}

## INTERACTION RULES
1. Stay in character at all times
2. Use your signature phrases naturally
3. Ask 3-5 insightful questions before generating artifacts
4. When ready to generate artifact, output it in a markdown code block
5. Signal completion with: [SCENE_COMPLETE]

Begin the interview now.`;
  }

  /**
   * Start the character agent
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Agent already running');
    }

    this.isRunning = true;
    
    // Spawn Claude Code process
    const initialPrompt = this.buildInitialPrompt();
    
    this.process = spawn('claude', ['--print'], {
      cwd: this.config.workingDirectory || process.cwd(),
      env: { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Handle stdout
    this.process.stdout?.on('data', (data: Buffer) => {
      const text = data.toString();
      this.outputBuffer += text;
      this.emit('output', text);
      
      // Check for scene completion
      if (text.includes('[SCENE_COMPLETE]')) {
        this.emit('scene-complete');
      }
      
      // Check for artifact generation (markdown code blocks)
      this.extractArtifacts(text);
    });

    // Handle stderr
    this.process.stderr?.on('data', (data: Buffer) => {
      this.emit('error', data.toString());
    });

    // Handle process exit
    this.process.on('close', (code) => {
      this.isRunning = false;
      this.emit('close', code);
    });

    // Send initial prompt
    this.sendMessage(initialPrompt);
  }

  /**
   * Send a message to the agent
   */
  sendMessage(content: string): void {
    if (!this.process || !this.isRunning) {
      throw new Error('Agent not running');
    }

    this.messages.push({
      role: 'user',
      content,
      timestamp: new Date()
    });

    this.process.stdin?.write(content + '\n');
    this.emit('message-sent', content);
  }

  /**
   * Extract artifacts from output
   */
  private extractArtifacts(text: string): void {
    const character = this.getCharacter();
    
    // Look for markdown code blocks with artifact content
    const codeBlockRegex = /```(?:markdown|md)?\s*\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const content = match[1].trim();
      
      // Check if this looks like an artifact (has headers, lists, etc.)
      if (content.startsWith('#') || content.includes('\n-') || content.includes('\n*')) {
        const artifact: Artifact = {
          id: uuid(),
          sessionId: this.config.sessionId,
          character: this.config.characterId,
          scene: 'simpson-living-room', // Will be updated by session
          type: character.artifactType,
          title: this.extractTitle(content) || `${character.name}'s Artifact`,
          content,
          createdAt: new Date()
        };
        
        this.artifacts.push(artifact);
        this.emit('artifact', artifact);
      }
    }
  }

  /**
   * Extract title from markdown content
   */
  private extractTitle(content: string): string | null {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : null;
  }

  /**
   * Get all messages
   */
  getMessages(): AgentMessage[] {
    return [...this.messages];
  }

  /**
   * Get all artifacts
   */
  getArtifacts(): Artifact[] {
    return [...this.artifacts];
  }

  /**
   * Get full output
   */
  getOutput(): string {
    return this.outputBuffer;
  }

  /**
   * Stop the agent
   */
  async stop(): Promise<AgentResult> {
    if (this.process) {
      this.process.kill('SIGTERM');
      this.process = null;
    }
    
    this.isRunning = false;
    
    return {
      success: true,
      messages: this.messages,
      artifacts: this.artifacts,
      sceneComplete: this.outputBuffer.includes('[SCENE_COMPLETE]')
    };
  }

  /**
   * Check if agent is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

/**
 * Agent Pool manages multiple character agents
 */
export class AgentPool {
  private agents: Map<string, CharacterAgent> = new Map();

  /**
   * Create a new agent for a character
   */
  createAgent(config: CharacterAgentConfig): CharacterAgent {
    const agentId = `${config.sessionId}-${config.characterId}`;
    
    if (this.agents.has(agentId)) {
      throw new Error(`Agent already exists for ${config.characterId} in session ${config.sessionId}`);
    }

    const agent = new CharacterAgent(config);
    this.agents.set(agentId, agent);
    
    return agent;
  }

  /**
   * Get an existing agent
   */
  getAgent(sessionId: string, characterId: CharacterId): CharacterAgent | undefined {
    return this.agents.get(`${sessionId}-${characterId}`);
  }

  /**
   * Remove an agent
   */
  async removeAgent(sessionId: string, characterId: CharacterId): Promise<AgentResult | null> {
    const agentId = `${sessionId}-${characterId}`;
    const agent = this.agents.get(agentId);
    
    if (!agent) return null;
    
    const result = await agent.stop();
    this.agents.delete(agentId);
    
    return result;
  }

  /**
   * Stop all agents for a session
   */
  async stopSession(sessionId: string): Promise<void> {
    for (const [agentId, agent] of this.agents.entries()) {
      if (agentId.startsWith(sessionId)) {
        await agent.stop();
        this.agents.delete(agentId);
      }
    }
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): string[] {
    const sessions = new Set<string>();
    for (const agentId of this.agents.keys()) {
      const sessionId = agentId.split('-')[0];
      sessions.add(sessionId);
    }
    return Array.from(sessions);
  }
}

// Singleton pool instance
export const agentPool = new AgentPool();
