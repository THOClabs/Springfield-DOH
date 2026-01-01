/**
 * Springfield Code Plugin Entry Point
 *
 * A Simpsons-themed vibe coding environment that gamifies development planning
 * through character agents, culminating in Ralph Wiggum persistent iteration loops.
 */

// Commands
export { default as springfieldCommand } from "./commands/springfield.js";
export { default as summonCommand } from "./commands/summon.js";
export { default as lisaRalphCommand } from "./commands/lisa-ralph-special.js";

// Character Commands
export { default as homerCommand } from "./commands/homer.js";
export { default as margeCommand } from "./commands/marge.js";
export { default as bartCommand } from "./commands/bart.js";
export { default as lisaCommand } from "./commands/lisa.js";
export { default as maggieCommand } from "./commands/maggie.js";
export { default as grampaCommand } from "./commands/grampa.js";
export { default as burnsCommand } from "./commands/burns.js";
export { default as smithersCommand } from "./commands/smithers.js";
export { default as flandersCommand } from "./commands/flanders.js";
export { default as milhouseCommand } from "./commands/milhouse.js";
export { default as moeCommand } from "./commands/moe.js";
export { default as wiggumCommand } from "./commands/wiggum.js";
export { default as ralphCommand } from "./commands/ralph.js";
export { default as krustyCommand } from "./commands/krusty.js";
export { default as bobCommand } from "./commands/bob.js";
export { default as skinnerCommand } from "./commands/skinner.js";
export { default as nelsonCommand } from "./commands/nelson.js";
export { default as apuCommand } from "./commands/apu.js";
export { default as frinkCommand } from "./commands/frink.js";
export { default as cbgCommand } from "./commands/cbg.js";
export { default as willieCommand } from "./commands/willie.js";

// Specialist Commands (v2.1.0)
export { default as drNickCommand } from "./commands/dr-nick.js";
export { default as pattyCommand } from "./commands/patty.js";
export { default as troyCommand } from "./commands/troy.js";
export { default as lionelCommand } from "./commands/lionel.js";
export { default as hansCommand } from "./commands/hans.js";
export { default as hibbertCommand } from "./commands/hibbert.js";
export { default as ednaCommand } from "./commands/edna.js";
export { default as ottoCommand } from "./commands/otto.js";
export { default as lennyCommand } from "./commands/lenny.js";
export { default as kentCommand } from "./commands/kent.js";
export { default as snakeCommand } from "./commands/snake.js";
export { default as cookieCommand } from "./commands/cookie.js";
export { default as gilCommand } from "./commands/gil.js";
export { default as bumblebeeCommand } from "./commands/bumblebee.js";
export { default as duffmanCommand } from "./commands/duffman.js";
export { default as fatTonyCommand } from "./commands/fat-tony.js";
export { default as seaCaptainCommand } from "./commands/sea-captain.js";
export { default as lovejoyCommand } from "./commands/lovejoy.js";
export { default as helenCommand } from "./commands/helen.js";
export { default as agnesCommand } from "./commands/agnes.js";

// Utility Commands (v2.2.0)
export { default as summonBatchCommand } from "./commands/summon-batch.js";
export { default as statsCommand } from "./commands/stats.js";
export { default as cancelRalphCommand } from "./commands/cancel-ralph.js";

// Hooks - v3.0.0: Secure token-based API only
// See CHANGELOG.md and MIGRATION.md for migration guide from v2.x
export {
  default as ralphGateHook,
  // Secure API
  requestRalphAuthorization,
  authorizeRalph,
  revokeRalphAuthorization,
  canInvokeRalph,
  // Testing only
  _resetForTesting as resetRalphGateForTesting,
  // Types
  type SecureToken,
} from "./hooks/ralph-gate.js";

// Constants
export * from "./constants.js";

// Artifacts
export { generateArtifact, artifactExists } from "./artifacts/generator.js";

// Stats (v2.2.0)
export { 
  loadStats, 
  saveStats, 
  recordInvocation, 
  getTopCharacters, 
  formatStatsReport,
  resetStats,
  type UsageStats,
} from "./utils/stats.js";

// Validation utilities (v3.0.0)
export {
  isFileComplete,
  hasTemplatePlaceholders,
  validateFileContent,
  validateRequiredFiles,
  validateSpringfieldDirectory,
  isSpringfieldInitialized,
  isSpringfieldReady,
  TEMPLATE_PLACEHOLDERS,
  type FileValidationResult,
  type DirectoryValidationResult,
} from "./utils/validation.js";

// Configuration (v2.3.0)
export {
  getConfig,
  getCachedConfig,
  clearConfigCache,
  validateConfig,
  DEFAULT_CONFIG,
  type SpringfieldConfig,
} from "./config.js";

// Skills system (v3.0.0)
export {
  registerSkill,
  registerSkillFromFile,
  getSkill,
  listSkills,
  getRegistryState,
  unregisterSkill,
  clearSkillRegistry,
  loadSkillsFromDirectory,
  findSkillsByTrigger,
  parseFrontmatter,
  type Skill,
  type SkillMetadata,
  type RegisterSkillOptions,
  type SkillLookupResult,
  type SkillRegistryState,
} from "./skills/index.js";

// Plugin metadata - version synced with package.json
export const PLUGIN_INFO = {
  name: "springfield-code",
  version: "3.0.2",
  description: "Simpsons-themed vibe coding environment for Claude Code",
};
