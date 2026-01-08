/**
 * Unit tests for gameLogic.js
 * Testing mole spawning algorithm and collision detection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { moleSpawning, checkCollision, generateMolePosition } from '../gameLogic.js'

describe('gameLogic.js', () => {
  let gameArea

  beforeEach(() => {
    gameArea = { width: 800, height: 600 }
  })

  describe('generateMolePosition', () => {
    it('should generate a position within game area bounds', () => {
      const moleSize = 80
      const position = generateMolePosition(gameArea, moleSize)

      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThanOrEqual(gameArea.width - moleSize)
      expect(position.y).toBeLessThanOrEqual(gameArea.height - moleSize)
    })

    it('should generate different positions on multiple calls', () => {
      const moleSize = 80
      const positions = Array.from({ length: 10 }, () => generateMolePosition(gameArea, moleSize))

      const uniquePositions = new Set(positions.map((p) => `${p.x},${p.y}`))
      expect(uniquePositions.size).toBeGreaterThan(1)
    })

    it('should handle minimum mole size', () => {
      const moleSize = 40
      const position = generateMolePosition(gameArea, moleSize)

      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeGreaterThanOrEqual(0)
    })

    it('should handle maximum mole size', () => {
      const moleSize = 120
      const position = generateMolePosition(gameArea, moleSize)

      expect(position.x).toBeLessThanOrEqual(gameArea.width - moleSize)
      expect(position.y).toBeLessThanOrEqual(gameArea.height - moleSize)
    })
  })

  describe('checkCollision', () => {
    it('should detect collision when point is inside rectangle', () => {
      const rect = { x: 100, y: 100, width: 80, height: 80 }
      const point = { x: 140, y: 140 }

      expect(checkCollision(point, rect)).toBe(true)
    })

    it('should detect collision when point is on rectangle edge', () => {
      const rect = { x: 100, y: 100, width: 80, height: 80 }
      const point = { x: 100, y: 100 }

      expect(checkCollision(point, rect)).toBe(true)
    })

    it('should not detect collision when point is outside rectangle', () => {
      const rect = { x: 100, y: 100, width: 80, height: 80 }
      const point = { x: 50, y: 50 }

      expect(checkCollision(point, rect)).toBe(false)
    })

    it('should not detect collision when point is far from rectangle', () => {
      const rect = { x: 100, y: 100, width: 80, height: 80 }
      const point = { x: 1000, y: 1000 }

      expect(checkCollision(point, rect)).toBe(false)
    })
  })

  describe('moleSpawning', () => {
    it('should spawn a mole at a valid position', () => {
      const config = {
        visualSettings: { moleSize: 80 }
      }
      const moles = []
      const mole = moleSpawning(gameArea, config, moles)

      expect(mole).toBeDefined()
      expect(mole.x).toBeGreaterThanOrEqual(0)
      expect(mole.y).toBeGreaterThanOrEqual(0)
      expect(mole.id).toBeDefined()
      expect(mole.hit).toBe(false)
    })

    it('should avoid collision with existing moles', () => {
      const config = {
        visualSettings: { moleSize: 80 }
      }
      const existingMole = {
        id: 'mole-1',
        x: 100,
        y: 100,
        hit: false,
        size: 80
      }
      const newMole = moleSpawning(gameArea, config, [existingMole])

      const distance = Math.sqrt(
        Math.pow(newMole.x - existingMole.x, 2) + Math.pow(newMole.y - existingMole.y, 2)
      )
      expect(distance).toBeGreaterThan(config.visualSettings.moleSize)
    })

    it('should handle multiple existing moles', () => {
      const config = {
        visualSettings: { moleSize: 80 }
      }
      const existingMoles = [
        { id: 'mole-1', x: 100, y: 100, hit: false, size: 80 },
        { id: 'mole-2', x: 300, y: 200, hit: false, size: 80 },
        { id: 'mole-3', x: 500, y: 400, hit: false, size: 80 }
      ]
      const newMole = moleSpawning(gameArea, config, existingMoles)

      for (const mole of existingMoles) {
        const distance = Math.sqrt(
          Math.pow(newMole.x - mole.x, 2) + Math.pow(newMole.y - mole.y, 2)
        )
        expect(distance).toBeGreaterThan(config.visualSettings.moleSize)
      }
    })

    it('should handle case where game area is full', () => {
      const config = {
        visualSettings: { moleSize: 200 }
      }
      const existingMoles = [
        { id: 'mole-1', x: 0, y: 0, hit: false, size: 200 },
        { id: 'mole-2', x: 600, y: 0, hit: false, size: 200 },
        { id: 'mole-3', x: 0, y: 400, hit: false, size: 200 },
        { id: 'mole-4', x: 600, y: 400, hit: false, size: 200 }
      ]
      const newMole = moleSpawning(gameArea, config, existingMoles)

      // Should still return a mole even if space is limited
      expect(newMole).toBeDefined()
    })

    it('should assign unique IDs to moles', () => {
      const config = {
        visualSettings: { moleSize: 80 }
      }
      const moles = []
      const mole1 = moleSpawning(gameArea, config, moles)
      const mole2 = moleSpawning(gameArea, config, moles)

      expect(mole1.id).not.toBe(mole2.id)
    })
  })
})
