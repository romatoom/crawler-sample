import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";

import state from "#utils/classes/state.js";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

export default function addHandlerProduct(router) {
  const { LABELS, BRAND, BASE_URL, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = [];

    $("a.pdfDown").each((_, el) => {
      const url = $("a.pdfDown").attr("href");
      if (!url.endsWith(".pdf")) return true;

      manuals.push(encodeURI(`${BASE_URL}${url}`));
    });

    if (manuals.length === 0) return;

    const { productName, category } = request.userData.data;

    let sku;
    if (productName === "Gourmia GWM448 Rotating Waffle") {
      sku = "GWM448";
    } else {
      sku = productName.split(" ")[0];
    }

    const images = [];

    $("#slider ul.slides > li > img").each((_, image) => {
      images.push(`${BASE_URL}/${$(image).attr("src")}`);
    });

    /* const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    ); */

    const currentProductId = productIdGenerator.next().value;

    const product = new Product({
      innerId: currentProductId,
      brand: BRAND,
      category,
      name: productName,
      url: request.url,
      sku,
      specs: [],
      images,
    });

    await state.storage.pushData(product);

    for (const manualLink of manuals) {
      const currentManualId = manualIdGenerator.next().value;

      const manual = new Manual({
        innerId: currentManualId,
        materialType: "Manual",
        pdfUrl: manualLink,
        title: `Manual for ${productName}`,
        language: "English",
        metadata: {},
      });

      await state.storage.pushData(manual);

      const productManual = new ProductManual({
        productId: currentProductId,
        manualId: currentManualId,
      });

      await state.storage.pushData(productManual);
    }
  });
}
