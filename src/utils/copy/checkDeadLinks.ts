import { Page } from "@playwright/test";
import axios from "axios";
import red from "chalk";
import yellow from "chalk";

/**
 * Send slack notifications
 * @param message message to send on slack
 * @param webhook slack webhook of the targeted slack channel
 */
const sendToSlack = async (message: string, webhook: string) => {
  const slackMessage = { text: message };
  await axios.post(webhook, slackMessage);
};

interface checkDeadLinksParams {
  /** userAgent */
  userAgent: string;
  /** slack webhook for production channel */
  webHookProd: string;
  /** slack webhook for staging channel */
  webHookStaging: string;
  /** group to ping on slack */
  groupMention: string;
}

/**
 * Evaluate all links of the targeted page and send slack message if an invalid link is found.
 * @param page PlayWright Page
 * @param mainDomain Domain to be targeted
 * @param targetPath path of the targeted page
 * @param params checkDeadLinksParams interface
 */
export const checkDeadLinks = async (
  page: Page,
  mainDomain: string,
  targetPath: string,
  params: checkDeadLinksParams
) => {
  //Visit specified URL
  const url = `${mainDomain}${targetPath}`;
  await page.goto(url);

  //Evaluate all the href and src from document
  const linkHrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
  const imgSrcs = await page.$$eval("img", (images) =>
    images.map((img) => img.src)
  );
  const allLinks = [...linkHrefs, ...imgSrcs];

  const errorLog: string[] = [];
  const forbiddenLog: string[] = [];

  const promises = allLinks.map(async (link) => {
    try {
      const res = await axios.get(link, {
        headers: {
          "User-Agent": params.userAgent,
        },
      });
    } catch (err) {
      //If error is 403, push to forbiddenLog
      if (err.response.status == 403) {
        const forbiddenMsg = `${err.response.status} ${link}`;
        forbiddenLog.push(forbiddenMsg);
        //If error is not 403, push to errorLog
      } else {
        const errorMsg = `${err.response.status} ${link}`;
        errorLog.push(errorMsg);
      }
    }
  });

  await Promise.all(promises);

  // Notify Slack only if an error log exists and the error log contains a 4xx or 5xx status code.
  if (
    forbiddenLog.length ||
    (errorLog.length &&
      (errorLog.some((log) => log.includes("5")) ||
        errorLog.some((log) => log.includes("4"))))
  ) {
    //display list of errors except 403 on terminal
    console.log("\n", `${red("Following URLs faced errors except 403:")}`);
    for (const log of errorLog) {
      console.error(red(log));
    }
    //display list of 403 on staging
    console.log("\n", `${yellow("Following URLs faced 403 warning:")}`);
    for (const log of forbiddenLog) {
      console.error(yellow(log));
    }

    // Define constants needed for slack messages
    const date = new Date();
    const localDate = date.toLocaleDateString();
    const localTime = date.toLocaleTimeString();
    const groupId = params.groupMention;
    const webHookProd = params.webHookProd;
    const webHookStg = params.webHookStaging;

    // Define message templates to include in slack message
    const commonMsgTemplete = `【Invalid URL bot】targets ${url}  ${localDate} ${localTime}`;
    const mention = ` \nmentions <!subteam^${groupId}>`;
    const invalidText = `\n\nThis is sent by invalid checker bot.\nHere are invalid URLs\n${errorLog.join(
      "\n  "
    )}`;
    const forbiddenText = `\n\n\nHere are URL facing status code 403\n${forbiddenLog.join(
      "\n  "
    )}`;
    const noInvalidFoundText = "\nNo invalid link found";

    let message = "";

    //Send slack message
    if (mainDomain.includes("localhost")) {
      // do nothing
    } else if (mainDomain.includes("staging")) {
      if (errorLog.length == 0 && forbiddenLog.length >= 1) {
        message = commonMsgTemplete + forbiddenText;
      } else if (errorLog.length >= 1 && forbiddenLog.length == 0) {
        message = commonMsgTemplete + invalidText;
      } else if (errorLog.length >= 1 && forbiddenLog.length >= 1) {
        message = commonMsgTemplete + invalidText + forbiddenText;
      } else {
        message = commonMsgTemplete + noInvalidFoundText;
      }
      // Send slack notification without mention if invalid links are found on staging
      await sendToSlack(message, webHookStg);
    } else if (mainDomain == "https://meetsmore.com") {
      if (errorLog.length == 0 && forbiddenLog.length >= 1) {
        message = commonMsgTemplete + forbiddenText;
      } else if (errorLog.length >= 1 && forbiddenLog.length == 0) {
        message = commonMsgTemplete + mention + invalidText;
      } else if (errorLog.length >= 1 && forbiddenLog.length >= 1) {
        message = commonMsgTemplete + mention + invalidText + forbiddenText;
      } else {
        message = commonMsgTemplete + noInvalidFoundText;
      }
      // send slack notification if invalid are found on production. Mentions MMQA except 403
      await sendToSlack(message, webHookProd);
    } else {
      console.log("targeted URL is not localhost, stg, nor production");
    }
    //If no invalid url is found, just show message and logs in terminal
  } else {
    console.log(` No Invalid link found on URL: ${url}`);
    console.log(red(errorLog));
    console.log(yellow(forbiddenLog));
  }

  //Throw error if an invalid link found.
  if (errorLog.some((log) => log.startsWith("5"))) {
    throw new Error("Test failed due to 5xx status codes");
  } else if (errorLog.some((log) => log.startsWith("4"))) {
    throw new Error("Test failed due to 4xx status codes");
  }
};
