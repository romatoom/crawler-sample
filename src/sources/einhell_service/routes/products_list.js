import { settings } from "#utils/globals.js";

export default function addHandlerProductsList(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.PRODUCTS_LIST,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      if (!request.url.includes("?page=")) {
        const pageCount = $(".pagination__pagination .pagination__button")
          .last()
          .text();

        const targets = []

        for(let page=2; page<= pageCount; page++) {
          targets.push({
            url: `${request.url}?page=${page}`,
            label: LABELS.PRODUCTS_LIST,
          });
        }

        await crawler.addRequests(targets);
      }

      const productsTargets = [];

      $(".product__list > .list__list > .card__card > .card-wrapper a").each(
        (_, el) => {
          productsTargets.push({
            url: `${BASE_URL}${$(el).attr("href")}`,
            label: LABELS.PRODUCT,
          });
        }
      );

      await crawler.addRequests(productsTargets);
    }
  );
}
