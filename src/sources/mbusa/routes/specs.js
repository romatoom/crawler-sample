import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator } from "#utils/generators.js";

export default function addHandlerSpecs(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.SPECS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { model, modelTitle, series, images } = request.userData.data;

    const specs = [];

    $(".model-specs-list.module-separator > div > div").each(
      (_, groupBlock) => {
        const group = $(groupBlock).find("h4").text().trim();

        $(groupBlock)
          .find("div > ul > li")
          .each((_, el) => {
            const label = $(el)
              .find(".model-specs-list__item-name")
              .text()
              .replaceAll("\n", "")
              .replaceAll("*", "")
              .replaceAll("†", "")
              .replace(/  +/g, " ")
              .trim();

            const values = $(el)
              .find(".model-specs-list__item-value")
              .text()
              .replaceAll("\n", "")
              .replaceAll("*", "")
              .replaceAll("†", "")
              .replace(/  +/g, " ")
              .trim();

            if (label?.length > 0 && values?.length > 0) {
              specs.push({ group, label, values });
            }
          });
      }
    );

    const products = [
      {
        innerId: productIdGenerator.next().value,
        brand: BRAND,
        category: "Vehicles",
        name: `${series} - ${model}`,
        url: request.url,
        specs,
        images,
        metadata: {
          modelTitle,
          series,
        },
      },
    ];

    const productsDataset = await Dataset.open(`${currentName}/products`);
    await productsDataset.pushData(products);
  });
}
