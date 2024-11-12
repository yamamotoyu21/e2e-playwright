import { Page, expect } from "@playwright/test";
import { timeoutMultiplier } from "src/utils/lib/util";

/**
 * Updates the instance_id in the stored local storage object within the browser context.
 * @param page - The Playwright page object.
 * @param newInstanceId - The new instance ID to be set.
 */
export const updateInstanceId = async (
  page: Page,
  newInstanceId: string
): Promise<void> => {
  await page.evaluate((newId) => {
    const storedData = localStorage.getItem("meetsmore");
    if (storedData) {
      const dataObj = JSON.parse(storedData);
      if (dataObj.bqData && dataObj.bqData.instance_id) {
        dataObj.bqData.instance_id = newId;
        localStorage.setItem("meetsmore", JSON.stringify(dataObj));
        console.log("instance_id updated to:", newId);
      }
    }
  }, newInstanceId); // Pass `newInstanceId` as an argument to the evaluate function
};

/**
 * Retrieves the value of the key from the local storage.
 * @param page - The Playwright page object.
 */
export const getLocalStorage = async (page: Page, localStorageKey: string) => {
  const localStorage = await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, localStorageKey);
  if (!localStorage) {
    throw new Error(`Local storage key ${localStorageKey} not found`);
  }
  return localStorage;
};
/**
 * Sets a key-value pair in the local storage and login to the targetedPage
 * @param page - The Playwright page object.
 * @param targetedPage - target page to visit after logging in
 * @param localStorageKey - The key to be set in local storage.
 * @param localStorageValue - The value to be set in local storage.
 */
export const loginByLocalStorage = async (
  page: Page,
  targetPage: string,
  localStorageKey: string,
  localStorageValue: string,
  tries = 0
): Promise<void> => {
  // Try to visit the page
  await page.goto(targetPage);

  // Set localStorage with token and reload the browser
  await page.evaluate(
    (keyValue) => {
      const [key, value] = keyValue;
      localStorage.setItem(key, value);
    },
    [localStorageKey, localStorageValue]
  );

  await page.reload();

  try {
    // Check if user is logged in
    await page.waitForURL(targetPage, { timeout: 2000 * timeoutMultiplier });
    expect(page.url()).toBe(targetPage);
  } catch {
    // If the user is not logged in, try again for at most 3 times. Otherwise, return error
    if (tries < 3) {
      await loginByLocalStorage(
        page,
        targetPage,
        localStorageKey,
        localStorageValue,
        tries + 1
      );
    } else {
      throw Error(`Cannot load ${targetPage}`);
    }
  }
};
