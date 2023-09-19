import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";

export default async function start() {
  const { BASE_URL, LABELS } = settings.source;

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

  await crawler.run([
    {
      url: `${BASE_URL}/en_DE`,
      label: LABELS.CATEGORIES,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}
