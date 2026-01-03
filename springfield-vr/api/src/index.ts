/**
 * Springfield VR - API Server
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { classifyProblem, classifyProblemWithClaude } from './classifier/index.js';
import { generateEpisode } from './generator/index.js';
import { handleInteraction } from './router/index.js';
import { createRalphJob, startExecution, getJobStatus, executeClaudeCode } from './executor/index.js';
import { 
  createSession, 
  getSession, 
  addArtifact, 
  advanceCharacter, 
  startBuilding,
  exportArtifacts,
  getCurrentCharacter,
  getCurrentScene
} from './store/index.js';
import { getEpisodesForDomain } from './context/index.js';
import { CharacterAgent } from './agents/index.js';
import { initWebSocket } from './websocket/index.js';
import { writeArtifact, writeSessionSummary } from './utils/index.js';
import { apiLogger as logger } from './utils/logger.js';
import type { 
  GenerateEpisodeRequest, 
  CharacterInteractionRequest,
  StartRalphRequest,
  CharacterId
} from './types.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket
initWebSocket(server);
logger.info('WebSocket server initialized');

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health check
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'springfield-vr' });
});

// ============================================================================
// WEB UI ENDPOINTS
// ============================================================================

/**
 * Create a new session with problem classification
 * Used by the 2D Web UI
 */
app.post('/api/sessions', async (req: Request, res: Response) => {
  try {
    const { problem } = req.body;
    
    if (!problem) {
      res.status(400).json({ error: 'problem is required' });
      return;
    }
    
    logger.info('Creating new session for problem');
    
    // Classify with Claude (falls back to keywords)
    const classification = await classifyProblemWithClaude(problem);
    
    // Get relevant episodes for context
    const allEpisodes = await getEpisodesForDomain(classification.primaryDomain);
    const relevantEpisodes = allEpisodes
      .slice(0, 5)
      .map(ep => ({
        code: ep.id,
        title: ep.title,
        themes: ep.themes,
      }));
    
    // Generate episode
    const episode = generateEpisode(classification, { maxCharacters: 8 });
    
    // Create session with unique ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const session = createSession(sessionId, episode);
    
    // Write session summary to disk
    const workspaceDir = process.cwd();
    writeSessionSummary(workspaceDir, sessionId, {
      problem,
      charactersConsulted: [],
      classification: classification.primaryDomain,
      startTime: new Date(),
    });
    
    // Get character sequence from episode
    const characterSequence = episode.characterSequence || ['homer', 'lisa', 'bart', 'marge'];
    
    res.json({
      sessionId,
      classification: {
        domains: [classification.primaryDomain, ...classification.secondaryDomains].filter(Boolean),
        primaryDomain: classification.primaryDomain,
        complexity: classification.complexity || 'medium',
        suggestedCharacters: classification.suggestedCharacters || characterSequence.slice(0, 4),
      },
      relevantEpisodes,
    });
    
  } catch (error) {
    logger.error('Failed to create session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * Chat with a specific character
 * Uses Claude API directly for synchronous responses
 */
app.post('/api/sessions/:sessionId/chat', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { character, message } = req.body;
    
    if (!character || !message) {
      res.status(400).json({ error: 'character and message are required' });
      return;
    }
    
    const session = getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    logger.info(`Chat with ${character} in session ${sessionId}`);
    
    // Import character prompts and call Claude directly
    const { getExtendedPrompt } = await import('./patterns/character-prompts.js');
    const prompt = getExtendedPrompt(character);
    
    // For MVP, return a simulated response with character personality
    // In production, this would use the Claude SDK
    const characterName = character.charAt(0).toUpperCase() + character.slice(1);
    
    // Generate character-appropriate response
    let response: string;
    switch (character) {
      case 'homer':
        response = `Hmm... ${message}? Let me think about this... *scratches head* D'oh! Have you considered what happens when things go wrong? What's the simplest thing that could work here? Also, will there be donuts?`;
        break;
      case 'lisa':
        response = `That's an interesting problem! Let me help you think through this systematically. Based on "${message}", I'd suggest we first define clear success criteria. What specific outcomes are we measuring? Have you considered the long-term maintainability implications?`;
        break;
      case 'bart':
        response = `Yo! So about "${message}" - what happens if someone tries to break this on purpose? Like, what if they send a million requests? Or put weird characters in there? Eat my shorts, security vulnerabilities!`;
        break;
      case 'marge':
        response = `*concerned sound* About "${message}" - have we thought about how this affects the team's workflow? I want to make sure everyone knows their responsibilities and we have good documentation for new team members.`;
        break;
      case 'burns':
        response = `Excellent... "${message}" you say? What's the cost-benefit analysis here? Every feature should justify its existence in hard numbers. Release the hounds on any unnecessary complexity!`;
        break;
      case 'frink':
        response = `Mm-hai! Regarding "${message}" - have you considered the glaven of edge cases? Perhaps we need redundancy with the automatic failover systems! The data shows a 47.3% improvement potential!`;
        break;
      case 'ralph':
        response = `My cat's breath smells like cat food! Oh wait, about "${message}" - I'm going to help by writing the code! *picks up crayon* Let me implement this step by step...`;
        break;
      default:
        response = `Thanks for asking about "${message}". Let me share my perspective on this based on my experience in Springfield...`;
    }
    
    res.json({
      response,
      artifacts: [],
    });
    
  } catch (error) {
    logger.error('Chat failed:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

/**
 * Execute Ralph on the session
 */
app.post('/api/sessions/:sessionId/execute', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    logger.info(`Starting Ralph execution for session ${sessionId}`);
    
    // Collect all artifacts
    const artifacts = exportArtifacts(sessionId);
    
    // Start Ralph execution (async, updates via WebSocket)
    const result = await executeClaudeCode({
      sessionId,
      problem: session.episode.title,
      artifacts: Object.values(artifacts),
    });
    
    res.json({
      status: 'started',
      branch: result.branch,
      jobId: result.jobId,
    });
    
  } catch (error) {
    logger.error('Execute failed:', error);
    res.status(500).json({ error: 'Execution failed' });
  }
});

// ============================================================================
// VR ENDPOINTS (existing)
// ============================================================================

/**
 * Generate a new episode from problem statement
 */
app.post('/api/episode/generate', (req: Request, res: Response) => {
  try {
    const { problemStatement, userId, preferences } = req.body as GenerateEpisodeRequest;
    
    if (!problemStatement || !userId) {
      res.status(400).json({ error: 'problemStatement and userId are required' });
      return;
    }
    
    // Classify the problem
    const classification = classifyProblem(problemStatement);
    
    // Generate episode
    const episode = generateEpisode(classification, {
      maxCharacters: preferences?.maxDuration ? Math.ceil(preferences.maxDuration / 10) : 6,
      excludeCharacters: preferences?.excludeCharacters
    });
    
    // Create session
    const session = createSession(userId, episode);
    
    res.json({ episode, session });
  } catch (error) {
    console.error('Error generating episode:', error);
    res.status(500).json({ error: 'Failed to generate episode' });
  }
});

/**
 * Get session status
 */
app.get('/api/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  
  const currentCharacter = getCurrentCharacter(sessionId);
  const currentScene = getCurrentScene(sessionId);
  
  res.json({ session, currentCharacter, currentScene });
});

/**
 * Interact with current character
 */
app.post('/api/session/:sessionId/interact', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { userMessage } = req.body;
    
    const session = getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    const currentCharacter = getCurrentCharacter(sessionId);
    if (!currentCharacter) {
      res.status(400).json({ error: 'No current character' });
      return;
    }
    
    const request: CharacterInteractionRequest = {
      sessionId,
      characterId: currentCharacter.character,
      userMessage
    };
    
    // Handle interaction
    const response = await handleInteraction(request, session, null);
    
    // Save artifacts
    if (response.artifacts) {
      for (const artifact of response.artifacts) {
        addArtifact(sessionId, artifact);
      }
    }
    
    // Advance if complete
    if (response.isComplete) {
      advanceCharacter(sessionId);
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error in interaction:', error);
    res.status(500).json({ error: 'Interaction failed' });
  }
});

/**
 * Start Ralph execution
 */
app.post('/api/session/:sessionId/ralph/start', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    if (session.status !== 'at-playground') {
      res.status(400).json({ error: 'Session must be at playground to start Ralph' });
      return;
    }
    
    // Create and start Ralph job
    const job = createRalphJob(session);
    startBuilding(sessionId);
    startExecution(job.id);
    
    res.json({ job });
  } catch (error) {
    console.error('Error starting Ralph:', error);
    res.status(500).json({ error: 'Failed to start Ralph' });
  }
});

/**
 * Get Ralph job status
 */
app.get('/api/ralph/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = getJobStatus(jobId);
  
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  
  res.json({ job });
});

/**
 * Export session artifacts
 */
app.get('/api/session/:sessionId/export', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  
  const session = getSession(sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  
  const files = exportArtifacts(sessionId);
  res.json({ files });
});

// ============================================================================
// START SERVER
// ============================================================================

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🍩 SPRINGFIELD VR API SERVER                               ║
║                                                               ║
║   "I'm helping!" - Ralph Wiggum                              ║
║                                                               ║
║   Server running on http://localhost:${PORT}                    ║
║   WebSocket on ws://localhost:${PORT}/ws                        ║
║                                                               ║
║   Web UI Endpoints:                                           ║
║   • POST /api/sessions - Create session & classify            ║
║   • POST /api/sessions/:id/chat - Chat with character         ║
║   • POST /api/sessions/:id/execute - Run Ralph                ║
║                                                               ║
║   VR Endpoints:                                               ║
║   • POST /api/episode/generate - Create new episode           ║
║   • GET  /api/session/:id - Get session status                ║
║   • POST /api/session/:id/interact - Character interaction    ║
║   • POST /api/session/:id/ralph/start - Start Ralph           ║
║   • GET  /api/ralph/:id - Get Ralph job status                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
});

export default app;
