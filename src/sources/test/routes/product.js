import state from "#utils/classes/state.js";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

export default function routeHandler(source) {
  const { baseURL, brand } = source;

  return async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = [];

    $("a.pdfDown").each((_, el) => {
      const url = $(el).attr("href");
      if (!url.endsWith(".pdf")) return true;

      manuals.push(encodeURI(`${baseURL}${url}`));
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
      images.push(`${baseURL}/${$(image).attr("src")}`);
    });

    const product = new Product({
      brand,
      category,
      name: productName,
      url: request.url,
      sku,
      specs: [],
      images,
    });

    await state.storage.pushData(product);

    for (const manualLink of manuals) {
      const manual = new Manual({
        materialType: "Manual",
        pdfUrl: manualLink,
        title: `Manual for ${productName}`,
        language: "English",
        metadata: {},
      });

      await state.storage.pushData(manual);

      const productManual = new ProductManual({
        productId: product.data.innerId,
        manualId: manual.data.innerId,
      });

      await state.storage.pushData(productManual);
    }
  };
}
