import { settings } from "#utils/globals.js";

export default function addHandlerCategories(router) {
  const {
    LABELS, BASE_URL
  } = settings.source;

  router.addHandler(LABELS.CATEGORIES, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const categories = $("#a-z-wrapper dd > a[href]");

    for (const categoryItem of categories) {
      const categoryElem = $(categoryItem);

      const category = categoryElem.text();
      const url = `${BASE_URL}${categoryElem.attr("href")}`;

      await crawler.addRequests([
        {
          url,
          label: LABELS.PRODUCTS_LIST,
          userData: {
            data: {
              category,
            },
          },
        },
      ]);

      if (settings.testMode) break;
    }
  });
}