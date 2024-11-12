import { Page, expect } from "@playwright/test";
/**
 * Removes the incident banner from the page.
 * @param page - The Playwright page object.
 * @returns A promise that resolves once the incident banner is removed.
 */
export async function removeIncidentBannerIfExists(page: Page): Promise<void> {
  const element = await page.$('div[data-testid="AlertBar"]');
  if (element) {
    await page.evaluate((el) => {
      el.style.display = "none";
    }, element);
  }
}
