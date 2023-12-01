import { CheerioCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";

import state from "#utils/classes/state.js";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";

export default async function start() {
  const { BASE_URL, LABELS } = settings.source;

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

  await state.storage.dropDatasets();

  Product.lastInnerId = await state.serializer.load("lastInnerIdProduct");
  Manual.lastInnerId = await state.serializer.load("lastInnerIdManual");

  await setGenerators(settings.source);

  await crawler.run([
    {
      url: `${BASE_URL}/products`,
      label: LABELS.PRODUCTS,
    },
  ]);

  await state.storage.exportDatasets();

  await state.exporter.export();
}
