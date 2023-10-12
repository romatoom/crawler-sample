import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";
import varRead from "#utils/var_reader.js";

export default function addHandlerManuals(router) {
  const { LABELS, BRAND, currentName, BASE_URL, MANUAL_TYPES } =
    settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const documents = [];

    $(".download-sections.manual-section li.download-list-items").each(
      (_, document) => {
        documents.push({
          manualTitle: $(document)
            .find(".download-list-item-title")
            .text()
            .trim(),

          manualDate: $(document)
            .find(".download-list-item-date")
            .text()
            .trim(),

          manualURL: encodeURI(
            $(document).find(".download-formats a").attr("href")
          ),
        });
      }
    );

    if (documents.length === 0) return;

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const { productName, productData } = request.userData.data;

    let { category, series, image } = productData;
    const productURL = `${BASE_URL}/${request.url.split("/").pop()}`;

    let products;

    if (productName === "Inspire 1 Pro/Raw") {
      products = await varRead("products", settings.source);
    }

    const images = [];
    if (!image) {
      const mImage = $(".item-icon img").eq(0).attr("src");

      if (mImage) {
        const format = mImage.split(".").pop();
        images.push(`https:${mImage.split("@")[0]}.${format}`);
      }
    } else {
      images.push(image);
    }

    const productNames =
      productName === "Inspire 1 Pro/Raw"
        ? ["Inspire 1 Pro", "Inspire 1 Raw"]
        : [productName];

    for (const productName of productNames) {
      if (["Inspire 1 Pro", "Inspire 1 Raw"].includes(productName)) {
        category = products[productName].category;
        series = products[productName].series;
        image = products[productName].image;
      }

      const currentProductId = productIdGenerator.next().value;

      const product = {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: productName,
        url: productURL,
        specs: [],
        images,
      };

      product.metadata = series ? { series } : {};
      await productsDataset.pushData(product);

      for (const manual of documents) {
        const currentManualId = manualIdGenerator.next().value;

        let materialType = "Manual";

        for (const manualType of MANUAL_TYPES) {
          if (manual.manualTitle.includes(manualType)) {
            materialType = manualType;
            break;
          }
        }

        await manualsDataset.pushData({
          innerId: currentManualId,
          materialType,
          pdfUrl: manual.manualURL,
          title: manual.manualTitle,
          language: [],
          metadata: {
            date: manual.manualDate,
          },
        });

        await productsManualsDataset.pushData({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }
  });
}
