/**
 * Component tests for PuzzlePiece.vue
 * Testing drag and drop functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PuzzlePiece from '@/components/game/PuzzlePiece.vue'

describe('PuzzlePiece.vue', () => {
  let wrapper
  let mockPiece

  beforeEach(() => {
    mockPiece = {
      id: 'piece-1',
      sessionId: 1,
      rowIndex: 0,
      colIndex: 0,
      imageData: createPlaceholderImage(100, 100, '#4CAF50'),
      collected: true,
      placedInGrid: false,
      correctPosition: false,
      dropX: 0,
      dropY: 0,
      snappingTolerance: 30,
      size: 100,
      correctX: 0,
      correctY: 0
    }
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Rendering', () => {
    it('should render puzzle piece element', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      expect(wrapper.find('.puzzle-piece').exists()).toBe(true)
    })

    it('should display piece image', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(mockPiece.imageData)
    })

    it('should set correct dimensions', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      expect(piece.attributes('style')).toContain('width: 100px')
      expect(piece.attributes('style')).toContain('height: 100px')
    })

    it('should show draggable attribute', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      expect(piece.attributes('draggable')).toBe('true')
    })

    it('should not render if piece is not collected', () => {
      mockPiece.collected = false
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      expect(piece.exists()).toBe(false)
    })
  })

  describe('Drag Events', () => {
    it('should handle drag start', async () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      await piece.trigger('dragstart', {
        dataTransfer: {
          setData: vi.fn()
        }
      })

      expect(wrapper.vm.isDragging).toBe(true)
    })

    it('should set piece ID in data transfer during drag', async () => {
      const setData = vi.fn()
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      await piece.trigger('dragstart', {
        dataTransfer: { setData }
      })

      expect(setData).toHaveBeenCalledWith('text/plain', mockPiece.id)
    })

    it('should handle drag end', async () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      await piece.trigger('dragend')

      expect(wrapper.vm.isDragging).toBe(false)
    })
  })

  describe('Drop Events', () => {
    it('should emit drop event when piece is dropped', async () => {
      const onDrop = vi.fn()
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop,
          onSnap: vi.fn()
        }
      })

      await wrapper.vm.handleDrop({ x: 100, y: 100 })

      expect(onDrop).toHaveBeenCalledWith(mockPiece.id, { x: 100, y: 100 })
    })

    it('should update piece position on drop', async () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      await wrapper.vm.handleDrop({ x: 100, y: 200 })

      expect(wrapper.vm.dropX).toBe(100)
      expect(wrapper.vm.dropY).toBe(200)
    })
  })

  describe('Snapping Logic', () => {
    it('should detect when piece is within snapping tolerance', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, correctX: 100, correctY: 100 },
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const isNear = wrapper.vm.checkSnapPosition({ x: 115, y: 115 })
      expect(isNear).toBe(true)
    })

    it('should detect when piece is outside snapping tolerance', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, correctX: 100, correctY: 100 },
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const isNear = wrapper.vm.checkSnapPosition({ x: 200, y: 200 })
      expect(isNear).toBe(false)
    })

    it('should snap to correct position when within tolerance', async () => {
      const onSnap = vi.fn()
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, correctX: 100, correctY: 100 },
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap
        }
      })

      await wrapper.vm.handleDrop({ x: 115, y: 115 })

      expect(onSnap).toHaveBeenCalledWith(mockPiece.id, true)
    })

    it('should not snap when outside tolerance', async () => {
      const onSnap = vi.fn()
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, correctX: 100, correctY: 100 },
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap
        }
      })

      await wrapper.vm.handleDrop({ x: 200, y: 200 })

      expect(onSnap).toHaveBeenCalledWith(mockPiece.id, false)
    })

    it('should handle zero tolerance', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, correctX: 100, correctY: 100 },
          size: 100,
          snappingTolerance: 0,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const isNear = wrapper.vm.checkSnapPosition({ x: 100, y: 100 })
      expect(isNear).toBe(true)
    })
  })

  describe('Visual States', () => {
    it('should show dragging class when isDragging is true', async () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: mockPiece,
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      wrapper.vm.isDragging = true
      await wrapper.vm.$nextTick()

      const piece = wrapper.find('.puzzle-piece')
      expect(piece.classes()).toContain('dragging')
    })

    it('should show placed class when piece is placed', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, placedInGrid: true },
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      expect(piece.classes()).toContain('placed')
    })

    it('should show correct class when piece is in correct position', () => {
      wrapper = mount(PuzzlePiece, {
        props: {
          piece: { ...mockPiece, correctPosition: true },
          size: 100,
          snappingTolerance: 30,
          onDrop: vi.fn(),
          onSnap: vi.fn()
        }
      })

      const piece = wrapper.find('.puzzle-piece')
      expect(piece.classes()).toContain('correct')
    })
  })
})

/**
 * Helper function to create placeholder image for testing
 */
function createPlaceholderImage(width, height, color) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  return canvas.toDataURL('image/png')
}
