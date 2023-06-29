import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";
import uniqWith from "lodash/uniqWith.js";

import { CENTRAL_MANUALS_FORMATTERS } from "#utils/formatters.js";
import {
  SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET,
  SOURCE_WITH_NEED_JOIN_MANUAL_TITLES,
  SOURCES,
} from "#utils/globals.js";
import { MI_FORMATTERS, INSTRUMART_FORMATTERS } from "#utils/formatters.js";

const { groupBy } = pkg;

import { log } from "crawlee";

import pathOfEntity from "#utils/paths.js";

log.setLevel(log.LEVELS.INFO);

function compareProducts(product1, product2) {
  return product1.brand === product2.brand && product1.name === product2.name;
}

function compareProductManuals(productManual1, productManual2) {
  return (
    productManual1.productId === productManual2.productId &&
    productManual1.manualId === productManual2.manualId
  );
}

function prepareManuals(manuals, source) {
  const groupedManuals = manuals.groupBy((manual) => manual.pdfUrl);

  let preparedManuals = [];
  const idsForReplace = {};

  for (const [_, manuals] of Object.entries(groupedManuals)) {
    const manual = manuals.find((m) => m.language === "English") || {
      ...manuals[0],
    };

    const languages = [...new Set(manuals.map((manual) => manual.language))];
    delete manual.language;
    manual.languages = languages;

    if (SOURCE_WITH_NEED_JOIN_MANUAL_TITLES.includes(source)) {
      const titles = [...new Set(manuals.map((manual) => manual.title))];

      let joinTitles;
      switch (source) {
        case SOURCES.CENTRAL_MANUALS:
          joinTitles = CENTRAL_MANUALS_FORMATTERS.joinTitles;
          break;
        case SOURCES.INSTRUMART:
          joinTitles = INSTRUMART_FORMATTERS.joinTitles;
          break;
        default:
          throw `Not found formatters for ${source.originalName}!`;
      }

      manual.title = titles.length === 1 ? titles[0] : joinTitles(titles);
    }

    preparedManuals.push(manual);

    if (!SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET.includes(source)) {
      manuals.forEach((m) => {
        idsForReplace[m.innerId] = manual.innerId;
      });
    }
  }

  /* switch (sourceName) {
    case "xiaomi":
      for (const [_, manuals] of Object.entries(groupedManuals)) {
        const manual = manuals.find((m) => m.language === "English") || {
          ...manuals[0],
        };

        const languages = [
          ...new Set(manuals.map((manual) => manual.language)),
        ];
        delete manual.language;
        manual.languages = languages;

        preparedManuals.push(manual);
      }

      break;
    case "central-manuals":
      for (const [_, manuals] of Object.entries(groupedManuals)) {
        const manual = manuals.find((m) => m.language === "English") || {
          ...manuals[0],
        };

        const languages = [
          ...new Set(manuals.map((manual) => manual.language)),
        ];
        delete manual.language;
        manual.languages = languages;

        const titles = [...new Set(manuals.map((manual) => manual.title))];
        manual.title =
          titles.length === 1
            ? titles[0]
            : CENTRAL_MANUALS_FORMATTERS.joinTitles(titles);

        preparedManuals.push(manual);

        manuals.forEach((m) => {
          idsForReplace[m.innerId] = manual.innerId;
        });
      }

      break;
    case "sony":
      for (const [_, manuals] of Object.entries(groupedManuals)) {
        const manual = manuals.find((m) => m.language === "English") || {
          ...manuals[0],
        };

        const languages = [
          ...new Set(manuals.map((manual) => manual.language)),
        ];
        delete manual.language;
        manual.languages = languages;

        preparedManuals.push(manual);

        manuals.forEach((m) => {
          idsForReplace[m.innerId] = manual.innerId;
        });
      }

      break;
    case "instrumart":
      for (const [_, manuals] of Object.entries(groupedManuals)) {
        const manual = manuals.find((m) => m.language === "English") || {
          ...manuals[0],
        };

        const languages = [
          ...new Set(manuals.map((manual) => manual.language)),
        ];
        delete manual.language;
        manual.languages = languages;

        const titles = [...new Set(manuals.map((manual) => manual.title))];
        manual.title =
          titles.length > 1
            ? INSTRUMART_FORMATTERS.joinTitles(titles)
            : titles[0];

        preparedManuals.push(manual);

        manuals.forEach((m) => {
          idsForReplace[m.innerId] = manual.innerId;
        });
      }
      break;
    default:
      preparedManuals = [...manuals];
      break;
  } */

  return { preparedManuals, idsForReplace };
}

function prepareProducts(products) {
  const idsForReplace = {};
  const preparedProducts = [];

  for (const product of products) {
    const existProduct = preparedProducts.find((p) =>
      compareProducts(p, product)
    );

    if (existProduct) {
      idsForReplace[product.innerId] = existProduct.innerId;
    } else {
      preparedProducts.push(product);
    }
  }

  return {
    preparedProducts,
    idsForReplace,
  };
}

function prepareProductsManuals(
  productsManuals,
  productsIdsForReplace,
  manualsIdsForReplace
) {
  const preparedProductsManuals = productsManuals.map((productManual) => {
    const { productId, manualId } = productManual;

    return {
      productId: productsIdsForReplace[productId] || productId,
      manualId: manualsIdsForReplace[manualId] || manualId,
    };
  });

  return uniqWith(preparedProductsManuals, compareProductManuals);
}

function productsManualsReferences(products, manuals, source) {
  function productNameContainsInManualTitle(product, manual) {
    switch (source) {
      case SOURCES.XIAOMI:
        return (
          product.name.toLowerCase() ===
          MI_FORMATTERS.cleanedManualTitle(manual.title).toLowerCase()
        );

      default:
        return false;
    }
  }

  log.info(`Prepare products-manuals references.`);

  const references = [];

  for (const product of products) {
    for (const manual of manuals) {
      if (productNameContainsInManualTitle(product, manual)) {
        references.push({
          productId: product.innerId,
          manualId: manual.innerId,
        });
      }
    }
  }

  return references;
}

export default async function getPreparedData(source) {
  log.info("Prepare and receive data.");

  const rawDataManuals = fs.readFileSync(pathOfEntity(source, "manuals"));
  const manuals = JSON.parse(rawDataManuals);

  const rawDataProducts = fs.readFileSync(pathOfEntity(source, "products"));
  const products = JSON.parse(rawDataProducts);

  const { preparedProducts, idsForReplace: productsIdsForReplace } =
    prepareProducts(products);

  const { preparedManuals, idsForReplace: manualsIdsForReplace } =
    prepareManuals(manuals, source);

  let preparedProductsManuals = [];

  if (SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET.includes(source)) {
    preparedProductsManuals = productsManualsReferences(
      preparedProducts,
      preparedManuals,
      source
    );
  } else {
    const rawDataProductsManuals = fs.readFileSync(
      pathOfEntity(source, "products_manuals")
    );

    const productsManuals = JSON.parse(rawDataProductsManuals);

    preparedProductsManuals = prepareProductsManuals(
      productsManuals,
      productsIdsForReplace,
      manualsIdsForReplace
    );
  }

  return {
    products: preparedProducts,
    manuals: preparedManuals,
    productsManuals: preparedProductsManuals,
  };
}
