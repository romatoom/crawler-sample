import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { getResourcesBySKU, getManuals, getTypeManual } from "../api_utils.js";
import flow from "lodash/flow.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default function addHandlerProduct(router) {
  const { LABELS, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { name, category, image } = request.userData.data;

    /// Get documents(manuals)

    const sku = $("#gtmEightDigitSku").attr("value");

    const resources = await getResourcesBySKU(sku);
    const productManuals = await getManuals(request.url);

    const documents = { ...resources };

    Object.entries(productManuals).forEach(([key, values]) => {
      documents[key] = documents.hasOwnProperty(key)
        ? [...documents[key], ...values]
        : [...values];
    });

    ////////////////////////////////

    if (Object.keys(documents).length === 0) return;

    const breadcrumbs = $(".breadcrumbs li");
    const title = breadcrumbs
      .eq(breadcrumbs.length - 1)
      .text()
      .trim();

    /// Get specs

    const specs = [];

    $("div.tech-spec-content-html div.row div.col-xs-12.col-sm-6 strong").each(
      (_, el) => {
        const elem = $(el);
        const label = elem.text()?.trim();
        const values = elem.parent()?.next()?.text()?.trim();

        if (label && values) {
          specs.push({ label, values });
        }
      }
    );

    $(".tech-spec-content-xml .tech-spec.xml").each((_, groupItem) => {
      const groupElem = $(groupItem);
      const groupTitle = groupElem.find(".trigger").text().trim();
      const group = groupElem.find(".tech-spec-content.tech-spec-group");
      group.find(".additional-attr").each((_, item) => {
        const elem = $(item);
        const label = elem
          .find(".tech-spec-attr.attribute span")
          .text()
          ?.trim();
        const values = elem
          .find(".tech-spec-attr.attribute-value")
          .text()
          ?.trim();
        if (label && values) {
          specs.push({ groupTitle, label, values });
        }
      });
    });

    ////////////////////////////////

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: title || name,
        sku,
        url: request.url,
        specs,
        images: [image],
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    Object.entries(documents).forEach(([key, values]) => {
      const materialType = getTypeManual(key);
      for (const manualItem of values) {
        const currentManualId = manualIdGenerator.next().value;

        const metadata = flow([
          Object.entries,
          (arr) => arr.filter(([key, value]) => value),
          Object.fromEntries,
        ])({
          date: manualItem.date,
          size: manualItem.size,
        });

        manualsResults.push({
          innerId: currentManualId,
          materialType,
          pdfUrl: manualItem.url,
          title: manualItem.name,
          language: [],
          metadata,
        });

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    });

    const manuals = await Dataset.open(`${currentName}/manuals`);
    await manuals.pushData(manualsResults);

    const products = await Dataset.open(`${currentName}/products`);
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      `${currentName}/products_manuals`
    );
    await productsManuals.pushData(productsManualsResults);
  });
}
