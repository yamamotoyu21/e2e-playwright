import { test, expect,BrowserContext, chromium} from "@playwright/test";
import { PlanPage } from "../../pages/plans.page";
import { BookingPage, BookingInfo } from "../../pages/booking.page"
import { BookingConfirmationPage }from "../../pages/bookingConfirmation.page"
import data from './data.json'


test.describe('planPage', () => {
    const testData: BookingInfo = {
      checkInDate: data.bookingInfo.checkInDate,
      term: data.bookingInfo.term,
      headCount: data.bookingInfo.headCount,
      breakfast: data.bookingInfo.breakfast,
      earlyCheckIn: data.bookingInfo.earlyCheckIn,
      sightseeing: data.bookingInfo.sightseeing,
      name: data.bookingInfo.name,
      contact: data.bookingInfo.contact,
      email: data.bookingInfo.email,
      tel: data.bookingInfo.tel,
      comment: data.bookingInfo.comment
    }
    
    test('Navigation buttons on the header is visible', async({ page }) => {
       
      const planPage = new PlanPage(page);
      await planPage.visit()
        await expect(await page.locator('#signup-holder')).toBeVisible()
        await expect(await page.locator('#mypage-holder')).toBeVisible()
        await expect(await page.locator('#login-holder')).toBeVisible()
        await expect(await page.locator('#logout-holder')).toBeVisible()
    })

    test('Check if cliclking plan button navigates to plan page ', async({  }) => {
      const browser = await chromium.launch();
      const context = await browser.newContext();

      // Step 1: ページに遷移する
      const page = await context.newPage();
      await page.goto('https://hotel.testplanisphere.dev/ja/plans.html');

      // Step 2: エレメントをクリックする
      await page.click('a[href="./reserve.html?plan-id=0"][class="btn btn-primary"]', { target: '_blank' });

      // 別タブが開くまで待つ
      await page.waitForTimeout(500); // 適切な待機時間を設定してください

      // 別タブへの参照を取得
      const pages = await context.pages();
      const newPage = pages[1]; // 新しく開かれたタブが一番最後に追加されるので、その参照を取得

      // Step 3: 別タブ内のURLが正しいことを確認する
      const expectedURL = 'https://hotel.testplanisphere.dev/ja/reserve.html?plan-id=0';
      const actualURL = newPage.url();

      if (actualURL === expectedURL) {
        console.log('URLが一致しています。');
      } else {
        console.error(`URLが一致しません。期待されるURL: ${expectedURL} 実際のURL: ${actualURL}`);
      }

      // ブラウザを閉じる
      await browser.close();
    })

    test.only('Check if booking form is available', async ({ page }) => {
      const bookingPage = new BookingPage(page)
      await bookingPage.visit(0)
      const bookingConfirmationPage: BookingConfirmationPage = await bookingPage.inputBookingInfo(testData)
      await bookingConfirmationPage.assertURL()
    })
})