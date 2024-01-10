import { ApiService } from "#utils/classes/apiService.js";
import state from "#utils/classes/state.js";

export class SramAPI extends ApiService {
  static async getBrands() {
    let brands;

    try {
      brands = await state.serializer.load("brands");
    } catch (err) {
      const url = "https://www.sram.com/api/service/browse?page=1";

      const response = await this.get(url);

      brands = response.facets.brands;

      await state.serializer.dump({ brands });
    }

    return brands;
  }

  static async getModelsForBrandAndPage(brand, page) {
    const url = `https://www.sram.com/api/service/browse?page=${page}&brand=${brand}`;
    const response = await this.get(url);
    return response?.results?.products;
  }

  static async getModels() {
    let allModels = [];

    try {
      allModels = await state.serializer.load("models");
    } catch (err) {
      const brands = await this.getBrands();

      for (const brand of brands) {
        console.log(`Get models for brand '${brand}'`);

        let page = 1;

        while (true) {
          try {
            const models = await this.getModelsForBrandAndPage(brand, page);

            if (models.length === 0) {
              break;
            }

            allModels.push(
              ...models.map((model) => ({
                ...model,
                brand,
              }))
            );

            page++;
          } catch (err) {
            break;
          }
        }
      }

      await state.serializer.dump({ models: allModels });
    }

    return allModels;
  }
}
