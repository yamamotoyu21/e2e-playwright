import { test, expect, Page } from "@playwright/test";
import { SignUpPage, SignUpInfo } from "../../pages/SignupPage";
import { MyPage } from "../../pages/MyPage";
import data from "./data.json";
import defineConfig from "../../../../../playwright.config";

const origin = defineConfig.use.baseURL;

test.describe("Sign Up", () => {
  let signUpPage: SignUpPage;

  test.only("signUp", async ({ browser, page }) => {
    const testData: SignUpInfo = {
      email: data.newUser.email,
      password: data.newUser.password,
      confirmPW: data.newUser.password,
      name: data.newUser.name,
      rank: data.newUser.rank,
      address: data.newUser.address,
      phone: data.newUser.phone,
      gender: data.newUser.gender,
      dateOfBirth: data.newUser.dateOfBirth,
    };

    //instantiate SignUpPage
    signUpPage = new SignUpPage(page, origin);

    //visit signUpPage
    await signUpPage.visit();

    //Sign up and see if it returns myPage object
    const mypage: MyPage = await signUpPage.signUp(testData);
    await expect(mypage).toBeDefined();

    //Check if the navigated URL is correct
    await mypage.assertURL();

    //Check if registered info is displayed except for those 'nonDisplayKeys'
    //   const nonDisplayKeys = new Set([
    //     "password",
    //     "rank",
    //     "gender",
    //     "dateOfBirth",
    //   ]);
    //   await mypage.assertRegisteredInfo(testData, nonDisplayKeys);
    // });
  });
});
