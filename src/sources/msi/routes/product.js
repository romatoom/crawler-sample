import axios from "axios";
import { settings } from "#utils/globals.js";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

async function getSubProducts(name, linkName) {
  const API_URL = `https://www.msi.com/api/v1/product/support/banner?product=${linkName}`;
  const response = await axios.get(API_URL);
  const subProductsObj = response.data?.result?.sub_product_list;

  if (!subProductsObj)
    return [
      {
        name,
        linkName,
      },
    ];

  const subProducts = [];
  for (const [linkName, name] of Object.entries(subProductsObj)) {
    subProducts.push({
      name,
      linkName,
    });
  }
  return subProducts;
}

async function getManuals(product, type) {
  const API_URL = `https://www.msi.com/api/v1/product/support/panel?product=${product}&type=${type}`;
  const response = await axios.get(API_URL);
  const downloads = response.data?.result?.downloads;
  const typeTitle = downloads.type_title[0];
  if (!typeTitle) return [];
  return downloads[typeTitle]
    .filter((el) => el.download_url.endsWith(".pdf"))
    .map((el) => ({
      url: el.download_url,
      size: el.download_size,
      language: el.language_title,
      typeTitle: el.type_title,
      downloadTitle: el.download_title || el.type_title,
    }));
}

export default function addHandlerProduct(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { category, name, linkName } = request.userData.data;
    const subProducts = await getSubProducts(name, linkName);

    for (const product of subProducts) {
      const { name, linkName } = product;

      const manualsItems = await getManuals(linkName, "manual");
      const quickguidesItems = await getManuals(linkName, "quickguide");

      const downloads = [...manualsItems, ...quickguidesItems];

      if (!downloads) return;

      const currentProductId = productIdGenerator.next().value;

      const productsResults = [
        {
          innerId: currentProductId,
          brand: BRAND,
          category,
          name,
          url: request.url,
          specs: [],
          images: [],
          metadata: {},
        },
      ];

      const manualsResults = [];
      const productsManualsResults = [];

      for (const downloadItem of downloads) {
        const currentManualId = manualIdGenerator.next().value;

        manualsResults.push({
          innerId: currentManualId,
          materialType: downloadItem.typeTitle,
          pdfUrl: downloadItem.url,
          title: `${downloadItem.downloadTitle} - ${name}`,
          language: downloadItem.language,
          metadata: {
            size_in_bite: downloadItem.size,
          },
        });

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }

      const products = await Dataset.open(`${currentName}/products`);
      await products.pushData(productsResults);

      const manuals = await Dataset.open(`${currentName}/manuals`);
      await manuals.pushData(manualsResults);

      const productsManuals = await Dataset.open(
        `${currentName}/products_manuals`
      );
      await productsManuals.pushData(productsManualsResults);
    }
  });
}
