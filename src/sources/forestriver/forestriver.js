import { log } from "crawlee";
import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

import { Source } from "#utils/classes/source.js";
import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

import state from "#utils/classes/state.js";

import { ForestRiverAPI } from "./api.js";

import { upperCaseFirstLetters } from "#utils/formatters.js";

export default class ForestRiverSource extends Source {
  baseURL = "https://www.forestriverinc.com";
  name = "forestriver";

  brand = "Forest River";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  constructor() {
    super({ createRouter: false });
  }

  async init() {
    log.info(`Setting up crawler for "${this.baseURL}"`);

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    await this.parseProducts();
  }

  async parseProducts() {
    let vehicles;
    let documents;
    let vehiclesInfos;

    try {
      vehicles = await state.serializer.load("vehicles");
    } catch (err) {
      vehicles = await ForestRiverAPI.getVehicles();
      await state.serializer.dump({ vehicles });
    }

    try {
      documents = await state.serializer.load("documents");
    } catch (err) {
      documents = await Promise.all(
        vehicles.map((vehicle) => {
          const { make, year, model } = vehicle;
          return ForestRiverAPI.getDocumentsForVehicle(make, year, model);
        })
      );

      await state.serializer.dump({ documents });
    }

    try {
      vehiclesInfos = await state.serializer.load("vehiclesInfos");
    } catch (err) {
      vehiclesInfos = await Promise.all(
        vehicles.map((vehicle) => {
          const { make, year, model } = vehicle;
          return ForestRiverAPI.getVehicleInfo(make, year, model);
        })
      );

      await state.serializer.dump({ vehiclesInfos });
    }

    for (const [index, vehicle] of vehicles.entries()) {
      const vehicleDocuments = documents[index];

      const vehicleInfo =
        vehiclesInfos[index].length > 0 ? vehiclesInfos[index][0] : null;

      const { make, year, model, FOREST_RIVER_PRODUCT_TYPE } = vehicle;

      const image = vehicleInfo ? vehicleInfo.file?.url : null;

      const product = new Product({
        brand: this.brand,
        category: upperCaseFirstLetters(FOREST_RIVER_PRODUCT_TYPE),
        name: `${make} ${model} ${year}`,
        images: image ? [image] : [],
        metadata: {
          make,
          model,
          year,
        },
      });

      await state.storage.pushData(product);

      for (const doc of vehicleDocuments) {
        if (!doc.bodyPdf?.url || !doc.bodyPdf.url.includes(".pdf")) continue;

        const manual = new Manual({
          materialType: "Owner's Manual",
          pdfUrl: doc.bodyPdf.url,
          title: doc.title,
          language: doc.language === "fr" ? "Français" : "English",
        });

        await state.storage.pushData(manual);

        const productManual = new ProductManual({
          productId: product.data.innerId,
          manualId: manual.data.innerId,
        });

        await state.storage.pushData(productManual);
      }
    }
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }
}
