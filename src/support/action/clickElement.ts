import type { Locator } from '@playwright/test';
import checkIfElementExists from '../lib/checkIfElementExists.js';

/**
 * Perform a click action on the given element
 * @param  {'click' | 'doubleClick'} action   The action to perform (click or doubleClick)
 * @param  {Locator}                  locator  Playwright locator for the element
 */
export default async function clickElement(
    action: 'click' | 'doubleClick',
    locator: Locator
): Promise<void> {
    // For link type, we can use getByRole or getByText, but since we already have a locator,
    // we'll just use it directly. The type parameter is kept for compatibility.

    await checkIfElementExists(locator);

    if (action === 'click') {
        await locator.click();
    } else {
        await locator.dblclick();
    }
}
