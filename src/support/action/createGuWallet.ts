import { expect } from "@playwright/test";
import { TestFixtures } from "../../tests/fixtures";

/**
 * Create a new G.U.Wallet
 * @param  {String}   password  The password to set for the wallet
 */
export default async function createGuWallet(
  password: string,
  fixtures: TestFixtures
) {
  const { lastPage, extensionId } = fixtures;
  await lastPage.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'domcontentloaded' });

  // Click through the initial wizard screens
  await expect(lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).first()).toBeVisible({ timeout: 5000 });
  await lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).first().click();

  await expect(lastPage.getByText('Without any knowledge of blockchain, you can easily use. Your data and wallet are securely protected by blockchain.'))
    .toBeVisible({ timeout: 5000 });
  await expect(lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).last()).toBeVisible({ timeout: 5000 });
  await lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).last().click();

  await expect(lastPage.getByText('Registering a master password'))
    .toBeVisible({ timeout: 5000 });

  // Fill password form
  const newPasswordInput = lastPage.locator('input[type="password"]').first();
  const confirmPasswordInput = lastPage.locator('input[type="password"]').last();

  await newPasswordInput.fill(password);
  await confirmPasswordInput.fill(password);

  const createButton = lastPage.getByRole('button', { name: 'Create' });
  await expect(createButton).toBeEnabled();
  await createButton.click();

  await expect(lastPage.getByText('How to manage private keys'))
    .toBeVisible({ timeout: 5000 });

  await expect(lastPage.getByText('Self-Custody')).toBeVisible({ timeout: 5000 });
  await lastPage.getByText('Self-Custody').click();

  await expect(lastPage.getByRole('button', { name: 'Start' })).toBeVisible({ timeout: 5000 });
  await lastPage.getByRole('button', { name: 'Start' }).first().click();

  // Create new wallet (not import)
  await expect(lastPage.getByText('Create your wallet.')).toBeVisible({ timeout: 5000 });
  await lastPage.getByText('Create your wallet.').click();

  // Accept terms and conditions
  await expect(lastPage.getByText('By using Lunascape Wallet, you agree to the following terms and conditions.')).toBeVisible({ timeout: 5000 });
  await expect(lastPage.getByText('I understand and agree that access to the held currency exists only on this device and is not stored on external servers or elsewhere.')).toBeVisible({ timeout: 5000 });
  await lastPage.getByText('I understand and agree that access to the held currency exists only on this device and is not stored on external servers or elsewhere.').click();
  await expect(lastPage.getByText('I understand that in case of app deletion, device damage, or changing the device, I will need the backup key (seed phrase) to restore the held currency.')).toBeVisible({ timeout: 5000 });
  await lastPage.getByText('I understand that in case of app deletion, device damage, or changing the device, I will need the backup key (seed phrase) to restore the held currency.').click();
  await expect(lastPage.getByText('I have read the ')).toBeVisible({ timeout: 5000 });
  await lastPage.getByText('I have read the ').click();

  const createAccountButton = lastPage.getByRole('button', { name: 'Create Account' });
  await expect(createAccountButton).toBeEnabled({ timeout: 5000 });
  await createAccountButton.click();
  await lastPage.waitForTimeout(3000);
  await expect(lastPage.getByText('Total Balance')).toBeVisible({ timeout: 5000 });
}

