import { Locator, Page, expect, BrowserContext } from "@playwright/test";
import  { myPage }  from "../pages/mypage.page";
import basicPage from "./BasicPage";

interface SignUpInfo{
    email:string;
    password: string;
    confirmPW: string;
    name: string;
    rank: string;
    address: string;
    phone: string;
    gender: number;
    dateOfBirth: string;
}
export class SignUpPage extends basicPage{
    /**
     * visit signup page directory
     */
    async visit(): Promise<void>{   
     await this.page.goto(`${this.origin}/signup.html`)
    }

    /**
     * This function is for checking if signup feature works
     * 
     * @param signUpInfo 
     * @returns myPage
     * 
     */
    async signUp(signUpInfo: SignUpInfo): Promise<myPage> {
        const { email, password, name, rank, address, phone, gender, dateOfBirth} = signUpInfo;

        //input email and confirm
        await this.page.type('#email', email)
        
        //input pw
        await this.page.type('#password', password)

        //input confirmation pw
        await this.page.type('#password-confirmation', password)

        //input name
        await this.page.type('#username', name)

        //select membership type
        await this.page.locator('#rank-normal').check();

        //input address
        await this.page.type('#address', address)

        //input phoneNumber
        await this.page.type('#tel', phone)

         //selectGender
        await this.page.locator('#gender').selectOption(gender.toString());

        //select date of birth
        await this.page.fill("#birthday", dateOfBirth);

        //select notification setting
        await this.page.locator('#notification').check();

        //Click submit button
        await this.page.locator('button[type="submit"]').click();

        await this.page.waitForLoadState()

        return new myPage(this.page, this.origin)
    }
    }