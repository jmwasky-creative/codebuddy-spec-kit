<template>
  <div class="high-scores">
    <div class="scores-container">
      <div class="scores-header">
        <h1 class="scores-title">🏆 High Scores</h1>
        <div class="sort-buttons">
          <Button
            v-for="sortOption in sortOptions"
            :key="sortOption.value"
            :variant="sortBy === sortOption.value ? 'primary' : 'secondary'"
            size="small"
            @click="handleSort(sortOption.value)"
            class="sort-button"
          >
            {{ sortOption.label }}
          </Button>
        </div>
      </div>

      <div v-if="scores.length === 0" class="empty-state">
        <div class="empty-icon">🎮</div>
        <p class="empty-text">No scores yet! Start playing to set your first record.</p>
      </div>

      <div v-else class="scores-list">
        <div
          v-for="(record, index) in sortedScores"
          :key="record.id"
          class="score-card"
          :class="[
            `score-card--rank-${index}`,
            { 'score-card--personal-best': record.isPersonalBest }
          ]"
        >
          <div class="score-rank">
            <span v-if="index === 0" class="rank-badge">🥇</span>
            <span v-else-if="index === 1" class="rank-badge">🥈</span>
            <span v-else-if="index === 2" class="rank-badge">🥉</span>
            <span v-else class="rank-number">#{{ index + 1 }}</span>
          </div>

          <div class="score-info">
            <div class="score-main">
              <div class="score-value">{{ record.score }}</div>
              <div class="score-date">{{ formatDate(record.timestamp) }}</div>
            </div>

            <div class="score-details">
              <div class="score-detail">
                <span class="detail-icon">🎯</span>
                <span class="detail-value">{{ record.hits }} hits</span>
              </div>
              <div class="score-detail">
                <span class="detail-icon">⏱️</span>
                <span class="detail-value">{{ formatTime(record.completionTime) }}</span>
              </div>
              <div class="score-detail">
                <span class="detail-icon">🎯</span>
                <span class="detail-value">{{ (record.accuracy * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="scores-footer">
        <Button variant="secondary" size="medium" @click="handleMenu" class="back-button">
          <span class="button-icon">🏠</span>
          Back to Menu
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Display high scores with sorting and filtering
 */

import { ref, computed } from 'vue'
import Button from '@components/shared/Button.vue'
import { getHighScores } from '@services/storageService.js'

const emit = defineEmits(['menu'])

const scores = ref([])
const sortBy = ref('score')

const sortOptions = [
  { value: 'score', label: 'Score' },
  { value: 'time', label: 'Time' },
  { value: 'date', label: 'Date' }
]

// Load scores on mount
onMounted(async () => {
  scores.value = await getHighScores(10)
})

const sortedScores = computed(() => {
  let sorted = [...scores.value]

  switch (sortBy.value) {
    case 'score':
      return sorted.sort((a, b) => b.score - a.score)
    case 'time':
      return sorted.sort((a, b) => a.completionTime - b.completionTime)
    case 'date':
      return sorted.sort((a, b) => b.timestamp - a.timestamp)
    default:
      return sorted
  }
})

function handleSort(option) {
  sortBy.value = option
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTime(seconds) {
  if (!seconds) return '--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function handleMenu() {
  emit('menu')
}
</script>

<script>
export default {
  name: 'HighScoresList'
}
</script>

<style scoped>
.high-scores {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.scores-container {
  max-width: 700px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
}

.scores-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.scores-title {
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sort-buttons {
  display: flex;
  gap: 0.5rem;
}

.sort-button {
  padding: 0.5rem 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.score-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.score-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.score-card--rank-0 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-color: #FFD700;
}

.score-card--rank-1 {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
  border-color: #C0C0C0;
}

.score-card--rank-2 {
  background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
  border-color: #CD7F32;
}

.score-card--personal-best {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
}

.score-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.rank-badge {
  font-size: 2rem;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #666;
}

.score-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.score-date {
  font-size: 0.875rem;
  color: #666;
}

.score-details {
  display: flex;
  gap: 1.5rem;
}

.score-detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}

.detail-icon {
  font-size: 1rem;
}

.detail-value {
  font-weight: 600;
}

.scores-footer {
  display: flex;
  justify-content: center;
}

.back-button {
  padding: 1rem 2rem;
}

.button-icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .scores-container {
    padding: 1.5rem;
  }

  .scores-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .score-card {
    flex-direction: column;
    gap: 1rem;
  }

  .score-details {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .rank-number {
    font-size: 1.25rem;
  }

  .score-value {
    font-size: 1.5rem;
  }
}
</style>
