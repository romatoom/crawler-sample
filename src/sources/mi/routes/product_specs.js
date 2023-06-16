import { Dataset } from "crawlee";
import { LABELS } from "../constants.js";

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

    const image = $("img");

    let imageSrc = image.length > 0 ? image.first().attr("data-src") : null;
    if (imageSrc && !imageSrc.startsWith("https:")) {
      imageSrc = `https:${imageSrc}`;
    }

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
      images: imageSrc ? [imageSrc] : [],
    };

    const productsDataset = await Dataset.open("mi/products");
    await productsDataset.pushData(product);
  });
}
