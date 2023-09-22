import { Dataset, log } from "crawlee";
import { settings } from "#utils/globals.js";

export async function dropDatasets(
  source = settings.source,
  datasetNames = []
) {
  const datasetNamesForDrop = [
    ...["manuals", "products", "products_manuals"],
    ...datasetNames,
  ];

  for (const datasetName of datasetNamesForDrop) {
    const dataset = await Dataset.open(`${source.currentName}/${datasetName}`);

    await dataset.drop();
  }
}

export async function exportDatasets(
  source = settings.source,
  datasetNames = []
) {
  log.info("Export datasets.");

  const datasetNamesForExport = [
    ...["manuals", "products", "products_manuals"],
    ...datasetNames,
  ];

  for (const datasetName of datasetNamesForExport) {
    const dataset = await Dataset.open(`${source.currentName}/${datasetName}`);

    await dataset.exportToJSON("OUTPUT", {
      toKVS: `${source.currentName}/${datasetName}`,
    });
  }
}
