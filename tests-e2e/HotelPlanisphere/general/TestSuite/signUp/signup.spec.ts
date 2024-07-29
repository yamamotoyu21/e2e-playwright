import { test, expect, Page } from "@playwright/test";
import { SignUpPage, SignUpInfo } from "../../pages/SignupPage";
import { MyPage } from "../../pages/MyPage";
import defineConfig from "../../../../../playwright.config";
import data from "./data.json";

const origin = defineConfig.use.baseURL;

test.describe("Sign Up", () => {
  test.only("sign up", async ({ page }) => {
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

    // visit SignUpPage
    const signUpPage = new SignUpPage(page, origin);
    await signUpPage.visit();

    //Sign up and see if it navigates to myPage
    const myPage = await signUpPage.signUp(testData);
    await expect(page.url()).toContain(myPage.url);
    //Check if registered info is displayed except for those 'nonDisplayKeys'
    const nonDisplayKeys = new Set([
      "password",
      "rank",
      "gender",
      "dateOfBirth",
    ]);
    await myPage.assertRegisteredInfoVisible(testData, nonDisplayKeys);
  });
});
