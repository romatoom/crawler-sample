import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";

import { getCategories, getProductsTargets } from "./api_utils.js";

export default async function startMsi() {
  const { BASE_URL, LABELS, CATEGORIES } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    /* maxRequestRetries: 1,
    requestHandlerTimeoutSecs: 10,
    minConcurrency: 10,
    maxConcurrency: 50, */
  });

  // log.info("Adding requests to the queue.");

  // Нужно для формирования поля CATEGORIES в src/sources/msi/constants.js
  // await getCategories();

  //await dropDatasets();

  log.info("Adding requests to the queue.");

  const targets = [];
  for (const category of CATEGORIES) {
    const target = await getProductsTargets(category);
    targets.push(...target);
  }

  await crawler.run(targets.slice(0, 1));

  //await exportDatasets();
  //await exportDataToSqlite();
}
