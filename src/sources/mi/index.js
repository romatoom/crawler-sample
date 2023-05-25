import { CheerioCrawler, log, Dataset } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, labels } from "./constants.js";
import postProcessingData from "#utils/post-processer.js";
import exportDataToSqlite from "#utils/exporter.js";

export default async function startMi() {
  log.setLevel(log.LEVELS.INFO);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.addRequests([
    {
      url: `${BASE_URL}/global/support/user-guide`,
      label: labels.START_USER_GUIDES,
    },
    {
      url: `${BASE_URL}/global/sitemap`,
      label: labels.START_SITEMAP,
    },
  ]);

  let manuals = await Dataset.open("mi/manuals");
  await manuals.drop();

  let products = await Dataset.open("mi/products");
  await products.drop();

  await crawler.run();

  manuals = await Dataset.open("mi/manuals");
  await manuals.exportToJSON("OUTPUT", { toKVS: "mi/manuals" });

  products = await Dataset.open("mi/products");
  await products.exportToJSON("OUTPUT", { toKVS: "mi/products" });

  await postProcessingData();
  await exportDataToSqlite();
}
