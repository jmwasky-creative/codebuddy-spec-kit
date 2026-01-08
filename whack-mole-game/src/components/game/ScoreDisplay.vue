<template>
  <div class="score-display">
    <div class="score-section">
      <div class="score-item">
        <span class="score-label">Score</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Hits</span>
        <span class="score-value">{{ hits }}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Misses</span>
        <span class="score-value">{{ misses }}</span>
      </div>
    </div>
    <div class="timer-section">
      <div class="timer-item">
        <span class="timer-icon">⏱️</span>
        <span class="timer-value">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Real-time score display during gameplay
 */

import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  hits: {
    type: Number,
    default: 0
  },
  misses: {
    type: Number,
    default: 0
  },
  timeRemaining: {
    type: Number,
    default: 60
  }
})

const formattedTime = computed(() => {
  const mins = Math.floor(props.timeRemaining / 60)
  const secs = Math.floor(props.timeRemaining % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})
</script>

<script>
export default {
  name: 'ScoreDisplay'
}
</script>

<style scoped>
.score-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 600;
}

.score-section {
  display: flex;
  gap: 2rem;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.score-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.score-value {
  font-size: 1.5rem;
  color: #333;
  font-weight: 700;
}

.timer-section {
  display: flex;
  align-items: center;
}

.timer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timer-icon {
  font-size: 1.5rem;
}

.timer-value {
  font-size: 2rem;
  color: #4CAF50;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.score-value:first-child {
  color: #4CAF50;
}

.score-value:nth-child(2) {
  color: #2196F3;
}

.score-value:nth-child(3) {
  color: #f44336;
}

@media (max-width: 768px) {
  .score-display {
    flex-direction: column;
    gap: 1rem;
    padding: 0.75rem 1rem;
  }

  .score-section {
    gap: 1rem;
  }

  .score-item {
    min-width: 60px;
  }

  .score-value {
    font-size: 1.25rem;
  }

  .timer-value {
    font-size: 1.5rem;
  }
}
</style>
