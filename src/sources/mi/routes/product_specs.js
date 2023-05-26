import { Dataset } from "crawlee";
import { LABELS } from "../constants.js";

export default function addHandlerProductSpecs(router) {
  router.addHandler(LABELS.PRODUCT_SPECS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const specs = [];
    const specsElements = $("[data-key^=spec_]");
    specsElements.each((index, spec) => specs.push($(spec).text().trim()));

    const image = $("img");

    let imageSrc = image.length > 0 ? image.first().attr("data-src") : null;
    if (imageSrc && !imageSrc.startsWith("https:")) {
      imageSrc = `https:${imageSrc}`;
    }

    const product = {
      ...request.userData.data,
      specs: {
        textData: specs,
      },
      images: imageSrc ? [imageSrc] : [],
    };

    const productsDataset = await Dataset.open("mi/products");
    await productsDataset.pushData(product);
  });
}
