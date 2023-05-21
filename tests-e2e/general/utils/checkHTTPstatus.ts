import { Page } from '@playwright/test';

export async function checkHTTPStatus(page: Page){
  const response = await page.waitForResponse(response => true);
  const status = response.status();
  return status;
}


