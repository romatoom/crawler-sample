import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { brand } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const pdfUrl = $(".manualsLink > a").first().attr("href");
    if (!pdfUrl?.includes(".pdf")) return;

    const { category } = request.userData.data;

    const image = $(".woocommerce-product-gallery__image > a").attr("href");

    const name = $("h1.product_title.entry-title").text().trim();

    const description = $(
      ".wpb-content-wrapper > div:nth-child(1) .wpb_wrapper .wpb_wrapper p"
    )
      .text()
      .trim();

    const specs = [];
    $("#be_compare_features_table tr.matching").each((_, row) => {
      specs.push({
        label: $(row).find("th").text().trim(),
        values: $(row).find("td").text().trim(),
      });
    });

    const product = new Product({
      brand,
      category,
      name,
      description,
      url: request.url,
      specs,
      images: image ? [image] : [],
    });

    const manual = new Manual({
      materialType: "Manual",
      pdfUrl,
      title: `Manual for ${name}`,
      language: "English",
    });

    const productManual = new ProductManual({
      productId: product.data.innerId,
      manualId: manual.data.innerId,
    });

    const promises = [
      state.storage.pushData(product),
      state.storage.pushData(manual),
      state.storage.pushData(productManual),
    ];

    await Promise.all(promises);
  };
}
