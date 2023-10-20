import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerProduct(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = [];

    $(".div-table .div-table-row.div-table-body-Maual").each((_, row) => {
      manuals.push({
        lang: $(row).find(".div-table-cell.download-desc").text().trim(),
        url: $(row).find(".div-table-cell.download-site a").attr("href"),
      });
    });

    if (manuals.length === 0) return;

    const { productName, image, category } = request.userData.data;

    const manualsResults = [];
    const productsManualsResults = [];

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: productName,
        url: request.url.replace("/support#support-manual", ""),
        specs: [],
        images: image ? [image] : [],
        metadata: {},
      },
    ];

    for (const manual of manuals) {
      const currentManualId = manualIdGenerator.next().value;

      manualsResults.push({
        innerId: currentManualId,
        materialType: "Manual",
        pdfUrl: manual.url,
        title: `Manual for ${productName}`,
        language: manual.lang === "Default" ? [] : manual.lang,
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
