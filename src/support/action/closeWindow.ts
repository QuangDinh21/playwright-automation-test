import type { BrowserContext, Page, Locator } from '@playwright/test';
import { focusWindowByUrl } from './focusWindowByUrl';

/**
 * Close a window by URL, title, or element
 * @param  {BrowserContext} context  Playwright browser context
 * @param  {Page}           page     Playwright page object (for element-based focus)
 * @param  {'url' | 'title' | 'element'} type     Type of search (url, title, or element)
 * @param  {string | Locator} value    The value to search for (string for url/title, Locator for element)
 */
export default async function closeWindow(
  context: BrowserContext,
  page: Page,
  type: 'url' | 'title' | 'element',
  value: string | Locator
): Promise<void> {
  let targetPage: Page;

  if (type === 'url') {
    targetPage = await focusWindowByUrl(context, value as string);
  } else if (type === 'title') {
    // Find page by title
    const pages = context.pages();
    for (const p of pages) {
      const title = await p.title();
      if (title.includes(value as string)) {
        targetPage = p;
        break;
      }
    }
    if (!targetPage!) {
      throw new Error(`Window with title including "${value}" not found`);
    }
  } else {
    // For element-based focus, wait for element to be visible, then use current page
    const locator = value as Locator;
    await locator.waitFor({ state: 'visible' });
    targetPage = page;
  }

  await targetPage.close();

  // Bring the last remaining page to front
  const openPages = context.pages().filter(p => !p.isClosed());
  if (openPages.length > 0) {
    await openPages[openPages.length - 1].bringToFront();
  }
}

