import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";
import uniqWith from "lodash/uniqWith.js";
import { addDownloadUrls } from "#utils/url_getter/index.js";
import { productIdGenerator } from "#utils/generators.js";

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

    if ("joinTitles" in source.METHODS) {
      const titles = [...new Set(manuals.map((manual) => manual.title))];
      manual.title =
        titles.length === 1 ? titles[0] : source.METHODS.joinTitles(titles);
    }

    preparedManuals.push(manual);

    if (!("referenceExist" in source.METHODS)) {
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
    let existedProduct = preparedProducts.find((p) =>
      compareProducts(p, product)
    );

    if (existedProduct) {
      idsForReplace[product.innerId] = existProduct.innerId;

      // объединение данных

      existedProduct.images = [
        ...new Set([...existedProduct["images"], ...product.images]),
      ];

      existedProduct.metadata = merge(
        existedProduct.metadata,
        product.metadata
      );

      const specs = [];

      for (const spec of [...existedProduct.specs, ...product.specs]) {
        const specsExists = specs.find(
          (s) => s.group === spec.group && s.label === spec.label
        );

        if (!specsExists) {
          specs.push(spec);
        }
      }

      existedProduct.specs = [...specs];

      //////
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
  preparedProductsManuals,
  source = settings.source
) {
  log.info(`Prepare products-manuals references.`);

  const references = [];

  let manualsIdsWithReference = [];

  for (const product of products) {
    for (const manual of manuals) {
      const existsFromReferences = preparedProductsManuals.find(
        (pm) =>
          pm.productId === product.innerId && pm.manualId === manual.innerId
      );

      if (existsFromReferences) {
        manualsIdsWithReference.push(manual.innerId);
      } else if (source.METHODS.referenceExist(product, manual)) {
        references.push({
          productId: product.innerId,
          manualId: manual.innerId,
        });

        manualsIdsWithReference.push(manual.innerId);
      }
    }
  }

  manualsIdsWithReference = [...new Set(manualsIdsWithReference)];

  const newProducts = [];

  // Добавляем псевдо-продукты
  if ("pseudoProductForManual" in source.METHODS) {
    for (const manual of manuals) {
      if (!manualsIdsWithReference.includes(manual.innerId)) {
        const productName = manual.metadata.series;

        const product = newProducts.find((p) => p.name === productName);

        if (!product) {
          const productId = productIdGenerator.next().value;

          const pseudoProduct = source.METHODS.pseudoProductForManual(manual);

          newProducts.push({
            innerId: productId,
            ...pseudoProduct,
          });

          references.push({
            productId: productId,
            manualId: manual.innerId,
          });
        } else {
          references.push({
            productId: product.innerId,
            manualId: manual.innerId,
          });
        }
      }
    }
  }

  return { references, newProducts };
}

async function manualsWithReplacedUrls(source, manuals) {
  const urls = manuals.map((m) => m.pdfUrl);
  await addDownloadUrls(source, urls);

  return manuals.map((m) => {
    m.pdfUrl = source.urlsHash[m.pdfUrl] || m.pdfUrl;
    return m;
  });
}

function clearedProducts(productsManuals, products) {
  const existedProductIDs = [
    ...new Set(productsManuals.map((pm) => pm.productId)),
  ];
  return products.filter((p) => existedProductIDs.includes(p.innerId));
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

  const rawDataProductsManuals = fs.readFileSync(
    pathOfEntity("products_manuals")
  );

  const productsManuals = JSON.parse(rawDataProductsManuals);

  if (productsManuals.length > 0) {
    preparedProductsManuals = prepareProductsManuals(
      productsManuals,
      productsIdsForReplace,
      manualsIdsForReplace
    );
  }

  if ("referenceExist" in source.METHODS) {
    const { references, newProducts } = productsManualsReferences(
      preparedProducts,
      preparedManuals,
      preparedProductsManuals
    );

    preparedProductsManuals = [...preparedProductsManuals, ...references];
    preparedProducts.push(...newProducts);
  }

  return {
    products: clearedProducts(preparedProductsManuals, preparedProducts),
    manuals: preparedManuals,
    productsManuals: preparedProductsManuals,
  };
}
