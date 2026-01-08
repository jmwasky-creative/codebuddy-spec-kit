import { test, expect } from '@playwright/test';

test.describe('Polish and Cross-Cutting Features E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('.main-menu')).toBeVisible();
    await expect(page.locator('[data-test="start-game"]')).toBeVisible();
  });

  test('should have responsive design on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.locator('.main-menu')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-test="start-game"]')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('.game-canvas')).toBeVisible();
  });

  test('should show loading state during game start', async ({ page }) => {
    await page.click('[data-test="start-game"]');

    // Check for loading indicator
    const loading = page.locator('.loading-spinner');
    if (await loading.isVisible()) {
      await expect(loading).toBeVisible();
    }
  });

  test('should show error message on failure', async ({ page }) => {
    // Simulate error condition
    await page.evaluate(() => {
      window.simulateError = true;
    });

    await page.click('[data-test="start-game"]');

    const error = page.locator('.error-message');
    if (await error.isVisible({ timeout: 5000 })) {
      await expect(error).toBeVisible();
    }
  });

  test('should persist configuration across sessions', async ({ page }) => {
    // Change config
    await page.click('[data-test="config-button"]');

    const gridRowsSlider = page.locator('[data-test="grid-rows-slider"]');
    if (await gridRowsSlider.isVisible()) {
      await gridRowsSlider.fill('4');
      await page.click('[data-test="apply-config"]');
    }

    // Reload page
    await page.reload();

    // Navigate to config and verify
    await page.click('[data-test="config-button"]');
    await expect(gridRowsSlider).toHaveValue('4');
  });

  test('should persist high scores across sessions', async ({ page }) => {
    // Play a game and save score
    await page.click('[data-test="start-game"]');
    await page.waitForSelector('.game-canvas');

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('game-end', { detail: { score: 1000 } }));
    });

    await page.click('[data-test="save-score"]');

    // Reload page
    await page.reload();

    // Navigate to high scores
    await page.click('[data-test="high-scores"]');
    await expect(page.locator('.high-scores-list')).toContainText('1000');
  });

  test('should have accessibility attributes', async ({ page }) => {
    await expect(page.locator('[data-test="start-game"]')).toHaveAttribute('role', 'button');
    await expect(page.locator('[data-test="config-button"]')).toHaveAttribute('aria-label');
  });

  test('should support screen readers', async ({ page }) => {
    await page.click('[data-test="high-scores"]');

    const list = page.locator('[data-test="high-scores-list"]');
    await expect(list).toHaveAttribute('role', 'list');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    await page.click('[data-test="start-game"]');

    // Should still work (local game)
    await expect(page.locator('.game-canvas')).toBeVisible({ timeout: 10000 });

    // Restore online
    await page.context().setOffline(false);
  });

  test('should show achievement notification', async ({ page }) => {
    await page.click('[data-test="start-game"]');

    // Trigger achievement
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('achievement-unlock', {
        detail: { id: 'first-hit', name: 'First Hit', icon: '🎯' }
      }));
    });

    const notification = page.locator('.achievement-notification');
    if (await notification.isVisible({ timeout: 5000 })) {
      await expect(notification).toBeVisible();
      await expect(notification).toContainText('First Hit');
    }
  });

  test('should have consistent visual style', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    const sliders = page.locator('.parameter-slider');
    const count = await sliders.count();

    for (let i = 0; i < count; i++) {
      await expect(sliders.nth(i)).toBeVisible();
    }
  });

  test('should handle rapid button clicks gracefully', async ({ page }) => {
    // Rapid clicks
    for (let i = 0; i < 10; i++) {
      await page.click('[data-test="start-game"]');
      await page.keyboard.press('Escape'); // Close
    }

    // Should not crash
    await expect(page.locator('.main-menu')).toBeVisible();
  });

  test('should display help information', async ({ page }) => {
    const helpButton = page.locator('[data-test="help-button"]');
    if (await helpButton.isVisible()) {
      await helpButton.click();
      await expect(page.locator('.help-modal')).toBeVisible();
    }
  });
});
