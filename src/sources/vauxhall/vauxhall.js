import { CheerioCrawler, log } from "crawlee";
import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";
import { VauxhallAPI } from "./api.js";

import { Source } from "#utils/classes/source.js";
import { Product } from "#utils/classes/product.js";
import state from "#utils/classes/state.js";

export default class VauxhallSource extends Source {
  baseURL = "https://www.vauxhall.co.uk";
  brand = "Vauxhall";
  name = "vauxhall";
  category = "Vehicles";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  /* exportOptions = {
    partLimit: ...
  }; */

  constructor() {
    super();
  }

  async init() {
    await this.addRoutes();

    log.info(`Setting up crawler for "${this.baseURL}"`);

    this.crawler = new CheerioCrawler({
      requestHandler: this.router,
      minConcurrency: 1,
      maxConcurrency: 5,
      maxRequestsPerMinute: 60,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    await this.parseProducts();
    await this.parseOwnersManuals();
    await this.parseInfotainmentManuals();
  }

  async parseProducts() {
    const products = await VauxhallAPI.getProducts(this.baseURL);

    for (const productItem of products) {
      const product = new Product({
        brand: this.brand,
        category: this.category,
        name: productItem.name,
        url: `${this.baseURL}${productItem.url}`,
        images: [`${this.baseURL}${productItem.image}`],
      });

      await state.storage.pushData(product);
    }
  }

  async parseOwnersManuals() {
    await this.crawler.run([
      {
        url: `${this.baseURL}/owners/information-and-safety/owners-manuals.html`,
        label: "MANUALS",
      },
    ]);
  }

  async parseInfotainmentManuals() {
    await this.crawler.run([
      {
        url: `${this.baseURL}/owners/information-and-safety/infotainment-manuals.html`,
        label: "INFOTAINMENT_MANUALS",
      },
    ]);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }

  referenceExist(product, manual) {
    return (
      product.data.name.toUpperCase() ===
      manual.data.metadata.model.toUpperCase()
    );
  }

  pseudoProductDataForManual(manual) {
    return {
      brand: this.brand,
      category: this.category,
      name: manual.data.metadata.model,
    };
  }
}
