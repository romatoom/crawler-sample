import { Dataset } from "crawlee";
import { LABELS, SOURCE_NAME, BASE_URL } from "../constants.js";
import {
  productIdGenerator,
  manualIdGenerator
} from "#utils/generators.js";

export default function addHandlerProduct(router) {
  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const check =
      request.url ===
      "https://www.instrumart.com/products/38242/aemc-5233-trms-digital-multimeter";

    const { category, name, description, images } = request.userData.data;

    const brand = $("div.content-label:contains('Manufactured') + ul")
      .find("a[href]")
      .text();

    const manualsLink = $("#docs .pdf-resource a[href]");

    if (manualsLink.length === 0) return;

    const manualsResults = [];
    const productsManualsResults = [];

    const currentProductId = productIdGenerator.next().value;

    for (const manualItem of manualsLink) {
      const manualElem = $(manualItem);
      const pdfUrl = `${BASE_URL}${manualElem.attr("href")}`;

      let languages = ["English"];

      const manualHtml = manualElem.html().trim();
      const regexp = /(?<title>.+)\<small\>\((?<size>.+)\)\<\/small\>/s;
      const matches = manualHtml.match(regexp);

      let manualTitle = matches.groups.title
        ? matches.groups.title.trim()
        : `Manual for ${name}`;

      if (manualTitle.includes("Spanish")) {
        languages = ["Español"];
      } else if (manualTitle.includes("German, English and French versions")) {
        languages = ["Deutsch", "English", "Français"];
      }

      const metadata = matches.groups.size
        ? { size: matches.groups.size.trim() }
        : {};

      for (const language of languages) {
        const currentManualId = manualIdGenerator.next().value;

        const man = {
          innerId: currentManualId,
          materialType: "Manual",
          pdfUrl,
          title: manualTitle,
          language,
          metadata,
        };

        manualsResults.push(man);

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }

    const productsResults = [
      {
        innerId: currentProductId,
        brand,
        category,
        name,
        url: request.url,
        specs: [],
        images,
        metadata: {
          description,
        },
      },
    ];

    const manuals = await Dataset.open(`${SOURCE_NAME}/manuals`);
    await manuals.pushData(manualsResults);

    const products = await Dataset.open(`${SOURCE_NAME}/products`);
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      `${SOURCE_NAME}/products_manuals`
    );
    await productsManuals.pushData(productsManualsResults);
  });
}
