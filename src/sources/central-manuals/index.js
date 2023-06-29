import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";

export default async function startCentralManuals() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(
    `Setting up crawler for "${BASE_URL.EN}", "${BASE_URL.ES}", "${BASE_URL.FR}"`
  );

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.addRequests([
    {
      url: `${BASE_URL.EN}/user_manual_instruction_guide_brand1.php`,
      label: LABELS.START,
      userData: {
        data: {
          langCode: "EN",
        },
      },
    },
    {
      url: `${BASE_URL.FR}/notice_manuel_mode_emploi_marque.php`,
      label: LABELS.START,
      userData: {
        data: {
          langCode: "FR",
        },
      },
    },
    {
      url: `${BASE_URL.ES}/manual_guia_del_usuario_instrucciones_marca1.php`,
      label: LABELS.START,
      userData: {
        data: {
          langCode: "ES",
        },
      },
    },
  ]);

  await dropDatasets(SOURCE);
  await crawler.run();

  await exportDatasets(SOURCE);
  await exportDataToSqlite(SOURCE);
}
