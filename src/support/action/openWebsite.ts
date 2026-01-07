import type { Page, BrowserContext } from '@playwright/test';

/**
 * Open the given URL
 * @param  {Page}     page        Playwright page object
 * @param  {'url' | 'site'} type  Type of navigation (url or site)
 * @param  {string}    url         The URL to navigate to (or path if type is 'site')
 * @param  {string}    baseUrl     Base URL for site type (optional)
 */
export default async function openWebsite(
    page: Page,
    type: 'url' | 'site',
    url: string,
    baseUrl?: string
): Promise<void> {
    /**
     * The URL to navigate to
     * @type {string}
     */
    const finalUrl = type === 'url' ? url : (baseUrl || '') + url;

    // Check if page is closed, get a new one from context if needed
    let currentPage = page;
    if (currentPage.isClosed()) {
      const context = (page as any).context() as BrowserContext;
      const openPages = context.pages().filter(p => !p.isClosed());
      if (openPages.length > 0) {
        currentPage = openPages[0];
      } else {
        // Wait for a new page to be created
        currentPage = await context.waitForEvent('page', { timeout: 5000 });
      }
    }

    await currentPage.goto(finalUrl);
}
