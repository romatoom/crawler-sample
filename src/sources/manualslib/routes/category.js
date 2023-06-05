import { LABELS, BASE_URL, PRODUCTS_LIMIT } from "../constants.js";
import { dataForPlaywrightCrawler } from "../playwright_crawler.js";

export default function addHandlerCategory(router) {
  router.addHandler(
    LABELS.CATEGORY,
    async ({ request, crawler, /* page, parseWithCheerio*/ $, log }) => {
      log.debug(`request.url: ${request.url}`);

      const products = $("div.row.tabled");

      let count = 0;

      for (const productItem of products) {
        const element = $(productItem);

        const productName = element.find("div.mname").text().trim();

        const manualLinks = element.find(".mlinks a[href]");

        dataForPlaywrightCrawler.push({
          productName,
          count: manualLinks.length,
        });

        /* for (const manualLinkItem of manualLinks) {
          const manualElement = $(manualLinkItem);
          const url = `${BASE_URL}${manualElement.attr("href")}`;

          await crawler.addRequests([
            {
              url,
              label: LABELS.MANUAL,
              userData: {
                data: {
                  ...request.userData.data,
                  manualType: manualElement.text().trim(),
                  productName,
                },
              },
            },
          ]);
        } */

        count++;
        // if (count >= PRODUCTS_LIMIT) break;
      }
    }
  );
}
