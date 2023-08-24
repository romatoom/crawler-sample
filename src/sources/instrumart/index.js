import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js"

export default async function startInstrumart() {
  const { BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 10,
    minConcurrency: 10,
    maxConcurrency: 50,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/categories`,
      label: LABELS.CATEGORIES,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}

