import { createBdd } from 'playwright-bdd';
import { test, TestFixtures } from '../tests/fixtures';
import restoreGuWallet from '../support/action/restoreGuWallet';
import { getLocator } from '../support/lib/getLocator';
import clickElement from '../support/action/clickElement';
import setInputField from '../support/action/setInputField';
import clearInputField from '../support/action/clearInputField';
import pause from '../support/action/pause'
import pressButton from '../support/action/pressButton';
import closeLastOpenedWindow from '../support/action/closeLastOpenedWindow';
import focusLastOpenedWindow from '../support/action/focusLastOpenedWindow';
import refreshPage from '../support/action/refreshPage';
import focusWindow from '../support/action/focusWindow';
import closeWindow from '../support/action/closeWindow';
import createGuWallet from '../support/action/createGuWallet';
import backToPage from '../support/action/backToPage';
import { focusWindowByUrl } from '../support/action/focusWindowByUrl';

const { When } = createBdd(test);

When('I restore G.U.Wallet with mnemonic {string} and password {string}', async ({ context, page, extensionId, lastPage }: TestFixtures, mnemonic: string, password: string) => {
  await restoreGuWallet(mnemonic, password, { context, page, extensionId, lastPage });
});

When('I click on the element {string}', async ({ lastPage }: TestFixtures, selector: string) => {
  await clickElement('click', getLocator(lastPage, selector));
});

When('I double click on the element {string}', async ({ lastPage }: TestFixtures, selector: string) => {
  await clickElement('doubleClick', getLocator(lastPage, selector));
});

When('I add {string} to the inputfield {string}', async ({ lastPage }: TestFixtures, value: string, selector: string) => {
  await setInputField('add', value, getLocator(lastPage, selector));
});

When('I set {string} to the inputfield {string}', async ({ lastPage }: TestFixtures, value: string, selector: string) => {
  await setInputField('set', value, getLocator(lastPage, selector));
});

When('I clear the inputfield {string}', async ({ lastPage }: TestFixtures, selector: string) => {
  await clearInputField(getLocator(lastPage, selector));
});

When('I pause for {int}ms', async ({ context }: TestFixtures, ms: number) => {
  await pause(context, ms.toString());
});

When('I press {string}', async ({ lastPage }: TestFixtures, key: string) => {
  await pressButton(lastPage, key);
});

When(
  "I close the last opened window",
  async ({ context }: TestFixtures) => {
    await pause(context, '2000');
    await closeLastOpenedWindow(null as never, context);
  }
);

When(
  "I close the last opened tab",
  async ({ context }: TestFixtures) => {
    await closeLastOpenedWindow(null as never, context);
  }
);

When(
  "I focus the last opened window",
  async ({ context }: TestFixtures) => {
    await focusLastOpenedWindow(null as never, context);
  }
);

When(
  "I focus the last opened tab",
  async ({ context }: TestFixtures) => {
    await focusLastOpenedWindow(null as never, context);
  }
);

When('I refresh the current page', async ({ lastPage }: TestFixtures) => {
  await refreshPage(lastPage);
});

When('I focus on window with {string} including {string}', async ({ context, lastPage }: TestFixtures, type: string, value: string) => {
  const locatorValue = type === 'element' ? getLocator(lastPage, value) : value;
  await focusWindow(context, lastPage, type as 'url' | 'title' | 'element', locatorValue);
});

When('I close window with {string} including {string}', async ({ context, lastPage }: TestFixtures, type: string, value: string) => {
  const locatorValue = type === 'element' ? getLocator(lastPage, value) : value;
  await closeWindow(context, lastPage, type as 'url' | 'title' | 'element', locatorValue);
});

When('I create G.U.Wallet with password {string}', async ({ context, page, extensionId, lastPage }: TestFixtures, password: string) => {
  await createGuWallet(password, { context, page, extensionId, lastPage });
});

When('I focus on G.U.Wallet window', async ({ context, extensionId }: TestFixtures) => {
  await pause(context, '500');
  await focusWindowByUrl(context, `chrome-extension://${extensionId}/`);
});

When('I back to previous window', async ({ context }: TestFixtures) => {
  await pause(context, '500');
  await backToPage(context);
});

When('I focus on JOC Dashboard window', async ({ context }: TestFixtures) => {
  await pause(context, '500');
  const jocUrl = process.env.JOC_DASHBOARD_TESTING_URL || '';
  if (jocUrl) {
    await focusWindowByUrl(context, jocUrl);
  }
});