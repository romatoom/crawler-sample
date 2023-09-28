import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator } from "#utils/generators.js";

export default function addHandlerGoFindProduct(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(
    LABELS.GO_FIND_PRODUCT,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const { title, image } = request.userData.data;

      const specs = [];

      $("table.twoColTable tr").each((_, trElem) => {
        const tds = $(trElem).find("td");

        const label = tds.eq(0).text().trim();
        const values = tds.eq(1).text().trim();

        if (label.length > 0 && values.length > 0) {
          specs.push({ label, values });
        }
      });

      const currentProductId = productIdGenerator.next().value;

      const productsDataset = await Dataset.open(`${currentName}/products`);

      await productsDataset.pushData({
        innerId: currentProductId,
        brand: BRAND,
        category: "Metal detectors",
        name: title,
        url: request.url,
        specs,
        images: [image],
        metadata: {},
      });
    }
  );
}
