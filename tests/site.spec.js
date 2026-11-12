const { test, expect } = require('@playwright/test');
const pages = ['index.html', 'projects.html', 'about.html', 'notes.html'];

for (const p of pages) {
  for (const scheme of ['light', 'dark']) {
    test(`${p} (${scheme}) has no sideways overflow and looks right`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/' + p);
        await page.waitForLoadState('networkidle');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${p} overflows at ${width}px`).toBeLessThanOrEqual(1);
        await page.screenshot({ path: `test-results/${p}-${scheme}-${width}.png`, fullPage: true });
      }
    });
  }
}

test('a project letter opens and closes', async ({ page }) => {
  await page.goto('/projects.html');
  await page.locator('.env').first().click();
  await expect(page.locator('.letter-wrap.open')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.letter-wrap.open')).toHaveCount(0);
});
