import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import productsInfo from "./get_products_info.js";
import { productIdGenerator } from "#utils/generators.js";
import { settings } from "#utils/globals.js";

export default async function startXiaomi() {
  const { BASE_URL, LABELS, BRAND } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  let pInfo = await productsInfo();

  if (settings.testMode) {
    pInfo = [pInfo[0]];
  }

  const requests = pInfo.map((el) => ({
    url: el.url,
    label: LABELS.PRODUCT,
    userData: {
      data: {
        innerId: productIdGenerator.next().value,
        name: el.name,
        category: el.category,
        images: el.images,
        brand: BRAND,
      },
    },
  }));

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.addRequests([
    ...requests,
    {
      url: `${BASE_URL}/global/support/user-guide`,
      label: LABELS.START_USER_GUIDES,
    },
  ]);

  await dropDatasets();
  await crawler.run();

  await exportDatasets();
  await exportDataToSqlite();
}
