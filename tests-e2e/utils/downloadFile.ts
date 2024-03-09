import { expect, Locator, Page } from "@playwright/test";
import pdfParse from "pdf-parse";
const fs = require("fs");

/**
 * Downloads a PDF file by clicking an element with the specified text and saves it with a timestamped filename.
 * @param {Page} page - The Playwright Page object representing a single page of the browser.
 * @param {string} elmText - The text content of the element to click for initiating the download.
 * @param {string} path - The local file system path where the downloaded file should be saved.
 * @returns {Promise<string>} The full path of the saved file.
 */
export async function downloadFile(
  page: Page,
  elmText: string,
  path: string
): Promise<string> {
  const downloadPromise = page.waitForEvent("download");
  await page.getByText(elmText).click();
  const download = await downloadPromise;

  // Extract the filename without extension and the extension itself
  const filenameWithoutExtension = download
    .suggestedFilename()
    .slice(0, download.suggestedFilename().lastIndexOf("."));

  const extension = download
    .suggestedFilename()
    .slice(download.suggestedFilename().lastIndexOf("."));

  // Construct the new filename with timestamp before the extension
  const newFilename = `${filenameWithoutExtension}${Date.now()}${extension}`;

  // Wait for the download process to complete and save the downloaded file somewhere.
  const filePath = path + newFilename;
  await download.saveAs(filePath);

  return filePath;
}

/**
 * Asserts the content of a downloaded PDF file by searching for expected text within it.
 * @param {string} filePath - The full path to the PDF file to be analyzed.
 * @param {string} expectedText - The text expected to be found within the PDF file.
 */
export async function assertPDFContent(filePath: string, expectedText: string) {
  const dataBuffer = fs.readFileSync(filePath);
  pdfParse(dataBuffer)
    .then(function (data) {
      expect(data.text.includes(expectedText)).toBeTruthy();
    })
    .catch(function (error) {
      console.error("Error parsing PDF:", error);
    });
}
