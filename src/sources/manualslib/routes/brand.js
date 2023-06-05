import { LABELS, BASE_URL, CATEGORIES_LIMIT } from "../constants.js";

export default function addHandlerBrand(router) {
  router.addHandler(
    LABELS.BRAND,
    async ({ request, crawler, /* page, parseWithCheerio*/ $, log }) => {
      log.debug(`request.url: ${request.url}`);

      const categories = $("div.cathead > a[href]");

      let count = 0;

      for (const categoryItem of categories) {
        const element = $(categoryItem);
        const url = `${BASE_URL}${element.attr("href")}`;

        await crawler.addRequests([
          {
            url,
            label: LABELS.CATEGORY,
            userData: {
              data: {
                ...request.userData.data,
                category: element.text().trim(),
              },
            },
          },
        ]);

        count++;
        // if (count >= CATEGORIES_LIMIT) break;
      }
    }
  );
}
