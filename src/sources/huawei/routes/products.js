import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerProducts(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const categoriesNames = {};
    $(".v3-prod-type").each((_, categoryName) => {
      categoriesNames[$(categoryName).attr("data-id")] = $(categoryName)
        .text()
        .trim();
    });

    const productsData = [];

    $(".v3-prod-type-detail-container").each((_, categoryBlock) => {
      const categoryID = $(categoryBlock).attr("id");
      if (categoryID === "soft-tool") return true;

      const json = JSON.parse(
        $(categoryBlock).attr("json").replaceAll("&quot;", '"')
      );

      const category = categoriesNames[categoryID];

      for (const seriesBlock of Object.values(json)) {
        const series = seriesBlock[0].title;
        const products = seriesBlock[0].items;

        for (const product of products) {
          productsData.push({
            url: `${BASE_URL}${product.productPage}`,
            category,
            series,
            image: `${BASE_URL}${product.productImage}`,
            productName: product.productName,
          });
        }
      }
    });

    varSave(productsData, "productsData", settings.source);
  });
}
