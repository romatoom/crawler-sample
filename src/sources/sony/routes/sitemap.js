import { LABELS, BASE_URL } from "../constants.js";
import { settings } from "#utils/globals.js";

export default function addHandlerSitemap(router) {
  router.addHandler(LABELS.SITEMAP, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const productsBlock = $("#site-map-item-products .site-map-block");

    for (const productBlockItem of productsBlock) {
      const productBlockElem = $(productBlockItem);

      const categoryTitle = productBlockElem.find("h3").text();

      const list = productBlockElem.find("li");

      for (const li of list) {
        const elem = $(li);
        const containsUl = elem.find("ul").length > 0;

        if (!containsUl) {
          for (const discontinued of [true, false]) {
            await crawler.addRequests([
              {
                url: `${BASE_URL}${elem
                  .find("a")
                  .attr("href")}?discontinued=${discontinued}`,
                label: LABELS.PRODUCTS_LIST,
                userData: {
                  data: {
                    category: categoryTitle,
                    discontinued,
                  },
                },
              },
            ]);
          }
        }

        if (settings.testMode) break;
      }
    }
  });
}
