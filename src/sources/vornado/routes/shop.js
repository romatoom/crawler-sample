export default function routeHandler(_) {
  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $("ul.product-categories > li.cat-item > a").each((_, link) => {
      targets.push({
        url: $(link).attr("href"),
        label: "PRODUCTS",
        userData: {
          data: {
            category: $(link).text().trim(),
          },
        },
      });
    });

    await crawler.addRequests(targets);
  };
}
