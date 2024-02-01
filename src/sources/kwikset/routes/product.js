import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { brand, types, langs } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const documents = [];
    $(".horizontal-card__link").each((_, link) => {
      documents.push({
        url: $(link).attr("href"),

        title: $(link)
          .find(".horizontal-card__content.text--black")
          .text()
          .trim(),

        size: $(link).find(".horizontal-card__sub-content").text().trim(),
      });
    });
    if (documents.length === 0) return;

    const { displayName, series, primaryImage, category } =
      request.userData.data;

    const image =
      primaryImage?.length > 0
        ? `https://images.kwikset.com/is/image/Kwikset/${primaryImage}?\$kwsProductThumb\$`
        : null;

    let labelPostfix = $(".product-header p span").text().trim();
    labelPostfix = labelPostfix?.length > 0 ? ` (${labelPostfix})` : "";

    const specs = [];

    $(".spec-list__item").each((_, specRow) => {
      const label = $(specRow).find(".spec-list__title").text().trim();
      const values = $(specRow).find(".spec-list__value").text().trim();
      if (label?.length > 0 && values?.length > 0) {
        specs.push({ label, values });
      }
    });

    const product = new Product({
      brand,
      category,
      name: `${displayName}${labelPostfix}`,
      url: request.url,
      images: image ? [image] : [],
      specs,
    });

    if (series.length > 0) {
      product.data.metadata = { series };
    }

    await state.storage.pushData(product);

    for (const manualItem of documents) {
      let materialType = "Manual";

      for (const type of types) {
        if (manualItem.title.toUpperCase().includes(type.toUpperCase())) {
          materialType = type;
          break;
        }
      }

      const language = [];
      for (const langKey in langs) {
        if (manualItem.title.toUpperCase().includes(langKey.toUpperCase())) {
          language.push(langs[langKey]);
        }
      }

      const manual = new Manual({
        materialType,
        pdfUrl: manualItem.url.replaceAll(" ", "%20"),
        title: manualItem.title,
        language,
        metadata: {
          size: manualItem.size,
        },
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
  };
}
