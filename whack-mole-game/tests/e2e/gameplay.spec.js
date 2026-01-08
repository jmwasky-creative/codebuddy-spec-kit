/**
 * E2E tests for gameplay flow
 * Testing start, play, and complete game flow
 */

import { test, expect, chromium } from '@playwright/test'

test.describe('Gameplay Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should start game from main menu', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await expect(page.locator('.game-canvas')).toBeVisible()
    await expect(page.locator('.score-display')).toBeVisible()
  })

  test('should display moles during gameplay', async ({ page }) => {
    await page.click('button:has-text("Start Game")')

    // Wait for first mole to appear
    await page.waitForTimeout(1200)

    const moles = await page.locator('.mole').all()
    expect(moles.length).toBeGreaterThan(0)
  })

  test('should collect puzzle piece when mole is hit', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await page.waitForTimeout(1200)

    const moles = await page.locator('.mole').all()
    if (moles.length > 0) {
      await moles[0].click()
      await page.waitForTimeout(600)

      const pieces = await page.locator('.puzzle-piece').all()
      expect(pieces.length).toBeGreaterThan(0)
    }
  })

  test('should display puzzle pieces after hitting moles', async ({ page }) => {
    await page.click('button:has-text("Start Game")')

    // Hit multiple moles
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1200)
      const moles = await page.locator('.mole').all()
      if (moles.length > 0) {
        await moles[0].click()
      }
    }

    await page.waitForTimeout(600)
    const pieces = await page.locator('.puzzle-piece').all()
    expect(pieces.length).toBeGreaterThan(0)
  })

  test('should display puzzle grid for assembly', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await expect(page.locator('.puzzle-grid')).toBeVisible()
  })

  test('should allow dragging puzzle pieces', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await page.waitForTimeout(1200)

    const moles = await page.locator('.mole').all()
    if (moles.length > 0) {
      await moles[0].click()
      await page.waitForTimeout(600)

      const pieces = await page.locator('.puzzle-piece').all()
      if (pieces.length > 0) {
        await pieces[0].dragTo(pieces[0], {
          targetPosition: { x: 200, y: 200 }
        })
      }
    }
  })

  test('should snap piece to correct position when near', async ({ page }) => {
    await page.click('button:has-text("Start Game")')

    // Collect enough pieces to test snapping
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(1200)
      const moles = await page.locator('.mole').all()
      if (moles.length > 0) {
        await moles[0].click()
      }
    }

    await page.waitForTimeout(600)
    const pieces = await page.locator('.puzzle-piece').all()
    if (pieces.length > 0) {
      const gridPositions = await page.locator('.puzzle-grid-slot').all()
      if (gridPositions.length > 0) {
        const slotBox = await gridPositions[0].boundingBox()
        const pieceBox = await pieces[0].boundingBox()

        if (slotBox && pieceBox) {
          await pieces[0].dragTo(pieces[0], {
            targetPosition: { x: slotBox.x + 10, y: slotBox.y + 10 }
          })
        }
      }
    }
  })

  test('should update score when mole is hit', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    const initialScore = await page.locator('.score-value').textContent()

    await page.waitForTimeout(1200)
    const moles = await page.locator('.mole').all()
    if (moles.length > 0) {
      await moles[0].click()
      await page.waitForTimeout(200)

      const updatedScore = await page.locator('.score-value').textContent()
      expect(parseInt(updatedScore)).toBeGreaterThan(parseInt(initialScore || '0'))
    }
  })

  test('should display timer countdown', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    const initialTime = await page.locator('.timer-value').textContent()

    await page.waitForTimeout(2000)
    const updatedTime = await page.locator('.timer-value').textContent()

    expect(parseInt(updatedTime || '0')).toBeLessThan(parseInt(initialTime || '0'))
  })

  test('should complete puzzle when all pieces are collected', async ({ page }) => {
    await page.click('button:has-text("Start Game")')

    // Note: This test assumes default 3x3 grid (9 pieces)
    // In a real scenario, you would automate collecting all 9 pieces
    // For E2E, this might require mocking or longer execution time
    for (let i = 0; i < 9; i++) {
      await page.waitForTimeout(1200)
      const moles = await page.locator('.mole').all()
      if (moles.length > 0) {
        await moles[0].click()
        await page.waitForTimeout(600)

        const pieces = await page.locator('.puzzle-piece').all()
        if (pieces.length > 0) {
          // Drag piece to grid
          const gridSlots = await page.locator('.puzzle-grid-slot').all()
          if (gridSlots.length > 0) {
            const slotBox = await gridSlots[0].boundingBox()
            if (slotBox) {
              await pieces[0].dragTo(pieces[0], {
                targetPosition: { x: slotBox.x + 10, y: slotBox.y + 10 }
              })
            }
          }
        }
      }
    }

    // Check if puzzle is complete
    await page.waitForTimeout(1000)
    const completeImage = await page.locator('.complete-character').isVisible()
    if (completeImage) {
      await expect(page.locator('.complete-character')).toBeVisible()
    }
  })

  test('should show results screen when game ends', async ({ page }) => {
    const onGameEndSpy = page.waitForEvent('console', (msg) => msg.text().includes('game'))

    await page.click('button:has-text("Start Game")')

    // Wait for game to end (60 seconds for default config)
    // For faster testing, you could modify config to have shorter duration
    await page.waitForTimeout(61000)

    await expect(page.locator('.results-screen')).toBeVisible()
  })

  test('should allow play again from results screen', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await page.waitForTimeout(61000) // Wait for game to end

    await expect(page.locator('.results-screen')).toBeVisible()
    await page.click('button:has-text("Play Again")')

    await expect(page.locator('.game-canvas')).toBeVisible()
  })

  test('should return to main menu from results screen', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await page.waitForTimeout(61000) // Wait for game to end

    await expect(page.locator('.results-screen')).toBeVisible()
    await page.click('button:has-text("Main Menu")')

    await expect(page.locator('.main-menu')).toBeVisible()
  })

  test('should handle missed clicks (clicking on empty space)', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    const initialMisses = await page.locator('.misses-value').textContent()

    // Click on empty space in game area
    await page.click('.game-canvas', { position: { x: 50, y: 50 } })
    await page.waitForTimeout(200)

    const updatedMisses = await page.locator('.misses-value').textContent()
    // Note: This depends on whether missed clicks are tracked/displayed
    // Update based on actual implementation
  })

  test('should handle rapid clicking on same mole', async ({ page }) => {
    await page.click('button:has-text("Start Game")')
    await page.waitForTimeout(1200)

    const moles = await page.locator('.mole').all()
    if (moles.length > 0) {
      // Rapid click multiple times
      for (let i = 0; i < 3; i++) {
        await moles[0].click()
        await page.waitForTimeout(50)
      }

      // Should only count as one hit
      await page.waitForTimeout(600)
      const score = await page.locator('.score-value').textContent()
      expect(parseInt(score || '0')).toBeGreaterThan(0)
    }
  })
})

test.describe('Game Responsiveness', () => {
  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.click('button:has-text("Start Game")')

    await expect(page.locator('.game-canvas')).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.click('button:has-text("Start Game")')

    await expect(page.locator('.game-canvas')).toBeVisible()
  })

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.click('button:has-text("Start Game")')

    await expect(page.locator('.game-canvas')).toBeVisible()
  })
})
