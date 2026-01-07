import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Check if the given element exists in the DOM one or more times
 * @param  {Locator}   locator   Playwright locator for the element
 * @param  {boolean}   falseCase Check if the element (does not) exists
 * @param  {number}    exactly   Check if the element exists exactly this number
 *                               of times
 */
export default async function checkIfElementExists(
    locator: Locator,
    falseCase?: boolean,
    exactly?: string | number
): Promise<void> {
    /**
     * The number of elements found in the DOM
     * @type {number}
     */
    const nrOfElements = await locator.count();

    if (falseCase === true) {
        expect(nrOfElements, `Element should not exist on the page`).toBe(0);
    } else if (exactly) {
        expect(nrOfElements, `Element should exist exactly ${exactly} time(s)`).toBe(+exactly);
    } else {
        expect(nrOfElements, `Element should exist on the page`).toBeGreaterThanOrEqual(1);
    }
}
