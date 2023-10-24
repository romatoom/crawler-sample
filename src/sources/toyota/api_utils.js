import axios from "axios";
import * as cheerio from "cheerio";
import { settings } from "#utils/globals.js";
import { getLanguageByLangCode } from "#utils/formatters.js";

import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export async function getProductsImages() {
  const URL = `${settings.source.BASE_URL}/all-vehicles/`;
  const response = await axios.get(URL);
  const html = response.data;
  const $ = cheerio.load(html);

  const productsImages = {};

  $(".vehicle-card").each((_, product) => {
    const title = $(product).find(".title.heading-04").text().trim();
    const modelYear = $(product).find(".model-year").text().trim();
    const image = $(product)
      .find(".image-container source")
      .eq(0)
      .attr("data-srcset")
      .replace("&w=345", "&w=1000");

    productsImages[`${title}:${modelYear}`] = image;
  });

  return productsImages;
}

export async function getVehicles() {
  const URL =
    "https://prod2.webservices.toyota.com/v1/vehicle/model-year-list?format=model-name";

  const response = await axios.get(URL);
  const vehicles = response?.data?.data?.vehicleModelYearList || [];

  return vehicles;
}

const MANUAL_TYPES_LABELS = {
  navigationManuals: "Navigation Manual",
  ownerManuals: "Owner Manual",
  omotaOwnersManualOverTheAir: "Owners Manual",
  warrantyGuides: "Warranty Guide",
};

export async function getManuals(model, year) {
  const url = encodeURI(
    `${settings.source.BASE_URL}/service/tcom/downloadableManuals/${model}/${year}`
  );
  const response = await axios.get(url);

  const manualsData = response.data.data;

  const manuals = [];

  for (const manualTypeKey in manualsData) {
    if (!Object.keys(MANUAL_TYPES_LABELS).includes(manualTypeKey)) continue;

    const manualType = MANUAL_TYPES_LABELS[manualTypeKey];

    for (const manual of manualsData[manualTypeKey]) {
      const url = manual.documents[0].contentLink;
      if (!url.includes(".pdf")) continue;

      manuals.push({
        manualType,
        lang: manual.language,
        title: manual.pubTitle.replaceAll("�", ""),
        url,
      });
    }
  }

  return manuals;
}

export async function saveData() {
  const { currentName, BRAND } = settings.source;
  const manualsDataset = await Dataset.open(`${currentName}/manuals`);
  const productsDataset = await Dataset.open(`${currentName}/products`);
  const productsManualsDataset = await Dataset.open(
    `${currentName}/products_manuals`
  );

  const vehiclesData = await getVehicles();
  const productsImages = await getProductsImages();

  // let skip = true;

  for (const model in vehiclesData) {
    const productName = model;

    for (const modelYear of vehiclesData[model]) {
      if (modelYear.includes(".")) continue;

      /* if (productName === "4Runner" && modelYear === "2006") {
        skip = false;
        continue;
      }

      if (skip) continue; */

      console.log(productName, modelYear);

      const image = productsImages[`${productName}:${modelYear}`];
      const manuals = await getManuals(productName, modelYear);

      if (manuals.length === 0) continue;

      const currentProductId = productIdGenerator.next().value;

      await productsDataset.pushData({
        innerId: currentProductId,
        brand: BRAND,
        category: "Vehicles",
        name: `${productName} ${modelYear}`,
        url: null,
        specs: [],
        images: image ? [image] : [],
      });

      for (const manual of manuals) {
        const currentManualId = manualIdGenerator.next().value;

        await manualsDataset.pushData({
          innerId: currentManualId,
          materialType: manual.manualType,
          pdfUrl: manual.url,
          title: manual.title,
          language: getLanguageByLangCode(manual.lang),
        });

        await productsManualsDataset.pushData({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }
  }
}
