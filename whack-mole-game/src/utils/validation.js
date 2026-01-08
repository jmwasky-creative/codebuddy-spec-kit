/**
 * Parameter validation utilities
 * Ensures all game configuration values are within acceptable ranges
 */

import { VALIDATION_RANGES } from './constants.js'

/**
 * Validate a number is within specified range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum acceptable value
 * @param {number} max - Maximum acceptable value
 * @returns {boolean} True if value is valid
 */
export function validateRange(value, min, max) {
  return typeof value === 'number' && value >= min && value <= max
}

/**
 * Validate game configuration object (backward compatible alias)
 * @param {Object} config - Game configuration to validate
 * @returns {{valid: boolean, errors: Array<string>}} Validation result with error messages
 */
export const validateConfig = validateGameConfiguration;

/**
 * Validate game configuration object
 * @param {Object} config - Game configuration to validate
 * @returns {{valid: boolean, errors: Array<string>}} Validation result with error messages
 */
export function validateGameConfiguration(config) {
  const errors = []

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be an object'] }
  }

  // Validate game duration
  if (!validateRange(config.gameDuration, VALIDATION_RANGES.gameDuration.min, VALIDATION_RANGES.gameDuration.max)) {
    errors.push(
      `Game duration must be between ${VALIDATION_RANGES.gameDuration.min} and ${VALIDATION_RANGES.gameDuration.max} seconds`
    )
  }

  // Validate puzzle grid size
  if (!config.puzzleGridSize || typeof config.puzzleGridSize !== 'object') {
    errors.push('Puzzle grid size must be an object with rows and cols')
  } else {
    if (!validateRange(config.puzzleGridSize.rows, VALIDATION_RANGES.puzzleGridSize.min, VALIDATION_RANGES.puzzleGridSize.max)) {
      errors.push(
        `Grid rows must be between ${VALIDATION_RANGES.puzzleGridSize.min} and ${VALIDATION_RANGES.puzzleGridSize.max}`
      )
    }
    if (!validateRange(config.puzzleGridSize.cols, VALIDATION_RANGES.puzzleGridSize.min, VALIDATION_RANGES.puzzleGridSize.max)) {
      errors.push(
        `Grid columns must be between ${VALIDATION_RANGES.puzzleGridSize.min} and ${VALIDATION_RANGES.puzzleGridSize.max}`
      )
    }
  }

  // Validate mole appearance interval
  if (
    !validateRange(
      config.moleAppearanceInterval,
      VALIDATION_RANGES.moleAppearanceInterval.min,
      VALIDATION_RANGES.moleAppearanceInterval.max
    )
  ) {
    errors.push(
      `Mole appearance interval must be between ${VALIDATION_RANGES.moleAppearanceInterval.min} and ${VALIDATION_RANGES.moleAppearanceInterval.max} seconds`
    )
  }

  // Validate mole display duration
  if (
    !validateRange(
      config.moleDisplayDuration,
      VALIDATION_RANGES.moleDisplayDuration.min,
      VALIDATION_RANGES.moleDisplayDuration.max
    )
  ) {
    errors.push(
      `Mole display duration must be between ${VALIDATION_RANGES.moleDisplayDuration.min} and ${VALIDATION_RANGES.moleDisplayDuration.max} seconds`
    )
  }

  // Validate scoring rules
  if (!config.scoringRules || typeof config.scoringRules !== 'object') {
    errors.push('Scoring rules must be an object')
  } else {
    if (typeof config.scoringRules.pointsPerHit !== 'number' || config.scoringRules.pointsPerHit <= 0) {
      errors.push('Points per hit must be a positive number')
    }
    if (typeof config.scoringRules.missPenalty !== 'number') {
      errors.push('Miss penalty must be a number')
    }
    if (typeof config.scoringRules.timeBonusMultiplier !== 'number') {
      errors.push('Time bonus multiplier must be a number')
    }
  }

  // Validate visual settings
  if (!config.visualSettings || typeof config.visualSettings !== 'object') {
    errors.push('Visual settings must be an object')
  } else {
    if (!config.visualSettings.gameAreaSize || typeof config.visualSettings.gameAreaSize !== 'object') {
      errors.push('Game area size must be an object with width and height')
    } else {
      if (
        !validateRange(
          config.visualSettings.gameAreaSize.width,
          VALIDATION_RANGES.gameAreaSize.min,
          VALIDATION_RANGES.gameAreaSize.max
        )
      ) {
        errors.push(
          `Game area width must be between ${VALIDATION_RANGES.gameAreaSize.min} and ${VALIDATION_RANGES.gameAreaSize.max} pixels`
        )
      }
      if (
        !validateRange(
          config.visualSettings.gameAreaSize.height,
          VALIDATION_RANGES.gameAreaSize.min,
          VALIDATION_RANGES.gameAreaSize.max
        )
      ) {
        errors.push(
          `Game area height must be between ${VALIDATION_RANGES.gameAreaSize.min} and ${VALIDATION_RANGES.gameAreaSize.max} pixels`
        )
      }
    }
    if (!validateRange(config.visualSettings.moleSize, VALIDATION_RANGES.moleSize.min, VALIDATION_RANGES.moleSize.max)) {
      errors.push(`Mole size must be between ${VALIDATION_RANGES.moleSize.min} and ${VALIDATION_RANGES.moleSize.max} pixels`)
    }
    if (!validateRange(config.visualSettings.pieceSize, VALIDATION_RANGES.pieceSize.min, VALIDATION_RANGES.pieceSize.max)) {
      errors.push(`Piece size must be between ${VALIDATION_RANGES.pieceSize.min} and ${VALIDATION_RANGES.pieceSize.max} pixels`)
    }
    if (!isValidHexColor(config.visualSettings.themeColor)) {
      errors.push('Theme color must be a valid hex color code (#XXXXXX)')
    }
  }

  // Validate logical constraints
  if (config.moleAppearanceInterval < config.moleDisplayDuration) {
    errors.push('Mole appearance interval should be greater than or equal to display duration')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate hex color code
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export function isValidHexColor(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Sanitize AI prompt input
 * @param {string} prompt - User-provided prompt
 * @returns {string} Sanitized prompt
 */
export function sanitizePrompt(prompt) {
  if (typeof prompt !== 'string') return ''
  return prompt.trim().slice(0, 500)
}

/**
 * Validate prompt length
 * @param {string} prompt - Prompt to validate
 * @returns {boolean} True if valid length
 */
export function isValidPromptLength(prompt) {
  return typeof prompt === 'string' && prompt.trim().length >= 1 && prompt.trim().length <= 500
}

/**
 * Validate game session object
 * @param {Object} session - Game session to validate
 * @returns {{valid: boolean, errors: Array<string>}} Validation result
 */
export function validateGameSession(session) {
  const errors = []

  if (!session || typeof session !== 'object') {
    return { valid: false, errors: ['Session must be an object'] }
  }

  if (typeof session.score !== 'number') {
    errors.push('Score must be a number')
  }

  if (typeof session.hits !== 'number' || session.hits < 0) {
    errors.push('Hits must be a non-negative number')
  }

  if (typeof session.misses !== 'number' || session.misses < 0) {
    errors.push('Misses must be a non-negative number')
  }

  if (typeof session.completedPuzzlePieces !== 'number' || session.completedPuzzlePieces < 0) {
    errors.push('Completed puzzle pieces must be a non-negative number')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate mole object
 * @param {Object} mole - Mole to validate
 * @returns {boolean} True if valid
 */
export function validateMole(mole) {
  return (
    mole &&
    typeof mole.id === 'string' &&
    typeof mole.x === 'number' &&
    typeof mole.y === 'number' &&
    typeof mole.hit === 'boolean'
  )
}

/**
 * Validate puzzle piece object
 * @param {Object} piece - Puzzle piece to validate
 * @returns {boolean} True if valid
 */
export function validatePuzzlePiece(piece) {
  return (
    piece &&
    typeof piece.id === 'string' &&
    typeof piece.rowIndex === 'number' &&
    typeof piece.colIndex === 'number' &&
    typeof piece.collected === 'boolean' &&
    typeof piece.imageData === 'string'
  )
}

/**
 * Validate character object
 * @param {Object} character - Character to validate
 * @returns {boolean} True if valid
 */
export function validateCharacter(character) {
  return (
    character &&
    typeof character.id === 'string' &&
    typeof character.prompt === 'string' &&
    typeof character.imageData === 'string' &&
    typeof character.width === 'number' &&
    typeof character.height === 'number' &&
    validateRange(character.width, 1, 4096) &&
    validateRange(character.height, 1, 4096)
  )
}

/**
 * Validate score record object
 * @param {Object} record - Score record to validate
 * @returns {boolean} True if valid
 */
export function validateScoreRecord(record) {
  return (
    record &&
    typeof record.id === 'number' &&
    typeof record.score === 'number' &&
    typeof record.hits === 'number' &&
    typeof record.misses === 'number' &&
    typeof record.accuracy === 'number' &&
    record.accuracy >= 0 &&
    record.accuracy <= 1
  )
}

/**
 * Validate a single parameter
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} paramName - Parameter name for error messages
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export function validateParameter(value, min, max, paramName) {
  const errors = [];

  if (typeof value !== 'number') {
    errors.push(`${paramName} must be a number`);
  } else if (value < min || value > max) {
    errors.push(`${paramName} must be between ${min} and ${max}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate mole frequency
 * @param {number} frequency - Mole frequency in ms
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export function validateMoleFrequency(frequency) {
  return validateParameter(frequency, 500, 5000, 'Mole frequency');
}

/**
 * Validate score threshold
 * @param {number} threshold - Score threshold
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export function validateScoreThreshold(threshold) {
  const errors = [];

  if (typeof threshold !== 'number') {
    errors.push('Score threshold must be a number');
  } else if (threshold <= 0) {
    errors.push('Score threshold must be greater than 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
