import { Manual } from "#utils/classes/manual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { baseURL } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const manuals = [];

    $("ul.f-dropdown.js-tabs-list.row.collapse a.stat-dropdown.tab-item").each(
      (_, link) => {
        const id = $(link).attr("href").replace("#", "");
        const model = $(link).text().trim();

        $(`#${id} a.q-block`).each((_, manualBlock) => {
          manuals.push({
            pdfUrl: `${baseURL}${$(manualBlock).attr("href")}`,
            date: $(manualBlock).find(".q-title-container").text().trim(),
            model,
          });
        });
      }
    );

    for (const manualItem of manuals) {
      const manual = new Manual({
        materialType: "Infotainment Manual",
        pdfUrl: manualItem.pdfUrl,
        title: `${manualItem.model} Infotainment Manual ${manualItem.date}`,
        language: "English",
        metadata: {
          model: manualItem.model.toUpperCase(),
          date: manualItem.date,
        },
      });

      await state.storage.pushData(manual);
    }
  };
}
