import { PlaywrightCrawler, CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";

export default async function start() {
  const { BASE_URL, MANUALS_BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 3,
    maxConcurrency: 15,
    // maxRequestsPerMinute: 100,
  });

  await dropDatasets();
  await setGenerators(settings.source);

  log.info("Adding requests to the queue.");

  const playwrightCrawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: true,
    requestHandlerTimeoutSecs: 500000,
  });

  await playwrightCrawler.run([
    {
      url: `${MANUALS_BASE_URL}/passengercars/services/manuals.html`,
      label: LABELS.MANUALS_DOUBLE,
    },
  ]);

  await crawler.run([
    {
      url: `${BASE_URL}/en/owners/manuals`,
      label: LABELS.MANUALS,
    },
  ]);

  await crawler.run([
    {
      url: `${BASE_URL}/en/all-vehicles`,
      label: LABELS.VEHICLES,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}
