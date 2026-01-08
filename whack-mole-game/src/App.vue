<template>
  <div id="app">
    <MainMenu
      v-if="currentScreen === 'main'"
      @start-game="handleStartGame"
      @configure="handleConfigure"
      @high-scores="handleHighScores"
      @help="handleHelp"
    />
    <GameCanvas
      v-else-if="currentScreen === 'game'"
      :gameConfig="gameConfig"
      @game-complete="handleGameComplete"
      @game-abandoned="handleGameAbandoned"
      :onGameEnd="handleGameComplete"
    />
    <ConfigPanel
      v-else-if="currentScreen === 'config'"
      :config="gameConfig"
      @save="handleConfigurationSave"
      @cancel="handleConfigurationCancel"
    />
    <ResultsScreen
      v-else-if="currentScreen === 'results'"
      :session="completedSession"
      :isPersonalBest="isPersonalBest"
      :isFastestTime="isFastestTime"
      @play-again="handlePlayAgain"
      @menu="handleReturnToMenu"
    />
    <HighScoresList
      v-else-if="currentScreen === 'highScores'"
      @menu="handleReturnToMenu"
    />
    <Modal
      v-if="showHelpModal"
      :visible="showHelpModal"
      title="How to Play"
      @close="closeHelpModal"
    >
      <div class="help-content">
        <h3>Game Instructions</h3>
        <ol>
          <li>Click "Start Game" to begin</li>
          <li>Click on moles as they appear to collect puzzle pieces</li>
          <li>Drag and drop puzzle pieces to assembly grid</li>
          <li>Complete the puzzle to reveal the AI-generated character!</li>
        </ol>
        <h3>Configuration</h3>
        <p>Click "Configure Game" to adjust difficulty, duration, grid size, scoring rules, and character prompts.</p>
        <h3>Scoring</h3>
        <p>Earn points for hitting moles and complete puzzles quickly for bonus points! Track your high scores and compete against your best performances.</p>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MainMenu from '@components/ui/MainMenu.vue'
import GameCanvas from '@components/game/GameCanvas.vue'
import ConfigPanel from '@components/config/ConfigPanel.vue'
import ResultsScreen from '@components/ui/ResultsScreen.vue'
import HighScoresList from '@components/ui/HighScoresList.vue'
import Modal from '@components/shared/Modal.vue'
import { useLocalStorage } from '@composables/useLocalStorage.js'

/**
 * Root application component managing screen navigation and application state
 */

const { getItem, setItem } = useLocalStorage()

// Application state
const currentScreen = ref('main')
const gameConfig = ref(null)
const completedSession = ref(null)
const showHelpModal = ref(false)

// Load configuration on mount
onMounted(async () => {
  const savedConfig = await getItem('whackMole_config')
  if (savedConfig) {
    gameConfig.value = savedConfig
  } else {
    // Use default config if none saved
    gameConfig.value = {
      gameDuration: 60,
      puzzleGridSize: { rows: 3, cols: 3 },
      moleAppearanceInterval: 1.0,
      moleDisplayDuration: 0.8,
      scoringRules: {
        pointsPerHit: 10,
        missPenalty: -2,
        timeBonusMultiplier: 0.1
      },
      visualSettings: {
        gameAreaSize: { width: 800, height: 600 },
        moleSize: 80,
        pieceSize: 100,
        themeColor: '#4CAF50'
      },
      difficultyPreset: 'Custom'
    }
  }
})

// Computed properties
const isPersonalBest = computed(() => {
  return completedSession.value?.isPersonalBest || false
})

const isFastestTime = computed(() => {
  return completedSession.value?.isFastestTime || false
})

// Navigation handlers
function navigateToScreen(screen) {
  currentScreen.value = screen
}

function handleStartGame() {
  navigateToScreen('game')
}

function handleConfigure() {
  navigateToScreen('config')
}

function handleHighScores() {
  navigateToScreen('highScores')
}

function handleHelp() {
  showHelpModal.value = true
}

function closeHelpModal() {
  showHelpModal.value = false
}

function handleConfigurationSave(config) {
  gameConfig.value = config
  setItem('whackMole_config', config)
  navigateToScreen('main')
}

function handleConfigurationCancel() {
  navigateToScreen('main')
}

function handleGameComplete(session) {
  completedSession.value = session
  navigateToScreen('results')
}

function handleGameAbandoned() {
  navigateToScreen('main')
}

function handlePlayAgain() {
  completedSession.value = null
  navigateToScreen('game')
}

function handleReturnToMenu() {
  completedSession.value = null
  navigateToScreen('main')
}
</script>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #333;
}

.help-content p {
  margin-bottom: 0.75rem;
  color: #666;
  line-height: 1.6;
}

.help-content ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.8;
}

.help-content li {
  margin-bottom: 0.5rem;
}
</style>
