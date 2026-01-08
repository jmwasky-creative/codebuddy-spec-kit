import { describe, it, expect, beforeEach } from 'vitest';
import logger from '../../src/utils/logger.js';

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs();
  });

  describe('Log Levels', () => {
    it('should log debug messages', () => {
      logger.setLevel('DEBUG');
      logger.debug('Debug message');
      expect(logger.getLogs().length).toBe(1);
    });

    it('should log info messages', () => {
      logger.info('Info message');
      expect(logger.getLogs().length).toBe(1);
    });

    it('should log warning messages', () => {
      logger.warn('Warning message');
      expect(logger.getLogs().length).toBe(1);
    });

    it('should log error messages', () => {
      logger.error('Error message');
      expect(logger.getLogs().length).toBe(1);
    });
  });

  describe('Log Filtering', () => {
    beforeEach(() => {
      logger.setLevel('INFO');
    });

    it('should not log debug when level is INFO', () => {
      logger.debug('Debug message');
      logger.info('Info message');
      expect(logger.getLogs().length).toBe(1);
    });

    it('should log warnings and errors when level is INFO', () => {
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      expect(logger.getLogs().length).toBe(3);
    });

    it('should only log errors when level is ERROR', () => {
      logger.setLevel('ERROR');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      expect(logger.getLogs().length).toBe(1);
    });
  });

  describe('Log Context', () => {
    it('should include context in logs', () => {
      logger.info('Test message', { userId: 123, action: 'click' });
      const logs = logger.getLogs();
      expect(logs[0].context).toEqual({ userId: 123, action: 'click' });
    });

    it('should handle empty context', () => {
      logger.info('Test message', {});
      const logs = logger.getLogs();
      expect(logs[0].context).toEqual({});
    });
  });

  describe('Log Retrieval', () => {
    beforeEach(() => {
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
    });

    it('should get all logs', () => {
      const logs = logger.getLogs();
      expect(logs.length).toBe(4);
    });

    it('should get logs by level', () => {
      const errorLogs = logger.getLogsByLevel('ERROR');
      expect(errorLogs.length).toBe(1);
      expect(errorLogs[0].level).toBe('ERROR');
    });

    it('should get recent logs', () => {
      const recent = logger.getRecentLogs(2);
      expect(recent.length).toBe(2);
    });
  });

  describe('Performance Logger', () => {
    it('should track performance', async () => {
      const perf = logger.createPerformanceLogger('test-task');

      await new Promise(resolve => setTimeout(resolve, 50));
      const duration = perf.end();

      expect(duration).toBeGreaterThanOrEqual(50);
    });
  });

  describe('Export Logs', () => {
    it('should export logs as text', () => {
      logger.info('Test message', { key: 'value' });
      const exported = logger.exportLogs();

      expect(exported).toContain('Test message');
      expect(exported).toContain('key');
      expect(exported).toContain('value');
    });
  });
});
