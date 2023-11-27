import { log } from "crawlee";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import { saveData } from "./api_utils.js";

export default async function start() {
  const { BASE_URL } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  await dropDatasets();

  await setGenerators(settings.source);

  await saveData();

  await exportDatasets();
  await exportDataToSqlite();
}
