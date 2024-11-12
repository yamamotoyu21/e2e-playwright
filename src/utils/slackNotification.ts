import { test as base } from "@playwright/test";
import { ToolsMainPage } from "src/pages/tools/ToolsMainPage";
import { storeUrlInCSV } from "../lib/storeUrlInCsv";
import { generateToolsBaseUrl } from "../lib/util";

/**
 * Domains needed during the test
 */
export type Domains = {
  // Domain of the main app (e.g. https://staging-meetsmore.com)
  main: string;
  // Domain of the tools backoffice (e.g. https://tools.staging-meetsmore.com)
  tools: string;
};

/**
 * Admin credentials needed to connect on Tools
 */
export type AdminCredentials = {
  email: string;
  password: string;
};

/**
 * Credentials needed to access staging environment
 */
export type AccessCredentials = {
  userAgent: string;
};

/**
 * Slack webHooks to notify test result
 */
export type SlackCredentials = {
  botDeadLinkProd: string;
  botDeadLinkStaging: string;
  groupMention: string;
};

/**
 * Pro account created and shared between the tests of a run
 */
export type ProAccount = {
  id: string;
  email: string;
  password: string;
  /**
   * Profile name is displayed in multiple places
   * Needed for easily click on buttons linked to this pro (especially in Tools)
   */
  profileName: string;
};

/**
 * Template pro account info to be used for duplicate new pro
 */
export type TemplatePro = {
  id: string;
  name: string;
};

// Fixtures that always run
type MyLocalFixtures = {
  adminPage: ToolsMainPage;
};

// Fixtures that only run once per worker
type MyWorkerFixtures = {
  domains: Domains;
  adminCredentials: AdminCredentials;
  pageAccessCredentials: AccessCredentials;
  slackCredentials: SlackCredentials;
  templatePro: TemplatePro;
  adminToken: string;
};

/**
 * Extend base test by providing our own fixtures on it
 * This new "test" can be used in multiple test files, and each of them will get the fixtures.
 * @link https://playwright.dev/docs/test-fixtures
 */
export const test = base.extend<MyLocalFixtures, MyWorkerFixtures>({
  // Store the domains
  domains: [
    {
      main: process.env.TEST_ORIGIN ?? "https://staging-meetsmore.com",
      tools: generateToolsBaseUrl(
        process.env.TEST_ORIGIN ?? "https://staging-meetsmore.com"
      ),
    },
    { scope: "worker", option: true },
  ],

  // Store the admin credentials
  adminCredentials: [
    {
      email: process.env.ADMIN_EMAIL ?? "team_qa+autifytools@meetsmore.com",
      password: process.env.ADMIN_PASSWORD ?? "meetsmore",
    },
    { scope: "worker", option: true },
  ],

  // Store the userAgent
  pageAccessCredentials: [
    {
      userAgent: "meetsmore-web-test",
    },
    { scope: "worker", option: true },
  ],

  // Store the web hooks to send to slack
  slackCredentials: [
    {
      botDeadLinkProd:
        "https://hooks.slack.com/services/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",
      botDeadLinkStaging:
        "https://hooks.slack.com/services/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",
      groupMention: "S05HG59569H",
    },
    { scope: "worker", option: true },
  ],

  // Store the template pro account info
  templatePro: [
    {
      id: process.env.TEMPLATE_PRO_ID ?? "63033dcacb7324002a092db8",
      name: process.env.TEMPLATE_PRO_NAME ?? "QA自動化用　複製禁止",
    },
    { scope: "worker", option: true },
  ],

  // Retrieve the admin token and store it
  adminToken: [
    async ({ browser, domains, adminCredentials }, use) => {
      const page = await browser.newPage();
      // Go on tools page
      const mainToolsPage = new ToolsMainPage(page, domains.tools);
      await mainToolsPage.visit();

      // Go on login page and login
      const loginPage = await mainToolsPage.goToLoginPage();
      const adminToken = await loginPage.loginAdmin(adminCredentials);

      if (!adminToken) {
        throw new Error("Failed to get the admin token");
      }
      // Close
      await page.close();

      // Run test
      await use(adminToken);
    },
    { scope: "worker" },
  ],

  // Override the default page fixture to add a listener on domcontentloaded
  page: async ({ page }, use, testInfo) => {
    const visitedUrls = new Set<string>();

    // Add a listener and store the URLs visited
    page.on("framenavigated", async (frame) => {
      if (frame === page.mainFrame()) {
        visitedUrls.add(page.url());
      }
    });

    // Run test
    await use(page);

    const urls = Array.from(visitedUrls);

    // Attach the visited URLs to the test
    await testInfo.attach("visited_urls.json", {
      body: JSON.stringify(urls, null, 2),
      contentType: "application/json",
    });

    // Store the URLs in a CSV for easy usage by QA
    for (const url of urls) {
      await storeUrlInCSV(
        "playwright-e2e-results/visited_urls.csv",
        testInfo.project.name,
        testInfo.file,
        testInfo.title,
        url
      );
    }
  },

  // Easily open the admin tools main page
  adminPage: async ({ page, domains, adminCredentials }, use) => {
    // Go on tools page
    const mainToolsPage = new ToolsMainPage(page, domains.tools);
    await mainToolsPage.visit();

    // Go on login page and login
    const loginPage = await mainToolsPage.goToLoginPage();
    await loginPage.loginAdmin(adminCredentials);
    await use(mainToolsPage);
  },
});

// Re-export from Playwright
export {
  expect,
  Page,
  Browser,
  BrowserContext,
  WebSocket,
  ConsoleMessage,
} from "@playwright/test";
