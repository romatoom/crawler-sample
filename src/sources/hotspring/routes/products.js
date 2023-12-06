export default function routeHandler(source) {
  const { category } = source;

  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $(".swiper-wrapper > div").each((_, productBlock) => {
      const url = $(productBlock).find(".card-title > a").attr("href");
      const productName = $(productBlock).find(".card-title > a").text().trim();

      const series = $(productBlock).find(".card-series").text().trim();

      const images = [];
      $(productBlock)
        .find("a > img")
        .each((_, img) => {
          images.push($(img).attr("src"));
        });

      targets.push({
        url,
        label: "PRODUCT",
        userData: {
          data: {
            productName,
            category,
            series,
            images,
          },
        },
      });
    });

    await crawler.addRequests(targets);
  };
}
