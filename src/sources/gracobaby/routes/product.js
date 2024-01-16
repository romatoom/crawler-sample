import state from "#utils/classes/state.js";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

export default function routeHandler(source) {
  const { brand } = source;

  return async ({ request, log, page, parseWithCheerio }) => {
    log.debug(`request.url: ${request.url}`);

    const $ = await parseWithCheerio();

    const documents = [];

    $("#collapsible-pdp-details-5 a.btn-link").each((_, link) => {
      const url = $(link).attr("href").replaceAll(" ", "%20");
      if (!url.endsWith(".pdf")) return true;

      const title = $(link)
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .replace("DOWNLOAD", "")
        .trim();

      documents.push({ url, title });
    });

    if (documents.length === 0) return;

    const { title, image } = request.userData.data;

    const description = $("#collapsible-pdp-details-1").text().trim();

    const specs = [];

    $("ul > li.specifications-row > div").each((_, specRow) => {
      const [labelEl, valuesEl] = $(specRow).find("span");
      const label = $(labelEl).text().trim();
      const values = $(valuesEl).text().trim();
      specs.push({ label, values });
    });

    const category = $(".breadcrumb-item").last().text().trim();

    const product = new Product({
      brand,
      category,
      name: title,
      specs,
      images: image ? [image] : [],
      metadata: {
        description,
      },
    });

    await state.storage.pushData(product);

    for (const manualData of documents) {
      const manual = new Manual({
        materialType: "Manual",
        pdfUrl: manualData.url,
        title: manualData.title,
        language: [],
      });

      const productManual = new ProductManual({
        productId: product.data.innerId,
        manualId: manual.data.innerId,
      });

      await state.storage.pushData(manual);
      await state.storage.pushData(productManual);
    }
  };
}
