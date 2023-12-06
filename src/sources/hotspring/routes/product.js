import state from "#utils/classes/state.js";

import { Product } from "#utils/classes/product.js";

export default function routeHandler(source) {
  const { brand } = source;

  return async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { productName, category, series, images } = request.userData.data;

    const description = $(".hero-model__content-description")
      .text()
      .replaceAll("\n", " ")
      .trim();

    const specs = [];

    $(".specifications .row div").each((_, spec) => {
      specs.push({
        label: $(spec).find(".specifications__title").text().trim(),
        values: $(spec).find(".specifications__value").text().trim(),
      });
    });

    const product = new Product({
      brand,
      category,
      name: `${productName} ${series}`,
      url: request.url,
      specs,
      images,
      description,
      metadata: {
        series,
      },
    });

    await state.storage.pushData(product);
  };
}
