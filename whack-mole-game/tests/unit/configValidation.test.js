import { describe, it, expect } from 'vitest';
import {
  validateConfig,
  validateParameter,
  validateMoleFrequency,
  validateScoreThreshold
} from '../../src/utils/validation.js';

describe('Config Validation', () => {
  describe('validateConfig', () => {
    it('should validate complete valid config', () => {
      const config = {
        gridRows: 3,
        gridCols: 3,
        moleFrequency: 1000,
        moleStayTime: 1500,
        scoreThreshold: 500
      };

      const result = validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return errors for invalid config', () => {
      const config = {
        gridRows: 10, // Too high
        gridCols: 1,  // Too low
        moleFrequency: -100, // Negative
        moleStayTime: 0,    // Too low
        scoreThreshold: 0   // Too low
      };

      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should accept config with optional fields', () => {
      const config = {
        gridRows: 3,
        gridCols: 3
      };

      const result = validateConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateParameter', () => {
    it('should validate parameter within range', () => {
      const result = validateParameter(5, 1, 10, 'testParam');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject parameter below minimum', () => {
      const result = validateParameter(0, 1, 10, 'testParam');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject parameter above maximum', () => {
      const result = validateParameter(15, 1, 10, 'testParam');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateMoleFrequency', () => {
    it('should accept valid frequency', () => {
      expect(validateMoleFrequency(1000).valid).toBe(true);
      expect(validateMoleFrequency(500).valid).toBe(true);
      expect(validateMoleFrequency(3000).valid).toBe(true);
    });

    it('should reject too low frequency', () => {
      expect(validateMoleFrequency(100).valid).toBe(false);
    });

    it('should reject too high frequency', () => {
      expect(validateMoleFrequency(5000).valid).toBe(false);
    });
  });

  describe('validateScoreThreshold', () => {
    it('should accept valid score threshold', () => {
      expect(validateScoreThreshold(100).valid).toBe(true);
      expect(validateScoreThreshold(500).valid).toBe(true);
      expect(validateScoreThreshold(2000).valid).toBe(true);
    });

    it('should reject negative score', () => {
      expect(validateScoreThreshold(-100).valid).toBe(false);
    });

    it('should reject zero score', () => {
      expect(validateScoreThreshold(0).valid).toBe(false);
    });
  });
});
