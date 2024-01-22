import { PlaywrightCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

import { FordAPI } from "./api.js";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

export default class FordSource extends Source {
  baseURL = "https://www.ford.com";
  brand = "Ford";
  name = "ford";
  category = "Vehicles";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  constructor() {
    super();
  }

  async init() {
    await this.addRoutes();

    log.info(`Setting up crawler for "${this.baseURL}"`);

    this.crawler = new PlaywrightCrawler({
      requestHandler: this.router,
      headless: true,
      requestHandlerTimeoutSecs: 500000,
      maxRequestRetries: 1,
      maxRequestsPerMinute: 60,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    await this.parseProductsInfo();
  }

  async parseProductsInfo() {
    let productsAttributes;

    try {
      productsAttributes = await state.serializer.load("productsAttributes");
    } catch (err) {
      await this.crawler.run([
        {
          url: `${this.baseURL}/support/owner-manuals`,
          label: "PRODUCTS",
        },
      ]);

      productsAttributes = await state.serializer.load("productsAttributes");
    }

    for (const { year, model } of productsAttributes) {
      const documents = await FordAPI.getDocumentsByModelAndYear(year, model);
      if (documents.length === 0) continue;

      const product = new Product({
        brand: this.brand,
        category: this.category,
        name: `${model} - ${year}`,
        metadata: {
          year,
          model,
        },
      });

      await state.storage.pushData(product);

      for (const manualData of documents) {
        const manual = new Manual({
          materialType: manualData.category,
          pdfUrl: manualData.url,
          title: manualData.title,
          language: [],
        });

        const productManual = new ProductManual({
          productId: product.data.innerId,
          manualId: manual.data.innerId,
        });

        await state.storage.pushData(manual);
        await state.storage.pushData(productManual);
      }
    }
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this), {
      // onlyParse: true,
      // dropDatasets: false,
    });
  }
}
