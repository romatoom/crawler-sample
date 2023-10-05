
import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerManuals(router) {
  const { LABELS, BASE_URL, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { category, title, modelNumber, productURL, images, specs } =
      request.userData.data;

    const manualsResults = [];

    $("ul.dln-instruction-manuals__list > li").each((_, el) => {
      let url = $(el).find("a[href]").attr("href");
      url = `${BASE_URL}${url}`;

      const manualTitle = $(el)
        .find(
          ".dln-instruction-manuals__listText .dln-instruction-manuals__listText--title"
        )
        .text();

      const regexpLangs = /.*\(Instruction manuals(.+)\)/;
      const matchesLangs = regexpLangs.exec(manualTitle);

      const langsString = matchesLangs?.[1];
      const language = langsString
        ? langsString
            .trim()
            .split(",")
            .map((l) => l.trim())
        : [];

      const details = $(el)
        .find(
          ".dln-instruction-manuals__listText .dln-instruction-manuals__listText--details"
        )
        .text()
        .trim();

      const regexp = /.+\((.+)\)/;
      const matches = regexp.exec(details);
      const filesize = matches?.[1];
      const metadata = filesize ? { filesize } : {};

      const currentManualId = manualIdGenerator.next().value;

      manualsResults.push({
        innerId: currentManualId,
        materialType: "Manual",
        pdfUrl: encodeURI(url),
        title: `Manual for ${title}`,
        language,
        metadata,
      });
    });

    if (manualsResults.length === 0) return;

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: title,
        sku: modelNumber,
        url: productURL,
        specs,
        images,
      },
    ];

    const productsManualsResults = [];

    for (const manual of manualsResults) {
      productsManualsResults.push({
        productId: currentProductId,
        manualId: manual.innerId,
      });
    }

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    await manualsDataset.pushData(manualsResults);

    const productsDataset = await Dataset.open(`${currentName}/products`);
    await productsDataset.pushData(productsResults);

    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );
    await productsManualsDataset.pushData(productsManualsResults);
  });
}


