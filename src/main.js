import { CheerioCrawler, log, Dataset } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, labels } from "./constants.js";
import postProcessingData from "./utils/post-processer.js";
import exportDataToSqlite from "./utils/exporter.js";

log.setLevel(log.LEVELS.INFO);
log.info("Setting up crawler.");

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

let manuals = await Dataset.open("manuals");
await manuals.drop();

let products = await Dataset.open("products");
await products.drop();

await crawler.run();

manuals = await Dataset.open("manuals");
await manuals.exportToJSON("OUTPUT", { toKVS: "manuals" });

products = await Dataset.open("products");
await products.exportToJSON("OUTPUT", { toKVS: "products" });

await postProcessingData();
await exportDataToSqlite();
