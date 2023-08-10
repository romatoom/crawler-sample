import { settings } from "#utils/globals.js";

export default function addHandlerCollection(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.COLLECTION, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const products = $(
      ".product > .product-tile > .product-tile-image-container"
    );

    for (const productItem of products) {
      const productElem = $(productItem);
      const productNumber = productElem.find(".product-id").text();

      let productUrl = productElem.find("a[href]").attr("href");
      productUrl = `${BASE_URL}${productUrl}`;

      const images = productElem.find("a[href] > img");
      const imagesUrls = [];
      for (const imageItem of images) {
        const imageElem = $(imageItem);
        imagesUrls.push(imageElem.attr("src"));
      }

      await crawler.addRequests([
        {
          url: productUrl,
          label: LABELS.PRODUCT,
          userData: {
            data: {
              productNumber,
              images: [...imagesUrls],
            },
          },
        },
      ]);
    }
  });
}
