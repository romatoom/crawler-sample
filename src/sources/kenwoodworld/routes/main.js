import { settings } from "#utils/globals.js";

export default function addHandlerMain(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.MAIN, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $(
      "nav#js-ken-header-navdrawer-desktop-comp_01999471 a.ken-header__navdrawer__nav-list__item[href]"
    ).each((_, link) => {
      const category = $(link).text().trim();
      if (category.endsWith("Collection")) return true;

      const url = $(link).attr("href");

      targets.push({
        url: `${BASE_URL}${url}`,
        label: LABELS.PRODUCTS,
        userData: {
          data: {
            category,
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
