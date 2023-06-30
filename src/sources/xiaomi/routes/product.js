import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";

export default function addHandlerProduct(router) {
  const { LABELS, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, crawler, $, log }) => {
    log.debug(`request.url: ${request.url}`);

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
              url: request.url,
            },
          },
        },
      ]);
    } else {
      const product = {
        ...request.userData.data,
        url: request.url,
        specs: [],
      };

      const productsDataset = await Dataset.open(`${currentName}/products`);
      await productsDataset.pushData(product);
    }
  });
}
