import { expect, Locator, Page } from "@playwright/test";
import { PlanPage } from "./plans.page";
import { BookingConfirmationPage } from '../pages/bookingConfirmation.page'


interface BookingInfo {
    checkInDate: string;
    term: string;
    headCount: string;
    breakfast: boolean;
    earlyCheckIn: boolean;
    sightseeing: boolean;
    name: string;
    contact: string;
    email: string;
    tel: string;
    comment: string;
}


export class BookingPage {
    page: Page;
    planNum: number;

    constructor(page: Page){
        this.page = page;
    }

    
    /**
     * Directory go to a booking page specifying a plan id
     * @param planNum 
     * @returns the page object model for booking page
     */
    async visit(planNum: number): Promise <BookingPage>{
        this.planNum = planNum;
        await this.page.goto(`https://hotel.testplanisphere.dev/ja/reserve.html?plan-id=${this.planNum}`)
        return new BookingPage(this.page)
    }
    /**
     * Check if the URL is correct
     * @param planNum plan id
     */
   async assertURL(planNum: number): Promise<void>{
       this.planNum = planNum;
       let expectedURL = `https://hotel.testplanisphere.dev/ja/reserve.html?plan-id=${this.planNum}`
       await this.page.waitForURL(expectedURL)
       await expect(this.page.url()).toBe(expectedURL)
   }

   async inputBookingInfo(bookingInfo:BookingInfo): Promise<BookingConfirmationPage>{
       
      //宿泊日数を指定
      const term = await this.page.locator('#term')
      await term.clear()
      await term.type(bookingInfo.term)

    　//宿泊者数を入力
      const headCount = await this.page.locator('#head-count')
      await headCount.clear()
      await headCount.type(bookingInfo.headCount)

      //オプションにチェック
      if(bookingInfo.breakfast){
        await this.page.getByLabel('朝食バイキング').check();
      }
      if(bookingInfo.earlyCheckIn){
        await this.page.getByLabel('お得な観光プラン').check();
      }
      if(bookingInfo.sightseeing){
        await this.page.getByLabel('お得な観光プラン').check();
      }

      //氏名を入力
      await this.page.getByLabel('氏名 必須').fill(bookingInfo.name)

      //連絡方法を選択
      await this.page.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption(bookingInfo.contact);

      //電話番号 or メールの場合は連絡先情報を入力
      if(bookingInfo.contact == 'tel'){
        await this.page.type('#tel', bookingInfo.tel)
      }else if(bookingInfo.contact == 'email'){
        await this.page.type('#email', bookingInfo.email)
      }

      //特記事項を入力
      await this.page.getByLabel('ご要望・ご連絡事項等ありましたらご記入ください').fill(bookingInfo.comment)

      //サブミット
      await this.page.locator('[data-test="submit-button"]').click();

      return new BookingConfirmationPage(this.page)
 
   }
}


