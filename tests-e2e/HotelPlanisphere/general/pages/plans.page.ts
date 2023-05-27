import { Locator, Page } from "@playwright/test";

export class PlanPage {
    readonly page: Page;
    readonly planNum: number;
    readonly researvationLink: Locator;
    readonly signUpLink: Locator;
    readonly signInLink: Locator;
    readonly navBarToggler: Locator;

    constructor(page: Page){
        this.page = page;
        this.researvationLink = page.locator('a.nav-link', {hasText: '宿泊予約'});
        this.signUpLink = page.locator('a.nav-link', {hasText: '会員登録'});
        this.signInLink = page.locator('a.nav-link', {hasText: 'ログイン'});
        this.navBarToggler = page.locator('button.navbar-togger')
    }

    async visit(){
        await this.page.goto('https://hotel.testplanisphere.dev/ja/plans.html')
    }

    async selectPlan(planNum: number) {
        const planLink = this.page.locator(`a[href="./reserve.html?plan-id=${planNum}"]`);
        await planLink.click();
    }
  
}

