import { labels } from "../constants.js";
import { formatTitle } from "../utils/formatters.js";

export default function addHandlerStartUserGuides(router) {
  router.addHandler(
    labels.START_USER_GUIDES,
    async ({ request, crawler, $, log }) => {
      log.debug(`request.url: ${request.url}`);

      const userGidLinks = $(".mi-tabs-pane__item div > a[href]");

      for (const link of userGidLinks) {
        const element = $(link);

        const url = element.attr("href");

        await crawler.addRequests([
          {
            url,
            label: labels.USER_GUID,
            userData: {
              data: {
                language: formatTitle(element.text().trim()),
              },
            },
          },
        ]);
      }
    }
  );
}
