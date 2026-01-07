import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '.features-gen', // Generated BDD tests
  /* Maximum time one test can run for. */
  timeout: 60000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run tests with configurable workers (default: 1 for serial execution) */
  workers: process.env.MAX_INSTANCES ? parseInt(process.env.MAX_INSTANCES, 10) : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }], // Don't auto-open report on failure
    ['list'], // Show test results in console
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace on failure - provides step-by-step debugging with screenshots, network, console */
    trace: 'on-first-retry',

    /* Take screenshot based on SCREENSHOT_MODE env var (options: 'off', 'on', 'only-on-failure') */
    screenshot: (process.env.SCREENSHOT_MODE as 'off' | 'on' | 'only-on-failure') || 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Note: Chrome extensions must be loaded using launchPersistentContext
      // See tests/fixtures.ts for extension loading setup
    },

    // Disabled firefox and webkit since Chrome extensions only work with Chromium
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

// BDD configuration
export const bddConfig = defineBddConfig({
  features: './src/features/**/*.feature',
  steps: [
    './src/tests/fixtures.ts',
    './src/steps/**/*.ts', // Custom wallet-specific steps
  ],
});
