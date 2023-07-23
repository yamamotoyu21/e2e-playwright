import { test, expect, Page } from "@playwright/test";
import { SignUpPage, signUpInfo } from "../general/pages/signup.page";
import { myPage } from "../general/pages/mypage.page";

test.describe("Sign Up", () => {
  let signUpPage: SignUpPage;

  test("signUp", async ({ browser, page }) => {
    const signUpInfo: signUpInfo = {
      email: `moonwalker1121@gmail.com`,
      password: "password",
      name: "John",
      rank: "Membership",
      address: "Freeway street",
      phone: "09021731095",
      gender: "2",
      dateOfBirth: "1996-11-21",
    };

    signUpPage = new SignUpPage(page);
    await signUpPage.visit();
    const myPageInstance: myPage = await signUpPage.signUp(signUpInfo);

    // myPageのページオブジェクトモデルが正しく返されたかを確認
    await expect(myPageInstance).toBeDefined();

    // submitボタンを押した後のURLがmyPageのURLと一致するか確認
    const myPageURL = "https://hotel.testplanisphere.dev/ja/mypage.html";
    await page.waitForURL(myPageURL);
    const currentURL = await myPageInstance.getCurrentURL();
    await expect(currentURL).toBe(myPageURL);
  });
});
