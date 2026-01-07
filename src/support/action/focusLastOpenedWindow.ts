import type { BrowserContext } from '@playwright/test';

/**
 * Focus the last opened window
 * @param  {never}          obsolete Type of object to focus to (window or tab) - obsolete
 * @param  {BrowserContext} context  Playwright browser context
 */
export default async function focusLastOpenedWindow(
    obsolete: never,
    context: BrowserContext
): Promise<void> {
    /**
     * All pages in the context
     */
    const pages = context.pages();

    if (pages.length === 0) {
        throw new Error('No pages available');
    }

    /**
     * The last opened page
     */
    const lastPage = pages[pages.length - 1];

    await lastPage.bringToFront();
}
