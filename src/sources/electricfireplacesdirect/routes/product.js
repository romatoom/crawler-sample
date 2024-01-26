import state from "#utils/classes/state.js";
import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";

export default function routeHandler(source) {
  const { category } = source;

  return async ({ request, log, page, parseWithCheerio }) => {
    log.debug(`request.url: ${request.url}`);

    const documents = [];

    let specsWrapper;
    for (const el of await page.locator(".feature-wrapper").all()) {
      if ((await el.textContent()) === "Product Specs") {
        specsWrapper = el;
        break;
      }
    }

    if (!specsWrapper) return;
    await specsWrapper.click();

    const $ = await parseWithCheerio();
    $(".product-specs__manuals a.manual").each((_, link) => {
      const url = $(link).attr("href");
      if (!url.endsWith(".pdf")) return true;

      documents.push({
        url,
        title: $(link).text().trim(),
      });
    });

    if (documents.length === 0) return;

    const sku = $(".product--info .product-co")
      .text()
      .replace(" | ", "")
      .trim();

    const brand = $(".product--info .product-co-a").text().trim();

    const images = [];
    $(".swiper-wrapper .slide-image").each((_, el) => {
      const style = $(el).attr("style");
      const regexp = /^background-image: url\((.+)\);$/;
      const matches = regexp.exec(style);
      if (!matches) return true;
      images.push(
        `https:${matches[1].replaceAll("&quot;", "").replaceAll('"', "")}`
      );
    });

    const specs = [];
    $(".Product-table-row.product-specs__details-item").each((_, row) => {
      const label = $(row)
        .find(".product-specs__details-item-label")
        .text()
        .trim();

      const values = $(row)
        .find(".product-specs__details-item-value")
        .text()
        .trim()
        .replaceAll("</p>", "")
        .replaceAll("<p>", "");

      if (label?.length > 0 && values?.length > 0) {
        specs.push({ group: "General", label, values });
      }
    });

    $(".Product-table-row.product-specs__electric-item").each((_, row) => {
      const label = $(row)
        .find(".product-specs__electric-item-label")
        .text()
        .trim();

      const values = $(row)
        .find(".product-specs__electric-item-value")
        .text()
        .trim()
        .replaceAll("</p>", "")
        .replaceAll("<p>", "");

      if (label?.length > 0 && values?.length > 0) {
        specs.push({ group: "Electrical", label, values });
      }
    });

    const product = new Product({
      url: request.url,
      brand,
      category,
      name: `${request.userData.data.name} (${sku})`,
      images,
      specs,
      sku,
    });

    await state.storage.pushData(product);

    for (const manualItem of documents) {
      const manual = new Manual({
        materialType: manualItem.title,
        pdfUrl: manualItem.url.trim().replaceAll(" ", "%20"),
        title: `${manualItem.title} for ${sku}`,
        language: [],
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
