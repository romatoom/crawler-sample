import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE_NAME, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";

import { langs, langCountryCodes } from "./temp_data.js";

export default async function startProSony() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/ue_US/change-country-region-language`,
      label: LABELS.LANGS,
    },
  ]);

  // await dropDatasets(SOURCE_NAME);

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/ue_US/sitemap`,
      label: LABELS.SITEMAP,
    },
  ]);

  // console.log(langs());
  // console.log(langCountryCodes());

  // await exportDatasets(SOURCE_NAME);
  // await exportDataToSqlite(SOURCE_NAME);
}
