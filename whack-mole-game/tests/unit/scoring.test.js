import { describe, it, expect } from 'vitest';
import { calculateScore, updateScore, getScoreLevel } from '../../src/utils/gameLogic.js';

describe('Scoring System', () => {
  describe('calculateScore', () => {
    it('should calculate score based on difficulty', () => {
      const score = calculateScore({
        hitTime: 500,
        baseScore: 100,
        difficulty: 'easy'
      });
      expect(score).toBeGreaterThan(0);
    });

    it('should award bonus for quick hits', () => {
      const quickScore = calculateScore({
        hitTime: 300,
        baseScore: 100,
        difficulty: 'medium'
      });
      const slowScore = calculateScore({
        hitTime: 1000,
        baseScore: 100,
        difficulty: 'medium'
      });
      expect(quickScore).toBeGreaterThan(slowScore);
    });

    it('should scale with difficulty', () => {
      const easyScore = calculateScore({
        hitTime: 500,
        baseScore: 100,
        difficulty: 'easy'
      });
      const hardScore = calculateScore({
        hitTime: 500,
        baseScore: 100,
        difficulty: 'hard'
      });
      expect(hardScore).toBeGreaterThan(easyScore);
    });
  });

  describe('updateScore', () => {
    it('should add to current score', () => {
      const result = updateScore(100, 50);
      expect(result.current).toBe(150);
    });

    it('should track best score', () => {
      const result = updateScore(100, 50, 200);
      expect(result.best).toBe(200);
    });

    it('should update best score if exceeded', () => {
      const result = updateScore(150, 100, 200);
      expect(result.best).toBe(250);
    });
  });

  describe('getScoreLevel', () => {
    it('should return beginner level for low scores', () => {
      expect(getScoreLevel(100)).toBe('Beginner');
    });

    it('should return intermediate level for medium scores', () => {
      expect(getScoreLevel(500)).toBe('Intermediate');
    });

    it('should return expert level for high scores', () => {
      expect(getScoreLevel(1500)).toBe('Expert');
    });
  });
});
