import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";


import { getProducts } from "./api_utils.js";

export default async function startWhirlpool() {
  const { BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);

  const products = await getProducts();

  const productsTargets = products.map((product) => ({
    url: `${BASE_URL}${product.url}`,
    label: LABELS.PRODUCT,
    userData: {
      data: {
        name: product.name,
        baseProduct: product.baseProduct,
        code: product.code,
        description: product.description,
        images: [product.picture],
        specs: product.specifications
          ? product.specifications.map((s) => ({
              label: s.key,
              values: s.value,
            }))
          : [],
      },
    },
  }));

  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 5,
    maxRequestsPerMinute: 100,
  });

  await dropDatasets();

  log.info("Adding requests to the queue.");

  await crawler.run(productsTargets);

  await exportDatasets();
  await exportDataToSqlite();
}
