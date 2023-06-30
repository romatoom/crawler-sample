import { getExistingProductsNames } from "../temp_data.js";
import { settings } from "#utils/globals.js";

export default function addHandlerProductsList(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.PRODUCTS_LIST,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const products = $(".product-block");

      for (const productItem of products) {
        const productElem = $(productItem);

        const productUrl = `${BASE_URL}${productElem
          .find("a")
          .attr("href")
          .trim()}`;

        let productName = productElem.find(".product-name").text().trim();

        const { discontinued } = request.userData.data;

        if (
          discontinued &&
          productName.toLowerCase().endsWith("discontinued")
        ) {
          const productNameWordsList = productName.split(" ");
          productNameWordsList.pop();
          productName = productNameWordsList.join(" ");
        }

        if (
          (settings.onlyNewProducts &&
            getExistingProductsNames().includes(productName)) ||
          productName.endsWith("Series")
        )
          continue;

        const productDescr = productElem
          .find(".product-descriptors")
          .text()
          .trim();

        let productImageUrl = productElem
          .find(".product-image img")
          .attr("src");
        productImageUrl = `https:${productImageUrl}`;

        await crawler.addRequests([
          {
            url: productUrl,
            label: LABELS.PRODUCT,
            userData: {
              data: {
                ...request.userData.data,
                productName,
                productDescr,
                images: [productImageUrl],
              },
            },
          },
        ]);

        if (settings.testMode) break;
      }
    }
  );
}
