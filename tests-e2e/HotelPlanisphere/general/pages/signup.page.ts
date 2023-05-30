import { Locator, Page } from "@playwright/test";

export class SignUpPage {
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
    userInfo: any;

    constructor(page: Page){
        this.page = page;
        this.emailInput = page.locator('#email')
        this.passwordInput = page.locator('#password')
        this.nameInput = page.locator('#username')
        this.rankInput = page.locator('input[name="rank"]')
        this.premiumRank = page.locator('#rank-premium')
        this.normalRank = page.locator('#normal')
        this.addressInput = page.locator('#address')
        this.phoneInput = page.locator('#tel')
        this.genderInput = page.locator('#gender')
        this.birthDayInput = page.locator('#birthday')
        this.notificationPreference = page.locator('#notification')
        this.submitButton = page.locator('button[type="submit"]')
    }

    async visit(){
        await this.page.goto('https://hotel.testplanisphere.dev/ja/signup.html')
    }

    async inputEmail(email: string){
        await this.emailInput.fill(email);
    }

    async inputPassword(password: string){
        await this.emailInput.fill(password);
    }
    
    async inputName(name: string){
        await this.nameInput.fill(name);
    }

    async checkPremiumRank(rank: string){
        await this.premiumRank.check();
    }

    async checkNormalRank(rank: string){
        await this.normalRank.check();
    }

    async inputAddress(address: string){
        await this.addressInput.fill(address)
    }

    async inputPhone(phone: string){
        await this.phoneInput.fill(phone)
    }

    async selectGender(genderOption: object){
        await this.genderInput.selectOption(genderOption);
    }


    // async inputAlluserInfo(page: Page, userInfo: object){
    //     const this.userInfo = userInfo;
    //     await planPage.inputEmail(this.userInfo.email);
    //     await planPage.inputPassword(this.userInfo.password);
    //     await planPage.inputName(this.userInfo.name);
    //     await planPage.checkPremiumRank(this.userInfo.rank);
    //     await planPage.inputAddress(this.userInfo.address);
    //     await planPage.inputPhone(this.userInfo.phone);
    //     await planPage.selectGender(this.userInfo.gender);
    // }

    async inputAlluserInfo(userInfo: any){
        this.userInfo = userInfo;
        await this.inputEmail(this.userInfo.email);
        await this.inputPassword(this.userInfo.password);
        await this.inputName(this.userInfo.name);
        await this.checkPremiumRank(this.userInfo.rank);
        await this.inputAddress(this.userInfo.address);
        await this.inputPhone(this.userInfo.phone);
        await this.selectGender(this.userInfo.gender);
      }




}

