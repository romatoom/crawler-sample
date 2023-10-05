import { settings } from "#utils/globals.js";
import axios from "axios";
import * as cheerio from "cheerio";

export default function addHandlerProducts(router) {
  const { LABELS } = settings.source;

  router.addHandler(LABELS.PRODUCTS, async ({ request, $, log, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const productsData = await getAllProducts(request.url, settings.source);

    const targets = productsData.map((pd) => ({
      url: pd.productURL,
      label: LABELS.PRODUCT,
      userData: {
        data: {
          ...request.userData.data,
          title: pd.title,
          modelNumber: pd.modelNumber,
        },
      },
    }));

    await crawler.addRequests(targets);
  });
}

async function getAllProducts(productsUrl, source) {
  const id = productsUrl.split("/").pop();

  const productsData = [];
  let page = 0;
  while (true) {
    const url = `https://www.kenwoodworld.com/en/api/c/${id}/results?q=&page=${page}&hasLoadMore=false`;
    const response = await axios.get(url);
    const html = response.data;
    if (html.length === 0) break;

    const $ = cheerio.load(html);

    $("section.ken-product-tile .ken-product-tile__top").each((_, product) => {
      let productURL = $(product)
        .find("a.ken-product-tile__imgWrap")
        .attr("href");
      productURL = `${source.BASE_URL}${productURL}`;

      const title = $(product)
        .find(".ken-product-tile__identifier")
        .text()
        .trim();

      const modelNumber = $(product)
        .find(".ken-product-tile__modelNumber")
        .text()
        .trim();

      productsData.push({
        productURL,
        title,
        modelNumber,
      });
    });

    page += 1;
  }

  return productsData;
}
