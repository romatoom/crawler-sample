import { settings } from "#utils/globals.js";

export default function addHandlerCategory(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.CATEGORY,
    async ({ request, log, parseWithCheerio, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const $ = await parseWithCheerio();

      const targets = [];

      $("ul.product-finder-list > li > a").each((_, el) => {
        const url = `${BASE_URL}${$(el).attr("href")}`;
        const series = $(el).attr("title");
        targets.push({
          url,
          label: LABELS.SERIES,
          userData: {
            data: {
              ...request.userData.data,
              series,
            },
          },
        });
      });

      await crawler.addRequests(targets);
    }
  );
}
