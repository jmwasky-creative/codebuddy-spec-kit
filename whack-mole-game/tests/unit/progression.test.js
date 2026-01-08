import { describe, it, expect } from 'vitest';
import { checkLevelUp, unlockAchievement } from '../../src/utils/gameLogic.js';

describe('Progression System', () => {
  describe('checkLevelUp', () => {
    it('should level up when threshold reached', () => {
      const result = checkLevelUp(1, 600, 500);
      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBe(2);
    });

    it('should not level up below threshold', () => {
      const result = checkLevelUp(1, 400, 500);
      expect(result.leveledUp).toBe(false);
    });

    it('should calculate next threshold', () => {
      const result = checkLevelUp(1, 600, 500);
      expect(result.nextThreshold).toBeGreaterThan(500);
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock achievement when criteria met', () => {
      const result = unlockAchievement('first-hit', { hits: 1 });
      expect(result.unlocked).toBe(true);
    });

    it('should not unlock if already achieved', () => {
      const result = unlockAchievement('first-hit', { hits: 1 }, ['first-hit']);
      expect(result.unlocked).toBe(false);
    });

    it('should return achievement details', () => {
      const result = unlockAchievement('score-100', { score: 100 });
      expect(result.achievement).toBeDefined();
    });
  });
});
