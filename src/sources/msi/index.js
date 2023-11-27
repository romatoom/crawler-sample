import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";

import { getCategories, getProductsTargets } from "./api_utils.js";
import { setExistingProducts } from "#utils/checks.js";
import { readProducts } from "#utils/database.js";

export default async function start() {
  const { BASE_URL, LABELS, CATEGORIES } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestsPerMinute: 100,
    minConcurrency: 1,
    maxConcurrency: 5,
  });

  log.info("Adding requests to the queue.");

  // Нужно для формирования поля CATEGORIES в src/sources/msi/constants.js
  // await getCategories();

  if (settings.onlyNewProducts) {
    let existingProducts;
    try {
      existingProducts = await readProducts();
    } catch (err) {
      log.error(err);
      existingProducts = [];
    }
    setExistingProducts(existingProducts);
  }

  await dropDatasets();

  log.info("Adding requests to the queue.");

  const targets = [];
  for (const category of CATEGORIES) {
    const target = await getProductsTargets(category);
    targets.push(...target);
  }

  await crawler.run(targets);

  await exportDatasets();
  await exportDataToSqlite();
}
