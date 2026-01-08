import { ref, computed } from 'vue';
import highScoresService from '../services/highScoresService.js';

/**
 * High Scores Composable
 */
export function useHighScores() {
  const scores = ref(highScoresService.getHighScores());
  const highestScore = ref(highScoresService.getHighestScore());

  /**
   * Refresh scores from storage
   */
  const refreshScores = () => {
    scores.value = highScoresService.getHighScores();
    highestScore.value = highScoresService.getHighestScore();
  };

  /**
   * Add a new score
   */
  const addScore = (score) => {
    const result = highScoresService.addScore(score);
    refreshScores();
    return result;
  };

  /**
   * Check if score qualifies for high scores
   */
  const isHighScore = (score) => {
    return highScoresService.isHighScore(score);
  };

  /**
   * Clear all scores
   */
  const clearScores = () => {
    highScoresService.clearScores();
    refreshScores();
  };

  /**
   * Score at rank (1-indexed)
   */
  const getScoreAtRank = (rank) => {
    return highScoresService.getScoreAtRank(rank);
  };

  /**
   * Has any scores
   */
  const hasScores = computed(() => scores.value.length > 0);

  /**
   * Count of scores
   */
  const scoreCount = computed(() => scores.value.length);

  /**
   * Top 3 scores
   */
  const topScores = computed(() => scores.value.slice(0, 3));

  return {
    // State
    scores,
    highestScore,

    // Computed
    hasScores,
    scoreCount,
    topScores,

    // Methods
    refreshScores,
    addScore,
    isHighScore,
    clearScores,
    getScoreAtRank
  };
}
