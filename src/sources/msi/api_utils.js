import axios from "axios";
import varSave from "#utils/var_saver.js";
import { SOURCES } from "#utils/globals.js";

const PAGE_SIZE = 10000;

export async function getCategories() {
  const MENU_URL = "https://www.msi.com/api/get/menu";

  const response = await axios.get(MENU_URL);
  const categoriesList = response?.data?.data?.menulist["1"]?.productline;

  const categories = [];

  for (const item of Object.values(categoriesList)) {
    categories.push(...item);
  }

  varSave(categories, "categories", SOURCES.MSI);
  // После этого подчищаем и добавляем в поле CATEGORIES в src/sources/msi/constants.js

  return categories;
}


export async function getProductsTargets(category) {
  const PRODUCTS_URL = `https://www.msi.com/api/v1/product/getProductList?product_line=${category.productLine}&page_size=${PAGE_SIZE}`;
  const response = await axios.get(PRODUCTS_URL);

  const { LABELS, BASE_URL } = SOURCES.MSI;

  const productsData = response.data?.result?.getProductList;

  const productsTargets = productsData.map((product) => ({
    url: `${BASE_URL}/${product.product_line}/${product.link}`,
    label: LABELS.PRODUCT,
    userData: {
      data: {
        category: category.title,
        name: product.title,
        linkName: product.link
      },
    },
  }));

  return productsTargets;
}
