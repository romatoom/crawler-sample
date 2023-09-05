import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { CANON_FORMATTERS, normalizeTitle } from "#utils/formatters.js";
import { getManualsOnPageForLang } from "../api_utils.js";
import flow from "lodash/flow.js";
import varSave from "#utils/var_saver.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerProductManuals(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCT_MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { id, name } = request.userData.data;

    let category = "Products";
    let regexp = /https:\/\/www.canon-europe.com\/support\/(.+)\/products\/.+$/;
    let matches = regexp.exec(request.url);

    if (matches) {
      regexp = /\/products\/(.+).+$/;
      matches = regexp.exec(request.url);
      category = normalizeTitle(matches[1].split("/")[0].replace("-", " "));
    }

    const langs = {};
    $("#operating-language-manual option").each((_, el) => {
      const elem = $(el);
      const key = elem.attr("value");
      if (!key) return true;
      const value = elem.text();
      langs[key] = value;
    });

    const promises = [];
    for (const [key, value] of Object.entries(langs)) {
      promises.push(getManualsOnPageForLang({ key, value }, id));
    }

    const manualsItems = (await Promise.all(promises)).flat();

    if (manualsItems.length === 0) {
      varSave(
        [request.url],
        "processedCanonEuropeURLs",
        settings.source,
        "append",
        "array"
      );
      return;
    }

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name,
        url: request.url,
        specs: [],
        images: [],
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    for (const manualItem of manualsItems) {
      const currentManualId = manualIdGenerator.next().value;

      const metadata = flow([
        Object.entries,
        (arr) => arr.filter(([key, value]) => value),
        Object.fromEntries,
      ])({
        releaseDate: manualItem.releaseDate,
      });

      manualsResults.push({
        innerId: currentManualId,
        materialType: "Manual",
        pdfUrl: manualItem.url,
        title: manualItem.title,
        language: manualItem.language,
        metadata,
      });

      productsManualsResults.push({
        productId: currentProductId,
        manualId: currentManualId,
      });
    }

    const manuals = await Dataset.open(`${currentName}/manuals`);
    await manuals.pushData(manualsResults);

    const products = await Dataset.open(`${currentName}/products`);
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      `${currentName}/products_manuals`
    );
    await productsManuals.pushData(productsManualsResults);

    varSave(
      [request.url],
      "processedCanonEuropeURLs",
      settings.source,
      "append",
      "array"
    );
  });
}
