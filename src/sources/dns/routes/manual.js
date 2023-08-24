import { Dataset, sleep } from "crawlee";
import { settings } from "#utils/globals.js";
import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";
import { getProductURLs } from "../products_urls_generator.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerManual(router) {
  const { LABELS, currentName } = settings.source;

  router.addHandler(LABELS.MANUAL, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const { productUrl, category, images, brand, name } = request.userData.data;

    varSave(
      [{ url: productUrl }],
      "processedURLs",
      settings.source,
      "append",
      "array"
    );

    const links = $("a.files-group-item__link[href]");

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand,
        category,
        name,
        url: productUrl,
        specs: [],
        images,
        metadata: {},
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    for (const linkItem of links) {
      const linkElem = $(linkItem);
      const pdfUrl = linkElem.attr("href");
      let manualTitle = linkElem.find(".files-group-item__title").text();

      if (manualTitle.startsWith("Инструкция:") && pdfUrl.endsWith(".pdf")) {
        manualTitle = manualTitle.replace("Инструкция:", "").trim();

        const currentManualId = manualIdGenerator.next().value;

        manualsResults.push({
          innerId: currentManualId,
          materialType: "Instruction",
          pdfUrl,
          title: manualTitle,
          language: "Русский",
        });

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }

    if (manualsResults.length > 0) {
      const manuals = await Dataset.open(`${currentName}/manuals`);
      await manuals.pushData(manualsResults);

      const products = await Dataset.open(`${currentName}/products`);
      await products.pushData(productsResults);

      const productsManuals = await Dataset.open(
        `${currentName}/products_manuals`
      );
      await productsManuals.pushData(productsManualsResults);
    }

    const productURLsBlock = getProductURLs();
    if (!productURLsBlock) return;

    const [nextProductUrl] = productURLsBlock;

    await crawler.addRequests([
      {
        url: nextProductUrl.url,
        label: LABELS.PRODUCT,
        userData: {
          data: {
            category: nextProductUrl.category,
          },
        },
      },
    ]);
  });
}
