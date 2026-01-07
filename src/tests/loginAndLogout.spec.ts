import { BrowserContext, expect, Page } from '@playwright/test';
import { test } from './fixtures';

const JOC_URL = 'https://app.dev.japanopenchain.org';

// ---- helpers ----

async function pause(pageOrContext: Page | BrowserContext, ms: number) {
  // Prefer page.waitForTimeout when possible; context doesn't have it.
  if ('waitForTimeout' in pageOrContext) await pageOrContext.waitForTimeout(ms);
  else await new Promise((r) => setTimeout(r, ms));
}

/**
 * Find & focus a page (tab/popup) in a context by URL substring.
 * Similar to your WebdriverIO focusWindow("url", value).
 */
async function focusWindowByUrl(context: BrowserContext, urlIncludes: string): Promise<Page> {
  for (const p of context.pages()) {
    const u = p.url();
    if (u && u.includes(urlIncludes)) {
      await p.bringToFront();
      return p;
    }
  }

  // Sometimes extensions open as a popup or new page slightly later
  const p = await context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
  if (p && p.url().includes(urlIncludes)) {
    await p.bringToFront();
    return p;
  }

  // Re-scan after wait
  for (const p2 of context.pages()) {
    if (p2.url().includes(urlIncludes)) {
      await p2.bringToFront();
      return p2;
    }
  }

  throw new Error(`Window with url including "${urlIncludes}" not found`);
}

async function focusLastPage(context: BrowserContext): Promise<Page> {
  const pages = context.pages();
  if (pages.length === 0) {
    throw new Error('No pages in context');
  }

  const lastPage = pages[pages.length - 1];
  await lastPage.bringToFront();
  return lastPage;
}

test('example test', async ({ context, page, extensionId }) => {
  await page.waitForTimeout(3000);
  const lastPage = await focusLastPage(context);
  await lastPage.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'domcontentloaded' });
  await expect(lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).first()).toBeVisible({ timeout: 5000 });
  await lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).first().click();
  await expect(lastPage.getByText('Without any knowledge of blockchain, you can easily use. Your data and wallet are securely protected by blockchain.'))
    .toBeVisible({ timeout: 5000 });
  await expect(lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).last()).toBeVisible({ timeout: 5000 });
  await lastPage.locator('button.MuiButton-root').filter({ hasText: 'Next' }).last().click();
  await expect(lastPage.getByText('Registering a master password'))
    .toBeVisible({ timeout: 5000 });

  const password = '12345678';
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

  await expect(lastPage.getByText('Import your wallet.')).toBeVisible({ timeout: 5000 });
  await lastPage.getByText('Import your wallet.').click();

  const seedPhrase = 'door brief riot gym apple candy liar spirit umbrella secret sausage hat';
  const seedPhraseInput = lastPage.locator('textarea[data-testid="seed-phrase-input"]');
  await expect(seedPhraseInput).toBeVisible({ timeout: 5000 });
  await seedPhraseInput.fill(seedPhrase);
  await lastPage.getByRole('button', { name: 'Start' }).last().click();

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

  await lastPage.goto(JOC_URL, { waitUntil: 'domcontentloaded' });

  const connectBtn = lastPage.getByTestId('connect-button');
  await expect(connectBtn).toBeVisible({ timeout: 5000 });

  await connectBtn.click();
  await lastPage.getByTestId('connect-selection-0').click();
  await lastPage.getByRole('button', { name: 'Unlock' }).click();

  const walletPage = await focusWindowByUrl(context, `chrome-extension://${extensionId}/`);

  await expect(walletPage.getByText('Approve'))
  .toBeVisible({ timeout: 5000 });
  await walletPage.getByText('Approve').click();
  await lastPage.waitForTimeout(5000);
  await lastPage.getByTestId('sign-button').click();

  const walletPage2 = await focusWindowByUrl(context, `chrome-extension://${extensionId}/`);

  await expect(walletPage2.getByText('Signature Request')).toBeVisible({ timeout: 5000 });
  await walletPage2.getByRole('button', { name: /^ok$/i }).click();
});

