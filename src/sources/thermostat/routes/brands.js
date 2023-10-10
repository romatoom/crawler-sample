import { settings } from "#utils/globals.js";

export default function addHandlerBrands(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.BRANDS, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];
    $("ul.wp-block-categories-list.wp-block-categories > li > a").each(
      (_, link) => {
        targets.push({
          url: $(link).attr("href"),
          label: LABELS.PRODUCTS,
          userData: {
            data: {
              brand: $(link).text().trim(),
            },
          },
        });
      }
    );

    await crawler.addRequests(targets);
  });
}
