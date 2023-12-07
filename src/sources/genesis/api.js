import { ApiService } from "#utils/classes/apiService.js";

export class GenesisAPI extends ApiService {
  static async getManuals(mainUrl) {
    const url = `${mainUrl}/bin/common/resourceResult`;

    const data = {
      resultType: "manualandwarranties",
      tags: "my-genesis:",
    };

    return this.post(url, data);
  }
}
