import axios from "axios";
import * as cheerio from "cheerio";
import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

import { normalizeTitle } from "#utils/formatters.js";

///// US //////

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
      image: product.modelRollingImgList.trim(),
    }));

    products.push(...productList);
  }

  varSave(products, "products", settings.source);
  return products;
}

export async function getManualsForProduct(product) {
  const { BASE_URL, BRAND, currentName } = settings.source;

  const url = "https://www.lg.com/us/support/manual-select-category-result";

  const data = {
    customerModelCode: product.modelId,
    category: product.categoryId,
    salesModelCode: product.salesModelCode,
    salesSuffixCode: product.salesSuffixCode,
  };

  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  const response = await axios.post(url, data, params);
  const html = response.data;
  const $ = cheerio.load(html);

  const manuals = [];

  $(".accordion-box").each((_, manualsBlock) => {
    const manualType = $(manualsBlock).find(".accordion-title").text().trim();

    const links = $(manualsBlock).find("ul.file-list > li a");

    for (const link of links) {
      let url = $(link).attr("href");

      if (!(url.includes("downloadFile?fileId=") || url.includes(".pdf")))
        return true;

      if (url.startsWith("/")) {
        url = `${BASE_URL}${url}`;
      }

      const title = $(link).text().trim();

      manuals.push({ url, title, manualType });
    }
  });

  if (manuals.length === 0) return;

  const manualsDataset = await Dataset.open(`${currentName}/manuals`);
  const productsDataset = await Dataset.open(`${currentName}/products`);
  const productsManualsDataset = await Dataset.open(
    `${currentName}/products_manuals`
  );

  const currentProductId = productIdGenerator.next().value;

  await productsDataset.pushData({
    innerId: currentProductId,
    brand: BRAND,
    category: product.category,
    name: `${product.userFriendlyName} (${product.modelName})`,
    url: `${BASE_URL}${product.modelUrlPath}`,
    specs: [],
    images: product.image ? [product.image] : [],
    metadata: {
      modelName: product.modelName,
      salesModelCode: product.salesModelCode,
    },
  });

  for (const manual of manuals) {
    const currentManualId = manualIdGenerator.next().value;

    const materialType = manual.manualType || "Manual";

    await manualsDataset.pushData({
      innerId: currentManualId,
      materialType,
      pdfUrl: manual.url,
      title: manual.title,
      language: [],
      metadata: {},
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  }
}

////////

export async function getSuperCategories(locale) {
  const { LOCALES } = settings.source;
  const { url } = LOCALES[locale];
  const response = await axios.get(url);

  const html = response.data;
  const $ = cheerio.load(html);
  const categories = {};

  $("select#superCategory_1 option").each((_, el) => {
    const value = $(el).attr("value");
    if (value) {
      categories[$(el).text().trim()] = value;
    }
  });

  return categories;
}

export async function getCategoryList(superCategoryId, locale) {
  const { BASE_URL } = settings.source;

  const url = `${BASE_URL}/${locale}/support/commonmodule/retrieveGpCategoryList.lgajax?pageFlag=manuals`;

  const data = {
    superCategoryId,
  };

  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  const response = await axios.post(url, data, params);
  return response.data;
}

export async function getSubcategoryList(superCategoryId, categoryId, locale) {
  const { BASE_URL } = settings.source;

  const url = `${BASE_URL}/${locale}/support/commonmodule/retrieveGpSubCategoryList.lgajax?type=software&pageFlag=manuals`;

  const data = {
    superCategoryId,
    categoryId,
  };

  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  const response = await axios.post(url, data, params);
  return response.data;
}

export async function getModelsList(
  superCategoryId,
  categoryId,
  subCateId,
  locale
) {
  const { BASE_URL } = settings.source;

  const url = `${BASE_URL}/${locale}/support/commonmodule/retrieveGpManualSoftwareModelList.lgajax`;

  const data = {
    superCategoryId,
    categoryId,
  };

  if (subCateId) {
    data.subCateId = subCateId;
  }

  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  const response = await axios.post(url, data, params);
  return response.data;
}

async function getProductInfoByModel(model) {
  const { BASE_URL } = settings.source;

  const url = `${BASE_URL}/${model.locale}/support/commonmodule/modelDetail.lgajax`;

  const data = {
    modelNum: model.model,
  };

  const params = {
    timeout: 2000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  const response = await axios.post(url, data, params);
  const respData = response.data;

  return {
    userFriendlyName: respData.userFriendlyName,
    image: `${BASE_URL}${respData.imageUrl.trim()}`,
    modelName: respData.modelName,
    modelType: respData.modelType,
    csSalesCode: respData.csSalesCode,
    url: `${BASE_URL}${respData.link}`,
  };
}

export async function getManualsForModel(model) {
  const { BASE_URL, BRAND, currentName } = settings.source;

  const product = await getProductInfoByModel(model);

  const url = `${BASE_URL}/${model.locale}/support/manual-select-category-result`;

  const data = {
    modelName: model.model,
  };

  const params = {
    timeout: 2000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  const response = await axios.post(url, data, params);
  const html = response.data;
  const $ = cheerio.load(html);

  const manuals = [];

  $(".accordion-box").each((_, manualsBlock) => {
    const manualType = $(manualsBlock).find(".accordion-title").text().trim();

    const links = $(manualsBlock).find("ul.file-list > li a");

    for (const link of links) {
      let url = $(link).attr("href");

      if (!(url.includes("downloadFile?fileId=") || url.includes(".pdf")))
        return true;

      if (url.startsWith("/")) {
        url = `${BASE_URL}${url}`;
      }

      const title = $(link).text().trim();

      manuals.push({ url, title, manualType });
    }
  });

  if (manuals.length === 0) return;

  const manualsDataset = await Dataset.open(`${currentName}/manuals`);
  const productsDataset = await Dataset.open(`${currentName}/products`);
  const productsManualsDataset = await Dataset.open(
    `${currentName}/products_manuals`
  );

  const currentProductId = productIdGenerator.next().value;

  await productsDataset.pushData({
    innerId: currentProductId,
    brand: BRAND,
    category: product.modelType ? normalizeTitle(product.modelType) : "Other",
    name: product.modelName,
    url: null,
    specs: [],
    images: product.image ? [product.image] : [],
    metadata: {
      csSalesCode: product.csSalesCode,
    },
  });

  for (const manual of manuals) {
    const currentManualId = manualIdGenerator.next().value;

    const materialType = manual.manualType || "Manual";

    await manualsDataset.pushData({
      innerId: currentManualId,
      materialType,
      pdfUrl: manual.url,
      title: manual.title,
      language: [],
      metadata: {
        locale: model.locale,
      },
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  }
}
