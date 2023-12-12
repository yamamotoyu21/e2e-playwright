import { Locator, Page, expect } from "@playwright/test";
import basicPage from "./BasicPage";

export class myPage extends basicPage {
  readonly page: Page;



  async visit() {
    await this.page.goto("https://hotel.testplanisphere.dev/ja/signup.html");
  }

  /**
   * assert the navigated URL is correct
   */
  async assertURL():Promise<void>{
    const myPageURL = "https://hotel.testplanisphere.dev/ja/mypage.html";
    await this.page.waitForURL(myPageURL);
    const currentURL = await this.page.url()
    await expect(currentURL).toBe(myPageURL);
}

/**
 * Assert the registered info is shown
 */
async assertRegsteredInfo(signUpInfo: object, nonDisplayKeys: Map):Promise<void>{
    for (const key in signUpInfo) {
        if (!nonDisplayKeys.has(key)) {
          const value = signUpInfo[key];
          const isTextPresent = await this.page.textContent(`text="${value}"`);
          expect(isTextPresent).toBeTruthy();
          console.log(`${value} is displayed`)
        }
      }
}
}
