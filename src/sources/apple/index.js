import { log, Dataset } from "crawlee";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import { getProducts, getAllManuals } from "./api_utils.js";
import varRead from "#utils/var_reader.js";
import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";
import { getLanguagesByLocales } from "#utils/formatters.js";

export default async function start() {
  const { BASE_URL } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  await dropDatasets();
  await setGenerators(settings.source);

  log.info("Adding requests to the queue.");

  await getProducts();
  await getAllManuals();
  await saveDataToDatasets(settings.source);

  await exportDatasets();
  await exportDataToSqlite();
}

function pushInnerProducts(product, rawProducts) {
  if (product.products.length === 0) {
    rawProducts.push(product);
  } else {
    for (const p of product.products) {
      pushInnerProducts(p, rawProducts);
    }
  }
}

function findProductByProductName(products, productName) {
  return products.find((p) => p.id === productName);
}

async function saveDataToDatasets(source) {
  const manualsDataset = await Dataset.open(`${source.currentName}/manuals`);
  const productsDataset = await Dataset.open(`${source.currentName}/products`);
  const productsManualsDataset = await Dataset.open(
    `${source.currentName}/products_manuals`
  );

  const rawProductsTree = await varRead("rawProducts", source);
  const rawProducts = [];

  for (const product of rawProductsTree) {
    pushInnerProducts(product, rawProducts);
  }

  const rawManuals = await varRead("rawManuals", source);

  for (const manualItem of rawManuals) {
    const url = manualItem.url;
    if (!url.endsWith(".pdf")) continue;

    const productname = manualItem.productname;
    const rawProduct = findProductByProductName(rawProducts, productname);
    if (!rawProduct) continue;

    const currentManualId = manualIdGenerator.next().value;
    const manual = {
      innerId: currentManualId,
      materialType: "Manual",
      pdfUrl: url,
      title: manualItem.title,
      language: getLanguagesByLocales([manualItem.locale]),
      metadata: {
        filesize: manualItem.filesize,
      },
    };

    const currentProductId = productIdGenerator.next().value;
    const product = {
      innerId: currentProductId,
      brand: source.BRAND,
      category: manualItem.category,
      name: rawProduct.name,
      url: null,
      specs: [],
      images: [],
      metadata: {},
    };

    const productsManuals = {
      productId: currentProductId,
      manualId: currentManualId,
    };

    await manualsDataset.pushData(manual);
    await productsDataset.pushData(product);
    await productsManualsDataset.pushData(productsManuals);
  }
}
