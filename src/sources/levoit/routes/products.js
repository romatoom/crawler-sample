import { settings } from "#utils/globals.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { getProduct } from "../api_utils.js";
import varRead from "#utils/var_reader.js";

import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerProducts(router) {
  const { LABELS, BASE_URL, currentName, BRAND } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, log }) => {
    log.debug(`request.url: ${request.url}`);

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const manuals = await varRead("manuals", settings.source);

    let page = 1;
    const productInfo = [];

    while (true) {
      const response = await axios.get(
        `${request.url}?page=${page}&section_id=main-collection-product-grid`
      );

      const $ = cheerio.load(response.data);

      $(
        "card-product > div.relative.h-full > div.flex.h-full.flex-col.text-sm"
      ).each((_, productBlock) => {
        const title = $(productBlock).find("div h3 a").text().trim();

        if (!manuals[title] || manuals[title].length === 0) return true;

        const modelsText = $(productBlock)
          .find(".card-title > small")
          .text()
          .trim()
          .replace("Model: ", "");

        const models = modelsText.split(",").map((m) => m.trim());

        productInfo.push({
          productSlug: `${BASE_URL}${$(productBlock)
            .find("div h3 a")
            .attr("href")}`
            .split("/")
            .pop(),

          models,

          manuals: manuals[title],
        });
      });

      if (
        $("button").filter(function () {
          return $(this).text().trim() === "Load more";
        }).length === 0
      )
        break;

      page++;
    }

    for (const pInfo of productInfo) {
      const product = await getProduct(pInfo.productSlug);

      const currentProductId = productIdGenerator.next().value;

      await productsDataset.pushData({
        innerId: currentProductId,
        brand: BRAND,
        category: product.type,
        name: product.title,
        url: `${BASE_URL}${product.url}`,
        specs: [],
        images: product.images.map((image) => `https:${image}`),
        metadata: {
          models: pInfo.models,
        },
      });

      for (const manual of pInfo.manuals) {
        const currentManualId = manualIdGenerator.next().value;

        await manualsDataset.pushData({
          innerId: currentManualId,
          materialType: "Manual",
          pdfUrl: manual,
          title: `Manual for ${product.title}`,
          language: [],
          metadata: {},
        });

        await productsManualsDataset.pushData({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }
  });
}
