import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

export default class GrandDesignRVSource extends Source {
  baseURL = "https://www.granddesignrv.com";
  brand = "Grand Design RV";
  name = "granddesignrv";
  category = "Recreational Vehicles";

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
      maxRequestsPerMinute: 60,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    await this.crawler.run([
      {
        url: `${this.baseURL}/owners/resources/owners-manuals`,
        label: "MANUALS",
      },
    ]);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }
}
