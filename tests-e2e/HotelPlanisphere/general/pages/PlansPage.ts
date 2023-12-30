import { Page, expect } from "@playwright/test";
import BasicPage from "./BasicPage";

export class PlanPage extends BasicPage {
  /**
   * Directory go to plans page
   */
  async visit() {
    await this.page.goto(`${this.origin}/plans.html`);
  }
  /**
   * Select a plan and go to plan page, specifying a plan id
   */
  async clickGoToPlanPage(planNum: number): Promise<void> {
    const planLink = this.page.locator(
      `a[href="./reserve.html?plan-id=${planNum}"]`
    );
    await planLink.click();
  }

  /**
   * Assert that the URL is correct
   */
  async assertURL() {
    const expectedURL = `${this.origin}/plans.html`;
    await this.page.waitForURL(expectedURL);
    await expect(this.page.url()).toBe(expectedURL);
  }
}
