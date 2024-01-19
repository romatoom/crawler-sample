import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { brand, types, langs } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const documents = [];

    $("a.pdf-link").each((_, link) => {
      documents.push({
        url: $(link).attr("href"),
        title: $(link).text().trim(),
      });
    });

    $("ul.support-description__icons > li > a").each((_, link) => {
      const url = $(link).attr("href");
      if (!url.includes(".pdf")) return true;

      documents.push({
        url,
        title: $(link).find("p.SVG-Text-PDP").text().trim(),
      });
    });

    $(".amplience__accordion_faq a").each((_, link) => {
      const url = $(link).attr("href");
      if (!url.includes(".pdf")) return true;

      documents.push({
        url,
        title: $(link).text().trim(),
      });
    });

    if (documents.length === 0) {
      await state.serializer.dump(
        { productURLsWithoutManuals: [request.url] },
        { append: true }
      );
      return;
    }

    const { name, description, image, sku, category } = request.userData.data;

    const specs = [];
    $(".product-main-attributes .attr-wrap").each((_, attr) => {
      const label = $(attr).find(".label").text().trim();
      const values = $(attr).find(".value").text().trim();

      if (label?.length > 0 && values?.length > 0) {
        specs.push({
          label,
          values,
        });
      }
    });

    const product = new Product({
      brand,
      category,
      name,
      description,
      url: request.url,
      images: image ? [image] : [],
      sku,
      specs,
    });

    await state.storage.pushData(product);

    for (const manualItem of documents) {
      let materialType = "Manual";

      for (const typeKey in types) {
        if (manualItem.title.toUpperCase().includes(typeKey)) {
          materialType = types[typeKey];
          break;
        }
      }

      const language = [];
      for (const langKey in langs) {
        if (manualItem.title.toUpperCase().includes(langKey)) {
          language.push(langs[langKey]);
        }
      }

      const manual = new Manual({
        materialType,
        pdfUrl: manualItem.url.replaceAll(" ", "%20"),
        title: manualItem.title,
        language,
      });

      const productManual = new ProductManual({
        productId: product.data.innerId,
        manualId: manual.data.innerId,
      });

      await Promise.all([
        state.storage.pushData(manual),
        state.storage.pushData(productManual),
      ]);
    }

    await state.serializer.dump(
      { productURLsSuccessed: [request.url] },
      { append: true }
    );
  };
}
