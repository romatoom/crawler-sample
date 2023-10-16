import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerManuals(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = {};

    $("user-manual-product-card").each((_, product) => {
      const title = $(product).find("p.mb-2").text().trim();

      const docs = [];
      $(product)
        .find("details aside ul li a")
        .each((_, link) => {
          const url = `https:${$(link).attr("href")}`;

          if (!url.includes(".pdf")) return true;

          docs.push(url);
        });

      if (!manuals[title]) manuals[title] = [];
      manuals[title].push(...docs);
    });

    varSave(manuals, "manuals", settings.source);
  });
}
