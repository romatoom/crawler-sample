import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { getManualsFromSupportPage, getTypeManual } from "../api_utils.js";
import flow from "lodash/flow.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerSupportManuals(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.SUPPORT_MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { name, category } = request.userData.data;

    const documents = await getManualsFromSupportPage(request.url);

    if (Object.keys(documents).length === 0) return;

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name,
        url: request.url,
        specs: [],
        images: [],
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    Object.entries(documents).forEach(([key, values]) => {
      const materialType = getTypeManual(key);
      for (const manualItem of values) {
        const currentManualId = manualIdGenerator.next().value;

        const metadata = flow([
          Object.entries,
          (arr) => arr.filter(([key, value]) => value),
          Object.fromEntries,
        ])({
          date: manualItem.date,
          size: manualItem.size,
        });

        manualsResults.push({
          innerId: currentManualId,
          materialType,
          pdfUrl: manualItem.url,
          title: manualItem.name,
          language: [],
          metadata,
        });

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    });

    const manuals = await Dataset.open(`${currentName}/manuals`);
    await manuals.pushData(manualsResults);

    const products = await Dataset.open(`${currentName}/products`);
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      `${currentName}/products_manuals`
    );
    await productsManuals.pushData(productsManualsResults);
  });
}
