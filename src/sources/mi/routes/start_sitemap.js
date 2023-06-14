import { LABELS } from "../constants.js";

import {
  getCurrentProductId,
  incrementCurrentProductId,
} from "#utils/globals.js";

export default function addHandlerStartSitemap(router) {
  router.addHandler(
    LABELS.START_SITEMAP,
    async ({ request, crawler, $, log }) => {
      log.debug(`request.url: ${request.url}`);

      const categoryBlocks = $(".sitemap__product__two-level");

      for (const categoryBlockItem of categoryBlocks) {
        const categoryBlockElement = $(categoryBlockItem);
        const categoryTitle = categoryBlockElement
          .find(".sitemap__product__two-level-title")
          .text()
          .trim();

        const products = categoryBlockElement.find(
          ".sitemap__product__item > a[href]"
        );

        for (const productItem of products) {
          const productItemElement = $(productItem);

          await crawler.addRequests([
            {
              url: productItemElement.attr("href"),
              label: LABELS.PRODUCT,
              userData: {
                data: {
                  innerId: getCurrentProductId(),
                  name: productItemElement.text().trim(),
                  category: categoryTitle,
                },
              },
            },
          ]);

          incrementCurrentProductId();
        }
      }
    }
  );
}
