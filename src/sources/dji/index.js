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

  const COOKIES = [
    {
      name: "lang",
      value: "en",
    },
    {
      name: "region",
      value: "US",
    },
  ];

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 20,
    maxRequestsPerMinute: 200,
    preNavigationHooks: [
      async (crawlingContext, _) => {
        crawlingContext.session.setCookies(
          COOKIES,
          crawlingContext.request.url
        );
      },
    ],
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  await crawler.run([
    {
      url: `${BASE_URL}/support/product`,
      label: LABELS.PRODUCTS,
    },
  ]);

  await crawler.run([
    {
      url: `${BASE_URL}/downloads`,
      label: LABELS.DOWNLOADS,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}
