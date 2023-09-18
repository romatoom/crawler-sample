import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { setExistingProducts } from "./temp_data.js";
import { readProducts } from "#utils/database.js";
import { settings } from "#utils/globals.js";

export default async function start() {
  const { BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestRetries: 15,
    requestHandlerTimeoutSecs: 10,
    minConcurrency: 10,
    maxConcurrency: 50,
  });

  if (settings.onlyNewProducts) {
    let existingProducts;
    try {
      existingProducts = await readProducts();
    } catch (err) {
      log.error(err);
      existingProducts = [];
    }
    setExistingProducts(existingProducts);
  }

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/ue_US/change-country-region-language`,
      label: LABELS.LANGS,
    },
  ]);

  await dropDatasets();

  log.info("Adding requests to the queue.");

  // ue_US
  // en_GB

  const targets = [];
  for (const langCountryCode of ["en_GB", "ue_US"]) {
    targets.push({
      url: `${BASE_URL}/${langCountryCode}/sitemap`,
      label: LABELS.SITEMAP,
    });
  }
  await crawler.run(targets);

  await exportDatasets();
  await exportDataToSqlite();
}
