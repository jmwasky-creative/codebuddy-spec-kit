/**
 * Achievement Definitions
 */
const ACHIEVEMENTS = {
  'first-hit': {
    id: 'first-hit',
    name: 'First Hit',
    description: 'Hit your first mole',
    icon: '🎯',
    criteria: (stats) => stats.totalHits >= 1
  },
  'score-100': {
    id: 'score-100',
    name: 'Century',
    description: 'Score 100 points',
    icon: '💯',
    criteria: (stats) => stats.maxScore >= 100
  },
  'score-500': {
    id: 'score-500',
    name: 'Half Grand',
    description: 'Score 500 points',
    icon: '🏆',
    criteria: (stats) => stats.maxScore >= 500
  },
  'score-1000': {
    id: 'score-1000',
    name: 'Grand Master',
    description: 'Score 1000 points',
    icon: '👑',
    criteria: (stats) => stats.maxScore >= 1000
  },
  'level-5': {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    criteria: (stats) => stats.maxLevel >= 5
  },
  'level-10': {
    id: 'level-10',
    name: 'Seasoned Player',
    description: 'Reach level 10',
    icon: '🌟',
    criteria: (stats) => stats.maxLevel >= 10
  },
  'puzzle-complete': {
    id: 'puzzle-complete',
    name: 'Puzzle Master',
    description: 'Complete a puzzle',
    icon: '🧩',
    criteria: (stats) => stats.puzzlesCompleted >= 1
  },
  'puzzle-5': {
    id: 'puzzle-5',
    name: 'Puzzle Collector',
    description: 'Complete 5 puzzles',
    icon: '🖼️',
    criteria: (stats) => stats.puzzlesCompleted >= 5
  },
  'perfect-game': {
    id: 'perfect-game',
    name: 'Perfect Game',
    description: 'Complete a game without missing a mole',
    icon: '💎',
    criteria: (stats) => stats.totalHits === stats.totalMoles && stats.totalMoles > 10
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Hit 5 moles in 5 seconds',
    icon: '⚡',
    criteria: (stats) => stats.fastest5Hits <= 5000
  }
};

/**
 * Achievements Service
 * Manages achievement tracking and unlocking
 */
class AchievementsService {
  constructor() {
    this.storageKey = 'achievements';
    this.statsKey = 'achievementStats';
    this.unlockedAchievements = new Set();
    this.loadAchievements();
    this.loadStats();
  }

  /**
   * Load unlocked achievements
   */
  loadAchievements() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.unlockedAchievements = new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  }

  /**
   * Save unlocked achievements
   */
  saveAchievements() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify([...this.unlockedAchievements])
    );
  }

  /**
   * Load player stats
   */
  loadStats() {
    try {
      const stored = localStorage.getItem(this.statsKey);
      if (stored) {
        this.stats = JSON.parse(stored);
      } else {
        this.stats = {
          totalHits: 0,
          totalMoles: 0,
          maxScore: 0,
          maxLevel: 1,
          puzzlesCompleted: 0,
          fastest5Hits: Infinity
        };
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      this.stats = {
        totalHits: 0,
        totalMoles: 0,
        maxScore: 0,
        maxLevel: 1,
        puzzlesCompleted: 0,
        fastest5Hits: Infinity
      };
    }
  }

  /**
   * Save player stats
   */
  saveStats() {
    localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
  }

  /**
   * Update stats after a game
   */
  updateStats(gameStats) {
    this.stats.totalHits += gameStats.hits || 0;
    this.stats.totalMoles += gameStats.moles || 0;

    if (gameStats.score > this.stats.maxScore) {
      this.stats.maxScore = gameStats.score;
    }

    if (gameStats.level > this.stats.maxLevel) {
      this.stats.maxLevel = gameStats.level;
    }

    if (gameStats.puzzleCompleted) {
      this.stats.puzzlesCompleted++;
    }

    if (gameStats.fastest5Hits < this.stats.fastest5Hits) {
      this.stats.fastest5Hits = gameStats.fastest5Hits;
    }

    this.saveStats();

    // Check for new achievements
    return this.checkAchievements();
  }

  /**
   * Check for new achievements based on current stats
   */
  checkAchievements() {
    const newUnlocks = [];

    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
      if (!this.unlockedAchievements.has(id) && achievement.criteria(this.stats)) {
        this.unlockedAchievements.add(id);
        newUnlocks.push(achievement);
      }
    }

    if (newUnlocks.length > 0) {
      this.saveAchievements();
    }

    return newUnlocks;
  }

  /**
   * Get all achievements
   */
  getAllAchievements() {
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: this.unlockedAchievements.has(achievement.id)
    }));
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements() {
    return Object.values(ACHIEVEMENTS).filter(a =>
      this.unlockedAchievements.has(a.id)
    );
  }

  /**
   * Get locked achievements
   */
  getLockedAchievements() {
    return Object.values(ACHIEVEMENTS).filter(a =>
      !this.unlockedAchievements.has(a.id)
    );
  }

  /**
   * Check if achievement is unlocked
   */
  isUnlocked(id) {
    return this.unlockedAchievements.has(id);
  }

  /**
   * Get achievement progress
   */
  getProgress(id) {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return null;

    // This is a simplified version
    // In a real implementation, you'd need to calculate progress based on criteria
    return {
      unlocked: this.isUnlocked(id),
      progress: this.isUnlocked(id) ? 100 : 0
    };
  }

  /**
   * Reset all achievements (for testing)
   */
  resetAchievements() {
    this.unlockedAchievements.clear();
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Reset stats
   */
  resetStats() {
    this.stats = {
      totalHits: 0,
      totalMoles: 0,
      maxScore: 0,
      maxLevel: 1,
      puzzlesCompleted: 0,
      fastest5Hits: Infinity
    };
    this.saveStats();
  }
}

// Singleton instance
const achievementsService = new AchievementsService();

export default achievementsService;
export { ACHIEVEMENTS };
