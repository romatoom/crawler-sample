import { Dataset } from "crawlee";

import varSave from "#utils/var_saver.js";

import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { settings } from "#utils/globals.js";

export default function addHandlerProduct(router) {
  const { LABELS, BASE_URL, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { category, name, description, images } = request.userData.data;

    const brand = $("div.content-label:contains('Manufactured') + ul")
      .find("a[href]")
      .text();

    const manualsLink = $("#docs .pdf-resource a[href]");

    if (manualsLink.length === 0 || brand === "") return;

    const manualsResults = [];
    const productsManualsResults = [];

    const currentProductId = productIdGenerator.next().value;

    for (const manualItem of manualsLink) {
      const manualElem = $(manualItem);

      const url = manualElem.attr("href");
      const pdfUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

      let languages = ["English"];

      const manualHtml = manualElem.html().trim();
      const regexp = /(?<title>.+)\<small\>\((?<size>.+)\)\<\/small\>/s;
      const matches = manualHtml.match(regexp);

      let manualTitle = matches?.groups?.title
        ? matches.groups.title.trim()
        : `Manual for ${name}`;

      if (manualTitle.includes("Spanish")) {
        languages = ["Español"];
      } else if (manualTitle.includes("German, English and French versions")) {
        languages = ["Deutsch", "English", "Français"];
      }

      const metadata = matches?.groups?.size
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

    varSave(productsResults, "productResults", settings.source);

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
