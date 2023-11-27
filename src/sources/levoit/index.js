import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
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
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 60,
    preNavigationHooks: [
      async (crawlingContext, _) => {
        crawlingContext.request.headers["User-Agent"] =
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";
        crawlingContext.request.headers["Accept"] = "*/*";
      },
    ],
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  await crawler.run([
    {
      url: `${BASE_URL}/pages/user-manuals`,
      label: LABELS.MANUALS,
    },
  ]);

  await crawler.run([
    {
      url: `${BASE_URL}/collections/shop`,
      label: LABELS.PRODUCTS,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}
