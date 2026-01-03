/**
 * Agents Exports
 */

export { 
  CharacterAgent, 
  AgentPool, 
  agentPool,
  type CharacterAgentConfig,
  type AgentMessage,
  type AgentResult
} from './character-agent.js';

import { agentPool } from './character-agent.js';

/**
 * Get the singleton agent pool
 */
export function getAgentPool() {
  return agentPool;
}
