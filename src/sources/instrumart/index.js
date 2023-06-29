import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";

export default async function startInstrumart() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 10,
    minConcurrency: 10,
    maxConcurrency: 50,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets(SOURCE);

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/categories`,
      label: LABELS.CATEGORIES,
    },
  ]);

  await exportDatasets(SOURCE);
  await exportDataToSqlite(SOURCE);
}

// 8320 manuals, 4071 products, 10621 products_manuals
