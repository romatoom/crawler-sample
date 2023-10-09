import { settings } from "#utils/globals.js";

export default function addHandlerProducts(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    if (request.url == `${BASE_URL}/collections/all`) {
      const targets = [];

      $("#accordion-filter-p-product_type .checkbox-container .checkbox").each(
        (_, el) => {
          const type = $(el).attr("value");
          if (type === "Recipe") return true;

          targets.push({
            url: `https://shop.panasonic.com/collections/all?filter.p.product_type=${type
              .replaceAll("&", "%26")
              .replaceAll(" ", "%20")}`,
            label: LABELS.PRODUCTS,
            userData: {
              data: {
                ...request.userData.data,
                category: type,
              },
            },
          });
        }
      );

      await crawler.addRequests(targets);

      return;
    }

    // Первая страница

    if (!request.url.includes("&page")) {
      const paginationText = $(".pagination__current").text();
      const pageCount =
        paginationText.length > 0 ? paginationText.split("/")[1].trim() : 1;

      const targets = [];

      for (let page = 2; page <= pageCount; page++) {
        targets.push({
          url: `${request.url}&page=${page}`,
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

    const targets = [];

    $("product-list product-card").each((_, el) => {
      const link = $(el).find(".product-card__figure a");
      const productUrl = `${BASE_URL}${link.attr("href")}`;
      const images = [];

      link.find("img").each((_, img) => {
        images.push(`https:${$(img).attr("src")}`);
      });

      targets.push({
        url: productUrl,
        label: LABELS.PRODUCT,
        userData: {
          data: {
            ...request.userData.data,
            images,
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
