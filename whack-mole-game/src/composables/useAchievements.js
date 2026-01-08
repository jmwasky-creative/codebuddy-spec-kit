import { ref, computed } from 'vue';
import achievementsService, { ACHIEVEMENTS } from '../services/achievementsService.js';

/**
 * Achievements Composable
 */
export function useAchievements() {
  const achievements = ref(achievementsService.getAllAchievements());

  /**
   * Refresh achievements from service
   */
  const refreshAchievements = () => {
    achievements.value = achievementsService.getAllAchievements();
  };

  /**
   * Update stats and check for new achievements
   */
  const updateStats = (gameStats) => {
    const newUnlocks = achievementsService.updateStats(gameStats);
    refreshAchievements();
    return newUnlocks;
  };

  /**
   * Check if achievement is unlocked
   */
  const isUnlocked = (id) => {
    return achievementsService.isUnlocked(id);
  };

  /**
   * Get achievement progress
   */
  const getProgress = (id) => {
    return achievementsService.getProgress(id);
  };

  /**
   * Get achievement by ID
   */
  const getAchievement = (id) => {
    return ACHIEVEMENTS[id] || null;
  };

  /**
   * Reset all achievements
   */
  const resetAchievements = () => {
    achievementsService.resetAchievements();
    refreshAchievements();
  };

  /**
   * Reset stats only
   */
  const resetStats = () => {
    achievementsService.resetStats();
  };

  /**
   * Unlocked achievements
   */
  const unlockedAchievements = computed(() => {
    return achievements.value.filter(a => a.unlocked);
  });

  /**
   * Locked achievements
   */
  const lockedAchievements = computed(() => {
    return achievements.value.filter(a => !a.unlocked);
  });

  /**
   * Total achievements count
   */
  const totalCount = computed(() => achievements.value.length);

  /**
   * Unlocked count
   */
  const unlockedCount = computed(() => unlockedAchievements.value.length);

  /**
   * Locked count
   */
  const lockedCount = computed(() => lockedAchievements.value.length);

  /**
   * Completion percentage
   */
  const completionPercentage = computed(() => {
    return totalCount.value > 0
      ? Math.round((unlockedCount.value / totalCount.value) * 100)
      : 0;
  });

  /**
   * Recent unlocks (last 5)
   */
  const recentUnlocks = computed(() => {
    return unlockedAchievements.value.slice(-5).reverse();
  });

  /**
   * Get achievement by category
   */
  const getByCategory = (category) => {
    const categories = {
      scoring: ['score-100', 'score-500', 'score-1000'],
      progression: ['level-5', 'level-10'],
      puzzle: ['puzzle-complete', 'puzzle-5'],
      performance: ['first-hit', 'perfect-game', 'speed-demon']
    };

    const ids = categories[category] || [];
    return achievements.value.filter(a => ids.includes(a.id));
  };

  return {
    // State
    achievements,

    // Computed
    unlockedAchievements,
    lockedAchievements,
    totalCount,
    unlockedCount,
    lockedCount,
    completionPercentage,
    recentUnlocks,

    // Methods
    refreshAchievements,
    updateStats,
    isUnlocked,
    getProgress,
    getAchievement,
    getByCategory,
    resetAchievements,
    resetStats
  };
}
