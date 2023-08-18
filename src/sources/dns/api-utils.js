import axios from "axios";
import * as cheerio from "cheerio";
import { COOKIES_STR } from "#utils/cookie_parser.js";

export async function getCategories() {
  const MENU_URL = "https://restapi.dns-shop.ru/v1/get-menu?maxMenuLevel=6";

  const categories = [];

  function addCategory(node, title) {
    if (!node.childs || node.childs.length === 0) {
      categories.push({
        title,
        url: `https://www.dns-shop.ru${node.url}`,
        count: node.count,
        searchUid: node.searchUid,
      });
      return;
    }

    for (const nodeItem of node.childs) {
      addCategory(nodeItem, title);
    }
  }

  const response = await axios.get(MENU_URL, {
    headers: {
      Cityid: "55506b4d-0565-11df-9cf0-00151716f9f5",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      Siteid: "8c2e120b-8732-48a7-8178-0e04d47962d8",
      Host: "restapi.dns-shop.ru",
      Origin: "https://www.dns-shop.ru",
      Referer: "https://www.dns-shop.ru/",
    },
  });

  const categoriesTree = response?.data?.data;

  for (const node of categoriesTree) {
    if (["Уцененные товары", "Распродажа"].includes(node.title)) continue;
    addCategory(node, node.title);
  }

  return categories;
}

//////

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "navigate",
  Host: "www.dns-shop.ru",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  Cookie: COOKIES_STR,
};

async function getCsrfToken(categoryURL) {
  const response = await axios.get(categoryURL, { headers: HEADERS });

  const $ = cheerio.load(response.data);

  return $('meta[name="csrf-token"]').attr("content");
}

export async function getProductsURLs(category, page) {
  const csrfToken = await getCsrfToken(category.url);

  const PRODUCTS_API_URL = `${category.url}?p=${page}`;

  const headers = { ...HEADERS };
  headers["X-Csrf-Token"] = csrfToken;
  headers["X-Requested-With"] = "XMLHttpRequest";

  const response = await axios.get(PRODUCTS_API_URL, { headers });

  const markup = response.data.html;
  const $ = cheerio.load(markup);

  const productsURLs = [];
  const products = $(".catalog-product");
  for (const productItem of products) {
    const productElem = $(productItem);
    let url = productElem.find("a.catalog-product__name").attr("href");
    url = `https://www.dns-shop.ru${url}`;

    productsURLs.push({
      category: category.title,
      url,
      categoryUid: category.searchUid,
    });
  }

  return productsURLs;
}
