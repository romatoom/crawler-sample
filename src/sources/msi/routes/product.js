import axios from "axios";
import { settings } from "#utils/globals.js";
import * as cheerio from "cheerio";

import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

import { getExistingProductsURLs } from "#utils/checks.js";

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

async function getImages(productGalleryUrl) {
  const response = await axios.get(productGalleryUrl);
  const $ = cheerio.load(response.data);
  const images = $(".gallery img");

  const imagesURLs = [];
  for (const image of images) {
    const imageElem = $(image);
    imagesURLs.push($(imageElem).attr("src"));
  }

  return imagesURLs;
}

async function getSpecs(specsURL) {
  const specs = {};

  try {
    const response = await axios.get(specsURL);
    const $ = cheerio.load(response.data);
    const table = $("table.table-configurations");

    const productNames = [];
    let productNamesElem = table.find("thead td span");

    if (productNamesElem.length === 0) {
      productNamesElem = $(".text-center h3");
    } else {
      productNamesElem =
        productNamesElem.length > 2
          ? productNamesElem.slice(1)
          : productNamesElem;
    }

    for (const pname of productNamesElem) {
      const productName = $(pname).text().trim();
      specs[productName] = [];
      productNames.push(productName);
    }

    const specBlock = $("#spec-basic");

    if (specBlock.length === 1 && productNames.length === 1) {
      let specArray = [];
      const labels = specBlock.find(".itembox li");
      for (const labelItem of labels) {
        const labelElem = $(labelItem);
        specArray.push({ label: labelElem.text().trim() });
      }

      const values = specBlock.find(".pdtb .tr .td");
      let index = 0;
      for (const valueItem of values) {
        const valueElem = $(valueItem)
          .first()
          .contents()
          .filter(function () {
            return this.type === "text";
          });

        specArray[index].values = valueElem
          .text()
          .trim()
          .replace(/(  +|\n)/g, "; ");

        index++;
      }

      specArray = specArray.filter(el => el.values.length > 0)

      specs[productNames[0]] = [...specArray];
    }

    const rowElems = table.find("tbody tr");
    for (const row of rowElems) {
      const rowElem = $(row);
      const label = rowElem.find("th").text().trim();
      const values = [];

      let index = 0;
      for (const val of rowElem.find("td")) {
        const values = $(val)
          .text()
          .trim()
          .replace(/(  +|\n)/g, "; ");

        if (values.length > 0) {
          specs[productNames[index]].push({ label, values });
        }

        index++;
      }
    }
  } catch (e) {
    //
  }

  return specs;
}

export default function addHandlerProduct(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCT, async ({ request, response, $, log }) => {
    if (response.statusCode === 404) return;

    log.debug(`request.url: ${request.url}`);

    if (
      settings.onlyNewProducts &&
      getExistingProductsURLs().includes(request.url)
    )
      return;

    const { category, name, linkName } = request.userData.data;
    const subProducts = await getSubProducts(name, linkName);

    const specs = await getSpecs(`${request.url}/Specification`);

    for (const product of subProducts) {
      const productsResults = [];
      const manualsResults = [];
      const productsManualsResults = [];

      const { name, linkName } = product;

      const manualsItems = await getManuals(linkName, "manual");
      const quickguidesItems = await getManuals(linkName, "quickguide");

      const downloads = [...manualsItems, ...quickguidesItems];

      if (!downloads || downloads.length === 0) continue;

      const images = await getImages(`${request.url}/Gallery`);

      const currentProductId = productIdGenerator.next().value;

      productsResults.push({
        innerId: currentProductId,
        brand: BRAND,
        category,
        name,
        url: request.url,
        specs: specs[name] || [],
        images,
        metadata: {},
      });

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

      if (manualsResults.length === 0) continue;

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
