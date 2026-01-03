/**
 * Store Exports
 * 
 * Provides both synchronous (in-memory) and async (Redis) session stores
 */

// Synchronous in-memory store (for backward compatibility)
export {
  createSession,
  getSession,
  updateSession,
  addArtifact,
  advanceCharacter,
  getCurrentCharacter,
  getCurrentScene,
  startBuilding,
  completeSession,
  getUserSessions,
  deleteSession,
  exportArtifacts
} from './session-store.js';

// Async Redis store (preferred for production)
export {
  initRedis,
  getStorageMode,
  closeRedis,
  getSessionCount,
  cleanupOldSessions,
  createSession as createSessionAsync,
  getSession as getSessionAsync,
  updateSession as updateSessionAsync,
  addArtifact as addArtifactAsync,
  advanceCharacter as advanceCharacterAsync,
  getCurrentCharacter as getCurrentCharacterAsync,
  getCurrentScene as getCurrentSceneAsync,
  startBuilding as startBuildingAsync,
  completeSession as completeSessionAsync,
  getUserSessions as getUserSessionsAsync,
  deleteSession as deleteSessionAsync,
  exportArtifacts as exportArtifactsAsync
} from './redis-store.js';
