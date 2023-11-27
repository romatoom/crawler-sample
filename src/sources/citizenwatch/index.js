import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";

export default async function start() {
  const { BASE_URL } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  await dropDatasets();

  await scrapeCollections();

  await exportDatasets();
  await exportDataToSqlite();
}

async function scrapeCollections() {
  const { LABELS, COLLECTIONS } = settings.source;

  const crawler = new CheerioCrawler({
    requestHandler: router,
    requestHandlerTimeoutSecs: 500000,
    navigationTimeoutSecs: 500000,
  });

  log.info("Adding requests to the queue.");

  const targets = COLLECTIONS.map((collection) => ({
    url: collection.url,
    label: LABELS.COLLECTION,
  }));

  await crawler.run(targets);
}
