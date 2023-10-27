import { CheerioCrawler, PlaywrightCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import varRead from "#utils/var_reader.js";

// import { getLangs } from "./api_utils.js";

export default async function start() {
  const { BASE_URL, LABELS, LANGS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 60,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  await crawler.run([
    {
      url: `${BASE_URL}/en/support/product/`,
      label: LABELS.PRODUCTS,
    },
  ]);

  const pCrawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: true,
    requestHandlerTimeoutSecs: 500000,
  });

  const productsData = await varRead("productsData", settings.source);

  const targets = [];

  for (const productData of productsData) {
    for (const lang of LANGS) {
      const locale = lang.langCode;
      const language = lang.language;

      let url = productData.url;

      if (locale !== "en") {
        url = url.replace("/en/", `/${locale}/`);
      }

      targets.push({
        url,
        label: LABELS.MANUALS,
        userData: {
          data: {
            category: productData.category,
            series: productData.series,
            image: productData.image,
            productName: productData.productName,
            language,
          },
        },
      });
    }
  }

  await pCrawler.run(targets);

  await exportDatasets();
  await exportDataToSqlite();
}

// 4519/10396 pages, 137 errors.
