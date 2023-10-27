import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerManuals(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(
    LABELS.MANUALS,
    async ({ request, log, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      const $ = await parseWithCheerio();

      const manuals = [];

      $(".v3-product-doc-list ul > li").each((_, manualBlock) => {
        const url = $(manualBlock).find(".v3-doc-tit a").attr("href").trim();
        if (!url.includes(".pdf")) return true;

        manuals.push({
          title: $(manualBlock).find(".v3-doc-tit a").attr("title").trim(),
          url: $(manualBlock).find(".v3-doc-tit a").attr("href").trim(),
        });
      });

      if (manuals.length === 0) return;

      const { category, series, image, productName, language } =
        request.userData.data;

      const manualsDataset = await Dataset.open(`${currentName}/manuals`);
      const productsDataset = await Dataset.open(`${currentName}/products`);
      const productsManualsDataset = await Dataset.open(
        `${currentName}/products_manuals`
      );

      const currentProductId = productIdGenerator.next().value;

      await productsDataset.pushData({
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: productName,
        url: request.url,
        specs: [],
        images: image ? [image] : [],
        metadata: {
          series,
        },
      });

      for (const manual of manuals) {
        const currentManualId = manualIdGenerator.next().value;

        await manualsDataset.pushData({
          innerId: currentManualId,
          materialType: "Manual",
          pdfUrl: manual.url,
          title: manual.title,
          language,
          metadata: {},
        });

        await productsManualsDataset.pushData({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }
  );
}
