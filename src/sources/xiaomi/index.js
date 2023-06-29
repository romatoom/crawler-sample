import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE, LABELS, BRAND } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import productsInfo from "./get_products_info.js";
import { productIdGenerator } from "#utils/generators.js";
import { settings } from "#utils/globals.js";

export default async function startXiaomi() {
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

  await dropDatasets(SOURCE);
  await crawler.run();

  await exportDatasets(SOURCE);
  await exportDataToSqlite(SOURCE);
}
