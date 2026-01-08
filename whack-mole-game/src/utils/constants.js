/**
 * Default game configuration constants
 * Used as fallback values and for resetting to defaults
 */

export const DEFAULT_GAME_CONFIG = {
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

// Export as DEFAULT_CONFIG for backward compatibility
export const DEFAULT_CONFIG = {
  gridRows: 3,
  gridCols: 3,
  moleFrequency: 1000,
  moleStayTime: 1500,
  scoreThreshold: 500
}

/**
 * Difficulty preset configurations
 */
export const DIFFICULTY_PRESETS = {
  Easy: {
    gameDuration: 120,
    puzzleGridSize: { rows: 2, cols: 2 },
    moleAppearanceInterval: 2.0,
    moleDisplayDuration: 1.5,
    scoringRules: {
      pointsPerHit: 5,
      missPenalty: 0,
      timeBonusMultiplier: 0.2
    },
    visualSettings: {
      gameAreaSize: { width: 800, height: 600 },
      moleSize: 100,
      pieceSize: 150,
      themeColor: '#81C784'
    },
    difficultyPreset: 'Easy'
  },
  Medium: {
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
    difficultyPreset: 'Medium'
  },
  Hard: {
    gameDuration: 30,
    puzzleGridSize: { rows: 4, cols: 4 },
    moleAppearanceInterval: 0.5,
    moleDisplayDuration: 0.5,
    scoringRules: {
      pointsPerHit: 15,
      missPenalty: -5,
      timeBonusMultiplier: 0.05
    },
    visualSettings: {
      gameAreaSize: { width: 800, height: 600 },
      moleSize: 60,
      pieceSize: 75,
      themeColor: '#388E3C'
    },
    difficultyPreset: 'Hard'
  }
}

/**
 * Character prompt presets
 */
export const CHARACTER_PROMPTS = [
  {
    name: 'Fantasy Hero',
    prompt: 'A brave fantasy hero with magical powers, anime style, vibrant colors',
    theme: 'fantasy'
  },
  {
    name: 'Sci-Fi Explorer',
    prompt: 'Futuristic space explorer with high-tech gear, sci-fi anime style',
    theme: 'sci-fi'
  },
  {
    name: 'Cute Animal',
    prompt: 'Adorable animated animal character, kawaii style, soft pastel colors',
    theme: 'animal'
  },
  {
    name: 'Warrior Princess',
    prompt: 'Mighty warrior princess with flowing hair and armor, fantasy anime style',
    theme: 'fantasy'
  },
  {
    name: 'Robot Companion',
    prompt: 'Friendly robot companion with glowing eyes, cute sci-fi style',
    theme: 'sci-fi'
  }
]

/**
 * Game state constants
 */
export const GAME_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
}

/**
 * Mole visual states
 */
export const MOLE_STATES = {
  APPEARING: 'appearing',
  VISIBLE: 'visible',
  HIT: 'hit',
  EXPIRED: 'expired'
}

/**
 * Puzzle piece states
 */
export const PIECE_STATES = {
  COLLECTED: 'collected',
  PLACED: 'placed',
  CORRECT: 'correct'
}

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  CONFIG: 'whackMole_config',
  PROMPTS: 'whackMole_prompts',
  HIGH_SCORES: 'whackMole_highScores'
}

/**
 * IndexedDB store names
 */
export const IDB_STORES = {
  GAME_SESSIONS: 'game_sessions',
  CHARACTERS: 'characters',
  PUZZLE_PIECES: 'puzzle_pieces',
  SCORE_RECORDS: 'score_records'
}

/**
 * IndexedDB database name and version
 */
export const IDB_CONFIG = {
  DB_NAME: 'WhackMoleGameDB',
  DB_VERSION: 1
}

/**
 * Validation ranges
 */
export const VALIDATION_RANGES = {
  gameDuration: { min: 30, max: 300 },
  puzzleGridSize: { min: 2, max: 6 },
  moleAppearanceInterval: { min: 0.5, max: 5.0 },
  moleDisplayDuration: { min: 0.3, max: 3.0 },
  moleSize: { min: 40, max: 120 },
  pieceSize: { min: 50, max: 150 },
  gameAreaSize: { min: 400, max: 1920 }
}

/**
 * Default snapping tolerance for puzzle pieces (pixels)
 */
export const DEFAULT_SNAPPING_TOLERANCE = 30

/**
 * Maximum prompt history length
 */
export const MAX_PROMPT_HISTORY = 50

/**
 * Maximum preset history length
 */
export const MAX_PRESET_HISTORY = 20

/**
 * Cleanup intervals (days)
 */
export const CLEANUP_INTERVALS = {
  GAME_SESSIONS: 30,
  PUZZLE_PIECES: 30,
  SCORE_RECORDS: 90,
  CHARACTERS: 90
}

/**
 * Canvas rendering target FPS
 */
export const TARGET_FPS = 60

/**
 * Click response target time (ms)
 */
export const TARGET_CLICK_RESPONSE = 100

/**
 * Puzzle piece drop target time (ms)
 */
export const TARGET_PIECE_DROP_TIME = 500

/**
 * AI image generation target time (ms)
 */
export const TARGET_AI_GEN_TIME = 5000
