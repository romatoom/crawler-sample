import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { getManuals } from "../api_utils.js";
import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerProduct(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const { category, sku, name, image } = request.userData.data;

    const manualsUrl = $(".p-product_detail-spec-related a.cmp-button").attr(
      "href"
    );

    const manuals = await getManuals(manualsUrl);
    if (manuals.length === 0) {
      return;
    }

    const specs = [];

    const specBlock = $(".p-product_detail-spec-accordion__item").eq(0);

    const group = specBlock
      .find(".p-product_detail-spec-accordion__header")
      .text()
      .trim();

    specBlock
      .find(".p-product_detail-spec-accordion__panel-inner li")
      .each((_, el) => {
        const label = $(el)
          .find(".p-product_detail-spec-accordion__panel-item-ttl h4")
          .text()
          .trim();

        const values = $(el)
          .find(".p-product_detail-spec-accordion__panel-item-cont")
          .text()
          .trim();

        if (label && values && values.length > 0) {
          specs.push({ group, label, values });
        }
      });

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name,
        sku,
        url: request.url,
        specs,
        images: [image],
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    for (const manualItem of manuals) {
      const currentManualId = manualIdGenerator.next().value;

      manualsResults.push({
        innerId: currentManualId,
        materialType: "Manual",
        pdfUrl: encodeURI(manualItem.url),
        title: `Manual for ${name}`,
        language: manualItem.language,
        metadata: {},
      });

      productsManualsResults.push({
        productId: currentProductId,
        manualId: currentManualId,
      });
    }

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    await manualsDataset.pushData(manualsResults);

    const productsDataset = await Dataset.open(`${currentName}/products`);
    await productsDataset.pushData(productsResults);

    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );
    await productsManualsDataset.pushData(productsManualsResults);
  });
}
