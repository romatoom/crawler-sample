import state from "#utils/classes/state.js";

import { sleep } from "crawlee";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

import { getSelectOptions } from "#utils/playwright_helpers.js";

export default function routeHandler(source) {
  const { brand, types } = source;

  return async ({ request, log, page, parseWithCheerio }) => {
    log.debug(`request.url: ${request.url}`);

    const { products } = request.userData.data;

    const categoryOptions = await page
      .locator("#productCategory > option")
      .all();

    const categories = await getSelectOptions(categoryOptions);

    for (const category of categories) {
      await page.locator("#productCategory").selectOption(category.value);
      await sleep(1000);

      const productLineOptions = await page.locator("#level-1 > option").all();

      const productLines = await getSelectOptions(productLineOptions);

      for (const productLine of productLines) {
        await page.locator("#level-1").selectOption(productLine.value);
        await sleep(1000);

        const productOptions = await page.locator("#level-2 > option").all();

        const products = await getSelectOptions(productOptions);

        for (const productItem of products) {
          await page.locator("#level-2").selectOption(productItem.value);
          await sleep(1000);

          const documents = await page
            .locator(".documents > .document-link > a")
            .all();

          if (documents.length === 0) {
            continue;
          }

          const product = new Product({
            brand,
            category: category.value,
            name: productItem.title
              .replaceAll("™", "")
              .replaceAll("®", "")
              .trim(),
            metadata: {
              productLine: productLine.value,
              productModelNumber: productItem.value,
            },
          });

          await state.storage.pushData(product);

          for (const document of documents) {
            const pdfUrl = (await document.getAttribute("href")).replaceAll(
              " ",
              "%20"
            );

            const title = (await document.textContent()).trim();

            let materalType = "Manual";

            for (const type in types) {
              if (title.includes(type)) {
                materalType = types[type];
                break;
              }
            }

            const manual = new Manual({
              materialType,
              pdfUrl,
              title,
              language: [],
            });

            const productManual = new ProductManual({
              productId: product.data.innerId,
              manualId: manual.data.innerId,
            });

            await state.storage.pushData(manual);
            await state.storage.pushData(productManual);
          }
        }
      }
    }
  };
}
