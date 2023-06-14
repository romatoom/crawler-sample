import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE_NAME, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";

export default async function startMi() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.addRequests([
    {
      url: `${BASE_URL}/global/support/user-guide`,
      label: LABELS.START_USER_GUIDES,
    },
    {
      url: `${BASE_URL}/global/sitemap`,
      label: LABELS.START_SITEMAP,
    },
  ]);

  await dropDatasets(SOURCE_NAME);
  await crawler.run();

  await exportDatasets(SOURCE_NAME);
  await exportDataToSqlite(SOURCE_NAME);
}

