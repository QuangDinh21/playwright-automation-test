import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Check if the given element exists in the current DOM
 * @param  {Locator}  locator   Playwright locator for the element
 * @param  {boolean}  falseCase Whether to check if the element exists or not
 */
export default async function isExisting(
    locator: Locator,
    falseCase: boolean
): Promise<void> {
    /**
     * Count of elements found in the DOM
     * @type {number}
     */
    const count = await locator.count();

    if (falseCase) {
        expect(count, `Expected element not to exist`).toBe(0);
    } else {
        expect(count, `Expected element to exist`).toBeGreaterThan(0);
    }
}
