import { settings } from "#utils/globals.js";

export default function addHandlerProduct(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    let manualsUrl = $(".ken-pdp__specifications__manual a").attr("href");
    if (!manualsUrl) return;
    manualsUrl = `${BASE_URL}${manualsUrl}`;

    const specs = [];

    $(".ken-pdp__specifications__specification").each((_, el) => {
      const group = $(el)
        .find(".ken-pdp__specifications__specification__title")
        .text()
        .trim();

      $(".ken-pdp__specifications__single").each((_, el) => {
        const label = $(el)
          .find(".ken-pdp__specifications__single__label")
          .text()
          .trim()
          .replace(":", "");

        const values = $(el)
          .find(".ken-pdp__specifications__single__value")
          .text()
          .trim();

        if (label?.length > 0 && values?.length > 0) {
          specs.push({ group, label, values });
        }
      });
    });

    const images = [];

    $("section.ken-pdp__gallery__main.js-ken-pdp__gallery__main-images")
      .eq(1)
      .find("img")
      .each((_, el) => {
        images.push($(el).attr("src"));
      });

    await crawler.addRequests([
      {
        url: manualsUrl,
        label: LABELS.MANUALS,
        userData: {
          data: {
            ...request.userData.data,
            images,
            specs,
            productURL: request.url,
          },
        },
      },
    ]);
  });
}
