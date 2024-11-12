import { expect, Locator, Page } from "@playwright/test";
import BasicPage from "./BasicPage";
import { PlanPage } from "./PlansPage";
import { BookingConfirmationPage } from "./BookingConfirmationPage";

/**
 * Interface representing booking information
 */
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
   * Navigate to a booking page for a specific plan
   * @param planId - The ID of the plan
   * @returns A new BookingPage instance
   */
  async visit(planId: number): Promise<BookingPage> {
    await this.page.goto(`${this.origin}/reserve.html?plan-id=${planId}`);
    return new BookingPage(this.page, this.origin);
  }

  /**
   * Assert that the current URL is correct for the given plan
   * @param planId - The ID of the plan
   */
  async assertURL(planId: number): Promise<void> {
    let expectedURL = `${this.origin}/reserve.html?plan-id=${planId}`;
    await this.page.waitForURL(expectedURL);
    await expect(this.page.url()).toBe(expectedURL);
  }

  /**
   * Complete the booking process with the provided information
   * @param bookingInfo - The booking information
   * @returns A new BookingConfirmationPage instance
   */
  async book(bookingInfo: BookingInfo): Promise<BookingConfirmationPage> {
    // Set duration of stay
    const term = await this.page.locator("#term");
    await term.clear();
    await term.fill(bookingInfo.term);

    // Set number of guests
    const headCount = await this.page.locator("#head-count");
    await headCount.clear();
    await headCount.fill(bookingInfo.headCount);

    // Select options
    if (bookingInfo.breakfast) {
      await this.page.getByLabel("朝食バイキング").check();
    }
    if (bookingInfo.earlyCheckIn) {
      await this.page.getByLabel("お得な観光プラン").check();
    }
    if (bookingInfo.sightseeing) {
      await this.page.getByLabel("お得な観光プラン").check();
    }

    // Enter name
    await this.page.getByLabel("氏名 必須").fill(bookingInfo.name);

    // Select contact method
    await this.page
      .getByRole("combobox", { name: "確認のご連絡 必須" })
      .selectOption(bookingInfo.contact);

    // Enter contact information based on selected method
    if (bookingInfo.contact == "tel") {
      await this.page.fill("#tel", bookingInfo.tel);
    } else if (bookingInfo.contact == "email") {
      await this.page.fill("#email", bookingInfo.email);
    }

    // Enter special requests
    await this.page
      .getByLabel("ご要望・ご連絡事項等ありましたらご記入ください")
      .fill(bookingInfo.comment);

    // Submit the form
    await this.page.getByTestId("submit-button").click();

    return new BookingConfirmationPage(this.page, this.origin);
  }
}
