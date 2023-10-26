import { PlaywrightCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";

import { getCategories } from "./api_utils.js";

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

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  const targets = (await getCategories()).map((c) => ({
    url: c.url,
    label: LABELS.CATEGORY,
    userData: {
      data: {
        category: c.category,
      },
    },
  }));

  for (const target of targets) {
    await crawler.run([target]);
  }

  await exportDatasets();
  await exportDataToSqlite();
}
