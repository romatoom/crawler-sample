import { ApiService } from "#utils/classes/apiService.js";

export class LenovoAPI extends ApiService {
  static async getManualsByGuid(guid) {
    const url = `https://pcsupport.lenovo.com/us/en/api/v4/contents/productmultlanguagelist?pids=${guid}&types=Manual&countries=us&language=en`;

    const responseData = await this.get(url);

    return responseData;
  }
}
