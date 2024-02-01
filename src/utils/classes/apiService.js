import axios from "axios";

export class ApiService {
  static defaultParams = {
    headers: {
      Accept: "*/*",
    },
  };

  static async get(url, config = {}) {
    const response = await axios.get(url, config);
    return response.data;
  }

  static async post(url, data, params = {}) {
    const response = await axios.post(url, data, {
      ...this.defaultParams,
      ...params,
    });

    return response.data;
  }
}
