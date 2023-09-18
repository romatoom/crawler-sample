import { PlaywrightCrawler, log } from "crawlee";
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

  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: true,
    requestHandlerTimeoutSecs: 500000,
  });

  await dropDatasets();

  log.info("Adding requests to the queue.");

  await setGenerators(settings.source);

  await crawler.run([
    {
      url: `${BASE_URL}/owners-manuals/`,
      label: LABELS.MANUALS,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}
