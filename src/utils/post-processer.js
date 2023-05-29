import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";

const { groupBy } = pkg;

import { log } from "crawlee";

import { pathOfEntity, pathOfPreparedEntity } from "#utils/paths.js";

log.setLevel(log.LEVELS.INFO);

export default async function postProcessingData(sourceName) {
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

  let data = JSON.stringify(preparedManuals);
  fs.writeFileSync(pathOfPreparedEntity(sourceName, "manuals"), data);

  data = JSON.stringify(products);
  fs.writeFileSync(pathOfPreparedEntity(sourceName, "products"), data);
}
