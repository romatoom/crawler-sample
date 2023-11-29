import { settings } from "#utils/globals.js";

export default function addHandlerProducts(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $(".category-section > .container > div").each((_, categoryBlock) => {
      const category = $(categoryBlock)
        .find(".category-pro-content")
        .text()
        .trim();

      $(categoryBlock)
        .find(".category-pro ul > li > a")
        .each((_, product) => {
          targets.push({
            url: `${BASE_URL}${$(product).attr("href")}`,
            label: LABELS.PRODUCT,
            userData: {
              data: {
                productName: $(product).find("span").text().trim(),
                category,
              },
            },
          });
        });
    });

    await crawler.addRequests(targets.slice(0, 10));
  });
}
