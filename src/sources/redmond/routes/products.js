import { settings } from "#utils/globals.js";
import { pageCount } from "#utils/calc.js";

export default function addHandlerProducts(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    const paginationExist = $(".paginate-text").length > 0;

    // Только для первой страницы
    if (!request.url.includes("?PAGEN_1=")) {
      if (paginationExist) {
        const paginateText = $(".paginate-text").text().trim();

        // 37-54 из 75 товаров
        const regexp = /^.+ из (.+) товар.+$/;
        const matches = regexp.exec(paginateText);
        const total = matches[1];

        const countOfPages = pageCount(total);

        const targets = [];

        for (let page = 2; page <= countOfPages; page++) {
          targets.push({
            url: `${request.url}?PAGEN_1=${page}`,
            label: LABELS.PRODUCTS,
            userData: {
              data: {
                ...request.userData.data,
              },
            },
          });
        }

        await crawler.addRequests(targets);
      }
    }

    $(".catalog-products-card").each((_, product) => {
      targets.push({
        url: `${BASE_URL}${$(product)
          .find(".catalog-products-card-img a")
          .attr("href")}`,

        label: LABELS.PRODUCT,

        userData: {
          data: {
            ...request.userData.data,

            productName: $(product)
              .find(".catalog-products-card-name p b")
              .text()
              .replace("REDMOND", "")
              .trim(),
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
