import { settings } from "#utils/globals.js";

export default function addHandlerEnterpriseCategories(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.ENTERPRISE_CATEGORIES,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      // Только для первой страницы
      if (!request.url.includes("?page=")) {
        const paginationExist = $(".List-Paging").length > 0;

        if (paginationExist) {
          const paginElems = $("ul.PagingArea > li.PagingItem");

          const pageCount = paginElems
            .eq(paginElems.length - 1)
            .text()
            .trim();

          const targets = [];

          for (let page = 2; page <= pageCount; page++) {
            targets.push({
              url: `${request.url}?page=${page}`,
              label: LABELS.ENTERPRISE_CATEGORIES,
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

      const targets = [];

      $(".ResultItem").each((_, product) => {
        const skuItems = [];

        const skuLinks = $(product).find(".skuDesc a");

        if (skuLinks.length > 0) {
          skuLinks.each((_, skuLink) => {
            skuItems.push({
              sku: $(skuLink).text().trim(),
              url: $(skuLink).attr("href"),
            });
          });
        } else {
          const skuLink = $(product).find(".ModelLink");

          skuItems.push({
            sku: $(skuLink).text().trim(),
            url: $(skuLink).attr("data-href"),
          });
        }

        let image = $(product).find("img.ParentModelImg");
        if (image.length > 0) {
          image = `https:${image.attr("data-src")}`;
        }

        const specs = [];

        $(".ResultItemSpec .ParentModelSpec").each((_, specBlock) => {
          const specSpans = $(specBlock).find("span");

          const label = specSpans.eq(0).text().trim();
          const values = specSpans.eq(1).text().trim();

          if ((label?.length > 0) & (values?.length > 0)) {
            specs.push({ label, values });
          }
        });

        for (const skuItem of skuItems) {
          targets.push({
            url: `${BASE_URL}${skuItem.url}`,
            label: LABELS.ENTERPRISE_PRODUCT,
            userData: {
              data: {
                ...request.userData.data,
                sku: skuItem.sku,
                images: image ? [image] : [],
                specs,
              },
            },
          });
        }
      });

      await crawler.addRequests(targets);
    }
  );
}
