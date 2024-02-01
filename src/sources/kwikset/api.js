import { ApiService } from "#utils/classes/apiService.js";
import pick from "lodash/pick.js";

export class KwiksetAPI extends ApiService {
  static async getProductsForCategory(category) {
    const products = [];

    const { products: productsForPage, totalPages } =
      await this.getProductsForCategoryByPage(category, 0);

    function pushProduct(product) {
      products.push(
        ...product.map((p) => ({
          ...pick(p, ["slug", "displayName", "series", "primaryImage"]),
          category: category.name,
        }))
      );
    }

    pushProduct(productsForPage);

    for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
      const { products: productsForPage } =
        await this.getProductsForCategoryByPage(category, pageIndex);

      pushProduct(productsForPage);
    }

    return products;
  }

  static async getProductsForCategoryByPage(category, pageIndex) {
    const url = `https://www.kwikset.com/api/kws/product-listing`;

    const params = {
      category: category.slug,
      browseByType: "Category",
      filterOptions: {
        pageIndex,
      },
      filters: [],
    };

    const response = await this.post(url, params);

    const totalPages = response.data.paging.totalPages;
    const products = response.data.variantGroupings;
    return { totalPages, products };
  }
}
