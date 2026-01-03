/**
 * Configurable Logger for Springfield VR API
 * 
 * Supports log levels: debug, info, warn, error
 * Configure via SPRINGFIELD_LOG_LEVEL environment variable
 * 
 * Adapted from springfield-code/src/utils/logger.ts
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

interface LoggerConfig {
  level: LogLevel;
  prefix: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

/**
 * Get the configured log level from environment
 */
function getLogLevelFromEnv(): LogLevel {
  const envLevel = process.env.SPRINGFIELD_LOG_LEVEL?.toLowerCase();
  if (envLevel && envLevel in LOG_LEVELS) {
    return envLevel as LogLevel;
  }
  // Default to 'info' in production, 'debug' in development
  return process.env.NODE_ENV === "production" ? "warn" : "info";
}

/**
 * Create a logger instance with a specific prefix
 * @param prefix - Module name to prefix log messages with
 * @returns Logger instance with debug, info, warn, error methods
 */
export function createLogger(prefix: string): Logger {
  return new Logger({ prefix, level: getLogLevelFromEnv() });
}

/**
 * Logger class with configurable levels
 */
export class Logger {
  private readonly config: LoggerConfig;
  private readonly levelValue: number;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level ?? getLogLevelFromEnv(),
      prefix: config.prefix ?? "Springfield",
    };
    this.levelValue = LOG_LEVELS[this.config.level];
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.config.prefix}] ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= this.levelValue;
  }

  /**
   * Log debug messages (only in development or when SPRINGFIELD_LOG_LEVEL=debug)
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log error messages
   */
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage(message), ...args);
    }
  }

  /**
   * Create a child logger with a sub-prefix
   */
  child(subPrefix: string): Logger {
    return new Logger({
      level: this.config.level,
      prefix: `${this.config.prefix}:${subPrefix}`,
    });
  }
}

// Pre-configured loggers for common modules
export const apiLogger = createLogger("API");
export const classifierLogger = createLogger("Classifier");
export const agentLogger = createLogger("Agent");
export const ralphLogger = createLogger("Ralph");
export const storeLogger = createLogger("Store");
export const wsLogger = createLogger("WebSocket");
