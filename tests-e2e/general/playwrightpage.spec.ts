import { test, expect } from '@playwright/test';
import { checkHTTPStatus } from './utils/checkHTTPstatus'

test.describe("navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  })

  test("main navigation", async ({ page }) => {
    await expect(page).toHaveURL("https://playwright.dev/")
  })

  test("404 error check", async ({ page }) => {
    const status = await checkHTTPStatus(page);
    expect(status).not.toBe(404);
  })

  test("503 error check", async ({ page }) => {
    const status = await checkHTTPStatus(page);
    expect(status).not.toBe(503);
  })

  test("navigation to intro", async({ page }) => {
    await page.getByRole('link', {name: 'Get started'}).click();
    expect(page.url()).toContain('/intro');
  })

  // test("opens github page in a new tab", async ({ page }) => {
  //   await page.getByRole('link', { name: 'Star microsoft/playwright on GitHub' }).click();
  //   const newTabUrl = await page.evaluate(() => window.location.href);
  //   expect(newTabUrl).toContain('/github.com/microsoft/playwright')
  // })

  // test("Check if document search is available",async({ page }) => {
  //   await page.getByPlaceholder('Search docs').fill('getByRole');
  //   await page.getByPlaceholder('Search docs').press('Enter');
  //   expect(page.url()).toContain('/class-framelocator#frame-locator-get-by-role');
  // })

})
 
  

