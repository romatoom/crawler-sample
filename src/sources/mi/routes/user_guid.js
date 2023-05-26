import { Dataset } from "crawlee";
import { LABELS } from "../constants.js";
import { MI_FORMATTERS } from "#utils/formatters.js";

export default function addHandlerUserGuid(router) {
  router.addHandler(LABELS.USER_GUID, async ({ request, $, log }) => {
    log.debug(`Extracting data: ${request.url}`);

    const results = [];

    $(".mi-tabs-pane__item a").each((_, el) => {
      let title = $(el).text().trim();

      // Fix bad manual title for Xiaomi Pad 5
      if (title === "GUID-507C72B3-D51B-4AC6-B42C-DAE33C68C5E5") {
        title = "Xiaomi Pad 5";
      }

      const pdfUrl = $(el).attr("href");

      const materialType = MI_FORMATTERS.materialTypeByManualTitle(title);

      if (title !== "" && pdfUrl.startsWith("https://")) {
        results.push({
          materialType,
          pdfUrl,
          title,
          language: request.userData.data.language,
        });
      }
    });

    const manuals = await Dataset.open("mi/manuals");
    await manuals.pushData(results);
  });
}
