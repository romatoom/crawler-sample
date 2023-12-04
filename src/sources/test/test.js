import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

export default class TestSource extends Source {
  baseURL = "https://www.gourmia.com";
  brand = "Gourmia";
  name = "test";

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

    await this.crawler.run([
      {
        url: `${this.baseURL}/products`,
        label: "PRODUCTS",
      },
    ]);
  }

  async start() {
    await this.startDecorator(this.parse);
  }
}
