import { Page, expect } from '@playwright/test';
const urls = require('../fixture/urls.json')

export async function checkHTTPStatus(page: Page){
  const response = await page.waitForResponse(response => true);
  const status = response.status();
  return status;
}

export async function checkFor404s(urls){
  for (const url of urls) {
   const response = await fetch(url);
   if(response.status !== 200){
     console.error(`Link to ${url} returned status code ${response}`)
   }
  }
}






