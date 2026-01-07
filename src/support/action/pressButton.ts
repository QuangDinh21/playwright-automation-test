import type { Page } from '@playwright/test';

/**
 * Perform a key press
 * @param  {Page}           page Playwright page object
 * @param  {string | string[]} key  The key(s) to press
 */
export default async function pressButton(
    page: Page,
    key: string | string[]
): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];

    for (const k of keys) {
        await page.keyboard.press(k);
    }
}
