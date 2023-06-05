import { LABELS } from "../constants.js";
import { normalizeTitle } from "#utils/formatters.js";

export default function addHandlerStartUserGuides(router) {
  router.addHandler(
    LABELS.START_USER_GUIDES,
    async ({ request, crawler, $, log, proxyInfo }) => {
      log.debug(`request.url: ${request.url}`);
      /* const usedProxyUrl = proxyInfo.url;
      log.debug(`usedProxyUrl: ${usedProxyUrl}`); */

      const userGidLinks = $(".mi-tabs-pane__item div > a[href]");

      for (const link of userGidLinks) {
        const element = $(link);

        const url = element.attr("href");

        await crawler.addRequests([
          {
            url,
            label: LABELS.USER_GUID,
            userData: {
              data: {
                language: normalizeTitle(element.text()),
              },
            },
          },
        ]);
      }
    }
  );
}
