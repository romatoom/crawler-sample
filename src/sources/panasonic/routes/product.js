import { settings } from "#utils/globals.js";
import { Dataset } from "crawlee";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerProduct(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { category, images, parsedManuals } = request.userData.data;

    const sku = $(".product-info__sku").text().replace("SKU: ", "").trim();

    const manuals = parsedManuals[sku] || [];

    const manualURL = $("a")
      .filter(function () {
        return $(this).text().trim() === "User Manuals";
      })
      .attr("href");

    if (manualURL?.endsWith(".pdf")) {
      manuals.push({
        manualTitle: `Manual for ${sku}`,
        manualURL,
        manualType: "Manual",
      });
    }

    if (manuals.length === 0) return;

    const productTitle = $("h1.product-info__title.h1").text().trim();

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const currentProductId = productIdGenerator.next().value;

    await productsDataset.pushData({
      innerId: currentProductId,
      brand: BRAND,
      category,
      name: productTitle,
      url: request.url,
      specs: [],
      images,
      sku,
      metadata: {},
    });

    varSave([sku], "skuList", settings.source, "append", "array");

    for (const manual of manuals) {
      const currentManualId = manualIdGenerator.next().value;

      await manualsDataset.pushData({
        innerId: currentManualId,
        materialType: manual.manualType,
        pdfUrl: manual.manualURL,
        title: manual.manualTitle,
        language: [],
        metadata: {},
      });

      await productsManualsDataset.pushData({
        productId: currentProductId,
        manualId: currentManualId,
      });
    }
  });
}
