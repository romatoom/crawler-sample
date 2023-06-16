import { Dataset } from "crawlee";
import { LABELS, BASE_URL } from "../constants.js";
import { CENTRAL_MANUALS_FORMATTERS } from "#utils/formatters.js";

import {
  getCurrentManualId,
  incrementCurrentManualId,
  getCurrentProductId,
  incrementCurrentProductId,
} from "#utils/globals.js";

export default function addHandlerManuals(router) {
  router.addHandler(LABELS.MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const headerHTML = $("h1").html();
    const brand = $("h1 .cap").text().trim().replace(" - ", " / ");
    // const lang = $("h1 span.font_size").text();

    // let language = "English";\n
    // if (lang.includes("Español")) language = "Español";
    // if (lang.includes("Français")) language = "Français";

    const regexp = /<span class="cap">.+<\/span>(?<category>.+)<br>/;
    const matches = headerHTML.match(regexp);
    const category = matches.groups.category.replace("&amp;", "and").trim();

    const manualsLinks = $("#download_list a[href]");

    const manualsResults = [];
    const productsResults = [];
    const productsManualsResults = [];
    const productNames = new Set([]);

    for (const manualItem of manualsLinks) {
      const elem = $(manualItem);
      const manualHref = elem.attr("href");
      const manualTitle = elem.text().replace("\n", " ");
      const pdfUrl = `${BASE_URL}${manualHref.slice(2, manualHref.length)}`;

      const { productName, manualType } =
        CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(manualTitle);

      manualsResults.push({
        innerId: getCurrentManualId(),
        materialType: manualType,
        pdfUrl,
        title: manualTitle,
        language: "English",
      });

      if (!productNames.has(productName)) {
        productNames.add(productName);

        productsResults.push({
          innerId: getCurrentProductId(),
          brand,
          category,
          name: productName,
          url: "",
          specs: [],
          images: [],
        });

        productsManualsResults.push({
          productId: getCurrentProductId(),
          manualId: getCurrentManualId(),
        });

        incrementCurrentProductId();
      }

      incrementCurrentManualId();
    }

    const manuals = await Dataset.open("central-manuals/manuals");
    await manuals.pushData(manualsResults);

    const products = await Dataset.open("central-manuals/products");
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      "central-manuals/products_manuals"
    );
    await productsManuals.pushData(productsManualsResults);
  });
}
