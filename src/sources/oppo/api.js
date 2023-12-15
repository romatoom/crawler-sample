import { ApiService } from "#utils/classes/apiService.js";
import state from "#utils/classes/state.js";

import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";

export class OppoAPI extends ApiService {
  static async getModels() {
    let responseData;

    try {
      responseData = await state.serializer.load("list-full");
    } catch (err) {
      const url =
        "https://par-sow-cms.oppo.com/oppo-server/userManualManage/list";

      const data = {
        langId: "1033",
        region: "en",
      };

      const params = {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        },
      };

      responseData = await this.post(url, data, params);

      await state.serializer.dump({ "list-full": responseData });
    }

    const models = [];

    for (const item of responseData) {
      models.push(
        ...item.manuals.map((i) => ({
          series: i.productSeries,
          model: i.productModel,
        }))
      );
    }

    return uniqWith(models, isEqual);
  }
}
