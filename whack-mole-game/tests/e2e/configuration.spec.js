import { test, expect } from '@playwright/test';

test.describe('Game Configuration E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to config screen from main menu', async ({ page }) => {
    await page.click('[data-test="config-button"]');
    await expect(page.locator('.config-panel')).toBeVisible();
  });

  test('should display all config options', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    await expect(page.locator('text=Grid Rows')).toBeVisible();
    await expect(page.locator('text=Grid Columns')).toBeVisible();
    await expect(page.locator('text=Mole Frequency')).toBeVisible();
    await expect(page.locator('text=Score Threshold')).toBeVisible();
  });

  test('should apply configuration changes', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    const gridRowsSlider = page.locator('[data-test="grid-rows-slider"]');
    if (await gridRowsSlider.isVisible()) {
      await gridRowsSlider.fill('4');
      await page.click('[data-test="apply-config"]');

      await expect(page.locator('text=Configuration applied')).toBeVisible();
    }
  });

  test('should reset to default configuration', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    const gridRowsSlider = page.locator('[data-test="grid-rows-slider"]');
    if (await gridRowsSlider.isVisible()) {
      await gridRowsSlider.fill('4');
      await page.click('[data-test="reset-config"]');

      await expect(gridRowsSlider).toHaveValue('3');
    }
  });

  test('should select difficulty preset', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    const easyPreset = page.locator('[data-test="preset-easy"]');
    if (await easyPreset.isVisible()) {
      await easyPreset.click();
      await expect(page.locator('text=Easy preset applied')).toBeVisible();
    }
  });

  test('should save custom prompt', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    const promptEditor = page.locator('[data-test="prompt-editor"]');
    if (await promptEditor.isVisible()) {
      await promptEditor.fill('A cute cartoon mole');
      await page.click('[data-test="save-prompt"]');

      await expect(page.locator('text=Prompt saved')).toBeVisible();
    }
  });

  test('should validate configuration before applying', async ({ page }) => {
    await page.click('[data-test="config-button"]');

    const gridRowsSlider = page.locator('[data-test="grid-rows-slider"]');
    if (await gridRowsSlider.isVisible()) {
      await gridRowsSlider.fill('10');

      const applyButton = page.locator('[data-test="apply-config"]');
      await applyButton.click();

      await expect(page.locator('text=Invalid configuration')).toBeVisible();
    }
  });

  test('should return to main menu after applying', async ({ page }) => {
    await page.click('[data-test="config-button"]');
    await page.click('[data-test="apply-config"]');

    await expect(page.locator('.main-menu')).toBeVisible();
  });

  test('should navigate back to main menu from config', async ({ page }) => {
    await page.click('[data-test="config-button"]');
    await page.click('[data-test="back-button"]');

    await expect(page.locator('.main-menu')).toBeVisible();
  });
});
