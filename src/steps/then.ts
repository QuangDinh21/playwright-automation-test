import { createBdd } from 'playwright-bdd';
import { test, TestFixtures } from '../tests/fixtures';
import { getLocator } from '../support/lib/getLocator';
import isExisting from '../support/check/isExisting';
import waitFor from '../support/action/waitFor';

const { Then } = createBdd(test);


Then('I expect that element {string} does exist', async ({ lastPage }: TestFixtures, selector: string) => {
  await isExisting(getLocator(lastPage, selector), false);
});

Then('I expect that element {string} does not exist', async ({ lastPage }: TestFixtures, selector: string) => {
  await isExisting(getLocator(lastPage, selector), true);
});

Then('I wait on element {string} for {int}ms to exist', async ({ lastPage }: TestFixtures, selector: string, ms: number) => {
  await waitFor(getLocator(lastPage, selector), ms.toString(), false, 'exist');
});

Then('I wait on element {string} for {int}ms to not exist', async ({ lastPage }: TestFixtures, selector: string, ms: number) => {
  await waitFor(getLocator(lastPage, selector), ms.toString(), true, 'exist');
});
