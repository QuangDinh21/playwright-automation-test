import type { Page } from '@playwright/test';

/**
 * Handle a modal/dialog
 * @param  {Page}     page      Playwright page object
 * @param  {'accept' | 'dismiss'} action    Action to perform on the modal (accept, dismiss)
 * @param  {'alertbox' | 'confirmbox' | 'prompt'} modalType Type of modal (alertbox, confirmbox, prompt)
 */
export default async function handleModal(
    page: Page,
    action: 'accept' | 'dismiss',
    modalType: 'alertbox' | 'confirmbox' | 'prompt'
): Promise<void> {
    /**
     * Set up dialog handler before the dialog appears
     */
    page.once('dialog', async (dialog) => {
        // Alert boxes can't be dismissed, this causes Chrome to crash during tests
        if (modalType === 'alertbox') {
            await dialog.accept();
        } else if (action === 'accept') {
            await dialog.accept();
        } else {
            await dialog.dismiss();
        }
    });
}
