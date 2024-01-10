import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";

const langs = {
  German: "Deutsch",
  Deutsch: "Deutsch",
  Spanish: "Español",
  Español: "Español",
  French: "Français",
  Français: "Français",
  Dutch: "Nederlands",
  English: "English",
  Chinese: "中文",
};

export default function routeHandler(source) {
  const { baseURL, category } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const { image, name, modelId, brand } = request.userData.data;

    let materialType;

    const documents = [];

    $(".service-detail-manuals > div")
      .children()
      .each((_, el) => {
        if ($(el)["0"].name === "h4") {
          materialType = $(el).text().trim();
        }

        if ($(el)["0"].name === "div") {
          const link = $(el).find(
            ".file-download-list-item-content.detail-page-file-link-label > a"
          );

          let url = $(link).attr("href");
          if (!url.endsWith(".pdf")) return true;

          url = `${baseURL}${url}`;
          const title = $(link).attr("title").replace(" - Open Resource", "");

          documents.push({
            url,
            materialType,
            title,
          });
        }
      });

    if (documents.length === 0) return;

    const specs = [];

    $("#spec-table tr").each((_, row) => {
      const values = $(row).find("td").text().trim();
      if (values === "n/a") return true;

      const label = $(row).find("th").text().trim();

      specs.push({ label, values });
    });

    const product = new Product({
      brand,
      category,
      name: `${name} (${modelId})`,
      specs,
      images: image ? [image] : [],
      sku: modelId,
    });

    await state.storage.pushData(product);

    for (const manualItem of documents) {
      const language = [];

      for (const key in langs) {
        if (manualItem.title.includes(key)) {
          language.push(langs[key]);
          break;
        }
      }

      const manual = new Manual({
        materialType: manualItem.materialType,
        pdfUrl: manualItem.url,
        title: manualItem.title,
        language,
      });

      const productManual = new ProductManual({
        productId: product.data.innerId,
        manualId: manual.data.innerId,
      });

      await state.storage.pushData(manual);
      await state.storage.pushData(productManual);
    }
  };
}
