import type { Page } from '@playwright/test';

/**
 * Refresh the current page
 * @param  {Page}  page Playwright page object
 */
export default async function refreshPage(page: Page): Promise<void> {
  await page.reload();
}

