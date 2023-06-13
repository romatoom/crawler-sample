import fs from "fs";
import pkg from "core-js/actual/array/group-by.js";
import uniqWith from "lodash/uniqWith.js";
import { CENTRAL_MANUALS_FORMATTERS } from "#utils/formatters.js";

const { groupBy } = pkg;

import { log } from "crawlee";

import pathOfEntity from "#utils/paths.js";

log.setLevel(log.LEVELS.INFO);

function compare(product1, product2) {
  return product1.brand === product2.brand && product1.name === product2.name;
}

function prepareManuals(manuals, sourceName) {
  const groupedManuals = manuals.groupBy((manual) => manual.pdfUrl);

  let preparedManuals = [];

  switch (sourceName) {
    case "mi":
      for (const [_, manuals] of Object.entries(groupedManuals)) {
        const languages = manuals.map((manual) => manual.language);

        const manual = { ...manuals[0] };
        delete manual.language;
        manual.languages = languages;

        preparedManuals.push(manual);
      }

      break;
    case "central-manuals":
      for (const [_, manuals] of Object.entries(groupedManuals)) {
        const manual = { ...manuals[0] };

        const languages = [
          ...new Set(manuals.map((manual) => manual.language)),
        ];
        delete manual.language;
        manual.languages = languages;

        const titles = [...new Set(manuals.map((manual) => manual.title))];
        manual.title =
          titles.length === 1
            ? titles[0]
            : CENTRAL_MANUALS_FORMATTERS.joinTitles(titles);

        preparedManuals.push(manual);
      }

      break;
    default:
      preparedManuals = [...manuals];
      break;
  }

  return preparedManuals;
}

export default async function getPreparedData(sourceName) {
  log.info("Prepare and receive data.");

  const rawDataManuals = fs.readFileSync(pathOfEntity(sourceName, "manuals"));
  const manuals = JSON.parse(rawDataManuals);

  const rawDataProducts = fs.readFileSync(pathOfEntity(sourceName, "products"));

  const products = JSON.parse(rawDataProducts);

  const preparedProducts = uniqWith(products, compare);

  const preparedManuals = prepareManuals(manuals, sourceName);

  return {
    products: preparedProducts,
    manuals: preparedManuals,
  };
}
