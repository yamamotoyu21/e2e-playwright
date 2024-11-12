import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

/**
 * Timeout multiplier for E2E tests
 * Useful for people that have a slightly slower computer or network
 */
const timeoutMultiplier = parseInt(
  process.env.E2E_TIMEOUT_MULTIPLIER ?? "1",
  10
);

const defaultOrigin: string =
  process.env.TEST_ORIGIN || "https://staging-meetsmore.com";

/**
 * Whether to enable visual regression test
 *  set true to turn on
 *  set false to turn off
 */
const isEnableVisualRegression: boolean =
  process.env.VISUAL_REGRESSION === "true";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  /**
   * Max failures before stopping
   * Directly stops locally
   * Stops after 15 failures in the CI
   */
  maxFailures: process.env.CI ? 15 : 1,
  /* Directory where the tests are located. */
  testDir: "./src",
  /* Maximum time one test can run for. */
  timeout: 120_000 * timeoutMultiplier, // Defaults 120s
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 15_000 * timeoutMultiplier, // Defaults to 15s

    /* Accept up to 2% of pixels to be different in screenshots */
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry once in CI only */
  retries: process.env.CI ? 1 : 0,
  /*
    CI: 100% of CPU cores used as workers
    local: always 1 worker
  */
  workers: process.env.CI ? "100%" : 1,
  /*
    Reporter(s) to use. See https://playwright.dev/docs/test-reporters
  */
  reporter: process.env.CI
    ? [["blob"], ["allure-playwright"], ["line"]]
    : [["html"], ["line"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 45_000 * timeoutMultiplier, // Defaults 45s
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: defaultOrigin,
    /** Allow playwright to read clipboard context */
    permissions: ["clipboard-read"],
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    /* Always keep video on CI, but only on failure locally */
    video: "retain-on-failure",

    // Emulates the user timezone
    timezoneId: "Asia/Tokyo",

    // Emulates the user locale
    locale: "ja-JP",

    contextOptions: {
      ignoreHTTPSErrors: true,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup and teardown are run before and after all the tests
    // https://playwright.dev/docs/test-global-setup-teardown
    {
      name: "setup",
      testMatch: "setup.ts",
      teardown: "teardown",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
    {
      name: "teardown",
      testMatch: "teardown.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
    // Actual tests

    // Tests with shared pro account all use the same pro account
    // This pro account is created during the `setup` project above
    // Any React Native tests will need Maestro and its dependencies
    {
      name: "shared_pro_account",
      dependencies: ["setup"],
      //Temporarily ignore NP Paylater due to check the behavior when maintainance @yuyamamoto 2024.7.4
      testIgnore: "sharedProAccount/**/npPaylater.spec.ts",
      testMatch: "sharedProAccount/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
    // Tests with shared provider account all use the same provider account
    // A provider is an account in MM that provides an external service/tool (in other words, it's leadgen/marketing-pf)
    // These tests use an already existing account
    {
      name: "shared_provider_account",
      testMatch: "sharedProviderAccount/**/**spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
    // Tests with no shared account
    {
      name: "no_shared_account",
      testMatch: "noSharedProAccount/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
    {
      name: "link_checker",
      testMatch: "linkChecker/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
    // Tests with admin account
    // Check that we cannot delete a card option that is being
    // used inside a product 'avoidMatchSetting' or 'userInfoSharing' condition
    {
      name: "query_card_life_cycle",
      testMatch: "tools/queryCard/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: "meetsmore-web-test",
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "playwright-e2e-results/",
};

export default config;
export { isEnableVisualRegression };
