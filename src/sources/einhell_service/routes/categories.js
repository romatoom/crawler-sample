import { settings } from "#utils/globals.js";

export default function addHandlerCategories(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.CATEGORIES, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $(".module-nav.module-nav--main ul.module-nav__lvl1 > li > a[href]").each(
      (_, el) => {
        if ($(el).text() === "Services") return true;

        const productsLink = $(el).attr("href");
        targets.push({
          url: `${BASE_URL}${productsLink}`,
          label: LABELS.PRODUCTS_LIST,
        });
      }
    );

    await crawler.addRequests(targets);
  });
}
