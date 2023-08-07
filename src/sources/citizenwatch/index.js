import { PlaywrightCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";

import varRead from "#utils/var_reader.js";

export default async function startCitizenwatch() {
  const { BASE_URL } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  let productNumbers;
  try {
    productNumbers = await varRead("productNumbers", settings.source);
  } catch (e) {
    await scrapeProductNumbers();
  } finally {
    productNumbers =
      productNumbers || (await varRead("productNumbers", settings.source));
  }

  await scrapeCollections();

  // await exportDatasets();
  // await exportDataToSqlite();
}

async function scrapeProductNumbers() {
  const { BASE_URL, LABELS } = settings.source;

  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    launchContext: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  });

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/support/manual/item_selection.html`,
      label: LABELS.PRODUCT_NUMBERS,
    },
  ]);
}

async function scrapeCollections() {
  const { BASE_URL, LABELS, COLLECTIONS } = settings.source;

  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    launchContext: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
    requestHandlerTimeoutSecs: 500000,
  });

  log.info("Adding requests to the queue.");

  const targets = COLLECTIONS.map((collection) => ({
    url: collection.url,
    label: LABELS.COLLECTION,
    userData: {
      data: {
        collection: collection.name,
      },
    },
  }));

  await crawler.run(targets);
}
