import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE_NAME, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { setExistingProducts } from "./temp_data.js";
import { readProducts } from "#utils/database.js";
import { settings } from "#utils/globals.js";

export default async function startSony() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 10,
    minConcurrency: 10,
    maxConcurrency: 50,
  });

  if (settings.onlyNewProducts) {
    let existingProducts;
    try {
      existingProducts = await readProducts(SOURCE_NAME);
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

  await dropDatasets(SOURCE_NAME);

  log.info("Adding requests to the queue.");

  // ue_US
  // en_GB

  const targets = [];
  for (const langCountryCode of ["en_GB"]) {
    targets.push({
      url: `${BASE_URL}/${langCountryCode}/sitemap`,
      label: LABELS.SITEMAP,
    });
  }
  await crawler.run(targets);

  await exportDatasets(SOURCE_NAME);
  await exportDataToSqlite(SOURCE_NAME);
}
