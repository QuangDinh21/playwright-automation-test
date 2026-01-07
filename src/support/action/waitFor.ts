import type { Locator } from '@playwright/test';

/**
 * Wait for the given element to be enabled, displayed, or to exist
 * @param  {Locator}  locator     Playwright locator for the element
 * @param  {string}   ms          Wait duration (optional)
 * @param  {boolean}  falseState  Check for opposite state
 * @param  {string}   state       State to check for (default existence)
 */
export default async function waitFor(
    locator: Locator,
    ms: string,
    falseState: boolean,
    state: string
): Promise<void> {
    /**
     * Maximum number of milliseconds to wait, default 3000
     * @type {number}
     */
    const intMs = parseInt(ms, 10) || 3000;

    /**
     * Boolean interpretation of the false state
     * @type {boolean}
     */
    let boolFalseState = !!falseState;

    /**
     * Parsed interpretation of the state
     * @type {string}
     */
    let parsedState = 'visible';

    if (falseState || state) {
        parsedState = state.indexOf(' ') > -1
            ? state.split(/\s/)[state.split(/\s/).length - 1]
            : state;
    }

    if (typeof falseState === 'undefined') {
        boolFalseState = false;
    }

    // Map WebdriverIO states to Playwright states
    const stateMap: Record<string, 'attached' | 'detached' | 'visible' | 'hidden'> = {
        exist: 'attached',
        existent: 'attached',
        displayed: 'visible',
        visible: 'visible',
        enabled: 'attached', // Playwright doesn't have 'enabled' state, use 'attached'
        clickable: 'visible', // Playwright doesn't have 'clickable' state, use 'visible'
    };

    const playwrightState = stateMap[parsedState.toLowerCase()] || 'visible';

    if (boolFalseState) {
        // Wait for opposite state
        if (playwrightState === 'visible') {
            await locator.waitFor({ state: 'hidden', timeout: intMs });
        } else if (playwrightState === 'attached') {
            await locator.waitFor({ state: 'detached', timeout: intMs });
        } else {
            await locator.waitFor({ state: playwrightState, timeout: intMs });
        }
    } else {
        await locator.waitFor({ state: playwrightState, timeout: intMs });
    }
}
