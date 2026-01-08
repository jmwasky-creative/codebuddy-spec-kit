/**
 * Core game mechanics
 * Handles mole spawning, collision detection, and game state management
 */

/**
 * Generate a random position for a mole within the game area
 * @param {{width: number, height: number}} gameArea - Game area dimensions
 * @param {number} moleSize - Size of the mole in pixels
 * @returns {{x: number, y: number}} Random position
 */
export function generateMolePosition(gameArea, moleSize) {
  const maxX = gameArea.width - moleSize
  const maxY = gameArea.height - moleSize

  const x = Math.floor(Math.random() * (maxX + 1))
  const y = Math.floor(Math.random() * (maxY + 1))

  return { x, y }
}

/**
 * Check if a point collides with a rectangle
 * @param {{x: number, y: number}} point - Point to check
 * @param {{x: number, y: number, width: number, height: number}} rect - Rectangle
 * @returns {boolean} True if collision detected
 */
export function checkCollision(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

/**
 * Generate a new mole with collision avoidance
 * @param {{width: number, height: number}} gameArea - Game area dimensions
 * @param {Object} config - Game configuration
 * @param {Array<Object>} existingMoles - Current active moles
 * @param {number} maxAttempts - Maximum attempts to find non-colliding position
 * @returns {Object} New mole object
 */
export function moleSpawning(gameArea, config, existingMoles = [], maxAttempts = 50) {
  const moleSize = config.visualSettings.moleSize
  const minDistance = moleSize * 1.2 // 20% buffer for spacing

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const position = generateMolePosition(gameArea, moleSize)

    // Check collision with existing moles
    const hasCollision = existingMoles.some((mole) => {
      const distance = Math.sqrt(
        Math.pow(position.x - mole.x, 2) + Math.pow(position.y - mole.y, 2)
      )
      return distance < minDistance
    })

    if (!hasCollision) {
      return {
        id: `mole-${Date.now()}-${attempt}`,
        x: position.x,
        y: position.y,
        size: moleSize,
        appearanceTime: Date.now(),
        hitTime: null,
        hit: false,
        expired: false,
        state: 'visible'
      }
    }
  }

  // If no valid position found after max attempts, return last generated position
  const position = generateMolePosition(gameArea, moleSize)
  return {
    id: `mole-${Date.now()}-${maxAttempts}`,
    x: position.x,
    y: position.y,
    size: moleSize,
    appearanceTime: Date.now(),
    hitTime: null,
    hit: false,
    expired: false,
    state: 'visible'
  }
}

/**
 * Check if a mole should disappear (expired or hit)
 * @param {Object} mole - Mole object
 * @param {number} displayDuration - Maximum display duration in ms
 * @returns {boolean} True if mole should be removed
 */
export function shouldRemoveMole(mole, displayDuration) {
  if (mole.hit) {
    return true
  }

  const elapsedTime = Date.now() - mole.appearanceTime
  return elapsedTime >= displayDuration
}

/**
 * Update mole state based on time
 * @param {Object} mole - Mole object
 * @param {number} displayDuration - Maximum display duration in ms
 * @returns {Object} Updated mole object
 */
export function updateMoleState(mole, displayDuration) {
  if (mole.hit) {
    return { ...mole, state: 'hit', hitTime: Date.now() }
  }

  const elapsedTime = Date.now() - mole.appearanceTime

  if (elapsedTime >= displayDuration) {
    return { ...mole, expired: true, state: 'expired' }
  }

  // Animation states based on time
  if (elapsedTime < 100) {
    return { ...mole, state: 'appearing' }
  } else {
    return { ...mole, state: 'visible' }
  }
}

/**
 * Handle mole hit
 * @param {Object} mole - Mole to hit
 * @returns {Object} Updated mole object
 */
export function hitMole(mole) {
  return {
    ...mole,
    hit: true,
    hitTime: Date.now(),
    state: 'hit'
  }
}

/**
 * Calculate distance between two points
 * @param {{x: number, y: number}} point1 - First point
 * @param {{x: number, y: number}} point2 - Second point
 * @returns {number} Euclidean distance
 */
export function calculateDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  )
}

/**
 * Check if click hit a mole
 * @param {{x: number, y: number}} clickPosition - Click coordinates
 * @param {Array<Object>} moles - Active moles
 * @returns {Object|null} Hit mole or null
 */
export function checkMoleHit(clickPosition, moles) {
  for (const mole of moles) {
    const moleRect = {
      x: mole.x,
      y: mole.y,
      width: mole.size,
      height: mole.size
    }

    if (checkCollision(clickPosition, moleRect) && !mole.hit && !mole.expired) {
      return mole
    }
  }

  return null
}

/**
 * Generate puzzle piece drop position
 * @param {number} moleX - Mole X position
 * @param {number} moleY - Mole Y position
 * @param {number} gameAreaHeight - Game area height
 * @returns {{x: number, y: number}} Drop position
 */
export function generatePieceDropPosition(moleX, moleY, gameAreaHeight) {
  // Drop slightly below the mole position
  const dropY = Math.min(moleY + 150, gameAreaHeight - 50)
  const dropX = moleX

  return { x: dropX, y: dropY }
}

/**
 * Calculate game score
 * @param {number} hits - Number of moles hit
 * @param {number} misses - Number of missed clicks
 * @param {number} timeRemaining - Time remaining in seconds
 * @param {Object} scoringRules - Scoring configuration
 * @returns {number} Total score
 */
export function calculateScore(hits, misses, timeRemaining, scoringRules) {
  const hitPoints = hits * scoringRules.pointsPerHit
  const missPenalty = misses * scoringRules.missPenalty
  const timeBonus = timeRemaining * scoringRules.timeBonusMultiplier

  return Math.round(hitPoints + missPenalty + timeBonus)
}

/**
 * Calculate hit accuracy
 * @param {number} hits - Number of hits
 * @param {number} misses - Number of misses
 * @returns {number} Accuracy percentage (0-1)
 */
export function calculateAccuracy(hits, misses) {
  const total = hits + misses
  if (total === 0) return 0
  return hits / total
}

/**
 * Format time for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (MM:SS)
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default {
  generateMolePosition,
  checkCollision,
  moleSpawning,
  shouldRemoveMole,
  updateMoleState,
  hitMole,
  calculateDistance,
  checkMoleHit,
  generatePieceDropPosition,
  calculateScore,
  calculateAccuracy,
  formatTime
}
