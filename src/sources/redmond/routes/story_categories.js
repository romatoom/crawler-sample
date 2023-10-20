import { settings } from "#utils/globals.js";

export default function addHandlerStoryCategories(router) {
  const { LABELS, STORE_URL } = settings.source;

  router.addHandler(
    LABELS.STORY_CATEGORIES,
    async ({ request, log, $, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const targets = [];

      $(".menu_list a").each((_, link) => {
        if ($(link).next().length > 0) return true;

        const category = $(link).text().trim();

        targets.push({
          url: `${STORE_URL}${$(link).attr("href")}`,
          label: LABELS.STORY_PRODUCTS,
          userData: {
            data: {
              category,
            },
          },
        });
      });

      await crawler.addRequests(targets);
    }
  );
}
