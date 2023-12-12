import { expect, Locator, Page } from "@playwright/test";
import basicPage from "./BasicPage";

export class BookingConfirmationPage extends basicPage {
  
    async assertURL(){
        const expectedURL = 'https://hotel.testplanisphere.dev/ja/confirm.html';
        await this.page.waitForURL(expectedURL)
        await expect(this.page.url()).toBe(expectedURL)
    }
}