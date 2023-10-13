import { settings } from "#utils/globals.js";

export default function addHandlerProducts(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $(".choose > div > a").each((_, product) => {
      targets.push({
        url: `${request.url}/${$(product).attr("href")}`,
        label: LABELS.MANUALS,
        userData: {
          data: {
            productName: $(product).find("h2").text().trim(),
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
