import type { BrowserContext, Page, Locator } from '@playwright/test';
import { focusWindowByUrl } from './focusWindowByUrl';

/**
 * Focus on a window by URL, title, or element
 * @param  {BrowserContext} context  Playwright browser context
 * @param  {Page}           page     Playwright page object (for element-based focus)
 * @param  {'url' | 'title' | 'element'} type     Type of search (url, title, or element)
 * @param  {string | Locator} value    The value to search for (string for url/title, Locator for element)
 */
export default async function focusWindow(
  context: BrowserContext,
  page: Page,
  type: 'url' | 'title' | 'element',
  value: string | Locator
): Promise<Page> {
  if (type === 'url') {
    return await focusWindowByUrl(context, value as string);
  } else if (type === 'title') {
    // Find page by title
    const pages = context.pages();
    for (const p of pages) {
      const title = await p.title();
      if (title.includes(value as string)) {
        await p.bringToFront();
        return p;
      }
    }
    throw new Error(`Window with title including "${value}" not found`);
  } else {
    // For element-based focus, we'll focus on the current page
    // and wait for the element to be visible
    const locator = value as Locator;
    await locator.waitFor({ state: 'visible' });
    await page.bringToFront();
    return page;
  }
}

