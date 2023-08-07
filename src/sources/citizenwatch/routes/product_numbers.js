import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerProductNumbers(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.PRODUCT_NUMBERS,
    async ({ request, page, log, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      // await page.waitForSelector("span#js-add-search-num");

      await page.waitForSelector("input[id='search-input']");
      await page.locator("input[id='search-input']").fill("");

      await page.waitForSelector("button[id='search-submit']");
      await page.locator("button[id='search-submit']").click();

      await page.waitForSelector("div[class='product']");

      let visibleItemsCount = await page
        .locator("div[class='product']")
        .count();

      const itemsCount = parseInt(
        await page.locator("[id='js-add-search-num']").textContent()
      );

      const moreSearch = await page.locator(".more-search-btn");

      while (visibleItemsCount < itemsCount) {
        await moreSearch.click();

        visibleItemsCount = await page.locator("div[class='product']").count();
        console.log("visibleItemsCount", visibleItemsCount);
      }

      const productNumbers = [];

      const $ = await parseWithCheerio();
      const products1 = $(".product");
      for (const p of products1) {
        const pElem = $(p);

        let url = pElem.find("a[href]").attr("href");
        url = `${BASE_URL}${url}`;

        const imgUrl = pElem.find(".product-image > img").attr("src");

        const productNumber = pElem.find("h3.product-no").text();

        const model = pElem.find("p.model-number").text();

        productNumbers.push({
          url,
          imgUrl,
          productNumber,
          model,
        });
      }

      await varSave(productNumbers, "productNumbers", settings.source);
    }
  );
}
