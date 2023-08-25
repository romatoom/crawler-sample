import axios from "axios";
import pick from "lodash/pick.js";
import { getLanguagesByLocales } from "#utils/formatters.js";

import { normalizeTitle } from "#utils/formatters.js";

const PAGE_SIZE = 100;

async function getProductsOnPage(currentPage, pageSize = PAGE_SIZE) {
  const apiURL = `https://www.whirlpool.com/ws/v2/whirlpool-us/products/search/singlesource?fields=OPT&lang=en_US&currentPage=${currentPage}&isBundle=false&disableGrouping=false&sort=&query=%3Arelevance&pageSize=${pageSize}`;

  const response = await axios.get(apiURL);

  return response.data?.products.map((p) => {
    const product = pick(p, [
      "baseProduct",
      "code",
      "description",
      "name",
      "specifications",
      "url",
    ]);

    product.picture = `https://www.whirlpool.com${p.picture}?fit=constrain,1&wid=1000&hei=1000&fmt=jpg`;

    return product;
  });
}

async function getPaginationInfo() {
  const apiURL = `https://www.whirlpool.com/ws/v2/whirlpool-us/products/search/singlesource?fields=OPT&lang=en_US&currentPage=1&isBundle=false&disableGrouping=false&sort=&query=%3Arelevance&pageSize=${PAGE_SIZE}`;

  const response = await axios.get(apiURL);
  const pagination = response?.data?.pagination;

  return {
    totalPages: pagination.totalPages,
    totalResults: pagination.totalResults,
  };
}

export async function getProducts() {
  const { totalPages, totalResults } = await getPaginationInfo();
  const lastIterationPageSize = totalResults - PAGE_SIZE * (totalPages - 1);

  const products = [];

  for (let page = 1; page <= totalPages; page++) {
    const pageSize = page === totalPages ? lastIterationPageSize : PAGE_SIZE;
    const productsOnPage = await getProductsOnPage(page, pageSize);
    products.push(...productsOnPage);
  }

  return products;
}

export async function getManuals(productSku) {
  const apiURL = `https://www.whirlpool.com/services/search/contents.json?notincludeEmptyLang=false&query=%3Aformat%3Aapplication%2Fpdf%2Capplication%2Fzip%3Aproduct_sku%3A${productSku}&pdpdoc=true&pageSize=20&sort=created-desc&currentPage=1&fields=FULL&lang=en_us&cp=%2Fcontent%2Fwhirlpoolv2%2Fen_us`;

  const response = await axios.get(apiURL);

  const documents = response.data?.documents;

  if (!documents) return [];

  return documents
    .map((doc) => ({
      title: `${doc.title} - ${productSku}`,
      url: `https://www.whirlpool.com${doc.asseturl}`,
      languages: doc.language ? getLanguagesByLocales(doc.language) : [],
      size: doc.size,
      description: doc.description,
      type: normalizeTitle(doc.doc_type[0].replaceAll("-", " ")),
    }))
    .filter((doc) => doc.url.endsWith(".pdf"));
}
