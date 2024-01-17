export default function routeHandler(_) {
  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    if (request.url.endsWith("/page/1")) return;

    const pageTargets = [];

    $("ul.page-numbers > li > a.page-numbers").each((_, pageLink) => {
      pageTargets.push({
        url: $(pageLink).attr("href"),
        label: "PRODUCTS",
        userData: {
          data: {
            ...request.userData.data,
          },
        },
      });
    });

    await crawler.addRequests(pageTargets);

    const targets = [];

    $("ul.products > li.product").each((_, product) => {
      const link = $(product).find("h2.woocommerce-loop-product__title > a");

      const url = link.attr("href");

      targets.push({
        url,
        label: "PRODUCT",
        userData: {
          data: {
            ...request.userData.data,
          },
        },
      });
    });

    await crawler.addRequests(targets);
  };
}
