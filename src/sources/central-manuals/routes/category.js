import { LABELS, BASE_URL } from "../constants.js";
import { normalizeBrand } from "#utils/formatters.js";
import { settings } from "#utils/globals.js";

export default function addHandlerCategory(router) {
  router.addHandler(LABELS.CATEGORY, async ({ request, crawler, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { langCode } = request.userData.data;

    const brands = $("#category li > a[href], #tab_general li > a[href]");

    for (const brandItem of brands) {
      const elem = $(brandItem);

      // Skip links to pages in other languages
      if (elem.find("span.link_category").length > 0) continue;

      const brand = normalizeBrand(elem.text().trim());

      const url = `${BASE_URL[langCode]}/${elem
        .attr("href")
        .replace("../", "")}`;

      await crawler.addRequests([
        {
          url,
          label: LABELS.MANUALS,
          userData: {
            data: {
              ...request.userData.data,
              brand,
            },
          },
        },
      ]);

      if (settings.testMode) break;
    }
  });
}
