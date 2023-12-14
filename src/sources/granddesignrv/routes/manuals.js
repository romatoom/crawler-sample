import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { category, brand, baseURL } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const tabs = {};

    $(".cmp-tabs__tablist-container .cmp-tabs__tab").each((_, typeBlock) => {
      const id = $(typeBlock).attr("id");
      tabs[id] = $(typeBlock).text().trim();
    });

    const manuals = [];

    $(".cmp-tabs__tabpanel").each((_, tabBlock) => {
      const id = $(tabBlock).attr("aria-labelledby");
      const type = tabs[id];

      $(tabBlock)
        .find(".aem-Grid.aem-Grid--7.aem-Grid--default--7.aem-Grid--phone--12")
        .each((_, manualsBlock) => {
          let firstManualTitle;

          $(manualsBlock)
            .find("div.cmp-download")
            .each((_, downloadBlock) => {
              const title = $(downloadBlock)
                .find("h3.cmp-download__title")
                .text()
                .trim();

              firstManualTitle ||= title;

              const descr = $(downloadBlock)
                .find(".cmp-download__description")
                .text()
                .trim();

              const size = $(downloadBlock)
                .find(
                  ".cmp-download__property--size .cmp-download__property-content"
                )
                .text()
                .trim();

              const url = `${baseURL}${$(downloadBlock)
                .find("a.cmp-download__action")
                .attr("href")}`;

              const label = $(downloadBlock)
                .find("a.cmp-download__action")
                .attr("aria-label");

              manuals.push({
                type,
                title,
                firstManualTitle,
                descr,
                size,
                url,
                label,
              });
            });
        });
    });

    for (const manualData of manuals) {
      const manual = new Manual({
        materialType: "Owner's Manual",
        pdfUrl: manualData.url,
        title: manualData.title,
        language: "English",
        metadata: {
          label: manualData.label,
          size: manualData.size,
          descr: manualData.descr,
        },
      });

      const product = new Product({
        brand,
        category,
        name: manualData.firstManualTitle
          .replace("Owner's Manual", "")
          .replace("Owners Manual", "")
          .trim(),
        metadata: {
          type: manualData.type,
        },
      });

      const productManual = new ProductManual({
        productId: product.data.innerId,
        manualId: manual.data.innerId,
      });

      await Promise.all([
        state.storage.pushData(manual),
        state.storage.pushData(product),
        state.storage.pushData(productManual),
      ]);
    }
  };
}
