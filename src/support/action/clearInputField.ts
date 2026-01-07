import type { Locator } from '@playwright/test';

/**
 * Clear a given input field
 * @param  {Locator}  locator Playwright locator for the element
 */
export default async function clearInputField(locator: Locator): Promise<void> {
    await locator.clear();
}
