import { test, expect, Response, Page} from "@playwright/test";
import { PlanPage } from "./pages/plans.page";

test.describe('planPage', () => {
    test('should have correct URL', async({ page }) => {
        const planPage = new PlanPage(page);
        await planPage.visit()
        const expectedURL = 'https://hotel.testplanisphere.dev/ja/plans.html';
        await page.waitForURL(expectedURL)
        await expect(page).toHaveURL(expectedURL);
    })
    test('should not have HTTP error code', async({ page }) => {
        const planPage = new PlanPage(page);
        await planPage.visit();
        const header = await page.locator('h2.my-3')
        await expect(header).toHaveText('宿泊プラン一覧')
    })

    test.only('should have navigation to each plan enabled', async({ page }) => {
        const expectedURL = 'https://hotel.testplanisphere.dev/ja/reserve.html?plan-id=0';

        const planPage = new PlanPage(page);
        await planPage.visit();

        // プランを選択し、新しいウィンドウを開く
        const newPagePromise = new Promise<Page>((resolve) => {
            page.once('popup', (newPage) => {
                resolve(newPage);
            });
        });

        await planPage.selectPlan(0)
        const newPage = await newPagePromise;

        await newPage.waitForLoadState();
        const newPageURL = newPage.url();
        await expect(newPageURL).toBe(expectedURL);

        const windows = await page.context().pages();
        await expect(windows).toContain(newPage);
        

    })
})
