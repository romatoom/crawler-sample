import { Dataset } from "crawlee";
import { LABELS } from "../constants.js";

export default function addHandlerProduct(router) {
  router.addHandler(LABELS.PRODUCT, async ({ request, crawler, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const BRAND = "Xiaomi";

    let specLink = $("a#nav-specs[href]");

    if (specLink.length !== 0) {
      let specLinkUrl = specLink.attr("href");
      if (!specLinkUrl.startsWith("https:")) {
        specLinkUrl = `https:${specLinkUrl}`;
      }

      await crawler.addRequests([
        {
          url: specLinkUrl,
          label: LABELS.PRODUCT_SPECS,
          userData: {
            data: {
              ...request.userData.data,
              brand: BRAND,
              url: request.url,
            },
          },
        },
      ]);
    } else {
      const product = {
        ...request.userData.data,
        brand: BRAND,
        url: request.url,
        specs: [],
        images: [],
      };

      const productsDataset = await Dataset.open("mi/products");
      await productsDataset.pushData(product);
    }
  });
}
