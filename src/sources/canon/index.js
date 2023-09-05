import { PlaywrightCrawler, CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import varRead from "#utils/var_reader.js";
import { getProductsManuals } from "./api_utils.js";
import fs from "fs";
import { setGenerators } from "#utils/generators.js";

const PRODUCTS_PARSED = true;

export default async function startCanon() {
  const { BASE_URL, LABELS, CATEGORIES } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);

  addRouterHandlers();

  if (!PRODUCTS_PARSED) {
    const playwrightCrawler = new PlaywrightCrawler({
      requestHandler: router,
      headless: true,
      requestHandlerTimeoutSecs: 500000,
    });

    const targets = CATEGORIES.map((category) => ({
      url: category.url,
      label: LABELS.CATEGORY,
      userData: {
        data: {
          category: category.title,
        },
      },
    }));

    for (const target of targets) {
      await playwrightCrawler.run([target]);
    }
  }

  const products = await varRead(
    "products",
    settings.source,
    "arrayWithoutBrackets"
  );

  const productsTargets = products.map((product) => ({
    url: product.url,
    label: LABELS.PRODUCT,
    userData: {
      data: {
        name: product.title,
        category: product.category,
        image: product.image,
      },
    },
  }));

  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 100,
    requestHandlerTimeoutSecs: 50000,
  });

  await dropDatasets();
  await setGenerators(settings.source);

  log.info("Adding requests to the queue.");

  // Canon USA
  await crawler.run(productsTargets);

  // Support page of Canon USA
  await crawler.run([
    {
      url: `${BASE_URL}/support`,
      label: LABELS.SUPPORT,
    },
  ]);

  // Canon manuals Europe

  const productsManuals = fs.existsSync(
    `#root/saved_variables/${settings.source.currentName}/productManuals.json`
  )
    ? await varRead("productsManuals", settings.source)
    : await getProductsManuals();

  const processedProductsManuals = await varRead(
    "processedCanonEuropeURLs",
    settings.source,
    "arrayWithoutBrackets"
  );

  const productsManualsForTargets = productsManuals.filter(
    (el) => !processedProductsManuals.includes(el.url)
  );

  console.log(productsManuals.length);
  console.log(productsManualsForTargets.length);

  const productsManualsTargets = productsManualsForTargets.map((pm) => ({
    url: pm.url,
    label: LABELS.PRODUCT_MANUALS,
    userData: {
      data: {
        id: pm.id,
        name: pm.name,
      },
    },
  }));

  await crawler.run(productsManualsTargets);

  await exportDatasets();
  await exportDataToSqlite();
}
