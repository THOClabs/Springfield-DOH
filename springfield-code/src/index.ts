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

// Hooks
export { default as ralphGateHook, setRalphInitiated } from "./hooks/ralph-gate.js";

// Constants
export * from "./constants.js";

// Artifacts
export { generateArtifact, artifactExists } from "./artifacts/generator.js";

// Plugin metadata
export const PLUGIN_INFO = {
  name: "springfield-code",
  version: "1.0.0",
  description: "Simpsons-themed vibe coding environment for Claude Code",
};
