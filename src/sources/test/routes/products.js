export default function routeHandler(source) {
  const { baseURL } = source;

  return async ({ request, log, $, crawler }) => {
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
            url: `${baseURL}${$(product).attr("href")}`,
            label: "PRODUCT",
            userData: {
              data: {
                productName: $(product).find("span").text().trim(),
                category,
              },
            },
          });
        });
    });

    await crawler.addRequests(targets.slice(0, 11));
  };
}
