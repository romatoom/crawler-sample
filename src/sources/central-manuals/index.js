import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE_NAME, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";

export default async function startCentralManuals() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.addRequests([
    {
      url: `${BASE_URL}/user_manual_instruction_guide_brand1.php`,
      label: LABELS.START,
    },
  ]);

  await dropDatasets(SOURCE_NAME);
  await crawler.run();

  await exportDatasets(SOURCE_NAME);
  await exportDataToSqlite(SOURCE_NAME);
}

// 24019m, 22868p, 22949pm
