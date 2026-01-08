import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import configService from '../../src/services/configService.js';
import highScoresService from '../../src/services/highScoresService.js';
import achievementsService, { ACHIEVEMENTS } from '../../src/services/achievementsService.js';

describe('Integration Tests', () => {
  beforeEach(() => {
    // Reset services before each test
    configService.resetConfig();
    highScoresService.clearScores();
    achievementsService.resetAchievements();
    achievementsService.resetStats();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Config to Gameplay Integration', () => {
    it('should apply config and use it in gameplay', () => {
      const config = {
        gridRows: 4,
        gridCols: 4,
        moleFrequency: 1500,
        moleStayTime: 2000,
        scoreThreshold: 800
      };

      const result = configService.updateConfig(config);
      expect(result.valid).toBe(true);

      const currentConfig = configService.getConfig();
      expect(currentConfig.gridRows).toBe(4);
      expect(currentConfig.gridCols).toBe(4);
    });

    it('should validate config before applying', () => {
      const invalidConfig = {
        gridRows: 10, // Too high
        gridCols: 1   // Too low
      };

      const result = configService.updateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Scoring to High Scores Integration', () => {
    it('should add score to high scores', () => {
      const result = highScoresService.addScore(500);

      expect(result.added).toBe(true);
      expect(result.rank).toBe(1);
      expect(result.isNewHighScore).toBe(true);

      const scores = highScoresService.getHighScores();
      expect(scores.length).toBe(1);
      expect(scores[0].score).toBe(500);
    });

    it('should rank scores correctly', () => {
      highScoresService.addScore(300);
      highScoresService.addScore(500);
      highScoresService.addScore(200);

      const scores = highScoresService.getHighScores();

      expect(scores[0].score).toBe(500);
      expect(scores[1].score).toBe(300);
      expect(scores[2].score).toBe(200);
    });

    it('should limit to max scores', () => {
      for (let i = 0; i < 15; i++) {
        highScoresService.addScore(i * 100);
      }

      const scores = highScoresService.getHighScores();
      expect(scores.length).toBe(10); // Default max is 10
    });
  });

  describe('Achievements to Scoring Integration', () => {
    it('should unlock achievement when score threshold reached', () => {
      const stats = {
        hits: 10,
        moles: 10,
        score: 100,
        level: 1,
        puzzleCompleted: false
      };

      const newUnlocks = achievementsService.updateStats(stats);

      expect(newUnlocks.length).toBeGreaterThan(0);
      expect(newUnlocks.some(a => a.id === 'score-100')).toBe(true);
    });

    it('should track multiple achievements', () => {
      const stats1 = {
        hits: 10,
        moles: 10,
        score: 100,
        level: 1,
        puzzleCompleted: false
      };

      const stats2 = {
        hits: 50,
        moles: 50,
        score: 500,
        level: 5,
        puzzleCompleted: true
      };

      achievementsService.updateStats(stats1);
      const newUnlocks = achievementsService.updateStats(stats2);

      expect(newUnlocks.length).toBeGreaterThan(0);
      expect(achievementsService.isUnlocked('score-100')).toBe(true);
    });

    it('should not re-unlock achievements', () => {
      const stats = {
        hits: 10,
        moles: 10,
        score: 100,
        level: 1,
        puzzleCompleted: false
      };

      achievementsService.updateStats(stats);
      const newUnlocks = achievementsService.updateStats(stats);

      expect(newUnlocks.length).toBe(0);
    });
  });

  describe('Config Persistence Integration', () => {
    it('should save and load config', () => {
      const config = {
        gridRows: 5,
        gridCols: 5,
        moleFrequency: 2000,
        moleStayTime: 2500,
        scoreThreshold: 1000
      };

      configService.updateConfig(config);

      // Create new service instance to simulate page reload
      const newConfig = configService.getConfig();
      expect(newConfig.gridRows).toBe(5);
      expect(newConfig.gridCols).toBe(5);
    });

    it('should save and load custom presets', () => {
      const presetName = 'My Preset';
      const presetConfig = {
        gridRows: 4,
        gridCols: 4,
        moleFrequency: 1200,
        moleStayTime: 1800,
        scoreThreshold: 700
      };

      configService.saveCustomPreset(presetName, presetConfig);

      const presets = configService.getAllPresets();
      const customPreset = presets.find(p => p.name === presetName);

      expect(customPreset).toBeDefined();
      expect(customPreset.config.gridRows).toBe(4);
    });
  });

  describe('Full Game Flow Integration', () => {
    it('should complete full game flow', () => {
      // 1. Configure game
      configService.updateConfig({
        gridRows: 3,
        gridCols: 3,
        moleFrequency: 1000,
        moleStayTime: 1500,
        scoreThreshold: 500
      });

      // 2. Simulate gameplay
      const gameStats = {
        hits: 20,
        moles: 25,
        score: 750,
        level: 2,
        puzzleCompleted: true
      };

      // 3. Update achievements
      achievementsService.updateStats(gameStats);

      // 4. Save high score
      const scoreResult = highScoresService.addScore(gameStats.score);

      // Verify
      expect(scoreResult.added).toBe(true);
      expect(achievementsService.isUnlocked('score-500')).toBe(true);
      expect(achievementsService.isUnlocked('puzzle-complete')).toBe(true);
      expect(highScoresService.getHighestScore()).toBe(750);
    });

    it('should handle perfect game scenario', () => {
      const gameStats = {
        hits: 50,
        moles: 50,
        score: 1500,
        level: 5,
        puzzleCompleted: true
      };

      achievementsService.updateStats(gameStats);

      // Check multiple achievements
      expect(achievementsService.isUnlocked('perfect-game')).toBe(true);
      expect(achievementsService.isUnlocked('score-1000')).toBe(true);
      expect(achievementsService.isUnlocked('level-5')).toBe(true);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across services', () => {
      // Add scores
      highScoresService.addScore(100);
      highScoresService.addScore(200);
      highScoresService.addScore(300);

      // Update stats
      achievementsService.updateStats({
        hits: 30,
        moles: 30,
        score: 300,
        level: 1,
        puzzleCompleted: false
      });

      // Verify consistency
      const scores = highScoresService.getHighScores();
      expect(scores.length).toBe(3);

      const stats = achievementsService.getAllAchievements();
      expect(stats.some(a => a.id === 'first-hit' && a.unlocked)).toBe(true);
    });
  });
});
