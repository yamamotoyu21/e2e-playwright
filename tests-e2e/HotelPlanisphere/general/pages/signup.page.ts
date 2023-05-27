import { Locator, Page } from "@playwright/test";

export class PlanPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly nameInput: Locator;
    readonly rankInput: Locator;
    readonly premiumRank: Locator;
    readonly normalRank: Locator;
    readonly addressInput: Locator;
    readonly phoneInput: Locator;
    readonly genderInput: Locator;
    readonly birthDayInput: Locator;
    readonly notificationPreference: Locator;
    readonly submitButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.emailInput = page.locator('#email"]')
        this.passwordInput = page.locator('#password')
        this.nameInput = page.locator('#username')
        this.rankInput = page.locator('input[name="rank"]')
        this.premiumRank = page.locator('#rank-premium')
        this.normalRank = page.locator('#normal')
        this.addressInput = page.locator('#address')
        this.phoneInput = page.locator('#phone')
        this.genderInput = page.locator('#gender')
        this.birthDayInput = page.locator('#birthday')
        this.notificationPreference = page.locator('#notification')
        this.submitButton = page.locator('button[type="submit"]')
    }

    
}

