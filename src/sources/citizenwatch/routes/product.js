import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerProduct(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);
    const { images, productNumber } = request.userData.data;

    const movementTechnology = $(
      ".col-12.pdp-detail-attribute-col.pdp-detail-attribute-header"
    )
      .filter(function () {
        return $(this).text().indexOf("Movement Technology") > -1;
      })
      .next()
      .find(
        ".pdp-detail-attribute-list-item.pdp-detail-attribute-list-item-bold"
      )
      .text()
      .trim();

    const downloadLink = $("a.setting-instructions-link[href]").first();
    const pdfUrl = downloadLink.attr("href");
    if (!pdfUrl) return;

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category: "Watch",
        name: productNumber,
        url: request.url,
        specs: [],
        images,
        metadata: {
          movementTechnology,
        },
      },
    ];

    const currentManualId = manualIdGenerator.next().value;

    const manualsResults = [
      {
        innerId: currentManualId,
        materialType: "Setting Instruction",
        pdfUrl,
        title: movementTechnology
          ? `Setting Instruction - ${movementTechnology}`
          : "Setting Instruction",
        language: "English",
      },
    ];

    const productsManualsResults = [
      {
        productId: currentProductId,
        manualId: currentManualId,
      },
    ];

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
