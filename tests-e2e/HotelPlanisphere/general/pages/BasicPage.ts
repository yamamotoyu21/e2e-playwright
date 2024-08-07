import { Page } from "@playwright/test";

/**
 * Basic class extended by all POM
 */
export default abstract class BasicPage {
  constructor(
    public readonly page: Page,
    public readonly origin: string,
    public readonly lang: string = "ja"
  ) {}
}
