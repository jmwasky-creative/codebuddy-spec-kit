/**
 * Puzzle piece generation utilities
 * Handles image slicing and puzzle piece creation
 */

/**
 * Create a placeholder image (solid color)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} color - Hex color code
 * @returns {string} Data URL of the image
 */
export function createPlaceholderImage(width, height, color = '#4CAF50') {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Fill with background color
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)

  // Add some visual interest (simple pattern)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(width, height)
  ctx.moveTo(width, 0)
  ctx.lineTo(0, height)
  ctx.stroke()

  return canvas.toDataURL('image/png')
}

/**
 * Generate puzzle pieces from an image
 * @param {string} imageData - Base64-encoded image data URL
 * @param {{rows: number, cols: number}} gridConfig - Grid dimensions
 * @param {number} pieceSize - Size of each piece in pixels
 * @returns {Array<Object>} Array of puzzle piece objects
 */
export async function generatePuzzlePieces(imageData, gridConfig, pieceSize) {
  const { rows, cols } = gridConfig
  const pieces = []

  // Create an image element from the data URL
  const image = await loadImage(imageData)

  const pieceWidth = image.width / cols
  const pieceHeight = image.height / rows

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const piece = await createPieceFromImage(
        image,
        row,
        col,
        pieceWidth,
        pieceHeight,
        gridConfig,
        pieceSize
      )
      pieces.push(piece)
    }
  }

  return pieces
}

/**
 * Load an image from a data URL
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<HTMLImageElement>} Loaded image
 */
function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = dataUrl
  })
}

/**
 * Create a puzzle piece from an image
 * @param {HTMLImageElement} image - Source image
 * @param {number} rowIndex - Row index in grid
 * @param {number} colIndex - Column index in grid
 * @param {number} pieceWidth - Width of piece in source image
 * @param {number} pieceHeight - Height of piece in source image
 * @param {{rows: number, cols: number}} gridConfig - Grid configuration
 * @param {number} displaySize - Display size of piece
 * @returns {Promise<Object>} Puzzle piece object
 */
async function createPieceFromImage(
  image,
  rowIndex,
  colIndex,
  pieceWidth,
  pieceHeight,
  gridConfig,
  displaySize
) {
  // Create canvas for this piece
  const canvas = document.createElement('canvas')
  canvas.width = displaySize
  canvas.height = displaySize
  const ctx = canvas.getContext('2d')

  // Draw the piece from the source image
  ctx.drawImage(
    image,
    colIndex * pieceWidth,
    rowIndex * pieceHeight,
    pieceWidth,
    pieceHeight,
    0,
    0,
    displaySize,
    displaySize
  )

  // Add piece edge/border for better visibility
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, displaySize, displaySize)

  // Get the piece image data
  const pieceImageData = canvas.toDataURL('image/png')

  // Calculate correct position in assembly grid
  const correctX = colIndex * displaySize
  const correctY = rowIndex * displaySize

  const pieceId = `piece-${rowIndex}-${colIndex}-${Date.now()}`

  return {
    id: pieceId,
    sessionId: null, // Will be set when game starts
    rowIndex,
    colIndex,
    imageData: pieceImageData,
    collected: false,
    placedInGrid: false,
    correctPosition: false,
    dropX: null,
    dropY: null,
    snappingTolerance: 30, // Default snapping tolerance
    size: displaySize,
    correctX,
    correctY,
    pieceWidth,
    pieceHeight
  }
}

/**
 * Check if a puzzle piece is in the correct position
 * @param {Object} piece - Puzzle piece object
 * @param {{x: number, y: number}} position - Current position
 * @returns {boolean} True if piece is in correct position
 */
export function isPieceInCorrectPosition(piece, position) {
  const distance = Math.sqrt(
    Math.pow(position.x - piece.correctX, 2) + Math.pow(position.y - piece.correctY, 2)
  )
  return distance <= piece.snappingTolerance
}

/**
 * Check if all pieces are collected
 * @param {Array<Object>} pieces - Puzzle pieces
 * @returns {boolean} True if all pieces collected
 */
export function areAllPiecesCollected(pieces) {
  return pieces.length > 0 && pieces.every((piece) => piece.collected)
}

/**
 * Check if all pieces are placed correctly
 * @param {Array<Object>} pieces - Puzzle pieces
 * @returns {boolean} True if puzzle is complete
 */
export function isPuzzleComplete(pieces) {
  return pieces.length > 0 && pieces.every((piece) => piece.correctPosition)
}

/**
 * Get puzzle completion status
 * @param {Array<Object>} pieces - Puzzle pieces
 * @returns {{total: number, collected: number, placed: number, correct: number}} Status
 */
export function getPuzzleCompletionStatus(pieces) {
  return {
    total: pieces.length,
    collected: pieces.filter((p) => p.collected).length,
    placed: pieces.filter((p) => p.placedInGrid).length,
    correct: pieces.filter((p) => p.correctPosition).length
  }
}

/**
 * Reassemble puzzle from pieces
 * @param {Array<Object>} pieces - Puzzle pieces
 * @param {{rows: number, cols: number}} gridConfig - Grid configuration
 * @param {number} pieceSize - Piece display size
 * @returns {string} Data URL of complete puzzle image
 */
export function reassemblePuzzle(pieces, gridConfig, pieceSize) {
  const canvas = document.createElement('canvas')
  canvas.width = gridConfig.cols * pieceSize
  canvas.height = gridConfig.rows * pieceSize
  const ctx = canvas.getContext('2d')

  // Sort pieces by grid position
  const sortedPieces = [...pieces].sort((a, b) => {
    if (a.rowIndex !== b.rowIndex) return a.rowIndex - b.rowIndex
    return a.colIndex - b.colIndex
  })

  // Draw each piece in its correct position
  for (const piece of sortedPieces) {
    const pieceImage = loadImage(piece.imageData)
    const x = piece.colIndex * pieceSize
    const y = piece.rowIndex * pieceSize

    ctx.drawImage(pieceImage, x, y, pieceSize, pieceSize)
  }

  return canvas.toDataURL('image/png')
}

export default {
  createPlaceholderImage,
  generatePuzzlePieces,
  isPieceInCorrectPosition,
  areAllPiecesCollected,
  isPuzzleComplete,
  getPuzzleCompletionStatus,
  reassemblePuzzle
}
