import { LABELS, BASE_URL } from "../constants.js";

export default function addHandlerStart(router) {
  router.addHandler(LABELS.START, async ({ request, crawler, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const brands = $("#tab_general a:not(.dropbtn)");

    for (const brandItem of brands) {
      const elem = $(brandItem);
      const url = `${BASE_URL}/${elem.attr("href")}`;

      await crawler.addRequests([
        {
          url,
          label: LABELS.MANUALS,
        },
      ]);
    }
  });
}
