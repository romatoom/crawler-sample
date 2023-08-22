import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";
import { sleep } from "crawlee";
import { getProductURLs } from "../products_urls_generator.js";

export default function addHandlerProduct(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log, crawler }) => {
    // log.debug(`request.url: ${request.url}`);

    let manualPageURL = $("a[data-tab-name='driver']").attr("href");
    if (!manualPageURL) {
      varSave(
        [{ url: request.url }],
        "processedURLs",
        settings.source,
        "append",
        "array"
      );

      const productURLsBlock = getProductURLs();
      if (!productURLsBlock) return;

      const [nextProductUrl] = productURLsBlock;

      await crawler.addRequests([
        {
          url: nextProductUrl.url,
          label: LABELS.PRODUCT,
          userData: {
            data: {
              category: nextProductUrl.category,
            },
          },
        },
      ]);

      return;
    }
    manualPageURL = `${BASE_URL}${manualPageURL}`;

    const brand = $(".product-card-top__brand img").attr("alt");
    const imageURL = $(".product-images-slider img").attr("src") || "";
    const name = $("h1.product-card-top__title").text();

    await crawler.addRequests([
      {
        url: manualPageURL,
        label: LABELS.MANUAL,
        userData: {
          data: {
            ...request.userData.data,
            name,
            images: [imageURL],
            brand,
            productUrl: request.url,
          },
        },
      },
    ]);
  });
}
