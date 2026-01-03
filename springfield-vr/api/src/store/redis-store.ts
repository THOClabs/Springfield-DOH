/**
 * Redis Session Store
 * Persistent session storage with Redis
 * Falls back to in-memory when Redis is unavailable
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import type { VRSession, GeneratedEpisode, Artifact } from '../types.js';

// Redis client (lazy initialization)  
// Using any type due to ioredis ESM compatibility issues
let redis: any = null;
let redisAvailable = false;

// Fallback in-memory store
const memoryStore: Map<string, VRSession> = new Map();

// Session TTL in seconds (24 hours)
const SESSION_TTL = 60 * 60 * 24;

/**
 * Initialize Redis connection
 */
export async function initRedis(url?: string): Promise<boolean> {
  try {
    // Handle both ESM and CJS imports
    const RedisClient = (Redis as any).default || Redis;
    redis = new RedisClient(url || process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times: number) => {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: 3
    });

    // Test connection
    await redis.ping();
    redisAvailable = true;
    console.log('✅ Redis connected');
    return true;
  } catch (error) {
    console.warn('⚠️ Redis not available, using in-memory store:', error);
    redisAvailable = false;
    redis = null;
    return false;
  }
}

/**
 * Get storage mode
 */
export function getStorageMode(): 'redis' | 'memory' {
  return redisAvailable ? 'redis' : 'memory';
}

/**
 * Serialize session for Redis storage
 */
function serializeSession(session: VRSession): string {
  return JSON.stringify({
    ...session,
    startedAt: session.startedAt.toISOString(),
    lastActivity: session.lastActivity.toISOString(),
    artifacts: session.artifacts.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString()
    })),
    episode: {
      ...session.episode,
      generatedAt: session.episode.generatedAt.toISOString()
    }
  });
}

/**
 * Deserialize session from Redis storage
 */
function deserializeSession(data: string): VRSession {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    startedAt: new Date(parsed.startedAt),
    lastActivity: new Date(parsed.lastActivity),
    artifacts: parsed.artifacts.map((a: any) => ({
      ...a,
      createdAt: new Date(a.createdAt)
    })),
    episode: {
      ...parsed.episode,
      generatedAt: new Date(parsed.episode.generatedAt)
    }
  };
}

/**
 * Create a new VR session
 */
export async function createSession(userId: string, episode: GeneratedEpisode): Promise<VRSession> {
  const session: VRSession = {
    id: uuid(),
    userId,
    episode,
    currentScene: 0,
    currentCharacter: 0,
    artifacts: [],
    startedAt: new Date(),
    lastActivity: new Date(),
    status: 'active'
  };

  if (redisAvailable && redis) {
    await redis.setex(`session:${session.id}`, SESSION_TTL, serializeSession(session));
    await redis.sadd(`user:${userId}:sessions`, session.id);
  } else {
    memoryStore.set(session.id, session);
  }

  return session;
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId: string): Promise<VRSession | undefined> {
  if (redisAvailable && redis) {
    const data = await redis.get(`session:${sessionId}`);
    if (!data) return undefined;
    return deserializeSession(data);
  } else {
    return memoryStore.get(sessionId);
  }
}

/**
 * Update session state
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<VRSession>
): Promise<VRSession | undefined> {
  const session = await getSession(sessionId);
  if (!session) return undefined;

  const updated: VRSession = {
    ...session,
    ...updates,
    lastActivity: new Date()
  };

  if (redisAvailable && redis) {
    await redis.setex(`session:${sessionId}`, SESSION_TTL, serializeSession(updated));
  } else {
    memoryStore.set(sessionId, updated);
  }

  return updated;
}

/**
 * Add an artifact to a session
 */
export async function addArtifact(sessionId: string, artifact: Artifact): Promise<VRSession | undefined> {
  const session = await getSession(sessionId);
  if (!session) return undefined;

  session.artifacts.push(artifact);
  session.lastActivity = new Date();

  if (redisAvailable && redis) {
    await redis.setex(`session:${sessionId}`, SESSION_TTL, serializeSession(session));
  } else {
    memoryStore.set(sessionId, session);
  }

  return session;
}

/**
 * Advance to next character in sequence
 */
export async function advanceCharacter(sessionId: string): Promise<VRSession | undefined> {
  const session = await getSession(sessionId);
  if (!session) return undefined;

  if (session.currentCharacter < session.episode.characterSequence.length - 1) {
    session.currentCharacter++;
    session.currentScene = session.episode.characterSequence[session.currentCharacter].order;
    session.lastActivity = new Date();
  } else {
    session.status = 'at-playground';
  }

  if (redisAvailable && redis) {
    await redis.setex(`session:${sessionId}`, SESSION_TTL, serializeSession(session));
  } else {
    memoryStore.set(sessionId, session);
  }

  return session;
}

/**
 * Get current character for session
 */
export async function getCurrentCharacter(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session) return undefined;

  return session.episode.characterSequence[session.currentCharacter];
}

/**
 * Get current scene for session
 */
export async function getCurrentScene(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session) return undefined;

  return session.episode.sceneSequence[session.currentScene];
}

/**
 * Mark session as building (Ralph started)
 */
export async function startBuilding(sessionId: string): Promise<VRSession | undefined> {
  return updateSession(sessionId, { status: 'building' });
}

/**
 * Mark session as complete
 */
export async function completeSession(sessionId: string): Promise<VRSession | undefined> {
  return updateSession(sessionId, { status: 'complete' });
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string): Promise<VRSession[]> {
  if (redisAvailable && redis) {
    const sessionIds = await redis.smembers(`user:${userId}:sessions`);
    const sessions: VRSession[] = [];
    
    for (const id of sessionIds) {
      const session = await getSession(id);
      if (session) sessions.push(session);
    }
    
    return sessions;
  } else {
    return Array.from(memoryStore.values()).filter(s => s.userId === userId);
  }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  const session = await getSession(sessionId);
  if (!session) return false;

  if (redisAvailable && redis) {
    await redis.del(`session:${sessionId}`);
    await redis.srem(`user:${session.userId}:sessions`, sessionId);
  } else {
    memoryStore.delete(sessionId);
  }

  return true;
}

/**
 * Export session artifacts to .springfield folder format
 */
export async function exportArtifacts(sessionId: string): Promise<Record<string, string>> {
  const session = await getSession(sessionId);
  if (!session) return {};

  const files: Record<string, string> = {};

  // Create project.md
  files['project.md'] = `# ${session.episode.title}

Problem: ${session.episode.problem.statement}
Domain: ${session.episode.problem.primaryDomain}
Complexity: ${session.episode.problem.complexity}
Generated: ${session.episode.generatedAt.toISOString()}

## Episode Structure

${session.episode.characterSequence.map((c, i) => 
  `${i + 1}. ${c.character} - ${c.purpose}`
).join('\n')}
`;

  // Create individual artifact files
  for (const artifact of session.artifacts) {
    const filename = artifact.type.replace('.md', '') + `-${artifact.character}.md`;
    files[filename] = `# ${artifact.title}
Generated by: ${artifact.character}
Scene: ${artifact.scene}
Created: ${artifact.createdAt.toISOString()}

---

${artifact.content}
`;
  }

  // Create completion.md
  files['completion.md'] = `# Completion Criteria

Session ID: ${session.id}
Status: ${session.status}
Total Artifacts: ${session.artifacts.length}

## Success Definition

The implementation is complete when:
${session.artifacts.map(a => `- [ ] ${a.title} requirements are met`).join('\n')}
- [ ] All tests pass
- [ ] Code compiles without errors
`;

  return files;
}

/**
 * Get session count (for monitoring)
 */
export async function getSessionCount(): Promise<number> {
  if (redisAvailable && redis) {
    const keys = await redis.keys('session:*');
    return keys.length;
  } else {
    return memoryStore.size;
  }
}

/**
 * Clean up old sessions
 */
export async function cleanupOldSessions(hoursOld: number = 48): Promise<number> {
  const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
  let removed = 0;

  if (redisAvailable && redis) {
    // Redis handles TTL automatically, but we can clean up user indices
    const keys = await redis.keys('session:*');
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const session = deserializeSession(data);
        if (session.lastActivity < cutoff) {
          await deleteSession(session.id);
          removed++;
        }
      }
    }
  } else {
    for (const [id, session] of memoryStore.entries()) {
      if (session.lastActivity < cutoff) {
        memoryStore.delete(id);
        removed++;
      }
    }
  }

  return removed;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    redisAvailable = false;
  }
}
