import type { Locator } from '@playwright/test';
import checkIfElementExists from '../lib/checkIfElementExists.js';

/**
 * Set the value of the given input field to a new value or add a value to the
 * current selector value
 * @param  {string}   method  The method to use (add or set)
 * @param  {string}   value   The value to set the selector to
 * @param  {Locator}  locator Playwright locator for the element
 */
export default async function setInputField(
    method: string,
    value: string,
    locator: Locator
): Promise<void> {
    let checkValue = value;

    await checkIfElementExists(locator, false, 1);

    if (!value) {
        checkValue = '';
    }

    if (method === 'add') {
        // Append to existing value
        const currentValue = await locator.inputValue();
        await locator.fill(currentValue + checkValue);
    } else {
        // Set new value (replace existing)
        await locator.fill(checkValue);
    }
}
