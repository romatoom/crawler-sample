import state from "#utils/classes/state.js";
import { ApiService } from "#utils/classes/apiService.js";

export class HooverAPI extends ApiService {
  static BASE_URL = "https://hoover.com";

  static async getProducts(categories) {
    const productItems = [];

    for (const categoryID in categories) {
      const productsForCategory = await this.getProductsItems(
        categoryID,
        categories[categoryID]
      );
      productItems.push(...productsForCategory);
    }

    // const url = categories[categoryID];

    return productItems.map((item) => ({
      name: item.l,
      url: item.url,
      description: item.d.replaceAll("\n", "").replaceAll(" ", " ").trim(),
      image: item.t,
      sku: item.sku,
      category:
        item.category === "All Products" ? "Vacuums & Cleaners" : item.category,
    }));
  }

  static async getProductsItems(categoryID, urlPrefix) {
    const filename = `productsItems_${categoryID}`;

    let productsItems = [];
    try {
      productsItems = await state.serializer.load(filename);
    } catch (err) {
      const url = (perPage) =>
        `https://api.fastsimon.com/categories_navigation?UUID=c466d11c-b733-4506-b989-579efdc375ac&uuid=c466d11c-b733-4506-b989-579efdc375ac&store_id=48424288407&api_type=json&category_id=${categoryID}&products_per_page=${perPage}&page_num=1&with_product_attributes=true`;

      let response = await this.get(url(1));

      const totalResults = response.total_results;

      response = await this.get(url(totalResults));

      productsItems = response.items.map((item) => ({
        ...item,
        url: `${urlPrefix}${item.u}`,
        category: response.category_name,
      }));

      const obj = {};
      obj[filename] = productsItems;
      await state.serializer.dump(obj);
    }

    return productsItems;
  }
}
