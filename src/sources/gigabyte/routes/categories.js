import { settings } from "#utils/globals.js";

export default function addHandlerCategories(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.CATEGORIES, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    // Только для первой страницы
    if (!request.url.includes("?page=")) {
      const pageCount = $("span.pageMaximumPage").text().trim();

      const targets = [];

      for (let page = 2; page <= pageCount; page++) {
        targets.push({
          url: `${request.url}?page=${page}`,
          label: LABELS.CATEGORIES,
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

    $(".product_list_box_info_up").each((_, product) => {
      const productName = $(product)
        .find(".product_info_text_col a")
        .text()
        .trim();

      const productURL = `${BASE_URL}${$(product)
        .find(".product_info_text_col a")
        .attr("href")}`;

      let image = $(product).find(".product_photo source");

      if (image?.length === 1) {
        const imageURLArr = image.attr("data-srcset").split("/");

        image = `https:${imageURLArr
          .slice(0, imageURLArr.length - 1)
          .join("/")}/1000`;
      }

      targets.push({
        url: `${productURL}/support#support-manual`,
        label: LABELS.PRODUCT,
        userData: {
          data: {
            ...request.userData.data,
            productName,
            image,
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
