import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

import { SramAPI } from "./api.js";

export default class SramSource extends Source {
  baseURL = "https://www.sram.com";
  name = "sram";
  category = "Bicycle Equipment";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

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
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    const models = await SramAPI.getModels();

    await this.parseManuals(models);
  }

  async parseManuals(models) {
    const targets = models.map((model) => ({
      url: `${this.baseURL}${model.url}`,
      label: "MODELS",
      userData: {
        data: {
          image: `${this.baseURL}${model.image}`,
          name: model.name,
          modelId: model.code,
          brand: model.brand,
        },
      },
    }));

    await this.crawler.run(targets);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }
}
