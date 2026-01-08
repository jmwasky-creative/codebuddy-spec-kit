/**
 * Component tests for GameCanvas.vue
 * Testing game loop and mole rendering
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameCanvas from '@/components/game/GameCanvas.vue'

describe('GameCanvas.vue', () => {
  let wrapper
  let mockConfig

  beforeEach(() => {
    mockConfig = {
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
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Rendering', () => {
    it('should render canvas element', () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const canvas = wrapper.find('canvas')
      expect(canvas.exists()).toBe(true)
    })

    it('should set canvas dimensions from config', () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const canvas = wrapper.find('canvas')
      expect(canvas.attributes('width')).toBe('800')
      expect(canvas.attributes('height')).toBe('600')
    })

    it('should render score display', () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      expect(wrapper.find('.score-display').exists()).toBe(true)
    })

    it('should render timer display', () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      expect(wrapper.find('.timer-display').exists()).toBe(true)
    })
  })

  describe('Game Loop', () => {
    it('should start game when startGame method is called', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()

      expect(vm.isGameRunning).toBe(true)
    })

    it('should pause game when pauseGame method is called', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await vm.pauseGame()

      expect(vm.isGameRunning).toBe(false)
    })

    it('should resume game when resumeGame method is called', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await vm.pauseGame()
      await vm.resumeGame()

      expect(vm.isGameRunning).toBe(true)
    })

    it('should stop game when endGame method is called', async () => {
      const onGameEnd = vi.fn()
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await vm.endGame()

      expect(vm.isGameRunning).toBe(false)
      expect(onGameEnd).toHaveBeenCalled()
    })
  })

  describe('Mole Rendering', () => {
    it('should render moles when game is running', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Wait for first mole spawn

      expect(vm.moles.length).toBeGreaterThan(0)
    })

    it('should remove mole when hit', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await new Promise((resolve) => setTimeout(resolve, 1100))

      const initialMoleCount = vm.moles.length
      if (initialMoleCount > 0) {
        await vm.handleMoleHit(vm.moles[0].id)
        expect(vm.moles.length).toBeLessThan(initialMoleCount)
      }
    })

    it('should emit mole-hit event when mole is clicked', async () => {
      const onGameEnd = vi.fn()
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await new Promise((resolve) => setTimeout(resolve, 1100))

      if (vm.moles.length > 0) {
        await vm.handleMoleHit(vm.moles[0].id)
        expect(wrapper.emitted('mole-hit')).toBeDefined()
      }
    })
  })

  describe('Score Tracking', () => {
    it('should initialize score at 0', () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      expect(wrapper.vm.score).toBe(0)
    })

    it('should increase score when mole is hit', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      const initialScore = vm.score
      await new Promise((resolve) => setTimeout(resolve, 1100))

      if (vm.moles.length > 0) {
        await vm.handleMoleHit(vm.moles[0].id)
        expect(vm.score).toBeGreaterThan(initialScore)
      }
    })

    it('should emit score-change event when score updates', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await new Promise((resolve) => setTimeout(resolve, 1100))

      if (vm.moles.length > 0) {
        await vm.handleMoleHit(vm.moles[0].id)
        expect(wrapper.emitted('score-change')).toBeDefined()
      }
    })
  })

  describe('Timer', () => {
    it('should display remaining time', () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      expect(wrapper.vm.timeRemaining).toBe(60)
    })

    it('should decrease timer as game progresses', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      const initialTime = vm.timeRemaining
      await vm.startGame()
      await new Promise((resolve) => setTimeout(resolve, 2000))

      expect(vm.timeRemaining).toBeLessThan(initialTime)
    })

    it('should end game when timer reaches zero', async () => {
      const onGameEnd = vi.fn()
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: { ...mockConfig, gameDuration: 1 },
          onGameEnd
        }
      })

      const vm = wrapper.vm
      await vm.startGame()
      await new Promise((resolve) => setTimeout(resolve, 1500))

      expect(onGameEnd).toHaveBeenCalled()
    })
  })

  describe('Game Session', () => {
    it('should return game session data', async () => {
      wrapper = mount(GameCanvas, {
        props: {
          gameConfig: mockConfig,
          onGameEnd: vi.fn()
        }
      })

      const vm = wrapper.vm
      const session = vm.getGameSession()

      expect(session).toBeDefined()
      expect(session.score).toBe(0)
      expect(session.hits).toBe(0)
      expect(session.misses).toBe(0)
    })
  })
})
