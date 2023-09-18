import { settings } from "#utils/globals.js";

export default function addHandlerStart(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.START, async ({ request, crawler, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { langCode } = request.userData.data;

    const categories = $("#right_content li > a");

    for (const categoryItem of categories) {
      const elem = $(categoryItem);

      const url = `${BASE_URL[langCode]}/${elem
        .attr("href")
        .replace("../", "")}`;
      let category = elem.text().trim();

      await crawler.addRequests([
        {
          url,
          label: LABELS.CATEGORY,
          userData: {
            data: {
              ...request.userData.data,
              category,
            },
          },
        },
      ]);

      if (settings.testMode) break;
    }
  });
}
