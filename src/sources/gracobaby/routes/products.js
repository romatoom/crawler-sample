import { sleep } from "crawlee";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { baseURL } = source;

  return async ({ request, log, page, parseWithCheerio }) => {
    log.debug(`request.url: ${request.url}`);

    const $ = await parseWithCheerio();
    const productsCount = parseInt(
      $("span#search-result-count-label").attr("data-total-results")
    );
    console.log("productsCount", productsCount);
    const iterationCount = Math.ceil(productsCount / 24);

    const loadMoreSelector = ".show-more > div > button";
    const productSelector = ".product-tile-wrap > .product > .product-tile";

    let loadMore = await page.locator(loadMoreSelector);

    //

    let i = 1;
    let modalClosed = false;

    const sleepTime = () => {
      return modalClosed ? 500 : 2000;
    };

    try {
      while (await loadMore.isVisible()) {
        console.log(`${i} iteration of ${iterationCount}`);

        const modalExists = await page.isVisible("#sfis-main-container");
        if (modalExists) {
          await page.locator("#sfis-popup-dismissal-form").click();
          modalClosed = true;
        }

        await loadMore.click();

        await sleep(sleepTime());

        await page.keyboard.down("End");

        await sleep(sleepTime());

        i++;

        if (i > iterationCount) break;
      }
    } catch (err) {
      //
    }

    const products = [];

    const productsElems = await page.locator(productSelector).all();

    // console.log(productsElems.length);

    for (const productItem of productsElems) {
      try {
        const link = await productItem.locator("a.product-tile-link");

        const url = await link.getAttribute("href");
        const title = ((await link.getAttribute("aria-label")) || "")
          .replaceAll("™", "")
          .trim();

        let image = await productItem
          .locator(".image-container img.tile-image")
          .getAttribute("src");

        if (
          image ===
          "https://s7d9.scene7.com/is/image/NewellRubbermaid/graco-placeholder-image_3000-01"
        ) {
          image = null;
        }

        products.push({
          url: `${baseURL}${url}`,
          title,
          image,
        });

        //await state.serializer.dump({ products }, { append: true });
      } catch (err) {
        continue;
      }
    }

    await state.serializer.dump({ products });
  };
}
