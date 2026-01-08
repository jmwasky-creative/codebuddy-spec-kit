/**
 * Game State Composable
 * Manages active game session state
 */

import { ref, computed } from 'vue'
import { createGameSession, updateGameSession } from '@services/storageService.js'
import { GAME_STATES } from '@utils/constants.js'

/**
 * Composable for game session state management
 */
export function useGameState() {
  const session = ref(null)
  const currentScore = ref(0)
  const hits = ref(0)
  const misses = ref(0)
  const completedPieces = ref(0)
  const totalPieces = ref(9)
  const timeRemaining = ref(60)
  const isGameRunning = ref(false)

  /**
   * Initialize a new game session
   * @param {Object} config - Game configuration
   * @param {string} characterId - AI character ID
   */
  async function startSession(config, characterId = null) {
    const now = Date.now()

    const newSession = {
      startTime: now,
      endTime: null,
      status: GAME_STATES.IN_PROGRESS,
      score: 0,
      hits: 0,
      misses: 0,
      completedPuzzlePieces: 0,
      totalPuzzlePieces: config.puzzleGridSize.rows * config.puzzleGridSize.cols,
      puzzleComplete: false,
      configurationSnapshot: config,
      characterId,
      isPersonalBest: false,
      isFastestTime: false
    }

    // Save to IndexedDB
    const sessionId = await createGameSession(newSession)
    newSession.id = sessionId

    // Update state
    session.value = newSession
    currentScore.value = 0
    hits.value = 0
    misses.value = 0
    completedPieces.value = 0
    totalPieces.value = newSession.totalPuzzlePieces
    timeRemaining.value = config.gameDuration
    isGameRunning.value = true

    return newSession
  }

  /**
   * Finalize the current game session
   * @param {string} status - Final status ('completed' or 'abandoned')
   */
  async function endSession(status = GAME_STATES.COMPLETED) {
    if (!session.value) {
      return
    }

    session.value.endTime = Date.now()
    session.value.status = status
    session.value.score = currentScore.value
    session.value.hits = hits.value
    session.value.misses = misses.value
    session.value.completedPuzzlePieces = completedPieces.value

    // Save to IndexedDB
    await updateGameSession(session.value)

    isGameRunning.value = false
    return session.value
  }

  /**
   * Update the current score
   * @param {number} score - New score
   */
  function updateScore(score) {
    currentScore.value = score
    if (session.value) {
      session.value.score = score
    }
  }

  /**
   * Record a mole hit
   */
  function recordHit() {
    hits.value += 1
    if (session.value) {
      session.value.hits = hits.value
    }
  }

  /**
   * Record a missed click
   */
  function recordMiss() {
    misses.value += 1
    if (session.value) {
      session.value.misses = misses.value
    }
  }

  /**
   * Record a collected puzzle piece
   */
  function collectPiece() {
    completedPieces.value += 1
    if (session.value) {
      session.value.completedPuzzlePieces = completedPieces.value
    }
  }

  /**
   * Record a puzzle piece placed in grid
   * @param {boolean} isCorrect - Whether piece is in correct position
   */
  function placePiece(isCorrect = false) {
    if (session.value) {
      if (isCorrect && !session.value.puzzleComplete) {
        // Check if all pieces are now correct
        session.value.puzzleComplete =
          completedPieces.value >= session.value.totalPuzzlePieces
      }
    }
  }

  /**
   * Update remaining time
   * @param {number} seconds - Remaining time in seconds
   */
  function updateTime(seconds) {
    timeRemaining.value = seconds
  }

  /**
   * Reset game state
   */
  function reset() {
    session.value = null
    currentScore.value = 0
    hits.value = 0
    misses.value = 0
    completedPieces.value = 0
    totalPieces.value = 9
    timeRemaining.value = 60
    isGameRunning.value = false
  }

  /**
   * Calculate hit accuracy
   */
  const accuracy = computed(() => {
    const total = hits.value + misses.value
    if (total === 0) return 0
    return hits.value / total
  })

  /**
   * Check if all puzzle pieces are collected
   */
  const allPiecesCollected = computed(() => {
    return completedPieces.value >= totalPieces.value
  })

  /**
   * Check if puzzle is complete
   */
  const puzzleComplete = computed(() => {
    return session.value?.puzzleComplete || false
  })

  /**
   * Get current session data
   */
  const currentSession = computed(() => session.value)

  /**
   * Check if game is active
   */
  const gameRunning = computed(() => isGameRunning.value)

  return {
    // State
    session: currentSession,
    score: currentScore,
    hits,
    misses,
    completedPieces,
    totalPieces,
    timeRemaining,
    accuracy,
    allPiecesCollected,
    puzzleComplete,
    isGameRunning: gameRunning,

    // Methods
    startSession,
    endSession,
    updateScore,
    recordHit,
    recordMiss,
    collectPiece,
    placePiece,
    updateTime,
    reset
  }
}

export default useGameState
