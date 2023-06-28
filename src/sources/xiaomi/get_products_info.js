import axios from "axios";

const PAGE_SIZE = 100;

async function getCategories() {
  const API_URL = `https://sgp-api.buy.mi.com/global/search/v1/api/index//0/0/0/0/0/0?version=v4&from=pc&pagesize=24`;
  const response = await axios.get(API_URL);
  const categories = response?.data?.data?.allCategories;

  const categoriesHash = {};

  for (const category of categories) {
    categoriesHash[category.cat_name] = category.cat_id;
  }

  return categoriesHash;
}

export default async function productsInfo() {
  const categories = await getCategories();

  let products = [];

  for (const [categoryName, categoryId] of Object.entries(categories)) {
    let currentPage = 0;
    let totalPages = 1;

    while (currentPage < totalPages) {
      const API_URL = `https://sgp-api.buy.mi.com/global/search/v1/api/index//0/0/0/${currentPage}/${categoryId}/0?version=v4&from=pc&pagesize=${PAGE_SIZE}`;
      const response = await axios.get(API_URL);

      totalPages = response?.data?.data?.dataProvider?.total_pages;
      let productsData = response?.data?.data?.dataProvider?.data;

      if (!totalPages || !productsData) break;

      productsData = productsData.map((p) => ({
        name: p.product.name,
        images: [p.product.image],
        url: p.product.item_link,
        category: categoryName,
      }));

      products = [...products, ...productsData];
      currentPage++;
    }
  }

  return products;
}
