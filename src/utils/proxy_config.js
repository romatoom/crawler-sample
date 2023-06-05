import { log, ProxyConfiguration } from "crawlee";
import axios from "axios";

const PROXY_LIST_SERVICE_URL =
  "https://advanced.name/freeproxy/6479aa8e03316?type=https";

async function proxyUrlList() {
  /* try {
    const response = await axios.get(PROXY_LIST_SERVICE_URL);
    // console.log(response.data.split("\r\n").map((data) => `https://${data}`));
    return response.data.split("\r\n").map((data) => `https://${data}`);
  } catch (error) {
    log.error(error);
    return [];
  } */
  return ["https://201.229.250.21:8080"];
}

log.info("Get proxy URLs...");
const proxyUrls = await proxyUrlList();

export const proxyConfiguration = new ProxyConfiguration({
  proxyUrls,
});
