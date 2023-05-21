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

  // test("navigation to github", async ({ page }) => {
  //   await page.getByRole('button', {name: 'Star'}).click();
  //   expect(page.url()).toContain('/github.com/microsoft/playwright')
  // })

  
})
 
  

