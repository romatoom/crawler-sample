import { PlaywrightCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

export default class ElectricFireplacesDirectSource extends Source {
  baseURL = "https://www.electricfireplacesdirect.com";
  name = "electricfireplacesdirect";
  category = "Fireplaces";

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
      minConcurrency: 1,
      maxConcurrency: 1,
      maxRequestRetries: 0,
      maxRequestsPerMinute: 15,
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

    await this.crawler.run(
      products.map((p) => ({
        url: `${this.baseURL}${p.url}`,
        label: "PRODUCT",
        userData: {
          data: {
            name: p.name,
          },
        },
      }))
    );
  }

  async parseProducts() {
    state.variables.lastPage = 0;
    state.variables.continueLoop = true;

    while (state.variables.continueLoop) {
      await this.crawler.run([
        {
          url: `${this.baseURL}/collections/all?page=${
            state.variables.lastPage + 1
          }`,
          label: "PRODUCTS",
        },
      ]);

      if (state.variables.continueLoop) {
        console.log("Retry");
      }
    }
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }
}
