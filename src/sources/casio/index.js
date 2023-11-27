import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { getProducts } from "./api_utils.js";
import { normalizeTitle } from "#utils/formatters.js";
import { readProducts } from "#utils/database.js";
import { setGenerators } from "#utils/generators.js";
import varRead from "#utils/var_reader.js";

const PRODUCTS_PARSED = true;

export default async function start() {
  const { SUPPORT_URL, LABELS, LANGS, CIDS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${SUPPORT_URL}"`);

  addRouterHandlers();

  let crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 10,
    maxRequestsPerMinute: 100,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  if (!PRODUCTS_PARSED) {
    // const existingProducts = await readProducts();
    // const existingProductsURLs = existingProducts.map((product) => product.url);

    let products;

    try {
      products = await varRead("products", settings.source);
    } catch (err) {
      console.log(err);
      products = await getProducts();
    }

    /*products = products.filter(
      (product) => !existingProductsURLs.includes(product.url)
    );*/

    const productTargets = products.map((p) => ({
      url: p.url,
      label: LABELS.PRODUCT,
      userData: {
        data: {
          category: normalizeTitle(p.category),
          sku: p.sku,
          name: p.dataProductName,
          image: p.image,
        },
      },
    }));

    console.log("Products:", productTargets.length);

    await crawler.run(productTargets);
  }

  const supportTargets = [];

  for (const [cid, category] of Object.entries(CIDS)) {
    for (const locale of Object.keys(LANGS)) {
      if (locale === "en") continue;

      const url = `https://support.casio.com/${locale}/manual/manualresult.php?cid=${cid}&keyword=`;
      supportTargets.push({
        url,
        label: LABELS.SUPPORT_PRODUCTS,
        userData: {
          data: {
            locale,
            category,
          },
        },
      });
    }
  }

  crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 5,
    maxConcurrency: 50,
    // maxRequestsPerMinute: 100,
  });

  await crawler.run(supportTargets);

  await exportDatasets();
  await exportDataToSqlite();
}
