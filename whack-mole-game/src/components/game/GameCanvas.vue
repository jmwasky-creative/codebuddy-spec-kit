<template>
  <div class="game-canvas-container">
    <ScoreDisplay
      :score="score"
      :hits="hits"
      :misses="misses"
      :timeRemaining="timeRemaining"
      class="score-display-overlay"
    />

    <canvas
      ref="canvasRef"
      class="game-canvas"
      :width="gameConfig.visualSettings.gameAreaSize.width"
      :height="gameConfig.visualSettings.gameAreaSize.height"
      @click="handleCanvasClick"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    />

    <div class="dropped-pieces">
      <PuzzlePiece
        v-for="piece in droppedPieces"
        :key="piece.id"
        :piece="piece"
        :size="gameConfig.visualSettings.pieceSize"
        :snappingTolerance="30"
        @drop="handlePieceDrop"
        @snap="handlePieceSnap"
      />
    </div>

    <PuzzleGrid
      ref="puzzleGridRef"
      :rows="gameConfig.puzzleGridSize.rows"
      :cols="gameConfig.puzzleGridSize.cols"
      :pieceSize="gameConfig.visualSettings.pieceSize"
      :completedImage="completedImage"
      @complete="handlePuzzleComplete"
      @piece-placed="handleGridPiecePlaced"
      class="puzzle-grid-overlay"
    />
  </div>
</template>

<script setup>
/**
 * Main game rendering area using HTML5 Canvas for game loop, mole rendering, and animations
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import ScoreDisplay from './ScoreDisplay.vue'
import PuzzlePiece from './PuzzlePiece.vue'
import PuzzleGrid from './PuzzleGrid.vue'
import {
  moleSpawning,
  checkMoleHit,
  shouldRemoveMole,
  updateMoleState,
  hitMole,
  generatePieceDropPosition,
  calculateScore
} from '@utils/gameLogic.js'
import { generatePuzzlePieces, createPlaceholderImage } from '@utils/puzzleGenerator.js'
import { useGameState } from '@composables/useGameState.js'
import { useAIImageGen } from '@composables/useAIImageGen.js'

const props = defineProps({
  gameConfig: {
    type: Object,
    required: true
  },
  onGameEnd: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['game-complete', 'game-abandoned', 'mole-hit', 'piece-drop', 'score-change'])

// Game state
const gameState = useGameState()
const aiImageGen = useAIImageGen()

const canvasRef = ref(null)
const puzzleGridRef = ref(null)

const moles = ref([])
const droppedPieces = ref([])
const puzzlePieces = ref([])
const completedImage = ref(null)

const score = computed(() => gameState.score)
const hits = computed(() => gameState.hits)
const misses = computed(() => gameState.misses)
const timeRemaining = computed(() => gameState.timeRemaining)

// Game loop variables
let animationFrameId = null
let lastMoleSpawnTime = 0
let lastUpdateTime = 0
let gameStartTime = null
let gameLoopActive = false

// Canvas context
let ctx = null

/**
 * Initialize game
 */
async function startGame() {
  // Start game session
  await gameState.startSession(props.gameConfig)

  // Generate character image
  const defaultPrompt = 'A cute animated character, cartoon style, vibrant colors'
  const character = await aiImageGen.generateCharacter(defaultPrompt, {
    width: 512,
    height: 512,
    gridConfig: props.gameConfig.puzzleGridSize
  })

  // Generate puzzle pieces
  puzzlePieces.value = await generatePuzzlePieces(
    character.imageData,
    props.gameConfig.puzzleGridSize,
    props.gameConfig.visualSettings.pieceSize
  )

  // Initialize canvas
  initCanvas()

  // Reset game state
  moles.value = []
  droppedPieces.value = []
  lastMoleSpawnTime = 0
  gameStartTime = Date.now()
  gameLoopActive = true

  // Start game loop
  startGameLoop()

  // Start timer
  startTimer()
}

/**
 * Initialize canvas context
 */
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
}

/**
 * Start the game loop
 */
function startGameLoop() {
  if (!ctx) return

  gameLoopActive = true
  lastUpdateTime = Date.now()
  lastMoleSpawnTime = Date.now()

  function loop() {
    if (!gameLoopActive) return

    updateGame()
    renderGame()
    animationFrameId = requestAnimationFrame(loop)
  }

  animationFrameId = requestAnimationFrame(loop)
}

/**
 * Stop the game loop
 */
function stopGameLoop() {
  gameLoopActive = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

/**
 * Update game state
 */
function updateGame() {
  const now = Date.now()
  const displayDuration = props.gameConfig.moleDisplayDuration * 1000
  const spawnInterval = props.gameConfig.moleAppearanceInterval * 1000

  // Spawn new moles
  if (now - lastMoleSpawnTime >= spawnInterval) {
    spawnMole()
    lastMoleSpawnTime = now
  }

  // Update existing moles
  moles.value.forEach((mole) => {
    const updatedMole = updateMoleState(mole, displayDuration)
    Object.assign(mole, updatedMole)
  })

  // Remove expired or hit moles
  moles.value = moles.value.filter((mole) => !shouldRemoveMole(mole, displayDuration))
}

/**
 * Render game
 */
function renderGame() {
  if (!ctx) return

  const width = props.gameConfig.visualSettings.gameAreaSize.width
  const height = props.gameConfig.visualSettings.gameAreaSize.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw background
  drawBackground(width, height)

  // Draw moles
  drawMoles()
}

/**
 * Draw background
 */
function drawBackground(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(1, '#98FB98')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Draw grass pattern
  ctx.strokeStyle = 'rgba(34, 139, 34, 0.3)'
  ctx.lineWidth = 2
  for (let i = 0; i < width; i += 40) {
    ctx.beginPath()
    ctx.moveTo(i, height - 20)
    ctx.quadraticCurveTo(i + 10, height - 30, i + 20, height - 20)
    ctx.stroke()
  }
}

/**
 * Draw moles
 */
function drawMoles() {
  moles.value.forEach((mole) => {
    drawMole(mole)
  })
}

/**
 * Draw individual mole
 */
function drawMole(mole) {
  const size = mole.size
  const x = mole.x
  const y = mole.y

  // Draw mole body
  ctx.fillStyle = '#8B4513'
  ctx.beginPath()
  ctx.ellipse(x + size / 2, y + size / 2, size / 2, size / 2.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw mole face
  drawMoleFace(x, y, size)

  // Draw mole nose
  ctx.fillStyle = '#FF6B6B'
  ctx.beginPath()
  ctx.ellipse(x + size / 2, y + size * 0.6, size / 6, size / 8, 0, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Draw mole face
 */
function drawMoleFace(x, y, size) {
  const eyeY = y + size * 0.35
  const eyeOffset = size * 0.2

  // Left eye
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.ellipse(x + size * 0.35, eyeY, size / 8, size / 6, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'black'
  ctx.beginPath()
  ctx.arc(x + size * 0.35, eyeY, size / 16, 0, Math.PI * 2)
  ctx.fill()

  // Right eye
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.ellipse(x + size * 0.65, eyeY, size / 8, size / 6, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'black'
  ctx.beginPath()
  ctx.arc(x + size * 0.65, eyeY, size / 16, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Spawn a new mole
 */
function spawnMole() {
  const gameArea = props.gameConfig.visualSettings.gameAreaSize
  const newMole = moleSpawning(gameArea, props.gameConfig, moles.value)
  moles.value.push(newMole)
}

/**
 * Handle canvas click
 */
function handleCanvasClick(event) {
  if (!gameLoopActive) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Check if a mole was hit
  const hitMole = checkMoleHit({ x, y }, moles.value)

  if (hitMole) {
    handleMoleHitInternal(hitMole, x, y)
  } else {
    // Missed click
    gameState.recordMiss()
    emit('score-change', gameState.score)
  }
}

/**
 * Handle internal mole hit
 */
function handleMoleHitInternal(mole, x, y) {
  // Update mole state
  const updatedMole = hitMole(mole)
  const moleIndex = moles.value.findIndex((m) => m.id === mole.id)
  if (moleIndex !== -1) {
    moles.value[moleIndex] = updatedMole
  }

  // Record hit
  gameState.recordHit()

  // Calculate new score
  const newScore = calculateScore(
    gameState.hits,
    gameState.misses,
    timeRemaining.value,
    props.gameConfig.scoringRules
  )
  gameState.updateScore(newScore)

  emit('mole-hit', mole.id, { x, y })
  emit('score-change', newScore)

  // Drop puzzle piece
  dropPuzzlePiece(mole, x, y)
}

/**
 * Drop a puzzle piece when mole is hit
 */
function dropPuzzlePiece(mole, x, y) {
  if (puzzlePieces.value.length === 0) return

  const nextPiece = puzzlePieces.value.find((p) => !p.collected)
  if (!nextPiece) return

  // Calculate drop position
  const dropPos = generatePieceDropPosition(
    mole.x,
    mole.y,
    props.gameConfig.visualSettings.gameAreaSize.height
  )

  // Update piece
  nextPiece.collected = true
  nextPiece.dropX = dropPos.x
  nextPiece.dropY = dropPos.y
  nextPiece.sessionId = gameState.session.id

  droppedPieces.value.push(nextPiece)
  gameState.collectPiece()

  emit('piece-drop', nextPiece.id, dropPos)

  // Check if all pieces collected
  if (gameState.allPiecesCollected) {
    completedImage.value = createPlaceholderImage(512, 512, '#4CAF50')
  }
}

/**
 * Handle piece dropped in grid
 */
function handlePieceDrop(pieceId, position) {
  console.log('Piece dropped:', pieceId, position)
}

/**
 * Handle piece snapped to position
 */
function handlePieceSnap(pieceId, isCorrect) {
  const piece = droppedPieces.value.find((p) => p.id === pieceId)
  if (piece) {
    piece.placedInGrid = true
    piece.correctPosition = isCorrect
    gameState.placePiece(isCorrect)
  }
}

/**
 * Handle puzzle complete
 */
function handlePuzzleComplete() {
  gameState.puzzleComplete = true
}

/**
 * Handle grid piece placed
 */
function handleGridPiecePlaced(piece) {
  console.log('Piece placed in grid:', piece)
}

/**
 * Start timer countdown
 */
function startTimer() {
  const timerInterval = setInterval(() => {
    if (!gameLoopActive) {
      clearInterval(timerInterval)
      return
    }

    const currentTimeRemaining = Math.max(0, timeRemaining.value - 1)
    gameState.updateTime(currentTimeRemaining)

    if (currentTimeRemaining <= 0) {
      clearInterval(timerInterval)
      endGame()
    }
  }, 1000)
}

/**
 * End game
 */
async function endGame() {
  stopGameLoop()
  const session = await gameState.endSession('completed')
  emit('game-complete', session)
}

/**
 * Mouse/touch handlers
 */
function handleMouseDown(event) {
  event.preventDefault()
}

function handleMouseUp(event) {
  event.preventDefault()
}

function handleTouchStart(event) {
  event.preventDefault()
}

function handleTouchEnd(event) {
  event.preventDefault()
  const touch = event.changedTouches[0]
  handleCanvasClick({
    clientX: touch.clientX,
    clientY: touch.clientY
  })
}

/**
 * Public methods
 */
function pauseGame() {
  stopGameLoop()
}

function resumeGame() {
  if (ctx) {
    startGameLoop()
  }
}

async function endGameAbandoned() {
  stopGameLoop()
  await gameState.endSession('abandoned')
  emit('game-abandoned')
}

function getGameSession() {
  return gameState.session
}

function getMoles() {
  return moles.value
}

function getPuzzlePieces() {
  return puzzlePieces.value
}

// Lifecycle
onMounted(() => {
  // Auto-start game
  startGame()
})

onUnmounted(() => {
  stopGameLoop()
})

// Expose methods
defineExpose({
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  getGameSession,
  getMoles,
  getPuzzlePieces
})
</script>

<script>
export default {
  name: 'GameCanvas'
}
</script>

<style scoped>
.game-canvas-container {
  position: relative;
  display: inline-block;
}

.game-canvas {
  display: block;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: crosshair;
  background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
}

.score-display-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;
}

.dropped-pieces {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.puzzle-grid-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
}
</style>
