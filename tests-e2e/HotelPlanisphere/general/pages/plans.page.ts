import { Locator, Page } from "@playwright/test";

export class PlanPage {
    readonly page: Page;
    readonly planNum: number;
    readonly researvationButton: Locator;
    readonly signUpButton: Locator;
    readonly signInButton: Locator;
    readonly navBarToggler: Locator;

    constructor(page: Page){
        this.page = page;
        this.researvationButton = page.getByText('宿泊予約')
        this.signUpButton = page.locator('#signup-holder')
        this.signInButton = page.locator('#login-holder')
        this.navBarToggler = page.locator('button[aria-controls="navbarNav"]')
    }

    async visit(){
        await this.page.goto('https://hotel.testplanisphere.dev/ja/plans.html')
    }

    async selectPlan(planNum: number) {
        const planLink = this.page.locator(`a[href="./reserve.html?plan-id=${planNum}"]`);
        await planLink.click();
    }
  
}

