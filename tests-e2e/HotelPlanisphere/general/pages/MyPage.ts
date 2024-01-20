import { Page, expect } from "@playwright/test";
import BasicPage from "./BasicPage";

export class MyPage extends BasicPage {
  async visit() {
    await this.page.goto("https://hotel.testplanisphere.dev/ja/signup.html");
  }

  /**
   * assert the navigated URL is correct
   */
  async assertURL() {
    const myPageURL = "https://hotel.testplanisphere.dev/ja/mypage.html";
    const currentURL = await this.page.url();

    // await console.log(currentURL);
    await expect(currentURL).toBe(myPageURL);
  }

  /**
   * Assert the registered info is shown except non displayedKeys
   */
  async assertRegisteredInfo(
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
}
