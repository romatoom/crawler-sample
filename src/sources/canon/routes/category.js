import { settings } from "#utils/globals.js";
import { sleep } from "crawlee";
import varSave from "#utils/var_saver.js";

export default function addHandlerCategory(router) {
  const { LABELS } = settings.source;

  router.addHandler(
    LABELS.CATEGORY,
    async ({ request, page, log, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      const { category } = request.userData.data;

      const loadMoreSelector = ".amscroll-load-button";
      const productSelector = ".item.product.product-item";

      let loadMore = page.locator(loadMoreSelector);

      let i = 1;
      while (await loadMore.isVisible()) {
        console.log(`${i} iteration of category '${category}'`);
        await loadMore.click();
        await sleep(2000);
        await page.keyboard.down("End");
        await sleep(1000);
        i++;
      }

      await page.waitForSelector(productSelector);

      const products = [];

      const $ = await parseWithCheerio();
      const productItems = $(productSelector);

      for (const productItem of productItems) {
        const productElem = $(productItem);
        const link = productElem.find("a.product-item-link");
        const url = link.attr("href");
        const title = link.text().trim();

        let image = productElem
          .find(".product-image-container img")
          .attr("src")
          .replace(/wid=\d+/, "wid=1000");

        if (image.indexOf("wid=") == -1) {
          image = `${image}&wid=1000`;
        }

        products.push({
          title,
          url,
          category,
          image,
        });
      }

      varSave(products, "products", settings.source, "append", "array");
    }
  );
}
