/**
 * WebSocket Progress Server
 * Real-time updates for character interactions and Ralph execution
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { ralphEvents } from '../executor/ralph-engine.js';
import type { CharacterId } from '../types.js';

interface WSClient {
  ws: WebSocket;
  sessionId: string;
  userId?: string;
}

interface WSMessage {
  type: string;
  sessionId?: string;
  data?: any;
}

// Connected clients by session
const clients: Map<string, Set<WSClient>> = new Map();

// WebSocket server instance
let wss: WebSocketServer | null = null;

/**
 * Initialize WebSocket server
 */
export function initWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    let client: WSClient | null = null;
    
    ws.on('message', (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'subscribe':
            if (message.sessionId) {
              client = { ws, sessionId: message.sessionId };
              addClient(message.sessionId, client);
              sendToClient(ws, { type: 'subscribed', sessionId: message.sessionId });
            }
            break;
            
          case 'unsubscribe':
            if (client && message.sessionId) {
              removeClient(message.sessionId, client);
              client = null;
              sendToClient(ws, { type: 'unsubscribed', sessionId: message.sessionId });
            }
            break;
            
          case 'ping':
            sendToClient(ws, { type: 'pong' });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      if (client) {
        removeClient(client.sessionId, client);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  // Connect Ralph events to WebSocket broadcasts
  setupRalphEventBridge();
  
  console.log('🔌 WebSocket server initialized at /ws');
  
  return wss;
}

/**
 * Add client to session subscribers
 */
function addClient(sessionId: string, client: WSClient): void {
  if (!clients.has(sessionId)) {
    clients.set(sessionId, new Set());
  }
  clients.get(sessionId)!.add(client);
}

/**
 * Remove client from session subscribers
 */
function removeClient(sessionId: string, client: WSClient): void {
  const sessionClients = clients.get(sessionId);
  if (sessionClients) {
    sessionClients.delete(client);
    if (sessionClients.size === 0) {
      clients.delete(sessionId);
    }
  }
}

/**
 * Send message to specific client
 */
function sendToClient(ws: WebSocket, message: object): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Broadcast to all clients in a session
 */
export function broadcastToSession(sessionId: string, message: object): void {
  const sessionClients = clients.get(sessionId);
  if (!sessionClients) return;
  
  const payload = JSON.stringify(message);
  
  for (const client of sessionClients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

/**
 * Broadcast to all connected clients
 */
export function broadcastToAll(message: object): void {
  if (!wss) return;
  
  const payload = JSON.stringify(message);
  
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

/**
 * Connect Ralph execution events to WebSocket broadcasts
 */
function setupRalphEventBridge(): void {
  ralphEvents.on('job-update', (event) => {
    // Find session for this job and broadcast
    const message = {
      type: 'ralph-update',
      jobId: event.jobId,
      event: event.event,
      data: event
    };
    
    // Broadcast to all clients (they'll filter by relevance)
    broadcastToAll(message);
  });
  
  ralphEvents.on('job-output', (event) => {
    const message = {
      type: 'ralph-output',
      jobId: event.jobId,
      output: event.output,
      isError: event.isError || false
    };
    
    broadcastToAll(message);
  });
}

/**
 * Send character message event
 */
export function sendCharacterMessage(
  sessionId: string,
  characterId: CharacterId,
  message: string,
  role: 'user' | 'assistant'
): void {
  broadcastToSession(sessionId, {
    type: 'character-message',
    characterId,
    role,
    message,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send artifact created event
 */
export function sendArtifactCreated(
  sessionId: string,
  artifact: {
    id: string;
    character: CharacterId;
    type: string;
    title: string;
  }
): void {
  broadcastToSession(sessionId, {
    type: 'artifact-created',
    artifact
  });
}

/**
 * Send scene transition event
 */
export function sendSceneTransition(
  sessionId: string,
  fromScene: string,
  toScene: string,
  characterId: CharacterId
): void {
  broadcastToSession(sessionId, {
    type: 'scene-transition',
    fromScene,
    toScene,
    characterId,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send episode started event
 */
export function sendEpisodeStarted(
  sessionId: string,
  episodeTitle: string,
  totalCharacters: number
): void {
  broadcastToSession(sessionId, {
    type: 'episode-started',
    title: episodeTitle,
    totalCharacters
  });
}

/**
 * Send Ralph started event
 */
export function sendRalphStarted(sessionId: string, jobId: string): void {
  broadcastToSession(sessionId, {
    type: 'ralph-started',
    jobId,
    message: "I'm helping!",
    timestamp: new Date().toISOString()
  });
}

/**
 * Send Ralph completed event
 */
export function sendRalphCompleted(
  sessionId: string,
  jobId: string,
  success: boolean,
  result?: any
): void {
  broadcastToSession(sessionId, {
    type: 'ralph-completed',
    jobId,
    success,
    message: success ? "I did it!" : "I tried my best...",
    result,
    timestamp: new Date().toISOString()
  });
}

/**
 * Get connected client count
 */
export function getClientCount(): number {
  let count = 0;
  for (const sessionClients of clients.values()) {
    count += sessionClients.size;
  }
  return count;
}

/**
 * Get session subscription count
 */
export function getSessionCount(): number {
  return clients.size;
}

/**
 * Close WebSocket server
 */
export function closeWebSocket(): Promise<void> {
  return new Promise((resolve) => {
    if (wss) {
      wss.close(() => {
        wss = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}
