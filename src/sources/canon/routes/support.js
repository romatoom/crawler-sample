import { settings } from "#utils/globals.js";

import axios from "axios";
import fs from "fs";

import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";

export default function addHandlerSupport(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.SUPPORT, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    let manuals = [];
    let manualsFileName = "supportManualsList";

    if (
      fs.existsSync(
        `#root/saved_variables/${settings.source.currentName}/${manualsFileName}.json`
      )
    ) {
      manuals = varRead(manualsFileName, settings.source);
    } else {
      for (const el of $(
        "#collapse-category-1516222099 .accordion-item > div"
      )) {
        const elem = $(el);

        const category = elem.find(".accordion-title").text().trim();

        const manualsOfCategory = await getSupportManuals(
          JSON.parse(elem.attr("data-path"))[0]
        );

        manuals.push(
          ...manualsOfCategory.map((m) => {
            m.category = category;
            return m;
          })
        );
      }

      varSave(manuals, manualsFileName, settings.source);
    }

    const supportManualsTargets = manuals.map((manual) => ({
      url: `https://www.usa.canon.com${manual.path}`,
      label: LABELS.SUPPORT_MANUALS,
      userData: {
        data: {
          name: manual.name,
          category: manual.category,
        },
      },
    }));

    await crawler.addRequests(supportManualsTargets);
  });
}

function preparedPath(path) {
  return `https://www.usa.canon.com/bin/canon/productFinder.accordion.${path.replaceAll(
    "/",
    "___"
  )}.-1.json`;
}

async function getSupportManuals(item) {
  if (item.path.endsWith(".html")) {
    return {
      name: item.name,
      path: item.path.slice(0, -5),
    };
  }

  const url = preparedPath(item.path);

  const response = await axios.get(url);

  const productList = JSON.parse(response.data.productList);

  const promises = productList.map((pl) => getSupportManuals(pl));

  const manuals = await Promise.all(promises);

  return manuals.flat();
}
