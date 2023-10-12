import varSave from "#utils/var_saver.js";
import { settings } from "#utils/globals.js";

export default function addHandlerProducts(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const categories = {};

    $(".style__tree-node___2iDGl").each((_, category) => {
      $(category)
        .next()
        .find("div")
        .each((_, subcategory) => {
          categories[$(subcategory).text().trim()] = $(category).text().trim();
        });
    });

    const products = {};

    $(".style__series-item___3YSO8").each((_, series) => {
      const seriesName = $(series).find("h4").text();
      $(series)
        .find("div > div > a")
        .each((_, product) => {
          const style = $(product).find("div > div").attr("style");
          const image = style
            .replace("background-image:url(", "")
            .replace(")", "");

          products[$(product).text().trim()] = {
            category: categories[seriesName],
            series: seriesName,
            image,
          };
        });
    });

    varSave(products, "products", settings.source);
  });
}
