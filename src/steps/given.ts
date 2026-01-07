import { createBdd } from 'playwright-bdd';
import { test, TestFixtures } from '../tests/fixtures';
import openWebsite from '../support/action/openWebsite';

const { Given } = createBdd(test);

Given('I open JOC Dashboard url', async ({ lastPage }: TestFixtures) => {
  const jocUrl = process.env.JOC_DASHBOARD_TESTING_URL || 'https://app.dev.japanopenchain.org/';
  if (jocUrl) {
    await openWebsite(lastPage, 'url', jocUrl);
  }
});

Given('I open G.U.Wallet popup url', async ({ lastPage, extensionId }: TestFixtures) => {
  await openWebsite(lastPage, 'url', `chrome-extension://${extensionId}/popup.html#/wallet`);
});

Given('I open the {string} {string}', async ({ lastPage }: TestFixtures, type: string, url: string) => {
  await openWebsite(lastPage, type as 'url' | 'site', url);
});