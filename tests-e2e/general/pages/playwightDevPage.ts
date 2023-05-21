import { test, expect, type Page } from '@playwright/test';

test.beforeAll(async ({ page }) => {
    const url = 'https://hotel.testplanisphere.dev/ja/index.html';
    const response = await page.goto(url)
})

//ページタイトル
test('Check if page title includes Hotel planisphere', async({ page }) => {
    await expect(page).toHaveTitle(/.*HOTEL PLANISPHERE*/);
});


test('Check if it can navigate you to Plans page', async({ page }) => {
    await page.getByRole('link', {name: '宿泊予約'}).click();
    await expect(page).toHaveURL(/plans/);
});



