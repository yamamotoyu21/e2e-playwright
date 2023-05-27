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
    test('should have correct title', async({ page }) => {
        const planPage = new PlanPage(page);
        await planPage.visit();
        const header = await page.locator('h2.my-3')
        await expect(header).toHaveText('宿泊プラン一覧')
    })

    test('should have each navigation on nav bar visible', async({ page }) => {
        const planPage = new PlanPage(page);
        await planPage.visit();
        await expect(planPage.signInButton).toBeVisible();
        await expect(planPage.signInButton).toBeVisible();
    })

    test('会員登録 button should navigate to signup page', async({ page }) => {
        const expectedURL = 'https://hotel.testplanisphere.dev/ja/signup.html';
        const planPage = new PlanPage(page);
        await planPage.visit();
        await planPage.signUpButton.click()
        await page.waitForURL(/\/signup/, 2000)
        await expect(page).toHaveURL(expectedURL)
    })

    test('should open plan(0) page in new window', async({ page }) => {
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
