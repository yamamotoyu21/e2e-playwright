import { Page, expect } from "@playwright/test";
import BasicPage from "./BasicPage";

export class MyPage extends BasicPage {
  url = `${this.origin}/${this.lang}/mypage.html`;

  async getURL(): Promise<string> {
    return this.url;
  }

  /**
   * Directly visit May
   */
  async visit() {
    await this.page.goto(`${this.origin}/${this.lang}/mypage.html`);
  }

  /**
   * Assert the registered info is shown except for non displayedKeys
   */
  async assertRegisteredInfoVisible(
    signUpInfo: object,
    nonDisplayKeys: any
  ): Promise<void> {
    for (const key in signUpInfo) {
      if (!nonDisplayKeys.has(key)) {
        const value = signUpInfo[key];
        //await this.page.locator("p").filter({ hasText: value }).toBeVisible();
        const element = await this.page.getByText(value);
        await expect(element).toBeVisible();
        const isTextPresent = await this.page.textContent(`text="${value}"`);
        expect(isTextPresent).toBeTruthy();
        console.log(`${value} is displayed`);
      }
    }
  }

  /**
   * Click go to icon setting page
   */
  async clickOnSetUpICon() {
    await this.page.click(`#icon-link`);
  }
}
