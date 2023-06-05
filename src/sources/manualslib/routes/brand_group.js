import { LABELS, BASE_URL, BRANDS_LIMIT } from "../constants.js";

export default function addHandlerBrandGroup(router) {
  router.addHandler(
    LABELS.BRAND_GROUP,
    async ({ request, crawler, /*page, parseWithCheerio*/ $, log }) => {
      log.debug(`request.url: ${request.url}`);

      /* await page.waitForSelector("div.row.tabled");
      const $ = await parseWithCheerio(); */

      const brands = $("div.row.tabled");

      let count = 0;

      for (const brandItem of brands) {
        const element = $(brandItem).find("div").first().find("a[href]");
        const url = `${BASE_URL}${element.attr("href")}`;

        await crawler.addRequests([
          {
            url,
            label: LABELS.BRAND,
            userData: {
              data: {
                brand: element.text().trim(),
              },
            },
          },
        ]);

        count++;
        // if (count >= BRANDS_LIMIT) break;
      }
    }
  );
}
