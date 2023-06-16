import { Dataset } from "crawlee";
import { LABELS, BASE_URL } from "../constants.js";
import { CENTRAL_MANUALS_FORMATTERS } from "#utils/formatters.js";

import {
  getCurrentManualId,
  incrementCurrentManualId,
  getCurrentProductId,
  incrementCurrentProductId,
} from "#utils/globals.js";

export default function addHandlerSitemap(router) {
  router.addHandler(LABELS.SITEMAP, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const productsBlock = $("#site-map-item-products .site-map-block");

    for (const productBlockItem of productsBlock) {
      const productBlockElem = $(productBlockItem);

      const categoryName = productBlockElem.find("h3").text();
      console.log(categoryName);

      /* manualsResults.push({
        innerId: getCurrentManualId(),
        materialType: manualType,
        pdfUrl,
        title: manualTitle,
        language: "English",
      });

      if (!productNames.has(productName)) {
        productNames.add(productName);

        productsResults.push({
          innerId: getCurrentProductId(),
          brand,
          category,
          name: productName,
          url: "",
          specs: [],
          images: [],
        });

        productsManualsResults.push({
          productId: getCurrentProductId(),
          manualId: getCurrentManualId(),
        });

        incrementCurrentProductId();
      }

      incrementCurrentManualId(); */
    }

    /* const manuals = await Dataset.open("central-manuals/manuals");
    await manuals.pushData(manualsResults);

    const products = await Dataset.open("central-manuals/products");
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      "central-manuals/products_manuals"
    );
    await productsManuals.pushData(productsManualsResults); */
  });
}
