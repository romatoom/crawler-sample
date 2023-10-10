import { settings } from "#utils/globals.js";
import { Dataset } from "crawlee";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";

import startCase from "lodash/startCase.js";
import camelCase from "lodash/camelCase.js";

const regexp = /^.+thermostats?(.+)$/i;

export default function addHandlerProduct(router) {
  const { LABELS, currentName, MANUALS_TYPES } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { productTitle, image, brand } = request.userData.data;

    const manualLink = $("a").filter(function () {
      return $(this).text().trim() === productTitle;
    });

    if (manualLink.length === 0) return;

    const manualURL = manualLink.eq(0).attr("href");
    if (!manualURL.endsWith(".pdf")) return;

    const { productName, manualType } = getProductNameAndManualType(
      productTitle,
      MANUALS_TYPES
    );

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const currentProductId = productIdGenerator.next().value;

    await productsDataset.pushData({
      innerId: currentProductId,
      brand,
      category: "Thermostat",
      name: productName,
      url: null,
      specs: [],
      images: image ? [image] : [],
      metadata: {},
    });

    const currentManualId = manualIdGenerator.next().value;

    await manualsDataset.pushData({
      innerId: currentManualId,
      materialType: manualType,
      pdfUrl: manualURL,
      title: productTitle,
      language: "English",
      metadata: {},
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  });
}

function getProductNameAndManualType(name, manualTypes) {
  for (const manualTypeItem of manualTypes) {
    if (name.includes(manualTypeItem)) {
      return {
        productName: name.replace(manualTypeItem, "").trim(),
        manualType: startCase(camelCase(manualTypeItem)),
      };
    }
  }

  const matches = regexp.exec(name);

  if (!matches) {
    return {
      productName: name,
      manualType: "Manual",
    };
  }

  const mType = matches[1].trim();

  return {
    productName: name.replace(mType, "").trim(),
    manualType: startCase(camelCase(mType)),
  };
}
