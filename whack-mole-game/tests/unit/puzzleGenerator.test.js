/**
 * Unit tests for puzzleGenerator.js
 * Testing image slicing into puzzle pieces
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { generatePuzzlePieces, createPlaceholderImage } from '../puzzleGenerator.js'

describe('puzzleGenerator.js', () => {
  let testImageData
  let gridConfig

  beforeEach(() => {
    // Create a simple test image (2x2 red square for testing)
    testImageData = createPlaceholderImage(200, 200, '#FF0000')
    gridConfig = { rows: 2, cols: 2 }
  })

  describe('createPlaceholderImage', () => {
    it('should create a data URL for the specified dimensions', () => {
      const dataUrl = createPlaceholderImage(100, 100, '#4CAF50')

      expect(dataUrl).toBeDefined()
      expect(typeof dataUrl).toBe('string')
      expect(dataUrl).toContain('data:image')
    })

    it('should handle different dimensions', () => {
      const smallImage = createPlaceholderImage(50, 50, '#FF0000')
      const largeImage = createPlaceholderImage(400, 400, '#0000FF')

      expect(smallImage).toBeDefined()
      expect(largeImage).toBeDefined()
    })

    it('should handle valid hex color codes', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#000000', '#FFFFFF']

      colors.forEach((color) => {
        const dataUrl = createPlaceholderImage(100, 100, color)
        expect(dataUrl).toBeDefined()
      })
    })

    it('should handle 3-character hex color codes', () => {
      const dataUrl = createPlaceholderImage(100, 100, '#F00')
      expect(dataUrl).toBeDefined()
    })
  })

  describe('generatePuzzlePieces', () => {
    it('should generate correct number of pieces for grid size', () => {
      const pieces = generatePuzzlePieces(testImageData, gridConfig, 100)

      expect(pieces.length).toBe(gridConfig.rows * gridConfig.cols)
    })

    it('should generate pieces for 2x2 grid', () => {
      const pieces = generatePuzzlePieces(testImageData, { rows: 2, cols: 2 }, 100)

      expect(pieces.length).toBe(4)
    })

    it('should generate pieces for 3x3 grid', () => {
      const pieces = generatePuzzlePieces(testImageData, { rows: 3, cols: 3 }, 67)

      expect(pieces.length).toBe(9)
    })

    it('should generate pieces for 4x4 grid', () => {
      const pieces = generatePuzzlePieces(testImageData, { rows: 4, cols: 4 }, 50)

      expect(pieces.length).toBe(16)
    })

    it('should assign unique IDs to pieces', () => {
      const pieces = generatePuzzlePieces(testImageData, gridConfig, 100)
      const ids = pieces.map((p) => p.id)

      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(pieces.length)
    })

    it('should assign correct row and column indices', () => {
      const pieces = generatePuzzlePieces(testImageData, { rows: 3, cols: 3 }, 67)

      pieces.forEach((piece) => {
        expect(piece.rowIndex).toBeGreaterThanOrEqual(0)
        expect(piece.rowIndex).toBeLessThan(3)
        expect(piece.colIndex).toBeGreaterThanOrEqual(0)
        expect(piece.colIndex).toBeLessThan(3)
      })
    })

    it('should generate pieces with correct positions in grid', () => {
      const pieces = generatePuzzlePieces(testImageData, gridConfig, 100)

      const topLeft = pieces.find((p) => p.rowIndex === 0 && p.colIndex === 0)
      const topRight = pieces.find((p) => p.rowIndex === 0 && p.colIndex === 1)
      const bottomLeft = pieces.find((p) => p.rowIndex === 1 && p.colIndex === 0)
      const bottomRight = pieces.find((p) => p.rowIndex === 1 && p.colIndex === 1)

      expect(topLeft).toBeDefined()
      expect(topRight).toBeDefined()
      expect(bottomLeft).toBeDefined()
      expect(bottomRight).toBeDefined()
    })

    it('should initialize all pieces as not collected', () => {
      const pieces = generatePuzzlePieces(testImageData, gridConfig, 100)

      pieces.forEach((piece) => {
        expect(piece.collected).toBe(false)
        expect(piece.placedInGrid).toBe(false)
        expect(piece.correctPosition).toBe(false)
      })
    })

    it('should assign correct piece sizes', () => {
      const pieceSize = 100
      const pieces = generatePuzzlePieces(testImageData, gridConfig, pieceSize)

      pieces.forEach((piece) => {
        expect(piece.size).toBe(pieceSize)
      })
    })

    it('should set default snapping tolerance', () => {
      const pieces = generatePuzzlePieces(testImageData, gridConfig, 100)

      pieces.forEach((piece) => {
        expect(piece.snappingTolerance).toBeGreaterThan(0)
      })
    })

    it('should calculate correct piece positions for assembly', () => {
      const pieceSize = 100
      const pieces = generatePuzzlePieces(testImageData, gridConfig, pieceSize)

      const topLeft = pieces.find((p) => p.rowIndex === 0 && p.colIndex === 0)
      const topRight = pieces.find((p) => p.rowIndex === 0 && p.colIndex === 1)

      if (topLeft) {
        expect(topLeft.correctX).toBe(0)
        expect(topLeft.correctY).toBe(0)
      }
      if (topRight) {
        expect(topRight.correctX).toBe(pieceSize)
        expect(topRight.correctY).toBe(0)
      }
    })

    it('should handle larger grid sizes', () => {
      const largeGrid = { rows: 6, cols: 6 }
      const pieces = generatePuzzlePieces(testImageData, largeGrid, 33)

      expect(pieces.length).toBe(36)
      pieces.forEach((piece) => {
        expect(piece.rowIndex).toBeGreaterThanOrEqual(0)
        expect(piece.rowIndex).toBeLessThan(6)
        expect(piece.colIndex).toBeGreaterThanOrEqual(0)
        expect(piece.colIndex).toBeLessThan(6)
      })
    })

    it('should generate pieces with valid image data', () => {
      const pieces = generatePuzzlePieces(testImageData, gridConfig, 100)

      pieces.forEach((piece) => {
        expect(piece.imageData).toBeDefined()
        expect(typeof piece.imageData).toBe('string')
        expect(piece.imageData).toContain('data:image')
      })
    })
  })
})
