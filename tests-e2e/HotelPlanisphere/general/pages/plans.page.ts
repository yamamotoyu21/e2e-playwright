import { Locator, Page } from "@playwright/test";

export class planPage {
    readonly page: Page;
    readonly researvationLink: Locator;
    readonly signUpLink: Locator;
    readonly signInLink: Locator;
    readonly navBarToggler: Locator;
    readonly planPageLink: Locator;

    constructor(page: Page){
        this.page = page;
        this.researvationLink = page.locator('a.nav-link', {hasText: '宿泊予約'});
        this.signUpLink = page.locator('a.nav-link', {hasText: '会員登録'});
        this.signInLink = page.locator('a.nav-link', {hasText: 'ログイン'});
        this.navBarToggler = page.locator('button.navbar-togger')
        this.planPageLink = page.locator('a[href="./reserve.html?plan-id=${n}"]');
        
    }

    async vist(){
        await this.page.goto('https://hotel.testplanisphere.dev/ja/plans.html')
    }

    async selectPlan(n: number){
        await this.planPageLink.click()
    }
}

