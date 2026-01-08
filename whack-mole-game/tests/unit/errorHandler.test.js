import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NetworkError,
  GameError,
  handleError,
  errorLogger
} from '../../src/utils/errorHandler.js';

describe('Error Handler', () => {
  beforeEach(() => {
    errorLogger.clearLogs();
  });

  describe('Error Classes', () => {
    it('should create AppError with code', () => {
      const error = new AppError('Test error', 'TEST_CODE');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('AppError');
    });

    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    it('should create NetworkError', () => {
      const error = new NetworkError('Connection failed');
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('should create GameError', () => {
      const error = new GameError('Game crashed');
      expect(error.code).toBe('GAME_ERROR');
    });
  });

  describe('handleError', () => {
    it('should handle AppError', () => {
      const error = new AppError('Test error', 'TEST_CODE');
      const result = handleError(error);
      expect(result.title).toBe('Error');
      expect(result.message).toBe('Test error');
      expect(result.code).toBe('TEST_CODE');
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');
      const result = handleError(error);
      expect(result.title).toBe('Error');
      expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should handle string error', () => {
      const result = handleError('String error');
      expect(result.message).toBe('String error');
    });

    it('should include context', () => {
      const error = new AppError('Test error', 'TEST_CODE', { userId: 123 });
      const result = handleError(error, { additional: 'info' });
      expect(result).toBeDefined();
    });
  });

  describe('errorLogger', () => {
    it('should log error', () => {
      const error = new AppError('Test error');
      errorLogger.log(error);

      const logs = errorLogger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].error.message).toBe('Test error');
    });

    it('should get recent logs', () => {
      for (let i = 0; i < 5; i++) {
        errorLogger.log(new AppError(`Error ${i}`));
      }

      const recent = errorLogger.getRecentLogs(3);
      expect(recent.length).toBe(3);
    });

    it('should clear logs', () => {
      errorLogger.log(new AppError('Test'));
      errorLogger.clearLogs();

      expect(errorLogger.getLogs().length).toBe(0);
    });
  });
});
