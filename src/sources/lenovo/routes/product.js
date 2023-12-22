import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";
import { LenovoAPI } from "../api.js";

export default function routeHandler(source) {
  const { brand, langs } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const { series, name, category } = request.userData.data;

    let guid;

    $("script").each((_, scriptElement) => {
      const scriptText = $(scriptElement).text();

      guid = getGuid(scriptText);

      if (guid) return false;
    });

    if (!guid) return;

    const data = await LenovoAPI.getManualsByGuid(guid);

    const categories = data.categories;

    const categoriesHash = {};
    for (const c of categories) {
      categoriesHash[c.id] = c.name;
    }

    const manualsList = data.list
      .filter(
        (listItem) =>
          listItem.url &&
          listItem.url.trim().startsWith("http") &&
          listItem.url.endsWith(".pdf")
      )
      .map((listItem) => {
        listItem.categories =
          listItem.categories.map((c) => categoriesHash[c]).join(", ") ||
          "Manual";
        return listItem;
      });

    if (!manualsList || manualsList.length === 0) return;

    let image = $("img.prod-img").attr("src");
    image =
      image && image.startsWith("http") ? image.replaceAll(" ", "%20") : null;

    const product = new Product({
      brand,
      category,
      name,
      images: image ? [image] : [],
      metadata: {
        series,
      },
    });

    await state.storage.pushData(product);

    for (const manualItem of manualsList) {
      let manual;
      try {
        manual = new Manual({
          materialType: manualItem.categories,
          pdfUrl: manualItem.url.trim().replaceAll(" ", "%20"),
          title: manualItem.title,
          language: langs[manualItem.sourceLanguage] || [],
          metadata: {
            dateModified: manualItem.updated,
          },
        });
      } catch (err) {
        console.error(err.message);
        continue;
      }

      const productManual = new ProductManual({
        productId: product.data.innerId,
        manualId: manual.data.innerId,
      });

      await state.storage.pushData(manual);
      await state.storage.pushData(productManual);
    }

    await state.serializer.dump(
      { successedURLs: [request.url] },
      { append: true }
    );
  };
}

function getGuid(scriptText) {
  const regexp = /"Guid":"([0-9A-F-]+)",.+/;
  const matches = regexp.exec(scriptText);

  return matches ? matches[1] : undefined;
}
