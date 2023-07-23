import { test, expect, Page } from "@playwright/test";
import { SignUpPage, signUpInfo } from "../../pages/signup.page";
import { myPage } from "../../pages/mypage.page";
import data from "./data.json"

test.describe("Sign Up", () => {
  let signUpPage: SignUpPage;

  test.only("signUp", async ({ browser, page }) => {
    const testData: signUpInfo = {
      email: data.newUser.email,
      password: data.newUser.password,
      name: data.newUser.name,
      rank: data.newUser.rank,
      address: data.newUser.address,
      phone: data.newUser.phone,
      gender: data.newUser.gender,
      dateOfBirth: data.newUser.dateOfBirth
    };

    //instantiate SignUpPage
    signUpPage = new SignUpPage(page);

    //visit signUpPage
    await signUpPage.visit();

    //Sign up and see if it returns myPage object
    const mypage: myPage = await signUpPage.signUp(testData);
    await expect(mypage).toBeDefined();

    //Check if the navigated URL is correct
    await mypage.assertURL()
    
    //Check if registered info is displayed
    const nonDisplayKeys = new Set(["password", "rank", "gender", "dateOfBirth"]);
    await mypage.assertRegsteredInfo(testData, nonDisplayKeys)
  });
});
