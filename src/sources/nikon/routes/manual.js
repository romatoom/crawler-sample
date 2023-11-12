import { settings } from "#utils/globals.js";
import { Dataset } from "crawlee";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";

export default function addHandlerManual(router) {
  const { LABELS, BASE_URL, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.MANUAL, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = [];

    $("#manual.contentsType .contents .intro .pseudoTable .row").each(
      (i, el) => {
        if (i === 0 || $(el).find("span.buttonCol a.button").length === 0)
          return true;

        let language = $(el).find("span.language").text().trim();

        const indexSquare = language.indexOf("(") || language.indexOf("（");

        if (indexSquare >= 0) {
          language = language.substring(0, indexSquare - 1);
        }

        manuals.push({
          title: $(el).find("strong.col").text().trim(),
          language,
          size: $(el).find("span.capacity").text().trim(),
          url: $(el).find("span.buttonCol a.button").attr("href").trim(),
        });
      }
    );

    if (manuals.length === 0) return;

    const { productName, category } = request.userData.data;

    let image = $(".photo img").attr("src");
    if (image) {
      image = `${BASE_URL}${image}`;
    }

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const currentProductId = productIdGenerator.next().value;

    await productsDataset.pushData({
      innerId: currentProductId,
      brand: BRAND,
      category,
      name: productName,
      url: null,
      specs: [],
      images: image ? [image] : [],
      metadata: {},
    });

    for (const manual of manuals) {
      const currentManualId = manualIdGenerator.next().value;

      const manualType = "Manual";

      await manualsDataset.pushData({
        innerId: currentManualId,
        materialType: manualType,
        pdfUrl: manual.url,
        title: manual.title,
        language: manual.language,
        metadata: {
          size: manual.size,
        },
      });

      await productsManualsDataset.pushData({
        productId: currentProductId,
        manualId: currentManualId,
      });
    }
  });
}
