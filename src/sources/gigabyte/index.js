import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";

export default async function start() {
  const { BASE_URL, LABELS, CONSUMER_CATEGORIES, ENTERPRISE_CATEGORIES } =
    settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 60,
  });

  await dropDatasets();
  await setGenerators(settings.source);

  log.info("Adding requests to the queue.");

  let targets = [];

  for (const category in ENTERPRISE_CATEGORIES) {
    targets.push({
      url: `${BASE_URL}${ENTERPRISE_CATEGORIES[category]}`,
      label: LABELS.ENTERPRISE_CATEGORIES,
      userData: {
        data: {
          category,
        },
      },
    });
  }

  await crawler.run(targets);

  targets = [];

  for (const category in CONSUMER_CATEGORIES) {
    targets.push({
      url: `${BASE_URL}${CONSUMER_CATEGORIES[category]}`,
      label: LABELS.CATEGORIES,
      userData: {
        data: {
          category,
        },
      },
    });
  }

  await crawler.run(targets);

  await exportDatasets();
  await exportDataToSqlite();
}
