import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";

const { groupBy } = pkg;

import { log } from "crawlee";

import pathOfEntity from "#utils/paths.js";

log.setLevel(log.LEVELS.INFO);

export default async function getPreparedData(sourceName) {
  log.info("Start post-processing.");

  const rawDataManuals = fs.readFileSync(pathOfEntity(sourceName, "manuals"));
  const manuals = JSON.parse(rawDataManuals);

  const rawDataProducts = fs.readFileSync(pathOfEntity(sourceName, "products"));
  const products = JSON.parse(rawDataProducts);

  const groupedManuals = manuals.groupBy((manual) => {
    return manual.pdfUrl;
  });

  let preparedManuals = [];
  for (const [_, manuals] of Object.entries(groupedManuals)) {
    const languages = manuals.map((manual) => manual.language);

    const manual = { ...manuals[0] };
    delete manual.language;
    manual.languages = languages;

    preparedManuals.push(manual);
  }

  return {
    products,
    manuals: preparedManuals,
  };
}
