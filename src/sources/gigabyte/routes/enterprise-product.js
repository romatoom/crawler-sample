import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerEnterpriseProduct(router) {
  const { LABELS, currentName, BRAND, MANUALS_TYPES } = settings.source;

  router.addHandler(LABELS.ENTERPRISE_PRODUCT, async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    let manualBlock;
    $(".FileListArea").each((_, el) => {
      if ($(el).find(".Title").text().trim() === "Manual") {
        manualBlock = el;
        return false;
      }
    });

    if (!manualBlock) return;
    const manuals = [];

    $(manualBlock)
      .find(".FileList .ContentLine")
      .each((_, manualItem) => {
        manuals.push({
          title: $(manualItem).find(".ItemTitle").text().trim(),
          url: $(manualItem).find(".DownloadLink").attr("href"),
          lang: $(manualItem).find(".TitleOtherInfo").text().trim(),
        });
      });

    if (manuals.length === 0) return;

    // const productName = `${sku} - ${$(".textSubTitle").text().trim()}`;
    const { category, images, specs, sku } = request.userData.data;

    const manualsResults = [];
    const productsManualsResults = [];

    const currentProductId = productIdGenerator.next().value;

    const productsResults = [
      {
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: sku,
        url: request.url,
        specs,
        images,
        sku,
        metadata: {},
      },
    ];

    for (const manual of manuals) {
      const currentManualId = manualIdGenerator.next().value;

      let materialType = "Manual";
      for (const manualType of MANUALS_TYPES) {
        if (manual.title.includes(manualType)) {
          materialType = manualType;
          break;
        }
      }

      manualsResults.push({
        innerId: currentManualId,
        materialType,
        pdfUrl: manual.url,
        title: manual.title,
        language: manual.lang === "Default" ? [] : manual.lang,
        metadata: {},
      });

      productsManualsResults.push({
        productId: currentProductId,
        manualId: currentManualId,
      });
    }

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    await manualsDataset.pushData(manualsResults);

    const productsDataset = await Dataset.open(`${currentName}/products`);
    await productsDataset.pushData(productsResults);

    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );
    await productsManualsDataset.pushData(productsManualsResults);
  });
}
