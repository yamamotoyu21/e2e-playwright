import { Page, expect } from "@playwright/test";
import BasicPage from "./BasicPage";
import { BookingPage } from "./BookingPage";

/**
 * Interface to define the structure of expected plan card data.
 */
export interface CardExpectation {
  title: string;
  items: string[];
}

export class PlanPage extends BasicPage {
  /**
   * Directory visit plans page
   */
  async visit() {
    await this.page.goto(`${this.origin}/plans.html`);
  }

  /**
   * Select a plan from plan list and visit booking page for the plan
   * @param {number} planNum - The unique identifier for the plan
   * @returns {Promise<BookingPage>} A promise that resolves to an instance of BookingPage.
   */
  async clickGoToPlanPage(planNum: number): Promise<BookingPage> {
    const planLink = this.page.locator(
      `a[href="./reserve.html?plan-id=${planNum}"]`
    );
    await planLink.click();

    return new BookingPage(this.page, this.origin);
  }

  /**
   * Assert you've landed on the plan list page
   */
  async assertURL(): Promise<void> {
    const expectedURL = `${this.origin}/plans.html`;
    await this.page.waitForURL(expectedURL);
    await expect(this.page.url()).toBe(expectedURL);
  }

  /**
   * Asserts that all expected plan data is visible on the page.
   * @param {CardExpectation[]} expectedData - An array of expected card data for detailed assertions.
   */
  async expectAllPlanDataVisible(
    expectedData: CardExpectation[]
  ): Promise<void> {
    for (const [index, { title, items }] of expectedData.entries()) {
      const currentCard = this.page.locator(".card-body").nth(index);

      // Assert the title of the current card matches the expected title.
      await expect(currentCard.locator(".card-title")).toHaveText(title);

      // For each expected item, assert it exists in the card.
      for (const item of items) {
        await expect(
          currentCard.locator("li").filter({ hasText: item })
        ).toHaveCount(1);
      }
    }

    // Additionally, ensure the total count of cards matches the expected data length.
    await expect(this.page.locator(".card-body")).toHaveCount(
      expectedData.length
    );
  }
}
