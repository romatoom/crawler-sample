import { settings } from "#utils/globals.js";

export default function addHandlerBrands(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.BRANDS, async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $("ul.nav.nav-pills.nav-stacked > li > a").each((_, brand) => {
      targets.push({
        url: `${BASE_URL}${$(brand).attr("href")}`,
        label: LABELS.PRODUCTS,
        userData: {
          data: {
            brand: $(brand).text().trim(),
          },
        },
      });
    });

    await crawler.addRequests([targets[0]]);
  });
}
