import { Page, expect } from "src/utils/fixtures";

interface SEOCheckOptions {
  expectedH1: string;
  expectedTitle: string;
  expectedH2Count?: number;
  expectNoIndex?: boolean;
  expectedContent?: string;
}

/**
 * Check SEO info of the page
 *  targeting h1, title, meta[description], noIndex
 * @param expectedHeader expected text for the HTML tag 'h1'
 * @param options optional An object containing all expected values for the SEO checks.
 *              if it's not defined, the function simply display the current SEO info
 */
export async function checkSEOTags(
  page: Page,
  options: SEOCheckOptions
): Promise<void> {
  const {
    expectedH1,
    expectedTitle,
    expectedH2Count,
    expectNoIndex,
    expectedContent,
  } = options;

  //get HTML tag info
  const h1Text = await page.locator("h1").textContent();

  const h2Count = (await page.$$("h2")).length;

  const titleText = await page.locator("title").textContent();

  const description = await page.$eval('meta[name="description"]', (element) =>
    element.getAttribute("content")
  );

  const robots = await page.$eval('meta[name="robots"]', (element) =>
    element.getAttribute("content")
  );

  //Check SEO Tag info should be expected
  await expect(h1Text).toBe(expectedH1);

  await expect(titleText).toBe(expectedTitle);

  if (expectedH2Count) {
    await expect(h2Count).toBe(expectedH2Count);
  }

  if (expectNoIndex) {
    await expect(robots).toBe("noIndex");
  } else {
    await expect(robots).not.toBe("noIndex");
  }

  if (expectedContent) {
    await expect(description).toBe(expectedContent);
  }

  //Display current info on console
  console.log(`SEO Tag Information:
        - H1 Text: ${h1Text}
        - H2 Count: ${h2Count}
        - Title Text: ${titleText}
        - Description: ${description}
        - Robots: ${robots}`);
}

interface BreadcrumbCheckOptions {
  expectedTexts: string[];
}

/**
 * Checks the content of breadcrumbs on a page against expected text values.
 *
 * This function assumes that breadcrumbs are structured in an ordered list (`<ol>`)
 * and each breadcrumb item is contained within list items (`<li>`). It supports
 * custom class names for the `<ol>` and `<li>` elements as seen in provided HTML structures.
 *
 * @param page The Page object from Playwright to perform queries on.
 * @param options An object containing the expected breadcrumb texts in the order they appear.
 *
 * @example
 *
 * const breadcrumbOptions = {
 *   expectedTexts: [
 *     'トップ »',
 *     '【テスト用】見積もりカテゴリ 01 »',
 *     '【テスト用】見積もりサービス 02の比較 »',
 *     '【テスト用】ミツモア 05-2の機能'
 *   ]
 * };
 *
 * await checkBreadcrumbContent(page, breadcrumbOptions);
 */
export async function checkBreadcrumbContent(
  page: Page,
  options: BreadcrumbCheckOptions
): Promise<void> {
  const { expectedTexts } = options;

  // Selector for the breadcrumb list items
  const breadcrumbSelector = "ol > li";

  // Count the number of breadcrumb items
  const itemCount = (await page.$$(breadcrumbSelector)).length;

  // Verify the number of breadcrumbs matches the expected count
  await expect(itemCount).toBe(expectedTexts.length);

  // Loop through each breadcrumb item and verify its text
  for (let i = 0; i < itemCount; i++) {
    const itemText = await page
      .locator(breadcrumbSelector)
      .nth(i)
      .textContent();

    if (!itemText) {
      throw new Error(`Breadcrumb item at index ${i} is empty
        - Expected: ${expectedTexts[i]}`);
    }

    // Using trim() to remove any leading/trailing whitespace and compare
    await expect(itemText.trim()).toBe(expectedTexts[i]);
  }
}
