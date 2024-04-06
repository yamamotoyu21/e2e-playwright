import { Page, expect } from "@playwright/test";
import BasicPage from "./BasicPage";
import { BookingPage } from "./BookingPage";
import axios from "axios";

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

  /**
   * check if plan links are dead or throw error
   */
  async assertPlanLinkAlive() {
    //Set all the plan links as targets
    const target = 'a[href^="./reserve.html?plan-id="]';
    const linkHrefs = await this.page.$$eval(target, (links) =>
      links
        .map((link) => (link instanceof HTMLAnchorElement ? link.href : ""))
        .filter((href) => href !== "")
    );

    // Send get requests to targeted links and check if they throw error
    const requests = linkHrefs.map(async (href) => {
      try {
        // Attempt to fetch each link
        await axios.get(href);
        console.log(`Link check passed: ${href}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle HTTP-specific errors (e.g., response status codes)
          if (error.response && error.response.status === 403) {
            console.log(`Forbidden (403) detected: ${href}`);
          } else {
            // Other Axios errors (e.g., network issues, non-200 status codes)
            console.log(`Error accessing ${href}: ${error.message}`);
          }
        } else {
          // Handle non-Axios errors (e.g., programming errors)
          console.error(`Unexpected error for ${href}:`, error);
        }
      }
    });

    // Wait for all requests to complete
    await Promise.all(requests);
  }
}
