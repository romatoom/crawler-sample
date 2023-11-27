import { CheerioCrawler, log } from "crawlee";
import {
  playwrightCrawler,
  dataForPlaywrightCrawler,
} from "./playwright_crawler.js";
import { router } from "./routes.js";
import { BASE_URL, SOURCE_NAME, LABELS } from "./constants.js";
import { proxyConfiguration } from "#utils/proxy_config.js";

import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";

export default async function start() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const cheerioCrawler = new CheerioCrawler({
    requestHandler: router,
    /* useSessionPool: true,
    persistCookiesPerSession: true, */
    // proxyConfiguration,
  });

  log.info("Adding requests to the queue.");

  await cheerioCrawler.addRequests([
    {
      url: `${BASE_URL}/brand`,
      label: LABELS.START,
    },
  ]);

  // await dropDatasets(SOURCE_NAME);

  await cheerioCrawler.run();

  console.log(
    "Manuals count:",
    dataForPlaywrightCrawler.reduce((accum, el) => accum + el.count, 0)
  );

  // await playwrightCrawler.addRequests(dataForPlaywrightCrawler);
  // await playwrightCrawler.run();

  /* await exportDatasets(SOURCE_NAME);

  await postProcessingData(SOURCE_NAME);
  await exportDataToSqlite(SOURCE_NAME); */
}
