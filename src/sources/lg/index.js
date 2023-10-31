import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import varRead from "#utils/var_reader.js";
import { selectProductCategory, getAllProducts } from "./api_utils.js";

// import { getLangs } from "./api_utils.js";

export default async function start() {
  const { BASE_URL, LABELS, LANGS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 60,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  /* await crawler.run([
    {
      url: `${BASE_URL}/en/support/product/`,
      label: LABELS.PRODUCTS,
    },
  ]); */

  let products;
  try {
    products = await varRead("products", settings.source);
  } catch {
    let categories;

    try {
      categories = await varRead("categories", settings.source);
    } catch {
      categories = await selectProductCategory();
    }

    products = await getAllProducts(categories);
  }

  console.log(products.length);
  console.log(products[0]);


  // await exportDatasets();
  // await exportDataToSqlite();
}

// 4519/10396 pages, 137 errors.
