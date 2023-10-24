import { settings } from "#utils/globals.js";

export default function addHandlerProduct(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    $(".ulb4 ul.nav.nav-pills.nav-stacked").each((_, manual) => {
      const langText = $(manual).prev().text().trim();

      const bracketIndex = langText.indexOf("(");

      const language =
        bracketIndex !== -1
          ? langText.slice(0, bracketIndex - 1)
          : langText.replace("in", "").trim();

      targets.push({
        url: `${BASE_URL}${$(manual).find("li > a").eq(0).attr("href")}`,
        label: LABELS.MANUAL,
        userData: {
          data: {
            ...request.userData.data,
            language
          }
        }
      });
    });

    await crawler.addRequests([targets[0]]);
  });
}
