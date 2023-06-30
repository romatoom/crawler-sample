import { normalizeTitle } from "#utils/formatters.js";
import { settings } from "#utils/globals.js";

export default function addHandlerStartUserGuides(router) {
  const { LABELS } = settings.source;

  router.addHandler(
    LABELS.START_USER_GUIDES,
    async ({ request, crawler, $, log }) => {
      console.log(settings);

      log.debug(`request.url: ${request.url}`);

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

        if (settings.testMode) break;
      }
    }
  );
}
