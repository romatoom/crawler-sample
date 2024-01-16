import { CheerioCrawler, PlaywrightCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

export default class SramSource extends Source {
  baseURL = "https://www.gracobaby.com";
  name = "gracobaby";
  brand = "Graco";

  types = {
    "Instruction Manual": "Instruction Manual",
    "Quick Start Guide": "Quick Start Guide",
    FAQs: "FAQs",
    "PRODUCT INSTRUCTIONS": "Products Instructions",
  };

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  constructor() {
    super();
  }

  async init() {
    await this.addRoutes();

    log.info(`Setting up crawler for "${this.baseURL}"`);

    this.playwrightCrawler = new PlaywrightCrawler({
      requestHandler: this.router,
      headless: false,
      requestHandlerTimeoutSecs: 500000,
      minConcurrency: 1,
      maxConcurrency: 1,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    let products;
    try {
      products = await state.serializer.load("products", {
        append: true,
      });
    } catch (err) {
      await this.parseProducts();
      products = await state.serializer.load("products", {
        append: true,
      });
    }

    /* const targets = products
      .map((product) => ({
        url: product.url,
        label: "PRODUCT",
        userData: {
          data: {
            title: product.title.replaceAll("®", ""),
            image: product.image,
          },
        },
      }));

    for (const target of targets) {
      await this.playwrightCrawler.run([target]);
    } */

    await this.parseInstructions(products);
  }

  async parseProducts() {
    await this.playwrightCrawler.run([
      {
        url: `${this.baseURL}/search`,
        label: "PRODUCTS",
      },
    ]);
  }

  async parseInstructions(products) {
    await this.playwrightCrawler.run([
      {
        url: `${this.baseURL}/product-instructions.html`,
        label: "INSTRUCTIONS",
        userData: {
          data: {
            products,
          },
        },
      },
    ]);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }
}
