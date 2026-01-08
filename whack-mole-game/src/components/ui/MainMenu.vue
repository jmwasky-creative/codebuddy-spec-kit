<template>
  <div class="main-menu">
    <div class="menu-container">
      <div class="menu-header">
        <h1 class="menu-title">🎯 Whack-a-Mole Puzzle</h1>
        <p class="menu-subtitle">Click moles, collect pieces, complete the puzzle!</p>
      </div>

      <div class="menu-buttons">
        <Button variant="primary" size="large" @click="handleStartGame" class="menu-button">
          <span class="button-icon">🎮</span>
          Start Game
        </Button>

        <Button variant="secondary" size="medium" @click="handleConfigure" class="menu-button">
          <span class="button-icon">⚙️</span>
          Configure Game
        </Button>

        <Button variant="secondary" size="medium" @click="handleHighScores" class="menu-button">
          <span class="button-icon">🏆</span>
          High Scores
        </Button>

        <Button variant="secondary" size="medium" @click="handleHelp" class="menu-button">
          <span class="button-icon">❓</span>
          Help / Instructions
        </Button>
      </div>

      <div class="menu-footer">
        <p class="footer-text">AI Character Puzzle Whack-a-Mole Game v1.0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Main menu with game options (start, configure, high scores, help)
 */

import Button from '@components/shared/Button.vue'

const emit = defineEmits(['start-game', 'configure', 'high-scores', 'help'])

function handleStartGame() {
  emit('start-game')
}

function handleConfigure() {
  emit('configure')
}

function handleHighScores() {
  emit('high-scores')
}

function handleHelp() {
  emit('help')
}
</script>

<script>
export default {
  name: 'MainMenu'
}
</script>

<style scoped>
.main-menu {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.menu-container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 3rem;
  text-align: center;
}

.menu-header {
  margin-bottom: 3rem;
}

.menu-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.menu-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-button {
  width: 100%;
  padding: 1.25rem 2rem;
  font-size: 1.1rem;
}

.button-icon {
  font-size: 1.5rem;
}

.menu-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.footer-text {
  font-size: 0.875rem;
  color: #999;
  margin: 0;
}

@media (max-width: 768px) {
  .menu-container {
    padding: 2rem 1.5rem;
  }

  .menu-title {
    font-size: 2rem;
  }

  .menu-subtitle {
    font-size: 1rem;
  }

  .menu-button {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .menu-container {
    padding: 1.5rem 1rem;
  }

  .menu-title {
    font-size: 1.5rem;
  }

  .menu-subtitle {
    font-size: 0.875rem;
  }
}
</style>
