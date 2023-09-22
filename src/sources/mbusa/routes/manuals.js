import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { manualIdGenerator } from "#utils/generators.js";

export default function addHandlerManuals(router) {
  const { LABELS, BASE_URL, currentName } = settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    // const $ = await parseWithCheerio();

    const manuals = [];

    $(
      "#tabbed-module-accordion__6d2f5bf7-5eff-455d-b53d-6dcad6fcea56 > div > section"
    ).each((_, yearsBlock) => {
      const yearData = $(yearsBlock)
        .attr("data-analytics-container")
        .replaceAll("'", '"');

      const year = JSON.parse(yearData)["tab"];

      $(yearsBlock)
        .find(
          ".accordion__pane > .compact-tile-grid > section > div > .compact-tile-grid__tiles > .link-group.link-group-item > section"
        )
        .each((_, seriesBlock) => {
          let series = $(seriesBlock)
            .find("h3.link-group__title")
            .text()
            .trim()
            .toUpperCase();

          // Fix
          series = series.replace("MERCEDES-", "");

          if (series === "G-CLASS") {
            series = "G-CLASS SUV";
          } else if (series === "C- CLASS COUPE") {
            series = "C-CLASS COUPE";
          }

          series = series.replace("SEDAN", "SEDAN (SALOON)");
          series = series.replace("WAGON", "WAGON (ESTATE)");

          const series_arr =
            series === "S-CLASS SEDAN (SALOON) & MAYBACH"
              ? ["S-CLASS SEDAN (SALOON)", "MAYBACH S-CLASS"]
              : [series];

          $(seriesBlock)
            .find("ul > li > a")
            .each((_, link) => {
              const pdfUrl = `${BASE_URL}${$(link).attr("href")}`;
              if (!pdfUrl.endsWith(".pdf")) return true;

              let language = "English";

              let materialType = $(link).text();

              if (
                materialType.includes("(Español)") ||
                materialType.includes("(Espanol)")
              ) {
                language = "Español";
                materialType = materialType
                  .replaceAll("(Español)", "")
                  .replaceAll("(Espanol)", "");
              } else if (materialType.includes("(English & Spanish)")) {
                language = ["English", "Español"];
                materialType = materialType.replaceAll(
                  "(English & Spanish)",
                  ""
                );
              }

              materialType = materialType.trim();

              for (const series of series_arr) {
                manuals.push({
                  innerId: manualIdGenerator.next().value,
                  materialType,
                  pdfUrl,
                  title: `${materialType} for ${series} (${year})`,
                  language,
                  metadata: {
                    year,
                    series,
                  },
                });
              }
            });
        });
    });

    // const seriesDocs = await Dataset.open(`${currentName}/seriesDocuments`);
    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    await manualsDataset.pushData(manuals);
  });
}
