/**
 * Data persistence operations service
 * Wraps localStorage and IndexedDB operations for game data
 */

import { useLocalStorage } from '@composables/useLocalStorage.js'

const { getItem, setItem, removeItem, indexedDB } = useLocalStorage()

/**
 * Storage Service Object - for backward compatibility
 */
const storageService = {
  getItem,
  setItem,
  removeItem,
  indexedDB
}

// Export as default for object-style usage
export default storageService

/**
 * Save game configuration to localStorage
 * @param {Object} config - Game configuration object
 * @returns {Promise<void>}
 */
export async function saveGameConfiguration(config) {
  await setItem('whackMole_config', config)
}

/**
 * Load game configuration from localStorage
 * @returns {Promise<Object|null>} Configuration or null
 */
export async function loadGameConfiguration() {
  return await getItem('whackMole_config')
}

/**
 * Reset game configuration to defaults
 * @returns {Promise<void>}
 */
export async function resetGameConfiguration() {
  await removeItem('whackMole_config')
}

/**
 * Save prompt configuration to localStorage
 * @param {Object} prompts - Prompt configuration object
 * @returns {Promise<void>}
 */
export async function savePromptConfiguration(prompts) {
  await setItem('whackMole_prompts', prompts)
}

/**
 * Load prompt configuration from localStorage
 * @returns {Promise<Object|null>} Prompt configuration or null
 */
export async function loadPromptConfiguration() {
  return await getItem('whackMole_prompts')
}

/**
 * Create a new game session
 * @param {Object} sessionData - Game session data
 * @returns {Promise<number>} Session ID
 */
export async function createGameSession(sessionData) {
  return await indexedDB.add('game_sessions', sessionData)
}

/**
 * Update game session
 * @param {Object} sessionData - Updated session data
 * @returns {Promise<number>} Session ID
 */
export async function updateGameSession(sessionData) {
  return await indexedDB.put('game_sessions', sessionData)
}

/**
 * Get game session by ID
 * @param {number} sessionId - Session ID
 * @returns {Promise<Object|null>} Session data or null
 */
export async function getGameSession(sessionId) {
  return await indexedDB.get('game_sessions', sessionId)
}

/**
 * Get all game sessions
 * @returns {Promise<Array>} All game sessions
 */
export async function getAllGameSessions() {
  return await indexedDB.getAll('game_sessions')
}

/**
 * Delete game session
 * @param {number} sessionId - Session ID
 * @returns {Promise<void>}
 */
export async function deleteGameSession(sessionId) {
  await indexedDB.delete('game_sessions', sessionId)
}

/**
 * Save character to IndexedDB
 * @param {Object} character - Character data
 * @returns {Promise<string>} Character ID
 */
export async function saveCharacter(character) {
  return await indexedDB.put('characters', character)
}

/**
 * Get character by ID
 * @param {string} characterId - Character ID
 * @returns {Promise<Object|null>} Character data or null
 */
export async function getCharacter(characterId) {
  return await indexedDB.get('characters', characterId)
}

/**
 * Get all characters
 * @returns {Promise<Array>} All characters
 */
export async function getAllCharacters() {
  return await indexedDB.getAll('characters')
}

/**
 * Delete character
 * @param {string} characterId - Character ID
 * @returns {Promise<void>}
 */
export async function deleteCharacter(characterId) {
  await indexedDB.delete('characters', characterId)
}

/**
 * Save puzzle piece to IndexedDB
 * @param {Object} piece - Puzzle piece data
 * @returns {Promise<string>} Piece ID
 */
export async function savePuzzlePiece(piece) {
  return await indexedDB.put('puzzle_pieces', piece)
}

/**
 * Get puzzle pieces by session ID
 * @param {number} sessionId - Game session ID
 * @returns {Promise<Array>} Puzzle pieces
 */
export async function getPuzzlePiecesBySession(sessionId) {
  return await indexedDB.getByIndex('puzzle_pieces', 'sessionId', sessionId)
}

/**
 * Delete puzzle piece
 * @param {string} pieceId - Piece ID
 * @returns {Promise<void>}
 */
export async function deletePuzzlePiece(pieceId) {
  await indexedDB.delete('puzzle_pieces', pieceId)
}

/**
 * Create score record
 * @param {Object} scoreData - Score record data
 * @returns {Promise<number>} Record ID
 */
export async function createScoreRecord(scoreData) {
  return await indexedDB.add('score_records', scoreData)
}

/**
 * Get all score records
 * @returns {Promise<Array>} All score records
 */
export async function getAllScoreRecords() {
  return await indexedDB.getAll('score_records')
}

/**
 * Get high scores (sorted descending)
 * @param {number} limit - Maximum number of records
 * @returns {Promise<Array>} High scores
 */
export async function getHighScores(limit = 10) {
  const allScores = await indexedDB.getAll('score_records')
  return allScores.sort((a, b) => b.score - a.score).slice(0, limit)
}

/**
 * Get fastest times (sorted ascending)
 * @param {number} limit - Maximum number of records
 * @returns {Promise<Array>} Fastest times
 */
export async function getFastestTimes(limit = 10) {
  const allScores = await indexedDB.getAll('score_records')
  return allScores
    .filter((s) => s.completionTime)
    .sort((a, b) => a.completionTime - b.completionTime)
    .slice(0, limit)
}

/**
 * Get recent scores (sorted by date)
 * @param {number} limit - Maximum number of records
 * @returns {Promise<Array>} Recent scores
 */
export async function getRecentScores(limit = 10) {
  const allScores = await indexedDB.getAll('score_records')
  return allScores.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
}

/**
 * Cleanup old records
 * @param {number} days - Delete records older than this many days
 * @returns {Promise<void>}
 */
export async function cleanupOldRecords(days = 30) {
  const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000

  // Cleanup game sessions
  const sessions = await getAllGameSessions()
  for (const session of sessions) {
    if (session.startTime < cutoffDate && session.status !== 'in_progress') {
      await deleteGameSession(session.id)
    }
  }

  // Cleanup puzzle pieces
  const pieces = await indexedDB.getAll('puzzle_pieces')
  for (const piece of pieces) {
    const session = await getGameSession(piece.sessionId)
    if (!session || session.startTime < cutoffDate) {
      await deletePuzzlePiece(piece.id)
    }
  }

  // Cleanup score records
  const scores = await getAllScoreRecords()
  for (const score of scores) {
    if (score.timestamp < cutoffDate) {
      await indexedDB.delete('score_records', score.id)
    }
  }
}

/**
 * Clear all data
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  await indexedDB.clear('game_sessions')
  await indexedDB.clear('characters')
  await indexedDB.clear('puzzle_pieces')
  await indexedDB.clear('score_records')
  await resetGameConfiguration()
  await removeItem('whackMole_prompts')
}
