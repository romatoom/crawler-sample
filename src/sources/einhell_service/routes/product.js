import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import camelCase from "lodash/camelCase.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

import { getLanguageByLangCode } from "#utils/formatters.js";

export default function addHandlerProduct(router) {
  const { LABELS, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const identnumbers = [];

    $(".top-wide > .top-20 > a").each((_, el) => {
      identnumbers.push($(el).attr("id"));
    });

    // Manuals

    const documents = [];

    for (const identnumber of identnumbers) {
      $(`#document-select-${identnumber}`)
        .find("option")
        .each((_, el) => {
          const selector = $(el).attr("value");

          if (!selector) return true;

          const langCode = selector.split("-")[1];
          const language = getLanguageByLangCode(langCode);

          $(
            `.downloads-wrapper > div > .${selector} > .download__download > a[href]`
          ).each((_, el) => {
            const link = $(el);

            const pdfUrl = link.attr("href").replaceAll(" ", "%20");
            if (!pdfUrl.endsWith(".pdf")) return true;

            const manualTitle = `${link
              .text()
              .trim()} - ${identnumber}`.replace(/  +/g, " ");

            const seperatorIndex = manualTitle.indexOf(" for ");
            const materialType =
              seperatorIndex > -1
                ? manualTitle.substring(0, seperatorIndex)
                : "Manual";

            const metadata = { identnumber: identnumber };

            documents.push({
              pdfUrl,
              manualTitle,
              language,
              materialType,
              metadata,
            });
          });
        });
    }

    if (documents.length === 0) return;

    // Product

    const images = [
      $(".esi-main-image-outer img").attr("data-src").replaceAll(" ", "%20"),
    ];

    const category = $(".product-tpg > .heading.gamma").text().trim();

    const productName = $("#sylius-product-name").text().trim();

    let brand = "Einhell";
    const metadata = {};

    $(".column.top-wide > div > strong").each((_, el) => {
      const elemArr = $(el).text().split(":");
      if (elemArr.length < 2) return true;

      const attr = camelCase(elemArr[0]);

      const value = $(el)
        .parent()
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim();

      if (attr === "brand") {
        brand = value;
      } else {
        metadata[attr] = value;
      }
    });

    metadata.identnumbers = identnumbers;

    const specs = [];

    $("#technical-details .content-item h2.heading.delta").each((_, el) => {
      const group = $(el).text().trim();

      $(el)
        .parent()
        .next()
        .find(".table__table tr")
        .each((_, el) => {
          const tds = $(el).find("td");
          specs.push({
            group,
            label: tds.eq(0).text().trim(),
            values: tds.eq(1).text().trim(),
          });
        });
    });

    ///

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand,
        category,
        name: productName,
        url: request.url,
        specs,
        images,
        metadata,
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    for (const manual of documents) {
      const currentManualId = manualIdGenerator.next().value;

      manualsResults.push({
        innerId: currentManualId,
        materialType: manual.materialType,
        pdfUrl: manual.pdfUrl,
        title: manual.manualTitle,
        language: manual.language,
        metadata: manual.metadata,
      });

      productsManualsResults.push({
        productId: currentProductId,
        manualId: currentManualId,
      });
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
