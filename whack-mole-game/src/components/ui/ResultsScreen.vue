<template>
  <div class="results-screen">
    <div class="results-container">
      <h1 class="results-title">Game Over!</h1>

      <!-- Score Display -->
      <div class="score-summary">
        <div class="final-score" data-test="final-score">
          <span class="score-label">Final Score</span>
          <span class="score-value">{{ score }}</span>
        </div>

        <div v-if="isNewHighScore" class="new-high-score">
          🎉 New High Score! 🎉
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Hits</span>
          <span class="stat-value">{{ stats.hits }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Misses</span>
          <span class="stat-value">{{ stats.misses }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Level Reached</span>
          <span class="stat-value">{{ stats.level }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Accuracy</span>
          <span class="stat-value">{{ accuracy }}%</span>
        </div>
      </div>

      <!-- Achievements -->
      <div v-if="newAchievements.length > 0" class="achievements-section">
        <h3>Achievements Unlocked!</h3>
        <div class="achievements-list">
          <div
            v-for="achievement in newAchievements"
            :key="achievement.id"
            class="achievement-item"
          >
            <span class="achievement-icon">{{ achievement.icon }}</span>
            <span class="achievement-name">{{ achievement.name }}</span>
          </div>
        </div>
      </div>

      <!-- Puzzle Status -->
      <div v-if="puzzleProgress" class="puzzle-status">
        <h3>Puzzle Progress</h3>
        <div class="puzzle-info">
          <span>Pieces Collected: {{ puzzleProgress.collected }} / {{ puzzleProgress.total }}</span>
        </div>
        <div class="puzzle-grid">
          <div
            v-for="(collected, idx) in Array(puzzleProgress.total).fill(false).map((_, i) => i < puzzleProgress.collected)"
            :key="idx"
            :class="['puzzle-piece-preview', { collected }]"
          >
            {{ collected ? '🧩' : '⬜' }}
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="action-buttons">
        <Button
          v-if="isNewHighScore"
          variant="primary"
          @click="handleSaveScore"
          data-test="save-score"
        >
          Save to High Scores
        </Button>
        <Button
          variant="primary"
          @click="handlePlayAgain"
          data-test="play-again"
        >
          Play Again
        </Button>
        <Button
          variant="secondary"
          @click="handleMainMenu"
          data-test="main-menu"
        >
          Main Menu
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHighScores } from '../../composables/useHighScores.js';
import { useAchievements } from '../../composables/useAchievements.js';
import Button from '../shared/Button.vue';

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  stats: {
    type: Object,
    default: () => ({ hits: 0, misses: 0, level: 1 })
  },
  puzzleProgress: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['play-again', 'main-menu', 'score-saved']);

const { isHighScore, addScore } = useHighScores();
const { updateStats } = useAchievements();

const isNewHighScore = computed(() => isHighScore(props.score));

const accuracy = computed(() => {
  const total = props.stats.hits + props.stats.misses;
  return total > 0 ? Math.round((props.stats.hits / total) * 100) : 0;
});

const newAchievements = computed(() => {
  // This would be populated during the game
  return [];
});

const handleSaveScore = () => {
  addScore(props.score);
  emit('score-saved');
};

const handlePlayAgain = () => {
  emit('play-again');
};

const handleMainMenu = () => {
  emit('main-menu');
};

// Update achievements when component mounts
const gameStats = {
  hits: props.stats.hits,
  moles: props.stats.hits + props.stats.misses,
  score: props.score,
  level: props.stats.level,
  puzzleCompleted: props.puzzleProgress?.collected === props.puzzleProgress?.total
};

updateStats(gameStats);
</script>

<style scoped>
.results-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.results-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.results-title {
  font-size: 3em;
  text-align: center;
  margin: 0 0 30px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-summary {
  text-align: center;
  margin-bottom: 30px;
}

.final-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.score-label {
  font-size: 1.5em;
  color: #7f8c8d;
}

.score-value {
  font-size: 4em;
  font-weight: bold;
  color: #2c3e50;
}

.new-high-score {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 20px;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9em;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
}

.achievements-section {
  margin-bottom: 30px;
}

.achievements-section h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 15px;
}

.achievements-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.achievement-item {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievement-icon {
  font-size: 1.5em;
}

.achievement-name {
  font-weight: 600;
  color: #2c3e50;
}

.puzzle-status {
  margin-bottom: 30px;
}

.puzzle-status h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 15px;
}

.puzzle-info {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 15px;
}

.puzzle-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}

.puzzle-piece-preview {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.puzzle-piece-preview.collected {
  background: #dfe6e9;
  border-color: #2d3436;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-buttons button {
  width: 100%;
}
</style>
