import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";

export default function addHandlerProduct(router) {
  const { LABELS, BRAND, currentName, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const documents = [];

    $("#product-download-categories .product-download-category").each(
      (_, manualBlock) => {
        const manualType = $(manualBlock)
          .find("a.product-download-category-heading > h3")
          .text()
          .trim();

        $(manualBlock)
          .find(".product-downlod-category-files .file-container")
          .each((_, fileContainer) => {
            const link = $(fileContainer).find("a");

            let url = link.attr("href");
            if (!url.endsWith(".pdf")) return true;

            url = `${BASE_URL}${url}`.replaceAll(" ", "%20");

            const manualTitle = link.text().trim();
            const size = $(fileContainer)
              .find("em")
              .text()
              .replace("(", "")
              .replace(")", "");

            documents.push({
              manualType,
              url,
              manualTitle,
              size,
            });
          });
      }
    );

    // if (documents.length === 0) return;

    let image = $(".product-image-container > img").attr("src");
    image = `${BASE_URL}${image}`;

    const title = $("#product-tech-specs-heading")
      .text()
      .replace("Tech Specs", "")
      .trim();

    const specs = [];

    $("#product-section-specs .product-tech-specs-row").each((_, row) => {
      const label = $(row).find(".product-tech-specs-label").text().trim();
      const values = $(row).find(".product-tech-specs-value").text().trim();

      if (label?.length > 0 && values?.length > 0) {
        specs.push({ label, values });
      }
    });

    await saveDataToDatasets(
      { image, title, productURL: request.url, specs, documents },
      settings.source
    );
  });
}

/*
function getLanguageByManualTitle(manualTitle) {
  "%20DE_WEB.pdf"
}
*/

async function saveDataToDatasets(
  { image, title, productURL, specs, documents },
  source
) {
  const productsDataset = await Dataset.open(`${source.currentName}/products`);

  const manualsDataset = await Dataset.open(`${source.currentName}/manuals`);

  const productsManualsDataset = await Dataset.open(
    `${source.currentName}/products_manuals`
  );

  const currentProductId = productIdGenerator.next().value;

  await productsDataset.pushData({
    innerId: currentProductId,
    brand: source.BRAND,
    category: "Metal detectors",
    name: title,
    url: productURL,
    specs,
    images: [image],
    metadata: {},
  });

  for (const manual of documents) {
    const currentManualId = manualIdGenerator.next().value;

    await manualsDataset.pushData({
      innerId: currentManualId,
      materialType: manual.manualType,
      pdfUrl: manual.url,
      title: manual.manualTitle,
      language: [],
      metadata: {
        size: manual.size,
      },
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  }
}
