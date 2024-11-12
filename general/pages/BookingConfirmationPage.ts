import { expect, Locator, Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export class BookingConfirmationPage extends BasicPage {
  async expectPage() {
    const expectedURL = `${this.origin}/confirm.html`;
    await this.page.waitForURL(expectedURL);
    await expect(this.page.url()).toBe(expectedURL);
  }
}
