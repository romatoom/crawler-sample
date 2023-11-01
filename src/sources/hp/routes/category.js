import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerCategory(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.CATEGORY,
    async ({ request, log, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      const $ = await parseWithCheerio();

      const seriesList = [];

      $("ul.product-finder-list > li > a").each((_, el) => {
        const url = `${BASE_URL}${$(el).attr("href")}`;
        const series = $(el).attr("title");
        seriesList.push({
          url,
          ...request.userData.data,
          series,
        });
      });

      varSave(seriesList, "series", settings.source, "append", "array");
    }
  );
}
