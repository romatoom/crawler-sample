import { settings } from "#utils/globals.js";

export default function addHandlerProducts(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $("ul.nav.nav-pills.nav-stacked > li > a").each((_, product) => {
      const productName = $(product)
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim();

      targets.push({
        url: `${BASE_URL}${$(product).attr("href")}`,

        label: LABELS.PRODUCT,

        userData: {
          data: {
            ...request.userData.data,

            productName,
          },
        },
      });
    });

    await crawler.addRequests(
      targets.filter(
        (t) => t.userData.data.productName === "2020 BMW 2 Series Coupe"
      )
    );
  });
}
