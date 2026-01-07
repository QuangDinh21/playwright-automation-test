import type { Page, BrowserContext } from '@playwright/test';

/**
 * Pause execution for a given number of milliseconds
 * @param  {Page|BrowserContext}  pageOrContext Playwright page object or browser context
 * @param  {string}               ms            Number of milliseconds to pause
 */
export default async function pause(
    pageOrContext: Page | BrowserContext,
    ms: string
): Promise<void> {
    /**
     * Number of milliseconds
     * @type {number}
     */
    const intMs = parseInt(ms, 10);

    // If it's a BrowserContext, use setTimeout instead
    if ('pages' in pageOrContext) {
        await new Promise(resolve => setTimeout(resolve, intMs));
        return;
    }

    // Check if page is closed before using it
    try {
        if (pageOrContext.isClosed()) {
            // Page is closed, use setTimeout instead
            await new Promise(resolve => setTimeout(resolve, intMs));
            return;
        }
    } catch {
        // If checking isClosed() throws, the page is likely closed
        await new Promise(resolve => setTimeout(resolve, intMs));
        return;
    }

    await pageOrContext.waitForTimeout(intMs);
}
