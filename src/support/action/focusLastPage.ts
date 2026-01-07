import type { BrowserContext, Page } from '@playwright/test';

/**
 * Helper function to focus the last page in the browser context
 * @param context - The browser context
 * @param fallbackPage - Optional fallback page to use if no pages exist
 * @returns The last page in the context, or waits for a new page
 */
export async function focusLastPage(context: BrowserContext, fallbackPage?: Page): Promise<Page> {
  const pages = context.pages();
  if (pages.length === 0) {
    // If no pages exist, wait for a new page to be created or use fallback
    if (fallbackPage) {
      await fallbackPage.bringToFront();
      return fallbackPage;
    }
    // Wait for a new page to be created (e.g., when opening extension popup)
    const newPage = await context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
    if (newPage) {
      await newPage.bringToFront();
      return newPage;
    }
    throw new Error('No pages in context and no new page was created');
  }
  const lastPage = pages[pages.length - 1];
  await lastPage.bringToFront();
  return lastPage;
}

