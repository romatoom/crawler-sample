/*
Сайт использует  StackPath
StackPath - это система защиты, которая предназначена для предотвращения автоматического парсинга
или злоупотребления данными на веб-сайте. Они применяют различ методы защиты, чтобы предотвратить несанкционированный доступ.

Защита срабатывает довольно быстро, не позволяя спарсить список продуктов, поэтому было решено спарсить только страницу с инструкциями
*/

import { /*PlaywrightCrawler,*/ CheerioCrawler, log, sleep } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import varRead from "#utils/var_reader.js";
import shuffle from "lodash/shuffle.js";
import { getRandomArbitrary } from "#utils/calc.js";

export default async function start() {
  const { BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 1,
    maxRequestRetries: 1,
    requestHandlerTimeoutSecs: 240000,
    // maxRequestsPerMinute: 100,
    errorHandler: (inputs, error) => {
      console.error(error.message);
      process.exit();
    },
  });

  await dropDatasets();
  await setGenerators(settings.source);

  log.info("Adding requests to the queue.");

  /*
  const playwrightCrawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: true,
    requestHandlerTimeoutSecs: 500000,
  });

  await playwrightCrawler.run([
    {
      url: `${BASE_URL}/russia/metal-detectors`,
      label: LABELS.PRODUCTS,
    },
  ]); */

  /*
  const productsURLs = shuffle(
    await varRead("productsURLs", settings.source, "arrayWithoutBrackets")
  );

  const targets = productsURLs.map((url) => {
    if (url === "https://go-find.minelab.com") {
      return {
        url,
        label: LABELS.GO_FIND_PRODUCTS,
      };
    }

    return {
      url: `${BASE_URL}/russia/${url}`,
      label: LABELS.PRODUCT,
    };
  });

  for (const target of targets) {
    await crawler.run([target]);
    await sleep(Math.floor(getRandomArbitrary(20000, 50000)));
  }
  */

  await crawler.run([
    {
      url: `${BASE_URL}/usa/support/downloads/product-manuals-guides`,
      label: LABELS.MANUALS,
    },
  ]);

  await exportDatasets();
  await exportDataToSqlite();
}
