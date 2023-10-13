import { settings } from "#utils/globals.js";

export default function addHandlerManuals(router) {
  const { LABELS } =
    settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const manualsURL = request.url.split("/").slice(0, -1).join("/");

    const targets = [];

    $(".choose ul > li > a").each((_, link) => {
      targets.push({
        url: `${manualsURL}${$(link).attr("href").slice(1)}`,
        label: LABELS.DOWNLOAD,
        userData: {
          data: {
            ...request.userData.data,
            language: $(link).text().trim(),
          },
        },
      });
    });

    await crawler.addRequests(targets);
  });
}
