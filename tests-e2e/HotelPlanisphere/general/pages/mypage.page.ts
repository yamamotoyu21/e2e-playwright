import { Locator, Page, expect } from "@playwright/test";

export class myPage {
  static url(): any {
    throw new Error("Method not implemented.");
  }
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto("https://hotel.testplanisphere.dev/ja/signup.html");
  }

  async assertURL():Promise<void>{
    const myPageURL = "https://hotel.testplanisphere.dev/ja/mypage.html";
    await this.page.waitForURL(myPageURL);
    const currentURL = await this.page.url()
    await expect(currentURL).toBe(myPageURL);
}

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
