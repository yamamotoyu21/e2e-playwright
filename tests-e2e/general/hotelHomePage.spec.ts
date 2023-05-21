import { test, expect, Page } from '@playwright/test';
import { checkHTTPStatus } from './utils/checkHTTPstatus'

test.describe("navigation from Home page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://hotel.testplanisphere.dev/ja/index.html');
    })

    test("Can visit booking page", async ({ page }) => {
        await page.getByRole('link', {name: '宿泊予約'}).click();
        expect(page.url()).toBe('https://hotel.testplanisphere.dev/ja/plans.html')
    })

    test("Can visit signUp page", async ({ page }) => {
        await page.getByRole('link', {name: '会員登録'});
        expect(page.url()).toBe('https://hotel.testplanisphere.dev/ja/signup.html')
    })

    test("Can visit login page", async ({ page }) => {
        await page.getByRole('link', {name: 'ログイン'});
        expect(page.url()).toBe('https://hotel.testplanisphere.dev/ja/login.html')
    })
})
