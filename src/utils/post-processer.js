import fs from "fs";

import pkg from "core-js/actual/array/group-by.js";
const { groupBy } = pkg;

import { log } from "crawlee";

import {
  PATH_OF_MANUALS_PATH,
  PATH_OF_PRODUCTS_PATH,
  PATH_OF_PREPARED_MANUALS,
  PATH_OF_PREPARED_PRODUCTS,
  PATH_OF_PREPARED_PRODUCTS_MANUALS,
} from "../constants.js";

log.setLevel(log.LEVELS.INFO);

function cleanedManualTitle(title) {
  let regexp =
    /Generic User Guide for|Generic User Guide|General User Guide|User Guide|Safety Information|Quick Start Guide|Adapter Information|\(M2110E1\)|\(M2133E1\)/;

  // Mi Smart Air Fryer (3.5L) -> Mi Smart Air Fryer 3.5L
  // Redmi Buds 3 Lite
  let cleanedTitle = title.replace(regexp, "").trim();
  regexp = /\(3.5L\)/;
  return cleanedTitle.replace(regexp, "3.5L");
}

/* function usedIndexes(products, manuals) {
  const usedProductsIndexes = new Set();
  const usedManualsIndexes = new Set();

  for (const [productIndex, product] of products.entries()) {
    for (const [manualIndex, manual] of manuals.entries()) {
      if (
        product.name.toLowerCase() ===
        cleanedManualTitle(manual.title).toLowerCase()
      ) {
        usedProductsIndexes.add(productIndex);
        usedManualsIndexes.add(manualIndex);
      }
    }
  }

  return {
    usedProductsIndexes: [...usedProductsIndexes],
    usedManualsIndexes: [...usedManualsIndexes],
  };
} */

function productsManualsReferences(products, manuals) {
  const references = [];

  for (const [productIndex, product] of products.entries()) {
    for (const [manualIndex, manual] of manuals.entries()) {
      if (
        product.name.toLowerCase() ===
        cleanedManualTitle(manual.title).toLowerCase()
      ) {
        references.push({
          product_id: productIndex + 1,
          manual_id: manualIndex + 1,
        });
      }
    }
  }

  return references;
}

export default async function postProcessingData() {
  log.info("Start post-processing.");

  const rawDataManuals = fs.readFileSync(PATH_OF_MANUALS_PATH);
  const manuals = JSON.parse(rawDataManuals);

  const rawDataProducts = fs.readFileSync(PATH_OF_PRODUCTS_PATH);
  const products = JSON.parse(rawDataProducts);

  const groupedManuals = manuals.groupBy((manual) => {
    return manual.pdfUrl;
  });

  let preparedManuals = [];
  for (const [_, manuals] of Object.entries(groupedManuals)) {
    const languages = manuals.map((manual) => manual.language);

    const manual = { ...manuals[0] };
    delete manual.language;
    manual.languages = languages;

    preparedManuals.push(manual);
  }

  /* const { usedProductsIndexes, usedManualsIndexes } = usedIndexes(
    products,
    preparedManuals
  );

  const fullPreparedProducts = products.filter((_, index) => {
    return usedProductsIndexes.includes(index);
  });

  const fullPreparedManuals = preparedManuals.filter((_, index) => {
    return usedManualsIndexes.includes(index);
  }); */

  const references = productsManualsReferences(products, preparedManuals);

  let data = JSON.stringify(preparedManuals);
  fs.writeFileSync(PATH_OF_PREPARED_MANUALS, data);

  data = JSON.stringify(products);
  fs.writeFileSync(PATH_OF_PREPARED_PRODUCTS, data);

  data = JSON.stringify(references);
  fs.writeFileSync(PATH_OF_PREPARED_PRODUCTS_MANUALS, data);
}

// 2986 manuals, 275 products, 1301 products_manuals
