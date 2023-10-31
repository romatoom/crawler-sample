import axios from "axios";
import * as cheerio from "cheerio";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

// https://www.lg.com/us/support/data-ajax/select-product-category.json

export async function selectProductCategory() {
  const url =
    "https://www.lg.com/us/support/data-ajax/select-product-category.json";
  const response = await axios.get(url);

  const data = response.data;
  const categories = [];

  for (const category of data) {
    if (!["consumer", "business"].includes(category.type)) {
      for (const listItem of category.list) {
        categories.push({
          categoryName: listItem["product-type"],
          biztype: listItem.biztype,
          categoryId: listItem.categoryId,
        });
      }
    }
  }

  varSave(categories, "categories", settings.source);
  return categories;
}

export async function getAllProducts(categories) {
  const products = [];

  for (const category of categories) {
    const url = `https://www.lg.com/us/mkt/ajax/category/retrieveCategoryProductList?sort=0&viewAll=Y&categoryId=${
      category.categoryId
    }&bizType=${category.biztype.toUpperCase()}`;
    const response = await axios.post(url);
    const productList = response.data.data[0].productList.map((product) => ({
      category: category.categoryName,
      modelId: product.modelId,
      modelName: product.modelName,
      modelUrlPath: product.modelUrlPath,
      categoryId: product.categoryId,
      salesModelCode: product.salesModelCode,
      salesSuffixCode: product.salesSuffixCode,
      userFriendlyName: product.userFriendlyName,
      image: product.modelRollingImgList,
    }));

    products.push(...productList);
  }

  varSave(products, "products", settings.source);
  return products;
}

/*

export async function getLangs() {
  const url = "https://consumer.huawei.com/en/worldwide/";
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const langs = [];

  $("li.country-selection__country > a").each((_, el) => {
    langs.push({
      langCode: $(el).attr("data-selectsitecode"),
      language: $(el).text().trim().split("/")[1].trim(),
    });
  });

  return uniqWith(langs, isEqual);
}
*/
