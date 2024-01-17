import { Manual } from "#utils/classes/manual.js";
import { Product } from "#utils/classes/product.js";
import { ProductManual } from "#utils/classes/productManual.js";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    if ($("h1.product_title.entry-title").length === 1) {
      await parseProductPage(source, $, request);
      return;
    }

    const targets = [];

    $("ul.products > li.product > a:nth-child(1)").each((_, link) => {
      targets.push({
        url: $(link).attr("href"),
        label: "SHOP",
        userData: {
          data: {
            image: $(link).find("img").attr("src"),
          },
        },
      });
    });

    await crawler.addRequests(targets);
  };
}

async function parseProductPage(source, $, request) {
  const { brand, types } = source;

  const documents = [];

  $("#tab-description a").each((_, link) => {
    const url = $(link).attr("href").replaceAll(" ", "%20");
    if (!url.endsWith(".pdf")) return true;

    documents.push({
      url,
      title: $(link).text().trim(),
    });
  });

  if (documents.length === 0) return;

  const name = $("h1.product_title.entry-title").text().trim();

  const { image } = request.userData.data;

  const category = $("nav.woocommerce-breadcrumb > a:nth-child(3)")
    .text()
    .trim();

  const specs = [];
  $(
    "table.woocommerce-product-attributes.shop_attributes tr.woocommerce-product-attributes-item"
  ).each((_, row) => {
    specs.push({
      label: $(row)
        .find("th.woocommerce-product-attributes-item__label")
        .text()
        .trim(),

      values: $(row)
        .find("td.woocommerce-product-attributes-item__value")
        .text()
        .trim(),
    });
  });

  const product = new Product({
    brand,
    category,
    name,
    url: request.url,
    specs,
    images: image ? [image] : [],
  });

  await state.storage.pushData(product);

  for (const document of documents) {
    let materialType = "Manual";

    for (const typeKey in types) {
      if (document.title.toUpperCase().includes(typeKey)) {
        materialType = types[typeKey];
        break;
      }
    }

    const manual = new Manual({
      materialType,
      pdfUrl: document.url,
      title: document.title,
      language: "English",
    });

    const productManual = new ProductManual({
      productId: product.data.innerId,
      manualId: manual.data.innerId,
    });

    await state.storage.pushData(manual);
    await state.storage.pushData(productManual);
  }

  await state.serializer.dump(
    { processedURLs: [request.url] },
    { append: true }
  );
}
