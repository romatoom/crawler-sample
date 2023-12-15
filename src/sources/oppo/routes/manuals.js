import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";
import { Helper } from "#utils/classes/helper.js";

export default function routeHandler(source) {
  const { baseURL, brand, categoriesHash } = source;

  return async ({ request, log, parseWithCheerio, page }) => {
    log.debug(`request.url: ${request.url}`);

    const { language, series, model } = request.userData.data;

    const category = categoriesHash[series] || "Other";

    await page.waitForSelector(".product-info--list", { timeout: 5_000 });

    const $ = await parseWithCheerio();

    let image = $(".van-image__img").attr("src");
    if (image) {
      image = `${baseURL}${image.replaceAll(" ", "%20")}`;
    }

    const manuals = [];

    $(".product-info--item").each((_, manualBlock) => {
      manuals.push({
        title: $(manualBlock)
          .find(".product-info--label span.title")
          .text()
          .trim(),

        url: $(manualBlock)
          .find(".product-info--downloadBtn a")
          .attr("href")
          .replaceAll(" ", "%20"),

        size: $(manualBlock)
          .find(".product-info--downloadBtn a")
          .find("span.download-size")
          .text()
          .trim(),
      });
    });

    if (manuals.length === 0) return;

    const product = new Product({
      brand,
      category,
      name: model,
      images: image ? [image] : [],
      metadata: {
        series,
      },
    });

    await state.storage.pushData(product);

    for (const manualItem of manuals) {
      const materialType = Helper.arrayItemsInString(
        manualItem.url,
        ["User-Guide", "Quick_Guide"],
        "Manual"
      )
        .replaceAll("_", " ")
        .replaceAll("-", " ");

      const manual = new Manual({
        materialType,
        pdfUrl: manualItem.url,
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

      await state.storage.pushData(manual);
      await state.storage.pushData(productManual);
    }
  };
}
