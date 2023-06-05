import { LABELS, BASE_URL, BRAND_GROUPS_LIMIT } from "../constants.js";

export default function addHandlerStart(router) {
  router.addHandler(
    LABELS.START,
    async ({ request, crawler, /* page, parseWithCheerio */ $, log }) => {
      log.debug(`request.url: ${request.url}`);

      const brandGroupLinks = $("div.bmap > a[href]");

      let count = 0;

      for (const link of brandGroupLinks) {
        const element = $(link);
        const url = `${BASE_URL}${element.attr("href")}`;

        await crawler.addRequests([
          {
            url,
            label: LABELS.BRAND_GROUP,
          },
        ]);

        count++;
        // if (count >= BRAND_GROUPS_LIMIT) break;
      }
    }
  );
}
