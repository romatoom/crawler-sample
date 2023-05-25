import { labels } from "../constants.js";

export default function addHandlerStartSitemap(router) {
  router.addHandler(
    labels.START_SITEMAP,
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
              label: labels.PRODUCT,
              userData: {
                data: {
                  name: productItemElement.text().trim(),
                  category: categoryTitle,
                },
              },
            },
          ]);
        }
      }
    }
  );
}
