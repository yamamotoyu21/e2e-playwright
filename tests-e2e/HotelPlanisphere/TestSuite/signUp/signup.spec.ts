import { test, expect, Page } from "@playwright/test";
import { SignUpPage, SignUpInfo } from "../../pages/SignupPage";
import { MyPage } from "../../pages/MyPage";
import data from "./data.json";
import defineConfig from "../../../../../playwright.config";

const origin = defineConfig.use.baseURL;

test.describe("Sign Up", () => {
  test.only("signUp", async ({ page }) => {
    const d = data.newUser;

    const testData: SignUpInfo = {
      email: d.email,
      password: d.password,
      confirmPW: d.password,
      name: d.name,
      rank: d.rank,
      address: d.address,
      phone: d.phone,
      gender: d.gender,
      dateOfBirth: d.dateOfBirth,
    };

    //visit SignUpPage
    const signUpPage = new SignUpPage(page, origin);
    await signUpPage.visit();
    await page.waitForLoadState();

    //Sign up and see if it navigates to myPage
    await signUpPage.signUp(testData);
    const myPage = new MyPage(page, origin);
    // const mypage: MyPage = await signUpPage.signUp(testData);
    await myPage.assertURL();
    //Check if registered info is displayed except for those 'nonDisplayKeys'
    const nonDisplayKeys = new Set([
      "password",
      "rank",
      "gender",
      "dateOfBirth",
    ]);
    await myPage.assertRegisteredInfo(testData, nonDisplayKeys);
  });
});
