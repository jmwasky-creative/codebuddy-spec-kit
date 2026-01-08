/**
 * High Scores Service
 * Manages high score persistence and retrieval
 */
class HighScoresService {
  constructor() {
    this.storageKey = 'highScores';
    this.maxScores = 10;
  }

  /**
   * Get all high scores
   */
  getHighScores() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load high scores:', error);
      return [];
    }
  }

  /**
   * Add a new score
   * @param {number} score - The score to add
   * @returns {Object} { added: boolean, rank: number, isNewHighScore: boolean }
   */
  addScore(score) {
    const scores = this.getHighScores();
    const entry = {
      score,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    scores.push(entry);

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // Keep only top scores
    const trimmedScores = scores.slice(0, this.maxScores);

    // Find rank
    const rank = trimmedScores.findIndex(s => s.timestamp === entry.timestamp) + 1;

    // Save
    localStorage.setItem(this.storageKey, JSON.stringify(trimmedScores));

    return {
      added: rank <= this.maxScores,
      rank,
      isNewHighScore: rank <= this.maxScores,
      scores: trimmedScores
    };
  }

  /**
   * Check if score is a high score
   * @param {number} score - Score to check
   */
  isHighScore(score) {
    const scores = this.getHighScores();
    if (scores.length < this.maxScores) return true;
    return score > scores[scores.length - 1].score;
  }

  /**
   * Get highest score
   */
  getHighestScore() {
    const scores = this.getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  /**
   * Clear all scores
   */
  clearScores() {
    localStorage.removeItem(this.storageKey);
    return [];
  }

  /**
   * Get score at rank
   * @param {number} rank - Rank (1-indexed)
   */
  getScoreAtRank(rank) {
    const scores = this.getHighScores();
    return scores[rank - 1] || null;
  }
}

// Singleton instance
const highScoresService = new HighScoresService();

export default highScoresService;
