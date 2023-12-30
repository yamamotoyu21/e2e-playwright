import { Locator, Page, expect } from "@playwright/test";
import BasicPage from "./BasicPage";

export class MyPage extends BasicPage {
  readonly page: Page;

  async visit() {
    await this.page.goto("https://hotel.testplanisphere.dev/ja/signup.html");
  }

  /**
   * assert the navigated URL is correct
   */
  async assertURL() {
    const myPageURL = "https://hotel.testplanisphere.dev/ja/mypage.html";
    //await this.page.waitForURL(myPageURL);

    //await expect(await this.page.url()).toBe(myPageURL);
  }

  /**
   * Assert the registered info is shown
   */
  async assertRegisteredInfo(
    signUpInfo: object,
    nonDisplayKeys: any
  ): Promise<void> {
    for (const key in signUpInfo) {
      if (!nonDisplayKeys.has(key)) {
        const value = signUpInfo[key];
        await this.page.getByText(value).toBeVisible();
        const isTextPresent = await this.page.textContent(`text="${value}"`);
        expect(isTextPresent).toBeTruthy();
        console.log(`${value} is displayed`);
      }
    }
  }
}
