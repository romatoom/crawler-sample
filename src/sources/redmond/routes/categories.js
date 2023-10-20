import { settings } from "#utils/globals.js";

export default function addHandlerCategories(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.CATEGORIES, async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $("ul.catalog-subsection-list > li.catalog-subsection-list-item > a").each(
      (_, categoryBlock) => {
        const url = $(categoryBlock).attr("href");

        if (url === "#" || url.includes("https://")) return true;

        targets.push({
          url: `${BASE_URL}${url}`,
          label: LABELS.PRODUCTS,
          userData: {
            data: {
              category: $(categoryBlock).text().trim(),
            },
          },
        });
      }
    );

    await crawler.addRequests(targets);
  });
}
