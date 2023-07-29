import { expect, Locator, Page } from "@playwright/test";

export class BookingConfirmationPage {
    page: Page;
    planNum: number;

    constructor(page: Page){
        this.page = page;
    }

    async assertURL(){
        const expectedURL = 'https://hotel.testplanisphere.dev/ja/confirm.html';
        await this.page.waitForURL(expectedURL)
        await expect(this.page.url()).toBe(expectedURL)
    }
}