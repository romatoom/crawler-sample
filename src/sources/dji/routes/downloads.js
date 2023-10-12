import { settings } from "#utils/globals.js";
import varRead from "#utils/var_reader.js";

export default function addHandlerDownloads(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.DOWNLOADS, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const products = await varRead("products", settings.source);

    const targets = [];

    $(
      ".J_beef_up .fixed-nav.fixed-nav-link.J_beefup__head.nav-item.nav-arrow.ga-data"
    )
      .next()
      .each((_, el) => {
        $(el)
          .find(".nav-item.nav-item-indent-4")
          .each((_, product) => {
            const productName = $(product).text().trim();

            const productData = products[productName] || {
              category: "Other",
              series: null,
              image: null,
            };

            targets.push({
              url: $(product).parent().attr("href"),
              label: LABELS.MANUALS,
              userData: {
                data: {
                  productName,
                  productData,
                },
              },
            });
          });
      });

    await crawler.addRequests(targets);
  });
}
