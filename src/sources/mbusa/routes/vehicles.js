import { settings } from "#utils/globals.js";

export default function addHandlerVehicles(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(LABELS.VEHICLES, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const vehiclesTargets = [];

    $(".all-vehicles__body-group .all-vehicles__class").each((_, vehicle) => {
      let series = $(vehicle)
        .find("a > h3.all-vehicles__class-name")
        .text()
        .toUpperCase();

      // Fix
      series = series.replace("MERCEDES-", "");

      series = series.replace("SEDAN", "SEDAN (SALOON)");
      series = series.replace("WAGON", "WAGON (ESTATE)");

      const image = `${BASE_URL}${$(vehicle)
        .find("a > picture > img")
        .attr("data-lazy-src")}`;

      $(vehicle)
        .find(".all-vehicles__class-more-info > ul > li > a")
        .each((_, modelLink) => {
          const model = JSON.parse(
            $(modelLink).attr("data-analytics-container").replaceAll("'", '"')
          )["model"];
          const modelTitle = $(modelLink).find("span").first().text().trim();
          const url = `${BASE_URL}${$(modelLink).attr("href")}`;

          vehiclesTargets.push({
            url,
            label: LABELS.SPECS,
            userData: {
              data: {
                model,
                modelTitle,
                series,
                images: [image],
              },
            },
          });
        });
    });

    await crawler.addRequests(vehiclesTargets);
  });
}
