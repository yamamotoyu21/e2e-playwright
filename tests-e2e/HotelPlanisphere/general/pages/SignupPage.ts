import { Locator, Page, expect, BrowserContext } from "@playwright/test";
import { MyPage } from "./myPage";
import BasicPage from "./BasicPage";

export interface SignUpInfo {
  email: string;
  password: string;
  confirmPW: string;
  name: string;
  rank?: string;
  address?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}
export class SignUpPage extends BasicPage {
  /**
   * visit signup page directory
   */
  async visit(): Promise<void> {
    await this.page.goto(`${this.origin}/signup.html`);
  }

  /**
   * This function is for checking if signup feature works
   * @param signUpInfo
   * @returns MyPage
   */
  async signUp(signUpInfo: SignUpInfo): Promise<MyPage> {
    const { email, password, name, rank, address, phone, gender, dateOfBirth } =
      signUpInfo;

    //input email and confirm
    await this.page.type("#email", email);
    await this.page.type("#password", password);
    await this.page.type("#password-confirmation", password);
    await this.page.type("#username", name);

    // Check rank
    switch (rank) {
      case "premium":
        await this.page.locator("#rank-premium").check();
        break;
      case "normal":
        await this.page.locator("#rank-normal").check();
        break;
    }

    //input address
    if (address) {
      await this.page.type("#address", address);
    }

    //input phoneNumber
    if (phone) {
      await this.page.type("#tel", phone);
    }

    //selectGender
    if (gender) {
      await this.page.locator("#gender").selectOption(gender.toString());
    }

    //select date of birth
    if (dateOfBirth) {
      await this.page.fill("#birthday", dateOfBirth);
    }

    //select notification setting
    await this.page.locator("#notification").check();

    //Click submit button
    await this.page.locator('button[type="submit"]').click();

    await this.page.waitForLoadState();

    return new MyPage(this.page, this.origin);
  }
}
