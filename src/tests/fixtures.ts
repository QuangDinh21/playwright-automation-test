import { test as base } from 'playwright-bdd';
import { chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';

export type TestFixtures = {
  context: BrowserContext;
  page: Page;
  extensionId: string;
  lastPage: Page;
};

export const test = base.extend<{
  context: BrowserContext;
  page: Page;
  extensionId: string;
  lastPage: Page;
}>({
  context: async ({ }, use, testInfo) => {
    const pathToExtension = path.join(__dirname, '../../extensions/gu-wallet');

    // Enable headless mode by default, can be overridden with HEADED=true environment variable
    const headless = process.env.ENABLE_HEADLESS_MODE !== 'true';

    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      headless: headless,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    // Get the first available open page, or wait for one to be created
    let page = context.pages().find(p => !p.isClosed());
    if (!page) {
      // If no open pages exist, wait for a new page to be created
      page = await context.waitForEvent('page', { timeout: 5000 });
    }
    await use(page);
  },
  extensionId: async ({ context }, use) => {
    // for manifest v3:
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker)
      serviceWorker = await context.waitForEvent('serviceworker');

    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
  lastPage: async ({ context, page }, use) => {
    const getLastPage = (): Page => {
      const pages = context.pages().filter(p => {
        try {
          return !p.isClosed();
        } catch {
          return false;
        }
      });

      if (pages.length === 0) {
        // If no pages available, use the base page fixture as fallback
        return page;
      }

      return pages[pages.length - 1];
    };

    // Get initial last page
    let initialLastPage = getLastPage();

    // Create a proxy that always gets the last page dynamically
    const lastPageProxy = new Proxy(initialLastPage, {
      get(target, prop) {
        // Always get a fresh reference to the last open page
        const currentLastPage = getLastPage();
        const value = currentLastPage[prop as keyof Page];
        // Bind functions to the current last page so they always use the fresh reference
        return typeof value === 'function' ? value.bind(currentLastPage) : value;
      },
    });

    await use(lastPageProxy as Page);
  },
});
export const expect = test.expect;