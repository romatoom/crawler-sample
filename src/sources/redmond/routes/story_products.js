import { settings } from "#utils/globals.js";

export default function addHandlerStoryProducts(router) {
  const { LABELS, STORE_URL } = settings.source;

  router.addHandler(
    LABELS.STORY_PRODUCTS,
    async ({ request, log, $, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const targets = [];

      const paginationExist =
        $(".review_pagination.catalog_pagination a").length > 0;

      // Только для первой страницы
      if (!request.url.includes("?PAGEN_6=")) {
        if (paginationExist) {
          const paginateLinks = $(".review_pagination.catalog_pagination a");
          const countOfPages = paginateLinks
            .eq(paginateLinks.length - 1)
            .text()
            .trim();

          const targets = [];

          for (let page = 2; page <= countOfPages; page++) {
            targets.push({
              url: `${request.url}?PAGEN_6=${page}`,
              label: LABELS.STORY_PRODUCTS,
              userData: {
                data: {
                  ...request.userData.data,
                },
              },
            });
          }

          await crawler.addRequests(targets);
        }
      }

      $(".main_catalog_item > div").each((_, product) => {
        targets.push({
          url: `${STORE_URL}${$(product)
            .find("a.outer_link_product")
            .attr("href")}`,

          label: LABELS.STORY_PRODUCT,

          userData: {
            data: {
              ...request.userData.data,

              productName: $(product)
                .find(".product_name span b")
                .text()
                .replace("REDMOND", "")
                .trim(),
            },
          },
        });
      });

      await crawler.addRequests(targets);
    }
  );
}
