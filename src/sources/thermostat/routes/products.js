import { settings } from "#utils/globals.js";

export default function addHandlerProducts(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const linkNextPage = $("a.wp-block-query-pagination-next");
    if (linkNextPage.length === 1) {
      const url = linkNextPage.attr("href");
      await crawler.addRequests([
        {
          url,
          label: LABELS.PRODUCTS,
          userData: {
            data: {
              ...request.userData.data,
            },
          },
        },
      ]);
    }

    const targets = [];

    $("ul.wp-block-post-template > li.wp-block-post").each((_, product) => {
      const image = $(product).find("img").attr("src");
      const productLink = $(product).find(".wp-block-post-title > a");
      const productTitle = productLink.text().trim();
      const productURL = productLink.attr("href");
      targets.push({
        url: productURL,
        label: LABELS.PRODUCT,
        userData: {
          data: {
            ...request.userData.data,
            productTitle,
            image,
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
