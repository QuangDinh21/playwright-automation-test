import type { BrowserContext } from '@playwright/test';

/**
 * Close the last opened window
 * @param  {never}          obsolete Type of object to close (window or tab) - obsolete
 * @param  {BrowserContext} context  Playwright browser context
 */
export default async function closeLastOpenedWindow(
    obsolete: never,
    context: BrowserContext
): Promise<void> {
    /**
     * All pages in the context
     */
    const pages = context.pages().filter(p => !p.isClosed());

    if (pages.length === 0) {
        return;
    }
    if (pages.length === 1) {
        return;
    }

    /**
     * The current page (first page)
     */
    const currentPage = pages[0];

    /**
     * The last opened page
     */
    const lastPage = pages[pages.length - 1];

    if (currentPage === lastPage) {
        // If last page is the current page, close it and focus on the previous one
        const previousPage = pages[pages.length - 2];
        await lastPage.close();
        if (previousPage && !previousPage.isClosed()) {
            await previousPage.bringToFront();
        }
    } else {
        await lastPage.close();
        // Focus back to the current page
        await currentPage.bringToFront();
    }
}
