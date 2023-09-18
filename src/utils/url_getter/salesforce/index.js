import { PlaywrightCrawler, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { LABELS } from "../constants.js";

export default async function startSalesforceDownloader(
  urls
) {
  log.setLevel(log.LEVELS.DEBUG);

  addRouterHandlers();

  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: true,
    maxRequestRetries: 1,
  });

  const requests = urls.map((url) => ({
    url,
    label: LABELS.DOWNLOAD_PDF,
  }));

  await crawler.run(requests);
}
