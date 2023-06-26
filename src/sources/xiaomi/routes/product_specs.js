import { Dataset } from "crawlee";
import { LABELS, SOURCE_NAME } from "../constants.js";

export default function addHandlerProductSpecs(router) {
  router.addHandler(LABELS.PRODUCT_SPECS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const specs = [];
    const specsElements = $("[data-key^=spec_]");
    const specsElements2 = $("[data-key^=Spec_]");
    const notesElements = $("[data-key^=note_]");
    const overviewElements = $("[data-key^=overview_]");

    specsElements.each((_, spec) => specs.push($(spec).text().trim()));
    specsElements2.each((_, spec) => specs.push($(spec).text().trim()));
    notesElements.each((_, spec) => specs.push($(spec).text().trim()));
    overviewElements.each((_, spec) => specs.push($(spec).text().trim()));

    const specText = specs.join("\n");

    const product = {
      ...request.userData.data,
      specs:
        specText !== ""
          ? [
              {
                label: "Spec text for analysis",
                values: specText,
              },
            ]
          : [],
    };

    const productsDataset = await Dataset.open(`${SOURCE_NAME}/products`);
    await productsDataset.pushData(product);
  });
}
