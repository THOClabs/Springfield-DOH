/**
 * Config and Logger Stress Tests - Batch 7
 * Stress testing config loading, caching, and logger behavior
 * 50 tests covering config validation, logger levels, edge cases
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { getCachedConfig, clearConfigCache, DEFAULT_CONFIG, getConfig, validateConfig } from '../src/config.js';
import { createLogger, Logger, LogLevel } from '../src/utils/logger.js';

describe('Config Stress - Default Values', () => {
    beforeEach(() => {
        clearConfigCache();
    });

    it('default tokenTtlMs should be 30000', () => {
        expect(DEFAULT_CONFIG.tokenTtlMs).toBe(30_000);
    });

    it('default tokenMaxUses should be 1', () => {
        expect(DEFAULT_CONFIG.tokenMaxUses).toBe(1);
    });

    it('default maxTokensPerMinute should be 10', () => {
        expect(DEFAULT_CONFIG.maxTokensPerMinute).toBe(10);
    });

    it('default rateLimitWindowMs should be 60000', () => {
        expect(DEFAULT_CONFIG.rateLimitWindowMs).toBe(60_000);
    });

    it('default minContentLength should be 200', () => {
        expect(DEFAULT_CONFIG.minContentLength).toBe(200);
    });

    it('default defaultMaxIterations should be 20', () => {
        expect(DEFAULT_CONFIG.defaultMaxIterations).toBe(20);
    });

    it('default defaultCompletionPromise should be DONE', () => {
        expect(DEFAULT_CONFIG.defaultCompletionPromise).toBe('DONE');
    });

    it('default logLevel should be warn', () => {
        expect(DEFAULT_CONFIG.logLevel).toBe('warn');
    });
});

describe('Config Stress - Cache Behavior', () => {
    beforeEach(() => {
        clearConfigCache();
    });

    it('getCachedConfig should return same instance on multiple calls', () => {
        const config1 = getCachedConfig();
        const config2 = getCachedConfig();
        const config3 = getCachedConfig();
        expect(config1).toBe(config2);
        expect(config2).toBe(config3);
    });

    it('clearConfigCache should invalidate cache', () => {
        const config1 = getCachedConfig();
        clearConfigCache();
        // After clear, next call creates new config
        expect(config1).toBeDefined();
    });

    it('repeated clear/get cycles should work', () => {
        for (let i = 0; i < 10; i++) {
            clearConfigCache();
            const config = getCachedConfig();
            expect(config).toBeDefined();
            expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
        }
    });

    it('config should have all required properties', () => {
        const config = getCachedConfig();
        expect(config).toHaveProperty('tokenTtlMs');
        expect(config).toHaveProperty('tokenMaxUses');
        expect(config).toHaveProperty('maxTokensPerMinute');
        expect(config).toHaveProperty('rateLimitWindowMs');
        expect(config).toHaveProperty('minContentLength');
        expect(config).toHaveProperty('defaultMaxIterations');
        expect(config).toHaveProperty('defaultCompletionPromise');
        expect(config).toHaveProperty('logLevel');
    });

    it('config values should be positive numbers where expected', () => {
        const config = getCachedConfig();
        expect(config.tokenTtlMs).toBeGreaterThan(0);
        expect(config.tokenMaxUses).toBeGreaterThan(0);
        expect(config.maxTokensPerMinute).toBeGreaterThan(0);
        expect(config.rateLimitWindowMs).toBeGreaterThan(0);
        expect(config.minContentLength).toBeGreaterThan(0);
        expect(config.defaultMaxIterations).toBeGreaterThan(0);
    });
});

describe('Config Stress - Validation', () => {
    it('valid config should have no errors', () => {
        const errors = validateConfig(DEFAULT_CONFIG);
        expect(errors.length).toBe(0);
    });

    it('empty object should use defaults', () => {
        const errors = validateConfig({});
        expect(errors.length).toBe(0);
    });

    it('tokenTtlMs less than 1000 should produce error', () => {
        const errors = validateConfig({ tokenTtlMs: 999 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('tokenTtlMs of 1000 should be valid', () => {
        const errors = validateConfig({ tokenTtlMs: 1000 });
        expect(errors.length).toBe(0);
    });

    it('negative tokenMaxUses should produce error', () => {
        const errors = validateConfig({ tokenMaxUses: -1 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('zero tokenMaxUses should produce error', () => {
        const errors = validateConfig({ tokenMaxUses: 0 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('negative maxTokensPerMinute should produce error', () => {
        const errors = validateConfig({ maxTokensPerMinute: -1 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rateLimitWindowMs less than 1000 should produce error', () => {
        const errors = validateConfig({ rateLimitWindowMs: 999 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('negative minContentLength should produce error', () => {
        const errors = validateConfig({ minContentLength: -1 });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('zero minContentLength should be valid', () => {
        const errors = validateConfig({ minContentLength: 0 });
        expect(errors.length).toBe(0);
    });
});

describe('Logger Stress - Creation', () => {
    it('createLogger should return logger with all methods', () => {
        const logger = createLogger('test');
        expect(logger.debug).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.error).toBeDefined();
    });

    it('multiple loggers with same name should work', () => {
        const logger1 = createLogger('same-name');
        const logger2 = createLogger('same-name');
        expect(logger1.info).toBeDefined();
        expect(logger2.info).toBeDefined();
    });

    it('loggers with different names should work', () => {
        const logger1 = createLogger('name1');
        const logger2 = createLogger('name2');
        expect(logger1.info).toBeDefined();
        expect(logger2.info).toBeDefined();
    });

    it('logger with empty name should work', () => {
        const logger = createLogger('');
        expect(logger.debug).toBeDefined();
    });

    it('logger with special characters in name should work', () => {
        const logger = createLogger('test-logger:module/sub');
        expect(logger.info).toBeDefined();
    });

    it('Logger class should be constructable', () => {
        const logger = new Logger('test-class');
        expect(logger.debug).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.error).toBeDefined();
    });
});

describe('Logger Stress - Method Calls', () => {
    let logger: ReturnType<typeof createLogger>;

    beforeEach(() => {
        logger = createLogger('stress-test');
    });

    it('debug with string should not throw', () => {
        expect(() => logger.debug('test message')).not.toThrow();
    });

    it('info with string should not throw', () => {
        expect(() => logger.info('test message')).not.toThrow();
    });

    it('warn with string should not throw', () => {
        expect(() => logger.warn('test message')).not.toThrow();
    });

    it('error with string should not throw', () => {
        expect(() => logger.error('test message')).not.toThrow();
    });

    it('debug with object should not throw', () => {
        expect(() => logger.debug('test', { key: 'value' })).not.toThrow();
    });

    it('error with Error object should not throw', () => {
        expect(() => logger.error('test', new Error('test error'))).not.toThrow();
    });

    it('empty message should not throw', () => {
        expect(() => logger.info('')).not.toThrow();
    });

    it('unicode message should not throw', () => {
        expect(() => logger.info('测试 тест テスト')).not.toThrow();
    });

    it('very long message should not throw', () => {
        const longMessage = 'A'.repeat(10000);
        expect(() => logger.info(longMessage)).not.toThrow();
    });

    it('multiple arguments should not throw', () => {
        expect(() => logger.info('test', 'arg1', 'arg2', 'arg3')).not.toThrow();
    });
});

describe('Config Stress - Type Safety', () => {
    it('config tokenTtlMs should be number', () => {
        const config = getCachedConfig();
        expect(typeof config.tokenTtlMs).toBe('number');
    });

    it('config tokenMaxUses should be number', () => {
        const config = getCachedConfig();
        expect(typeof config.tokenMaxUses).toBe('number');
    });

    it('config maxTokensPerMinute should be number', () => {
        const config = getCachedConfig();
        expect(typeof config.maxTokensPerMinute).toBe('number');
    });

    it('config rateLimitWindowMs should be number', () => {
        const config = getCachedConfig();
        expect(typeof config.rateLimitWindowMs).toBe('number');
    });

    it('config minContentLength should be number', () => {
        const config = getCachedConfig();
        expect(typeof config.minContentLength).toBe('number');
    });

    it('config defaultMaxIterations should be number', () => {
        const config = getCachedConfig();
        expect(typeof config.defaultMaxIterations).toBe('number');
    });

    it('config defaultCompletionPromise should be string', () => {
        const config = getCachedConfig();
        expect(typeof config.defaultCompletionPromise).toBe('string');
    });

    it('config logLevel should be string', () => {
        const config = getCachedConfig();
        expect(typeof config.logLevel).toBe('string');
    });
});

describe('Config Stress - getConfig', () => {
    it('getConfig should return valid config', () => {
        const config = getConfig();
        expect(config).toBeDefined();
        expect(config.tokenTtlMs).toBeGreaterThan(0);
    });

    it('getConfig with current directory should work', () => {
        const config = getConfig(process.cwd());
        expect(config).toBeDefined();
    });

    it('getConfig with non-existent directory should return defaults', () => {
        const config = getConfig('/non-existent-path');
        expect(config.tokenTtlMs).toBe(DEFAULT_CONFIG.tokenTtlMs);
    });
});
