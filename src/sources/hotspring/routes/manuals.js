import { Manual } from "#utils/classes/manual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { category, baseURL } = source;

  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = [];

    $(".all-hotspring-owners-manuals").each((_, manualBlock) => {
      const series = $(manualBlock).find("h2").text().trim();

      $(manualBlock)
        .find("a.btn")
        .each((_, link) => {
          const linkText = $(link).text().trim();

          let language = "English";

          if (linkText === "U.S. Owner's Manual") {
            language = ["English", "Español", "Français"];
          }

          if (linkText === "Canada Owner's Manual") {
            language = ["English", "Français"];
          }

          language = linkText.includes("French") ? "Français" : language;
          language = linkText.includes("Spanish") ? "Español" : language;

          const title = $(link).attr("title") || linkText;

          let pdfUrl = $(link).attr("href");
          pdfUrl = pdfUrl.startsWith("/") ? `${baseURL}${pdfUrl}` : pdfUrl;

          manuals.push({
            title,
            language,
            pdfUrl,
            series,
          });
        });

      $(manualBlock)
        .find("ul > li > a")
        .each((_, link) => {
          const title = $(link).attr("title") || $(link).text().trim();

          let language = "English";

          language = title.includes("French") ? "Français" : language;
          language = title.includes("Spanish") ? "Español" : language;

          manuals.push({
            title,
            language,
            pdfUrl: `${baseURL}${$(link).attr("href")}`,
            series,
          });
        });
    });

    for (const manualItem of manuals) {
      const manual = new Manual({
        materialType: "Owner's Manual",
        pdfUrl: manualItem.pdfUrl,
        title: manualItem.title,
        language: manualItem.language,
        metadata: {
          series: manualItem.series,
        },
      });

      await state.storage.pushData(manual);
    }
  };
}
