import { settings } from "#utils/globals.js";
import { getLangsForProduct, getLangManualsForProduct } from "../api_utils.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerSeries(router) {
  const { LABELS, BASE_URL, BRAND, currentName } = settings.source;

  router.addHandler(
    LABELS.SERIES,
    async ({ request, log, parseWithCheerio, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const $ = await parseWithCheerio();

      const narrowSelectionPage =
        $("h4").filter(function () {
          return $(this).text().trim() === "Narrow your selection";
        }).length === 1;

      if (narrowSelectionPage) {
        const targets = [];

        $("ul.product-finder-list li a").each((_, el) => {
          targets.push({
            url: `${BASE_URL}${$(el).attr("href")}`,
            label: LABELS.SERIES,
            userData: {
              data: {
                ...request.userData.data,
              },
            },
          });
        });

        await crawler.addRequests(targets);
        return;
      }

      const { category, series } = request.userData.data;

      const manualsDataset = await Dataset.open(`${currentName}/manuals`);
      const productsDataset = await Dataset.open(`${currentName}/products`);
      const productsManualsDataset = await Dataset.open(
        `${currentName}/products_manuals`
      );

      const models = [];

      $("ul.product-finder-list li a").each((_, el) => {
        models.push({
          url: `${BASE_URL}${$(el).attr("href")}`,
          name: $(el).attr("title"),
          image: $(el).find("img").attr("src"),
        });
      });

      const modelsCount = models.length;

      for (const [index, model] of models.entries()) {
        const productID = model.url.split("/").pop();

        let langs;
        try {
          langs = await getLangsForProduct(productID);
        } catch (err) {
          continue;
        }

        console.log(`Model url: ${model.url}`);
        console.log(
          `Parse series: ${series}. ProductID ${productID} (${
            index + 1
          } of ${modelsCount}). Languages count: ${langs.length}`
        );

        const manuals = [];

        let manualsForLang;
        for (const lang of langs) {
          try {
            manualsForLang = await getLangManualsForProduct(
              productID,
              lang.languageCode
            );
          } catch (err) {
            continue;
          }

          const language = lang.languageName;

          manuals.push(
            ...manualsForLang.map((m) => {
              return { ...m, language };
            })
          );
        }

        if (manuals.length === 0) continue;

        const currentProductId = productIdGenerator.next().value;

        await productsDataset.pushData({
          innerId: currentProductId,
          brand: BRAND,
          category,
          name: model.name,
          url: null,
          specs: [],
          images:
            model.image && model.image !== "/wcc-assets/images/tms-fallback.png"
              ? [model.image]
              : [],
          metadata: {
            series,
          },
        });

        for (const manual of manuals) {
          const currentManualId = manualIdGenerator.next().value;

          await manualsDataset.pushData({
            innerId: currentManualId,
            materialType: manual.type || "Manual",
            pdfUrl: manual.url,
            title: manual.title,
            language: manual.language,
            metadata: manual.size?.length > 0 ? { size: manual.size } : {},
          });

          await productsManualsDataset.pushData({
            productId: currentProductId,
            manualId: currentManualId,
          });
        }
      }
    }
  );
}
