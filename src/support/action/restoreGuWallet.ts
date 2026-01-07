import { expect } from "@playwright/test";
import { TestFixtures } from "../../tests/fixtures";

/**
 * Restore G.U.Wallet
 * @param  {String}   mnemonic  The mnemonic phrase to restore the wallet
 * @param  {String}   password  The password to set for the wallet
 */
export default async function restoreGuWallet(
  mnemonic: string,
  password: string,
  fixtures: TestFixtures
) {
  const { context, extensionId, page: fallbackPage } = fixtures;

  // Get a valid page - try existing pages first, then fallback, then wait for new page
  let page: typeof fallbackPage;
  const pages = context.pages();

  if (pages.length > 0) {
    // Use the last page if available
    page = pages[pages.length - 1];
  } else if (fallbackPage && !fallbackPage.isClosed()) {
    // Use fallback page if available and not closed
    page = fallbackPage;
  } else {
    // No pages exist, create a new one
    page = await context.newPage();
  }

  // Navigate to extension popup
  await page.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'domcontentloaded' });
  await page.bringToFront();
  await expect(page.locator('button.MuiButton-root').filter({ hasText: 'Next' }).first()).toBeVisible({ timeout: 5000 });
  await page.locator('button.MuiButton-root').filter({ hasText: 'Next' }).first().click();
  await expect(page.getByText('Without any knowledge of blockchain, you can easily use. Your data and wallet are securely protected by blockchain.'))
    .toBeVisible({ timeout: 5000 });
  await expect(page.locator('button.MuiButton-root').filter({ hasText: 'Next' }).last()).toBeVisible({ timeout: 5000 });
  await page.locator('button.MuiButton-root').filter({ hasText: 'Next' }).last().click();
  await expect(page.getByText('Registering a master password'))
    .toBeVisible({ timeout: 5000 });

  const newPasswordInput = page.locator('input[type="password"]').first();
  const confirmPasswordInput = page.locator('input[type="password"]').last();

  await newPasswordInput.fill(password);
  await confirmPasswordInput.fill(password);

  const createButton = page.getByRole('button', { name: 'Create' });
  await expect(createButton).toBeEnabled();

  await createButton.click();
  await expect(page.getByText('How to manage private keys'))
    .toBeVisible({ timeout: 5000 });

  await expect(page.getByText('Self-Custody')).toBeVisible({ timeout: 5000 });
  await page.getByText('Self-Custody').click();

  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: 'Start' }).first().click();

  await expect(page.getByText('Import your wallet.')).toBeVisible({ timeout: 5000 });
  await page.getByText('Import your wallet.').click();

  const seedPhraseInput = page.locator('textarea[data-testid="seed-phrase-input"]');
  await expect(seedPhraseInput).toBeVisible({ timeout: 5000 });
  await seedPhraseInput.fill(mnemonic);
  await page.getByRole('button', { name: 'Start' }).last().click();

  await expect(page.getByText('By using Lunascape Wallet, you agree to the following terms and conditions.')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('I understand and agree that access to the held currency exists only on this device and is not stored on external servers or elsewhere.')).toBeVisible({ timeout: 5000 });
  await page.getByText('I understand and agree that access to the held currency exists only on this device and is not stored on external servers or elsewhere.').click();
  await expect(page.getByText('I understand that in case of app deletion, device damage, or changing the device, I will need the backup key (seed phrase) to restore the held currency.')).toBeVisible({ timeout: 5000 });
  await page.getByText('I understand that in case of app deletion, device damage, or changing the device, I will need the backup key (seed phrase) to restore the held currency.').click();
  await expect(page.getByText('I have read the ')).toBeVisible({ timeout: 5000 });
  await page.getByText('I have read the ').click();

  const createAccountButton = page.getByRole('button', { name: 'Create Account' });
  await expect(createAccountButton).toBeEnabled({ timeout: 5000 });
  await createAccountButton.click();
  await page.waitForTimeout(3000);
  await expect(page.getByText('Total Balance')).toBeVisible({ timeout: 5000 });
}
