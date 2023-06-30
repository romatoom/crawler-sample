import { settings } from "#utils/globals.js";

export default function addHandlerProductsList(router) {
  const { LABELS, BASE_URL } = settings.source;
  router.addHandler(
    LABELS.PRODUCTS_LIST,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const products = $("#products .card > a[href]");

      for (const productItem of products) {
        const productElem = $(productItem);

        const url = `${BASE_URL}${productElem.attr("href")}`;

        const imageSrc = `${BASE_URL}${productElem
          .find("img")
          .attr("data-original")}`;
        const name = productElem.find(".product-name").text().trim();
        const description = productElem
          .find(".product-description")
          .text()
          .trim();

        await crawler.addRequests([
          {
            url,
            label: LABELS.PRODUCT,
            userData: {
              data: {
                ...request.userData.data,
                name,
                description,
                images: [imageSrc],
              },
            },
          },
        ]);

        if (settings.testMode) break;
      }
    }
  );
}
