import type { BrowserContext } from '@playwright/test';

/**
 * Go back to the previous page in browser history
 * @param  {BrowserContext} context  Playwright browser context
 * @param  {number}         pageIndex Index of the page to go back to (default: 0, which is the first page)
 */
export default async function backToPage(
  context: BrowserContext,
  pageIndex: number = 0
): Promise<void> {
  const pages = context.pages();
  if (pages.length === 0) {
    throw new Error('No pages available');
  }

  // Focus on the specified page (default to first page)
  const targetPage = pages[pageIndex] || pages[0];
  await targetPage.bringToFront();

  // Go back in browser history
  await targetPage.goBack();
}

