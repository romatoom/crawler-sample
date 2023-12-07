import { Product } from "#utils/classes/product.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { category, baseURL, brand } = source;

  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const products = [];

    $(".lineup__pane")
      .first()
      .find("ul.lineup__list > li")
      .each((_, productBlock) => {
        const year = $(productBlock).find(".lineup__year").text().trim();
        const model = $(productBlock).find(".lineup__model-id").text().trim();

        const url = `${baseURL}${$(productBlock)
          .find(".lineup__explore-link")
          .attr("href")}`;

        const image = $(productBlock).find("img.responsive-image").attr("src");

        const product = new Product({
          brand,
          category,
          name: `${year} ${model}`,
          url,
          images: [image],
          metadata: {
            model,
            year,
          },
        });

        products.push(product);
      });

    for (const product of products) {
      await state.storage.pushData(product);
    }
  };
}
