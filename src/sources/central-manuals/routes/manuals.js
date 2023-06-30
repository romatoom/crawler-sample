import { Dataset } from "crawlee";
import * as cheerio from "cheerio";
import { CENTRAL_MANUALS_FORMATTERS } from "#utils/formatters.js";
import { settings } from "#utils/globals.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerManuals(router) {
  const { LABELS, BASE_URL, currentName } = settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, crawler, body, log }) => {
    log.debug(`request.url: ${request.url}`);

    // Fix html body layout
    let fixedBody = body;
    if (
      request.url ===
      "https://www.central-manuales.com/guia_de_uso_instrucciones_manual_tableta/wacom.php"
    ) {
      fixedBody = fixedBody.replace(
        "Bamboo FolioM.U.",
        "Bamboo Folio - M.U.</a></li>"
      );
      fixedBody = fixedBody.replace(
        "Bamboo SlateM.U.",
        "Bamboo Slate - M.U.</a></li>"
      );
      fixedBody = fixedBody.replace("</a></li></a></li>", "");
    }

    const $ = cheerio.load(fixedBody);

    const pages = $("div.pages a[href]");
    for (const page of pages) {
      const elem = $(page);

      const urlArr = request.url.split("/");
      urlArr.pop();
      urlArr.push(elem.attr("href"));
      const url = `${urlArr.join("/")}`;

      await crawler.addRequests([
        {
          url,
          label: LABELS.MANUALS,
          userData: {
            data: {
              ...request.userData.data,
            },
          },
        },
      ]);
    }

    const { langCode, category, brand } = request.userData.data;

    const lang = $("h1 span.font_size").text();

    let language = "English";
    if (lang.includes("Español")) language = "Español";
    if (lang.includes("Français")) language = "Français";

    const manualsLinks = $("#download_list li > a[href]");

    const manualsResults = [];
    const productsResults = [];
    const productsManualsResults = [];
    const productNames = new Set([]);

    for (const manualItem of manualsLinks) {
      const elem = $(manualItem);
      const manualHref = elem.attr("href");

      let manualTitle = elem.text().replaceAll("\n", " ").trim();

      // Fix manual title
      if (!manualTitle.includes(" - ")) {
        if (manualTitle.includes("- ")) {
          manualTitle = manualTitle.replace("- ", " - ");
        } else if (manualTitle.includes(" -")) {
          manualTitle = manualTitle.replace(" -", " - ");
        } else if (!manualTitle.includes("-")) {
          manualTitle = `${manualTitle} - Manual`;
        }
      }

      let priorityLanguage;
      if (manualTitle.endsWith("(en)")) {
        priorityLanguage = "English";
        manualTitle = manualTitle.replace("(en)", "").trim();
      }

      const pdfUrl = `${BASE_URL[langCode]}${manualHref.slice(2)}`;

      const { productName, manualType } =
        CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(manualTitle, langCode);

      const currentManualId = manualIdGenerator.next().value;

      manualsResults.push({
        innerId: currentManualId,
        materialType: manualType,
        pdfUrl,
        title: manualTitle,
        language: priorityLanguage || language,
      });

      if (!productNames.has(productName)) {
        productNames.add(productName);

        const currentProductId = productIdGenerator.next().value;

        productsResults.push({
          innerId: currentProductId,
          brand,
          category,
          name: productName,
          url: "",
          specs: [],
          images: [],
        });

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });

        if (settings.testMode) break;
      }
    }

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
