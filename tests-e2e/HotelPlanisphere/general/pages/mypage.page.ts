import { Locator, Page, expect } from "@playwright/test";

export class myPage{
    static url(): any {
        throw new Error('Method not implemented.');
    }
    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async visit(){
        await this.page.goto('https://hotel.testplanisphere.dev/ja/signup.html');
    }

    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }
}