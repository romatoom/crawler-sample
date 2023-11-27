import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import varRead from "#utils/var_reader.js";
import {
  getManualsURLs,
  getPreparedManualsURLs,
  getLangs,
} from "./api_utils.js";

export default async function start() {
  /* const { BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 120,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  let manualsURLs;
  try {
    manualsURLs = await varRead("manualsURLs", settings.source);
  } catch (err) {
    manualsURLs = await getManualsURLs();
  }

  const preparedManualsURLs = getPreparedManualsURLs(manualsURLs);

  const targets = [];

  for (const productName in preparedManualsURLs) {
    const { category, urls } = preparedManualsURLs[productName];

    for (const url of urls) {
      targets.push({
        url,
        label: LABELS.MANUAL,
        userData: {
          data: {
            category,
            productName,
          },
        },
      });
    }
  }

  await crawler.run(targets);*/

  // await exportDatasets();
  await exportDataToSqlite();
}
