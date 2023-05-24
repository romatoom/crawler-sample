import { Dataset } from "crawlee";
import { labels } from "../constants.js";
import { materialTypeByManualTitle } from "../utils/formatters.js";

export default function addHandlerUserGuid(router) {
  router.addHandler(labels.USER_GUID, async ({ request, $, log }) => {
    log.debug(`Extracting data: ${request.url}`);

    const results = [];

    $(".mi-tabs-pane__item a").each((_, el) => {
      let title = $(el).text().trim();

      // Fix bad manual title for Xiaomi Pad 5
      if (title === "GUID-507C72B3-D51B-4AC6-B42C-DAE33C68C5E5") {
        title = "Xiaomi Pad 5";
      }

      const pdfUrl = $(el).attr("href");

      const materialType = materialTypeByManualTitle(title);

      if (title !== "" && pdfUrl.startsWith("https://")) {
        results.push({
          materialType,
          pdfUrl,
          title,
          language: request.userData.data.language
        });
      }
    });

    const manuals = await Dataset.open("manuals");
    await manuals.pushData(results);
  });
}
