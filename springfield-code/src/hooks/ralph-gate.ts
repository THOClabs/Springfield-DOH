/**
 * Ralph Gate Hook
 * Prevents direct Ralph invocation - only Lisa can initiate Ralph
 *
 * Security: Uses cryptographic tokens with TTL and single-use enforcement.
 * Tokens are ephemeral, time-limited, and cannot be reconstructed.
 *
 * @module ralph-gate
 */

import { randomBytes } from "crypto";
import { ralphGateLogger as logger } from "../utils/logger.js";
import { getCachedConfig } from "../config.js";

// ============================================================================
// Types
// ============================================================================

/** Branded type for cryptographic tokens - compile-time safety */
declare const TokenBrand: unique symbol;
export type SecureToken = string & { readonly [TokenBrand]: true };

interface TokenMetadata {
  /** When the token was issued (Unix timestamp) */
  issuedAt: number;
  /** Number of times this token has been used */
  uses: number;
  /** Maximum number of uses allowed */
  maxUses: number;
  /** Token time-to-live in milliseconds */
  ttlMs: number;
  /** Timeout handle for cleanup - stored to prevent memory leaks */
  timeoutId: ReturnType<typeof setTimeout>;
}

// ============================================================================
// Token Authority - Cryptographic Token Management
// ============================================================================

/**
 * Secure token authority for Lisa-Ralph protocol.
 * Issues cryptographically random, time-limited, single-use tokens.
 */
class TokenAuthority {
  private readonly activeTokens = new Map<SecureToken, TokenMetadata>();
  private readonly tokenLength = 32; // 256-bit tokens
  
  // Rate limiting: track token issuance timestamps
  private readonly issuanceHistory: number[] = [];

  /**
   * Get configuration values (supports runtime config changes)
   */
  private get config() {
    return getCachedConfig();
  }

  /**
   * Check if rate limit allows new token issuance
   */
  private isRateLimited(): boolean {
    const now = Date.now();
    const { rateLimitWindowMs, maxTokensPerMinute } = this.config;
    // Clean old entries outside the window
    while (this.issuanceHistory.length > 0 && 
           this.issuanceHistory[0] < now - rateLimitWindowMs) {
      this.issuanceHistory.shift();
    }
    return this.issuanceHistory.length >= maxTokensPerMinute;
  }

  /**
   * Issue a new cryptographically secure token.
   * @param maxUses - Maximum number of times this token can be used (default: from config)
   * @param ttlMs - Time-to-live in milliseconds (default: from config)
   * @returns A secure, random token, or null if rate limited
   */
  issueToken(maxUses?: number, ttlMs?: number): SecureToken | null {
    const { tokenMaxUses, tokenTtlMs, maxTokensPerMinute } = this.config;
    const effectiveMaxUses = maxUses ?? tokenMaxUses;
    const effectiveTtlMs = ttlMs ?? tokenTtlMs;

    // Check rate limit - graceful fallback instead of throwing
    if (this.isRateLimited()) {
      logger.error(`Rate limit exceeded - max ${maxTokensPerMinute} tokens per minute`);
      return null;
    }

    // Generate 256-bit cryptographically random token
    const token = randomBytes(this.tokenLength).toString("base64url") as SecureToken;

    // Schedule automatic cleanup after TTL expires - store handle to prevent memory leak
    const timeoutId = setTimeout(() => {
      this.activeTokens.delete(token);
    }, effectiveTtlMs + 1000); // Extra second buffer

    const metadata: TokenMetadata = {
      issuedAt: Date.now(),
      uses: 0,
      maxUses: effectiveMaxUses,
      ttlMs: effectiveTtlMs,
      timeoutId,
    };

    this.activeTokens.set(token, metadata);
    this.issuanceHistory.push(Date.now());
    logger.debug(`Token issued, expires in ${effectiveTtlMs}ms`);

    return token;
  }

  /**
   * Validate and consume a token.
   * @param token - The token to validate
   * @returns true if token is valid and was consumed, false otherwise
   */
  validateAndConsume(token: SecureToken | string | undefined): boolean {
    if (!token) {
      logger.warn("No token provided");
      return false;
    }

    const metadata = this.activeTokens.get(token as SecureToken);

    if (!metadata) {
      logger.warn("Invalid or expired token");
      return false;
    }

    // Check TTL
    const now = Date.now();
    if (now - metadata.issuedAt > metadata.ttlMs) {
      this.activeTokens.delete(token as SecureToken);
      logger.warn("Token expired");
      return false;
    }

    // Increment usage and check limit
    metadata.uses++;
    if (metadata.uses >= metadata.maxUses) {
      // Token exhausted - clear timeout and remove it
      clearTimeout(metadata.timeoutId);
      this.activeTokens.delete(token as SecureToken);
    }

    return true;
  }

  /**
   * Revoke a token before it expires.
   * @param token - The token to revoke
   */
  revokeToken(token: SecureToken | string): void {
    const metadata = this.activeTokens.get(token as SecureToken);
    if (metadata) {
      clearTimeout(metadata.timeoutId);
      this.activeTokens.delete(token as SecureToken);
    }
  }

  /**
   * Get the number of active tokens (for monitoring).
   */
  get activeTokenCount(): number {
    return this.activeTokens.size;
  }

  /**
   * Clear all tokens (for testing only).
   * Gated by NODE_ENV check in production.
   */
  _clearAllForTesting(): void {
    /* istanbul ignore if -- @preserve Production-only guard */
    if (process.env.NODE_ENV === "production") {
      logger.error("Cannot clear tokens in production!");
      return;
    }
    // Clear all timeouts to prevent memory leaks
    for (const metadata of this.activeTokens.values()) {
      clearTimeout(metadata.timeoutId);
    }
    this.activeTokens.clear();
    this.issuanceHistory.length = 0;
  }
}

// Singleton token authority instance
const tokenAuthority = new TokenAuthority();

// ============================================================================
// Ralph Gate State
// ============================================================================

// State flag - set to the active token when Lisa authorizes
let activeRalphToken: SecureToken | null = null;

// ============================================================================
// Public API
// ============================================================================

/**
 * Request authorization to invoke Ralph.
 * Only Lisa should call this. Returns a secure token that must be used
 * within the TTL window.
 *
 * @returns A secure token for Ralph invocation, or null if rate limited
 */
export function requestRalphAuthorization(): SecureToken | null {
  const token = tokenAuthority.issueToken();
  if (token) {
    activeRalphToken = token;
  }
  return token;
}

/**
 * Check if Ralph can currently be invoked.
 * This is a read-only check - does not consume the token.
 */
export function canInvokeRalph(): boolean {
  return activeRalphToken !== null;
}

/**
 * Validate a token and authorize Ralph invocation.
 * This consumes the token - it cannot be reused.
 *
 * @param token - The token to validate
 * @returns true if authorization succeeded
 */
export function authorizeRalph(token: SecureToken | string | undefined): boolean {
  if (!token || token !== activeRalphToken) {
    logger.warn("Token mismatch or not the active token");
    return false;
  }

  const valid = tokenAuthority.validateAndConsume(token);
  if (valid) {
    // Clear the active token after successful use
    activeRalphToken = null;
  }
  return valid;
}

/**
 * Revoke any pending Ralph authorization.
 */
export function revokeRalphAuthorization(): void {
  if (activeRalphToken) {
    tokenAuthority.revokeToken(activeRalphToken);
    activeRalphToken = null;
  }
}

// ============================================================================
// Testing API (stripped in production builds via tree-shaking)
// ============================================================================

/**
 * Reset the gate state (for testing purposes only).
 * This function is designed to be tree-shaken in production builds.
 * 
 * @internal
 * @remarks Only available when NODE_ENV !== 'production'
 */
export const _resetForTesting =
  process.env.NODE_ENV !== "production"
    ? (): void => {
        activeRalphToken = null;
        tokenAuthority._clearAllForTesting();
      }
    : /* istanbul ignore next -- @preserve Production-only fallback */ (): void => {
        logger.error("_resetForTesting is not available in production");
      };

// ============================================================================
// Confused Ralph Responses
// ============================================================================

/**
 * Get a random confused Ralph response when gate is blocked
 */
function getConfusedRalphResponse(): string {
  const responses = [
    `*Ralph looks confused*

Hi Lisa! Where's Lisa? Lisa tells me what to do.

*picks nose*

You should talk to Lisa first.`,

    `*Ralph stares blankly*

I'm helping! ...Am I helping?

*looks around for Lisa*

Lisa knows what I'm supposed to do.`,

    `*Ralph giggles nervously*

My cat's breath smells like cat food!

*waits for instructions*

Lisa tells me the plan first.`,

    `*Ralph scratches head*

I heard a noise... was that me?

*confused expression*

Lisa! Where's Lisa? She has my instructions!`,

    `*Ralph points at nothing*

That's where I saw the leprechaun!

*realizes this isn't about leprechauns*

Oh. You want me to do something? Lisa tells me what to do.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================================================
// Hook Handler
// ============================================================================

interface HookEvent {
  toolName: string;
  [key: string]: unknown;
}

interface HookContext {
  [key: string]: unknown;
}

interface HookResult {
  allowed: boolean;
  message?: string;
}

/**
 * PreToolUse hook handler
 * Intercepts Ralph-related tool calls and validates authorization
 */
async function handle(event: HookEvent, _context: HookContext): Promise<HookResult> {
  // Case-insensitive tool name matching to prevent bypass
  const toolName = event.toolName.toLowerCase();

  // Check if this is a Ralph-related tool
  if (toolName === "ralph-loop" || toolName === "ralph") {
    if (!activeRalphToken) {
      return {
        allowed: false,
        message: getConfusedRalphResponse(),
      };
    }

    // Consume the token atomically
    const valid = authorizeRalph(activeRalphToken);
    /* istanbul ignore if -- @preserve Race condition: token could expire between null check and validation */
    if (!valid) {
      return {
        allowed: false,
        message: getConfusedRalphResponse(),
      };
    }

    return { allowed: true };
  }

  // Allow all other tools
  return { allowed: true };
}

export default {
  name: "ralph-gate",
  event: "PreToolUse",
  handle,
};
