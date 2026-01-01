/**
 * Tests for logger.ts - Logger class methods
 * v3.0.1 - Coverage enhancement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLogger, Logger } from "../src/utils/logger.js";

describe("Logger", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Save and clear environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("createLogger", () => {
    it("creates a logger with the given prefix", () => {
      const logger = createLogger("TestModule");
      expect(logger).toBeInstanceOf(Logger);
    });

    it("uses debug level when SPRINGFIELD_LOG_LEVEL=debug", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "debug";
      const logger = createLogger("DebugTest");
      
      const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      logger.debug("test message");
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("uses silent level when SPRINGFIELD_LOG_LEVEL=silent", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "silent";
      const logger = createLogger("SilentTest");
      
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      logger.error("test message");
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Logger class", () => {
    let logger: Logger;

    beforeEach(() => {
      process.env.SPRINGFIELD_LOG_LEVEL = "debug"; // Enable all log levels
      logger = new Logger({ prefix: "Test" });
    });

    describe("debug method", () => {
      it("logs debug messages with prefix", () => {
        const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
        
        logger.debug("debug message");
        
        expect(consoleSpy).toHaveBeenCalledWith("[Test] debug message");
        consoleSpy.mockRestore();
      });

      it("passes additional arguments", () => {
        const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
        
        logger.debug("debug with args", { key: "value" }, 123);
        
        expect(consoleSpy).toHaveBeenCalledWith(
          "[Test] debug with args",
          { key: "value" },
          123
        );
        consoleSpy.mockRestore();
      });
    });

    describe("info method", () => {
      it("logs info messages with prefix", () => {
        const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
        
        logger.info("info message");
        
        expect(consoleSpy).toHaveBeenCalledWith("[Test] info message");
        consoleSpy.mockRestore();
      });

      it("passes additional arguments", () => {
        const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
        
        logger.info("info with data", [1, 2, 3]);
        
        expect(consoleSpy).toHaveBeenCalledWith("[Test] info with data", [1, 2, 3]);
        consoleSpy.mockRestore();
      });
    });

    describe("warn method", () => {
      it("logs warn messages with prefix", () => {
        const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        
        logger.warn("warning message");
        
        expect(consoleSpy).toHaveBeenCalledWith("[Test] warning message");
        consoleSpy.mockRestore();
      });
    });

    describe("error method", () => {
      it("logs error messages with prefix", () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        
        logger.error("error message");
        
        expect(consoleSpy).toHaveBeenCalledWith("[Test] error message");
        consoleSpy.mockRestore();
      });
    });

    describe("child method", () => {
      it("creates a child logger with combined prefix", () => {
        const childLogger = logger.child("SubModule");
        
        expect(childLogger).toBeInstanceOf(Logger);
        
        const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
        childLogger.debug("child message");
        
        expect(consoleSpy).toHaveBeenCalledWith("[Test:SubModule] child message");
        consoleSpy.mockRestore();
      });

      it("preserves log level in child logger", () => {
        process.env.SPRINGFIELD_LOG_LEVEL = "error";
        const parentLogger = new Logger({ prefix: "Parent" });
        const childLogger = parentLogger.child("Child");
        
        const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        
        childLogger.info("should not log");
        childLogger.error("should log");
        
        expect(infoSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
        
        infoSpy.mockRestore();
        errorSpy.mockRestore();
      });
    });
  });

  describe("log level filtering", () => {
    it("does not log debug when level is info", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "info";
      const logger = new Logger({ prefix: "LevelTest" });
      
      const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      
      logger.debug("should not log");
      logger.info("should log");
      
      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).toHaveBeenCalled();
      
      debugSpy.mockRestore();
      infoSpy.mockRestore();
    });

    it("does not log info when level is warn", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "warn";
      const logger = new Logger({ prefix: "WarnTest" });
      
      const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      
      logger.info("should not log");
      logger.warn("should log");
      
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      
      infoSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it("logs all levels when set to debug", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "debug";
      const logger = new Logger({ prefix: "AllLevels" });
      
      const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      logger.debug("debug");
      logger.info("info");
      logger.warn("warn");
      logger.error("error");
      
      expect(debugSpy).toHaveBeenCalled();
      expect(infoSpy).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      
      debugSpy.mockRestore();
      infoSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("default configuration", () => {
    it("uses warn level in production", () => {
      delete process.env.SPRINGFIELD_LOG_LEVEL;
      process.env.NODE_ENV = "production";
      
      const logger = new Logger({ prefix: "Prod" });
      
      const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      
      logger.info("should not log in production");
      logger.warn("should log in production");
      
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      
      infoSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it("uses info level in development", () => {
      delete process.env.SPRINGFIELD_LOG_LEVEL;
      process.env.NODE_ENV = "development";
      
      const logger = new Logger({ prefix: "Dev" });
      
      const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      
      logger.debug("should not log in dev without explicit debug level");
      logger.info("should log in dev");
      
      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).toHaveBeenCalled();
      
      debugSpy.mockRestore();
      infoSpy.mockRestore();
    });

    it("uses default prefix when none provided", () => {
      process.env.SPRINGFIELD_LOG_LEVEL = "debug";
      const logger = new Logger();
      
      const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      logger.debug("test");
      
      expect(consoleSpy).toHaveBeenCalledWith("[Springfield] test");
      consoleSpy.mockRestore();
    });
  });
});
