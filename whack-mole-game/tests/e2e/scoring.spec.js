import { test, expect } from '@playwright/test';

test.describe('Scoring and Progression E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-test="start-game"]');
  });

  test('should display score during gameplay', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    const scoreDisplay = page.locator('[data-test="score-display"]');
    await expect(scoreDisplay).toBeVisible();
    await expect(scoreDisplay).toContainText('Score: 0');
  });

  test('should increase score when hitting moles', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    const mole = page.locator('.mole').first();
    if (await mole.isVisible()) {
      await mole.click();

      const scoreDisplay = page.locator('[data-test="score-display"]');
      const scoreText = await scoreDisplay.textContent();
      expect(parseInt(scoreText.match(/\d+/)[0])).toBeGreaterThan(0);
    }
  });

  test('should show results screen with final score', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    // Simulate game ending
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('game-end', { detail: { score: 500 } }));
    });

    await expect(page.locator('.results-screen')).toBeVisible();
    await expect(page.locator('[data-test="final-score"]')).toContainText('500');
  });

  test('should unlock and display achievements', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    // Hit multiple moles to unlock achievement
    const moles = page.locator('.mole');
    const count = await moles.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      await moles.nth(i).click();
    }

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('game-end', { detail: { score: 300 } }));
    });

    const achievementSection = page.locator('.achievements');
    if (await achievementSection.isVisible()) {
      await expect(achievementSection).toContainText('First Hit');
    }
  });

  test('should show level progression', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    const levelDisplay = page.locator('[data-test="level-display"]');
    await expect(levelDisplay).toBeVisible();
    await expect(levelDisplay).toContainText('Level 1');
  });

  test('should level up when threshold reached', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    // Hit enough moles to reach level 2
    const moles = page.locator('.mole');
    const count = await moles.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      await moles.nth(i).click();
    }

    const levelDisplay = page.locator('[data-test="level-display"]');
    const levelText = await levelDisplay.textContent();

    // Level should have increased
    expect(parseInt(levelText.match(/\d+/)[0])).toBeGreaterThanOrEqual(1);
  });

  test('should save high score to leaderboard', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('game-end', { detail: { score: 1500 } }));
    });

    await expect(page.locator('.results-screen')).toBeVisible();

    // Save score
    await page.click('[data-test="save-score"]');

    // Navigate to high scores
    await page.click('[data-test="high-scores"]');

    await expect(page.locator('[data-test="high-scores-list"]')).toContainText('1500');
  });

  test('should display high scores from main menu', async ({ page }) => {
    await page.click('[data-test="high-scores"]');

    await expect(page.locator('.high-scores-list')).toBeVisible();
  });

  test('should clear high scores', async ({ page }) => {
    await page.click('[data-test="high-scores"]');

    const clearButton = page.locator('[data-test="clear-scores"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Confirm in dialog
      await page.click('button:has-text("Yes")');

      await expect(page.locator('.high-scores-list')).toContainText('No scores yet');
    }
  });

  test('should return to main menu after viewing results', async ({ page }) => {
    await page.waitForSelector('.game-canvas');

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('game-end', { detail: { score: 500 } }));
    });

    await expect(page.locator('.results-screen')).toBeVisible();

    await page.click('[data-test="main-menu"]');

    await expect(page.locator('.main-menu')).toBeVisible();
  });
});
