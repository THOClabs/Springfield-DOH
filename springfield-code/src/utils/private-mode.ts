/**
 * Private Mode Manager
 * Handles private mode state for individual reflection without stats tracking
 *
 * User research (Marcus, Chicago): "I'd be embarrassed to use this in front
 * of my team. Not because it's bad. Because it's TOO good at finding things
 * I don't want to admit."
 *
 * @module utils/private-mode
 */

import * as fs from "fs";
import * as path from "path";
import { SPRINGFIELD_DIR } from "../constants.js";

/**
 * Directory for private artifacts (not tracked in stats)
 */
export const PRIVATE_DIR = ".springfield-private";

/**
 * Private mode state structure
 */
export interface PrivateModeState {
  /** Whether private mode is currently enabled */
  enabled: boolean;
  /** When private mode was enabled (ISO timestamp) */
  enabledAt?: string;
  /** Session identifier for this private session */
  sessionId?: string;
}

const CONFIG_FILE = "config.json";

/**
 * Get the path to the Springfield config file
 */
function getConfigPath(projectDir: string): string {
  return path.join(projectDir, SPRINGFIELD_DIR, CONFIG_FILE);
}

/**
 * Load Springfield config from file
 */
function loadConfig(projectDir: string): Record<string, unknown> {
  const configPath = getConfigPath(projectDir);
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);

  if (!fs.existsSync(springfieldDir)) {
    return {};
  }

  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/**
 * Save Springfield config to file
 */
function saveConfig(projectDir: string, config: Record<string, unknown>): boolean {
  const configPath = getConfigPath(projectDir);
  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);

  if (!fs.existsSync(springfieldDir)) {
    return false;
  }

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a simple session ID for tracking
 */
function generateSessionId(): string {
  return `private-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Check if private mode is enabled for a project
 *
 * @param projectDir - Project directory path
 * @returns true if private mode is enabled
 */
export function isPrivateModeEnabled(projectDir: string): boolean {
  const config = loadConfig(projectDir);
  return config.privateMode === true;
}

/**
 * Enable private mode for the session
 *
 * @param projectDir - Project directory path
 * @returns Updated private mode state
 */
export function enablePrivateMode(projectDir: string): PrivateModeState {
  const config = loadConfig(projectDir);
  const now = new Date().toISOString();
  const sessionId = generateSessionId();

  config.privateMode = true;
  config.privateModeEnabledAt = now;
  config.privateModeSessionId = sessionId;

  saveConfig(projectDir, config);

  // Ensure private directory exists
  const privateDir = path.join(projectDir, PRIVATE_DIR);
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }

  return {
    enabled: true,
    enabledAt: now,
    sessionId,
  };
}

/**
 * Disable private mode
 *
 * @param projectDir - Project directory path
 * @returns Updated private mode state
 */
export function disablePrivateMode(projectDir: string): PrivateModeState {
  const config = loadConfig(projectDir);

  config.privateMode = false;
  delete config.privateModeEnabledAt;
  delete config.privateModeSessionId;

  saveConfig(projectDir, config);

  return {
    enabled: false,
  };
}

/**
 * Get current private mode status
 *
 * @param projectDir - Project directory path
 * @returns Current private mode state
 */
export function getPrivateModeStatus(projectDir: string): PrivateModeState {
  const config = loadConfig(projectDir);

  if (config.privateMode === true) {
    return {
      enabled: true,
      enabledAt: config.privateModeEnabledAt as string | undefined,
      sessionId: config.privateModeSessionId as string | undefined,
    };
  }

  return {
    enabled: false,
  };
}

/**
 * Get the appropriate artifact directory based on private mode
 *
 * @param projectDir - Project directory path
 * @param forcePrivate - Override to force private directory
 * @returns Path to artifact directory
 */
export function getArtifactDirectory(
  projectDir: string,
  forcePrivate?: boolean
): string {
  const isPrivate = forcePrivate ?? isPrivateModeEnabled(projectDir);

  if (isPrivate) {
    return path.join(projectDir, PRIVATE_DIR);
  }

  return path.join(projectDir, SPRINGFIELD_DIR);
}

/**
 * Check if command arguments contain --private flag
 *
 * @param args - Command arguments
 * @returns Object with flag status and cleaned arguments
 */
export function hasPrivateFlag(args: string[]): {
  hasFlag: boolean;
  cleanArgs: string[];
} {
  const hasFlag = args.includes("--private") || args.includes("-p");
  const cleanArgs = args.filter((arg) => arg !== "--private" && arg !== "-p");

  return {
    hasFlag,
    cleanArgs,
  };
}

/**
 * Format private mode indicator for output
 *
 * @returns Formatted indicator string
 */
export function getPrivateModeIndicator(): string {
  return `[PRIVATE MODE] Stats not tracked. Artifacts in ${PRIVATE_DIR}/`;
}

/**
 * Format private mode status message
 *
 * @param state - Current private mode state
 * @returns Formatted status message
 */
export function formatPrivateModeStatus(state: PrivateModeState): string {
  if (!state.enabled) {
    return `Private Mode: OFF

Stats are being tracked normally.
Artifacts are saved to .springfield/

To enable: /springfield private-mode on`;
  }

  const enabledDate = state.enabledAt
    ? new Date(state.enabledAt).toLocaleString()
    : "unknown";

  return `Private Mode: ON

*Moe nods approvingly*

"What happens at Moe's stays at Moe's."

Stats are NOT being tracked.
Artifacts are saved to ${PRIVATE_DIR}/
Enabled at: ${enabledDate}
Session: ${state.sessionId || "unknown"}

To disable: /springfield private-mode off`;
}
