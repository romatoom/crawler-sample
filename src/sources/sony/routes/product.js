import axios from "axios";
import { Dataset } from "crawlee";
import { LABELS, BASE_URL, SOURCE_NAME } from "../constants.js";
import { langs } from "../temp_data.js";

import {
  getCurrentManualId,
  incrementCurrentManualId,
  getCurrentProductId,
  incrementCurrentProductId,
} from "#utils/globals.js";

export default function addHandlerProduct(router) {
  router.addHandler(LABELS.PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    let manualsExist = false;
    $("i[aria-label]").each((_, el) => {
      const ariaLabel = $(el).attr("aria-label");
      manualsExist = ariaLabel === "Manuals";
      if (manualsExist) return false;
    });
    if (!manualsExist) return;

    const regexp = /^https:\/\/pro.sony\/(.{5})\/.+/;
    const langCountryCode = request.url.match(regexp)[1];

    const { productName, productDescr, category, discontinued, images } =
      request.userData.data;

    const model = request.url.split("/").slice(-1)[0];

    const specs = [];

    const specsBlocks = $(".productspecificationsblock-wrapper .Collapsible");

    for (const specsBlockItem of specsBlocks) {
      const specsBlockElem = $(specsBlockItem);
      const group = specsBlockElem.find(".Collapsible__trigger").text();
      const specsList = specsBlockElem.find(".panel-content");

      for (const specItem of specsList) {
        const specElem = $(specItem);
        const label = specElem.find(".panel-content-left").text();
        const value = specElem
          .find(".panel-content-right")
          .text()
          .replaceAll(" ", " ");

        specs.push({
          group,
          label,
          value,
        });
      }
    }

    const productImages = [];
    const productImageList = $(".product-media-carousel .slick-list div.image");
    for (const productImageItem of productImageList) {
      const imageUrl = $(productImageItem)
        .attr("style")
        .match(/url\('(.*?)'/)[1];
      productImages.push(`https:${imageUrl}`);
    }

    const currentProductId = getCurrentProductId();
    incrementCurrentProductId();

    const productsResults = [
      {
        innerId: currentProductId,
        brand: "Sony",
        category,
        name: productName,
        url: request.url,
        specs,
        images: productImages || images,
        metadata: {
          description: productDescr,
          discontinued,
        },
      },
    ];

    const manualsResults = [];
    const productsManualsResults = [];

    for (const lang of langs()) {
      let response;
      try {
        response = await axios.get(
          `${BASE_URL}/${langCountryCode}/api/support/resources?type=document&model=${model}&language=${lang.langCode}`
        );
      } catch (e) {
        continue;
      }

      if (!response.data?.searchResponse?.results) continue;

      for (const result of response.data.searchResponse.results) {
        const currentManualId = getCurrentManualId();
        incrementCurrentManualId();

        let pdfUrl = result.url.startsWith("https:")
          ? result.url
          : `https:${result.url}`;

        if (pdfUrl.endsWith("index.html")) {
          const splittedUrl = pdfUrl.split("/");
          splittedUrl.pop();
          splittedUrl.push("print.pdf");
          pdfUrl = splittedUrl.join("/");
        }

        const man = {
          innerId: currentManualId,
          materialType: "Manual",
          pdfUrl,
          title: result.title,
          language: lang.langName,
        };

        manualsResults.push(man);

        productsManualsResults.push({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }

    if (
      [manualsResults, productsResults, productsManualsResults].some(
        (el) => el.length === 0
      )
    )
      return;

    const manuals = await Dataset.open(`${SOURCE_NAME}/manuals`);
    await manuals.pushData(manualsResults);

    const products = await Dataset.open(`${SOURCE_NAME}/products`);
    await products.pushData(productsResults);

    const productsManuals = await Dataset.open(
      `${SOURCE_NAME}/products_manuals`
    );
    await productsManuals.pushData(productsManualsResults);
  });
}
