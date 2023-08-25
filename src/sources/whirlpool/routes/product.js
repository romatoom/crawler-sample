import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

import { getManuals } from "../api_utils.js";

import flow from "lodash/flow.js";

export default function addHandlerProduct(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { code, images, baseProduct, description, name, specs } =
      request.userData.data;

    const breadcrumbs = $(".breadcrumbs li.breadcrumbs-list-item span");
    let category = breadcrumbs.eq(breadcrumbs.length - 2).text();
    category = category.split("|")[0].trim();

    const productManuals = await getManuals(code);

    if (productManuals.length === 0) return;

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: `${code} - ${name}`,
        sku: code,
        url: request.url,
        specs,
        images,
        description,
        metadata: {
          baseProduct,
        },
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    for (const manualItem of productManuals) {
      const currentManualId = manualIdGenerator.next().value;

      const metadata = flow([
        Object.entries,
        (arr) => arr.filter(([key, value]) => value),
        Object.fromEntries,
      ])({
        description: manualItem.description,
        size: manualItem.size,
      });

      manualsResults.push({
        innerId: currentManualId,
        materialType: manualItem.type,
        pdfUrl: manualItem.url,
        title: manualItem.title,
        language: manualItem.languages,
        metadata,
      });

      productsManualsResults.push({
        productId: currentProductId,
        manualId: currentManualId,
      });
    }

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
