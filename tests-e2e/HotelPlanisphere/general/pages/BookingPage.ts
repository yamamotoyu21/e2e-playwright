import { expect, Locator, Page } from "@playwright/test";
import BasicPage from "./BasicPage";
import { PlanPage } from "./PlansPage";
import { BookingConfirmationPage } from "./BookingConfirmationPage";

export interface BookingInfo {
  checkInDate: string;
  term: string;
  headCount: string;
  breakfast: boolean;
  earlyCheckIn: boolean;
  sightseeing: boolean;
  name: string;
  contact: string;
  email: string;
  tel: string;
  comment: string;
}

export class BookingPage extends BasicPage {
  /**
   * Directory go to a booking page specifying a plan id
   * @param planId
   * @returns the page object model for booking page
   */
  async visit(planId: number): Promise<BookingPage> {
    await this.page.goto(`${this.origin}/reserve.html?plan-id=${planId}`);
    return new BookingPage(this.page, this.origin);
  }
  /**
   * Check if the URL is correct
   * @param planId plan id
   */
  async assertURL(planId: number): Promise<void> {
    let expectedURL = `${this.origin}/reserve.html?plan-id=${planId}`;
    await this.page.waitForURL(expectedURL);
    await expect(this.page.url()).toBe(expectedURL);
  }

  async book(bookingInfo: BookingInfo): Promise<BookingConfirmationPage> {
    //宿泊日数を指定
    const term = await this.page.locator("#term");
    await term.clear();
    await term.type(bookingInfo.term); //宿泊者数を入力

    const headCount = await this.page.locator("#head-count");
    await headCount.clear();
    await headCount.type(bookingInfo.headCount);

    //オプションにチェック
    if (bookingInfo.breakfast) {
      await this.page.getByLabel("朝食バイキング").check();
    }
    if (bookingInfo.earlyCheckIn) {
      await this.page.getByLabel("お得な観光プラン").check();
    }
    if (bookingInfo.sightseeing) {
      await this.page.getByLabel("お得な観光プラン").check();
    }

    //氏名を入力
    await this.page.getByLabel("氏名 必須").fill(bookingInfo.name);

    //連絡方法を選択
    await this.page
      .getByRole("combobox", { name: "確認のご連絡 必須" })
      .selectOption(bookingInfo.contact);

    //電話番号 or メールの場合は連絡先情報を入力
    if (bookingInfo.contact == "tel") {
      await this.page.type("#tel", bookingInfo.tel);
    } else if (bookingInfo.contact == "email") {
      await this.page.type("#email", bookingInfo.email);
    }

    //特記事項を入力
    await this.page
      .getByLabel("ご要望・ご連絡事項等ありましたらご記入ください")
      .fill(bookingInfo.comment);

    //サブミット
    await this.page.locator('[data-test="submit-button"]').click();

    return new BookingConfirmationPage(this.page, this.origin);
  }
}
