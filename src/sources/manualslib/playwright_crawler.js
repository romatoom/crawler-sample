import { PlaywrightCrawler, Router, log } from "crawlee";
import { LABELS } from "./constants.js";

export const dataForPlaywrightCrawler = [];

const crawlerRouter = Router.create();

crawlerRouter.addHandler(
  LABELS.DOWNLOAD_MANUAL,
  async ({ request, page, parseWithCheerio }) => {
    log.info("playwrightCrawler:");
    console.log("request.url:", request.url);
    log.info("request.userData.data", request.userData.data);

    await page.waitForSelector(".captcha_block_left");
    // console.log(page.locator(".captcha_block_left"));
    const box = await page.locator(".captcha_block_left").boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    await page.waitForSelector(".button-get-manual");
    // console.log(page.locator(".button-get-manual"));
    page.locator(".button-get-manual").click();

    await page.waitForSelector("a.download-url");
    console.log(page.locator("a.download-url").text());

    /* useSessionPool: true,
      persistCookiesPerSession: true,
      proxyConfiguration */
  }
);

export const playwrightCrawler = new PlaywrightCrawler({
  requestHandler: crawlerRouter,
  headless: false,
});
