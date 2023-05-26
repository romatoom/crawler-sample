import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";

import { MI_FORMATTERS } from "#utils/formatters.js";
const { groupBy } = pkg;

import { log } from "crawlee";

import { pathOfEntity, pathOfPreparedEntity } from "#utils/paths.js";

log.setLevel(log.LEVELS.INFO);

/* function usedIndexes(products, manuals) {
  const usedProductsIndexes = new Set();
  const usedManualsIndexes = new Set();

  for (const [productIndex, product] of products.entries()) {
    for (const [manualIndex, manual] of manuals.entries()) {
      if (
        product.name.toLowerCase() ===
        MI_FORMATTERS.cleanedManualTitle(manual.title).toLowerCase()
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
        MI_FORMATTERS.cleanedManualTitle(manual.title).toLowerCase()
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

export default async function postProcessingData(sourceName) {
  log.info("Start post-processing.");

  const rawDataManuals = fs.readFileSync(pathOfEntity(sourceName, "manuals"));
  const manuals = JSON.parse(rawDataManuals);

  const rawDataProducts = fs.readFileSync(pathOfEntity(sourceName, "products"));
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
  fs.writeFileSync(pathOfPreparedEntity(sourceName, "manuals"), data);

  data = JSON.stringify(products);
  fs.writeFileSync(pathOfPreparedEntity(sourceName, "products"), data);

  data = JSON.stringify(references);
  fs.writeFileSync(pathOfPreparedEntity(sourceName, "products_manuals"), data);
}

// 2986 manuals, 275 products, 1301 products_manuals
// 3124 manuals, 275 products, 1336 products_manuals
