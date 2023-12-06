import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

export default class TestSource extends Source {
  baseURL = "https://www.hotspring.com";
  brand = "Hotspring";
  name = "hotspring";
  category = "SPA";

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

    // Products
    await this.crawler.run([
      {
        url: `${this.baseURL}/shop`,
        label: "PRODUCTS",
      },
    ]);

    // Manuals
    await this.crawler.run([
      {
        url: `${this.baseURL}/owners/manuals-and-resources`,
        label: "MANUALS",
      },
    ]);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }

  referenceExist(product, manual) {
    return product.data.metadata.series === manual.data.metadata.series;
  }

  pseudoProductDataForManual(manual) {
    return {
      brand: "Hotspring",
      category: "SPA",
      name: manual.data.metadata.series,
      metadata: {
        series: manual.data.metadata.series,
      },
    };
  }
}
