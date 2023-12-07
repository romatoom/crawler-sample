import axios from "axios";

export class ApiService {
  static defaultParams = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "text/html, */*; q=0.01",
    },
  };

  static async get(url) {
    const response = await axios.get(url);
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
