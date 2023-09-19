import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";
import uniqWith from "lodash/uniqWith.js";
import { addDownloadUrls } from "#utils/url_getter/index.js";

import {
  settings,
  SOURCES_WITH_NEED_REPLACE_URL,
  SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET,
} from "#utils/globals.js";

const { groupBy } = pkg;

import { log } from "crawlee";

import { pathOfEntity } from "#utils/paths.js";

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

function prepareManuals(manuals, source = settings.source) {
  const groupedManuals = manuals.groupBy((manual) => manual.pdfUrl);

  let preparedManuals = [];
  const idsForReplace = {};

  for (const [_, manuals] of Object.entries(groupedManuals)) {
    const manual = manuals.find((m) => m.language === "English") || {
      ...manuals[0],
    };

    // Set languages

    let languages = [];

    for (const manualItem of manuals) {
      if (Array.isArray(manualItem.language)) {
        languages.push(...manualItem.language);
      } else {
        languages.push(manualItem.language);
      }
    }

    languages = [...new Set(languages)];

    delete manual.language;
    manual.languages = languages;

    //////////

    if ("joinTitles" in source.FORMATTERS) {
      const titles = [...new Set(manuals.map((manual) => manual.title))];
      manual.title =
        titles.length === 1 ? titles[0] : source.joinTitles(titles);
    }

    preparedManuals.push(manual);

    if (!SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET.includes(source.KEY)) {
      manuals.forEach((m) => {
        idsForReplace[m.innerId] = manual.innerId;
      });
    }
  }

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

function productsManualsReferences(
  products,
  manuals,
  source = settings.source
) {
  function productNameContainsInManualTitle(product, manual) {
    switch (source.KEY) {
      case "XIAOMI":
        return (
          product.name.toLowerCase() ===
          source.FORMATTERS.cleanedManualTitle(manual.title).toLowerCase()
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

async function manualsWithReplacedUrls(source, manuals) {
  const urls = manuals.map((m) => m.pdfUrl);
  await addDownloadUrls(source, urls);

  return manuals.map((m) => {
    m.pdfUrl = source.urlsHash[m.pdfUrl] || m.pdfUrl;
    return m;
  });
}

export default async function getPreparedData(source = settings.source) {
  log.info("Prepare and receive data.");

  console.log("Read manuals from output file");
  const rawDataManuals = fs.readFileSync(pathOfEntity("manuals"));
  let manuals = JSON.parse(rawDataManuals);

  if (SOURCES_WITH_NEED_REPLACE_URL.includes(source.KEY)) {
    manuals = await manualsWithReplacedUrls(source, manuals);
  }

  console.log("Read products from output file");
  const rawDataProducts = fs.readFileSync(pathOfEntity("products"));
  const products = JSON.parse(rawDataProducts);

  console.log("Prepare products from output file");
  const { preparedProducts, idsForReplace: productsIdsForReplace } =
    prepareProducts(products);

  console.log("Prepare manuals from output file");
  const { preparedManuals, idsForReplace: manualsIdsForReplace } =
    prepareManuals(manuals);

  let preparedProductsManuals = [];

  console.log("Prepare products-manuals from output file");
  if (SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET.includes(source.KEY)) {
    preparedProductsManuals = productsManualsReferences(
      preparedProducts,
      preparedManuals
    );
  } else {
    const rawDataProductsManuals = fs.readFileSync(
      pathOfEntity("products_manuals")
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
